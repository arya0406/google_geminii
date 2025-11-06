"""
DWed Backend Server Startup Script
Run this with: python start_backend.py
"""
import subprocess
import sys
import os

os.chdir(r'd:\gemini_dwed\backend')
print("=" * 60)
print("🚀 Starting DWed Backend Server")
print("=" * 60)
print()

try:
    # Run Flask app
    subprocess.run([sys.executable, 'app.py'])
except KeyboardInterrupt:
    print("\n\n✋ Server stopped by user")
except Exception as e:
    print(f"❌ Error: {e}")
