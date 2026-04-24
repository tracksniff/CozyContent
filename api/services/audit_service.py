import requests
from bs4 import BeautifulSoup
import anthropic
import os
import json
import logging

logger = logging.getLogger(__name__)

def perform_audit(audit_id):
    from ..models import AuditReport
    
    try:
        report = AuditReport.objects.get(id=audit_id)
        url = report.website_url
        if not url.startswith('http'):
            url = 'https://' + url
            
        # 1. Scrape basic info
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        report.meta_title = soup.title.string if soup.title else "No title found"
        
        desc = soup.find('meta', attrs={'name': 'description'})
        report.meta_description = desc['content'] if desc else "No description found"
        
        # Check for common elements
        has_h1 = bool(soup.find('h1'))
        has_cta = any(word in response.text.lower() for word in ['book', 'call', 'contact', 'quote', 'get started'])
        has_testimonials = any(word in response.text.lower() for word in ['testimonial', 'reviews', 'what our clients say'])
        has_mobile_meta = bool(soup.find('meta', attrs={'name': 'viewport'}))
        
        # Mock load speed for now (random 40-70 for "bad" sites)
        import random
        report.load_speed_score = random.randint(45, 65)
        report.save()
        
        # 2. Call Claude for AI Interpretation
        client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        
        prompt = f"""
        You are an expert website conversion auditor. Analyze the following website data for a business and provide a professional, high-impact audit.
        
        Business Name: {report.business_name}
        Industry: {report.industry}
        Location: {report.location}
        URL: {url}
        Meta Title: {report.meta_title}
        Meta Description: {report.meta_description}
        Has H1: {has_h1}
        Has CTA: {has_cta}
        Has Testimonials: {has_testimonials}
        Mobile Ready (Viewport tag): {has_mobile_meta}
        Load Speed Score: {report.load_speed_score}/100
        
        Your goal is to provide a scorecard and actionable advice. 
        Be specific to their industry ({report.industry}) and location ({report.location}).
        
        Return ONLY a JSON object with this exact structure:
        {{
            "overall_score": <int 0-100>,
            "scores": {{
                "design": <int 0-20>,
                "mobile_ux": <int 0-20>,
                "lead_conversion": <int 0-20>,
                "seo_basics": <int 0-20>,
                "trust_signals": <int 0-20>
            }},
            "findings": [
                {{ "type": "negative", "text": "❌ ... " }},
                {{ "type": "negative", "text": "❌ ... " }},
                ...
            ],
            "quick_wins": [
                {{ "type": "positive", "text": "✅ ... " }},
                ...
            ],
            "summary": "Short professional summary mentionging business name and location."
        }}
        
        Make the findings punchy and critical but helpful. 
        For example: "❌ Website looks outdated on mobile" or "❌ Missing service area pages for {report.location}".
        """
        
        response = client.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=2000,
            system="You are a conversion rate optimization expert. You return only JSON.",
            messages=[{"role": "user", "content": prompt}],
        )
        
        ai_response = response.content[0].text.strip()
        # Clean up if Claude adds markdown blocks
        if ai_response.startswith('```json'):
            ai_response = ai_response[7:-3]
        elif ai_response.startswith('```'):
            ai_response = ai_response[3:-3]
            
        report.report_data = json.loads(ai_response)
        report.save()
        
        return report.report_data
        
    except Exception as e:
        logger.error(f"Audit failed for {audit_id}: {str(e)}")
        return None
