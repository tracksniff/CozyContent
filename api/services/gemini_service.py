import google.generativeai as genai
import os
import logging
import json
import time

logger = logging.getLogger(__name__)

def generate_website_code(application_data, retries=3, delay=5):
    """
    Generate React + Vite codebase based on application data using Gemini API.
    Includes retry logic for rate limits.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        logger.error("GEMINI_API_KEY not found")
        return None

    genai.configure(api_key=api_key)
    # Using gemini-1.5-flash as a fallback or default if 2.0 is overloaded
    model = genai.GenerativeModel('gemini-1.5-flash') 

    prompt = f"""
    Create a complete, modern, and professional React website using Vite and Tailwind CSS for the following company:
    Company Name: {application_data['company_name']}
    Industry: {application_data['industry']}
    Website URL: {application_data['website_url']}
    Location: {application_data['city_location']}
    Services: {application_data['services_list']}
    Testimonials: {application_data['testimonials']}
    Branding Colors: {application_data['branding_colors']}

    Requirements:
    1. Visuals: Use modern, high-quality aesthetics. Provide placeholders for images if needed.
    2. Styling: Use Tailwind CSS.
    3. Structure: Header, Hero, Services, Testimonials, Contact, Footer.
    4. Code Quality: Clean, modular React components (TypeScript).
    5. Output: Provide the full code ONLY as a raw JSON object where keys are file paths and values are file contents.
       Example: {{"src/App.tsx": "...", "package.json": "..."}}
    """

    for attempt in range(retries):
        try:
            response = model.generate_content(prompt)
            text = response.text
            
            # Extract JSON from response
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
            
            return json.loads(text)
            
        except Exception as e:
            if "429" in str(e) and attempt < retries - 1:
                wait_time = delay * (2 ** attempt) # Exponential backoff: 5s, 10s, 20s
                logger.warning(f"Gemini Rate Limit (429) hit. Retrying in {wait_time}s... (Attempt {attempt + 1}/{retries})")
                time.sleep(wait_time)
                continue
            else:
                logger.error(f"Error generating website code: {str(e)}")
                return None
    
    return None
