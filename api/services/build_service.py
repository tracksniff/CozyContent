import os
import subprocess
import shutil
import tempfile
import logging
import json

logger = logging.getLogger(__name__)

def validate_generated_code(code_files):
    """
    Validates generated code by attempting a build in a temporary directory.
    Returns (success, error_message).
    """
    temp_dir = tempfile.mkdtemp(prefix="website_build_")
    logger.info(f"Temporary build directory created: {temp_dir}")

    try:
        # 1. Write files to temporary directory
        for file_path, content in code_files.items():
            full_path = os.path.join(temp_dir, file_path)
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            with open(full_path, "w") as f:
                f.write(content)

        # 2. Check if package.json exists
        if "package.json" not in code_files:
            return False, "Missing package.json in generated files."

        # 3. Check for node_modules optimization
        # To avoid running npm install every time (which is slow and heavy),
        # we check if there's a global node_modules or a pre-warmed cache we can link.
        # For now, we'll try to run 'tsc' if it's a typescript project, as it catches most errors.
        
        logger.info("Running TypeScript validation...")
        
        # We need to ensure typescript is available. 
        # In a real environment, we'd have a 'base' node_modules we can symlink to save time.
        # For this implementation, let's assume we want to run 'npm run build' or 'tsc'.
        
        # If we have a 'node_modules' in a parent or specific location, we can symlink it.
        # But for now, let's try a direct tsc check if possible.
        
        # Alternative: Just check for syntax errors using a lightweight tool if npm install is too slow.
        # However, the user specifically asked for a build check.
        
        # Let's try to run tsc -v to see if it's available globally
        try:
            # We use --noEmit to just check types without generating files
            # We use --skipLibCheck to speed up
            result = subprocess.run(
                ["npx", "tsc", "--noEmit", "--skipLibCheck"],
                cwd=temp_dir,
                capture_output=True,
                text=True,
                timeout=120 # 2 minute timeout
            )
            
            if result.returncode == 0:
                logger.info("Build validation successful.")
                return True, None
            else:
                error_msg = result.stdout + result.stderr
                logger.error(f"Build validation failed: {error_msg}")
                return False, error_msg

        except subprocess.TimeoutExpired:
            return False, "Build validation timed out."
        except Exception as e:
            return False, f"Error during build validation: {str(e)}"

    finally:
        # 4. Cleanup
        try:
            shutil.rmtree(temp_dir)
            logger.info(f"Deleted temporary build directory: {temp_dir}")
        except Exception as e:
            logger.error(f"Failed to delete temp dir {temp_dir}: {e}")

def get_build_error_fix_prompt(original_files, error_message):
    """
    Creates a prompt for Claude to fix the build errors.
    """
    return f"""The previous code generation failed to build with the following errors:

{error_message}

Please fix the errors and provide the updated complete file set. 
Ensure ALL files are included in your response, even if they didn't change, as I need the full repository.
Ensure 100% valid TypeScript and that all imports match the file structure.
"""
