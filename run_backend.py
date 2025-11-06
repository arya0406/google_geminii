import sys
import os

# Add backend directory to path
backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_dir)

try:
    from backend.app import app
except ImportError:
    # Fallback: run app.py directly
    os.chdir(backend_dir)
    from backend import app as app_module
    app = app_module.app

if __name__ == '__main__':
    print("\n" + "="*70)
    print("🚀 DWed Venue Finder Backend Server")
    print("="*70)
    print("✅ Server starting on http://127.0.0.1:5000")
    print("📝 Press Ctrl+C to stop the server")
    print("="*70 + "\n")
    app.run(debug=True, port=5000, use_reloader=False)

