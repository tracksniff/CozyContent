import google.generativeai as genai
import os
import logging
import json

logger = logging.getLogger(__name__)

def generate_website_code(application_data):
    """
    Generate React + Vite codebase based on application data using Gemini API
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        logger.error("GEMINI_API_KEY not found")
        return None

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.0-flash') # or gemini-1.5-pro

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
    1. Visuals: Use modern, high-quality aesthetics. Provide placeholders for images if needed, but aim for a visually complete prototype.
    2. Styling: Use Tailwind CSS. Ensure consistent spacing, typography, and interactive feedback.
    3. Structure:
       - Header/Navbar
       - Hero section with a strong call to action.
       - Services section detailing what they offer.
       - Testimonials section (if provided).
       - Contact section with a form and location details.
       - Footer.
    4. Code Quality: Clean, modular React components (TypeScript).
    5. Output: Provide the full code as a JSON object where keys are file paths and values are file contents.
       Example: {{"src/App.tsx": "...", "src/components/Header.tsx": "...", "package.json": "..."}}
       Include all necessary configuration files (package.json, tailwind.config.js, vite.config.ts, tsconfig.json, index.html, etc.) to make it a runnable project.
    """

    try:
        response = model.generate_content(prompt)
        # Extract JSON from response
        text = response.text
        # Sometimes Gemini wraps JSON in code blocks
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
        
        return json.loads(text)
    except Exception as e:
        logger.error(f"Error generating website code: {str(e)}")
        return None
