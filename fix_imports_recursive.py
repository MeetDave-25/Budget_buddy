import os
import re

directory = r'd:/Budget tracker/src'

# Regex to find imports with version numbers (e.g., @1.2.3)
# It looks for patterns like "some-package@1.2.3" inside quotes
pattern = re.compile(r'from\s+["\']([^"\']+)@\d+\.\d+\.\d+["\']')

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace function
        def replacer(match):
            full_match = match.group(0)
            package_name = match.group(1)
            # Reconstruct the import string without the version
            # We need to be careful to preserve the quote style
            quote = '"' if '"' in full_match else "'"
            return f'from {quote}{package_name}{quote}'

        new_content = pattern.sub(replacer, content)
        
        if new_content != content:
            print(f"Fixing {filepath}")
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

for root, dirs, files in os.walk(directory):
    for filename in files:
        if filename.endswith(".tsx") or filename.endswith(".ts"):
            fix_file(os.path.join(root, filename))
