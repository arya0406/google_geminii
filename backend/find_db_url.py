#!/usr/bin/env python3
"""
PostgreSQL Connection Tester
Helps you find the correct DATABASE_URL for your PostgreSQL setup
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine

def test_connection(database_url):
    """Test a database connection"""
    try:
        engine = create_engine(database_url)
        with engine.connect() as conn:
            result = conn.execute("SELECT version()")
            version = result.fetchone()[0]
            print(f"✅ Connection successful!")
            print(f"📊 PostgreSQL Version: {version[:50]}...")
            return True
    except Exception as e:
        print(f"❌ Connection failed: {str(e)}")
        return False

def find_database_url():
    """Interactive helper to find the correct DATABASE_URL"""

    print("🔍 PostgreSQL Connection Helper")
    print("=" * 40)

    # Common PostgreSQL setups
    common_configs = [
        {
            'name': 'Local PostgreSQL (default)',
            'url': 'postgresql://postgres:postgres@localhost:5432/dwed_db'
        },
        {
            'name': 'Local PostgreSQL (password)',
            'url': 'postgresql://postgres:password@localhost:5432/dwed_db'
        },
        {
            'name': 'Docker PostgreSQL',
            'url': 'postgresql://postgres:mypassword@localhost:5432/dwed_db'
        }
    ]

    print("\n🔧 Testing common configurations...")

    for config in common_configs:
        print(f"\n🧪 Testing: {config['name']}")
        print(f"   URL: {config['url']}")
        if test_connection(config['url']):
            print(f"\n🎉 Found working configuration!")
            print(f"   DATABASE_URL={config['url']}")
            print(f"\n💡 Copy this to your .env file:")
            print(f"   DATABASE_URL={config['url']}")
            return config['url']

    print("\n❌ None of the common configurations worked.")
    print("\n🔧 Let's configure it manually...")

    # Manual configuration
    host = input("PostgreSQL host (default: localhost): ").strip() or "localhost"
    port = input("PostgreSQL port (default: 5432): ").strip() or "5432"
    username = input("Username (default: postgres): ").strip() or "postgres"
    password = input("Password: ").strip()
    database = input("Database name (default: dwed_db): ").strip() or "dwed_db"

    manual_url = f"postgresql://{username}:{password}@{host}:{port}/{database}"

    print(f"\n🧪 Testing manual configuration...")
    print(f"   URL: {manual_url}")

    if test_connection(manual_url):
        print(f"\n🎉 Manual configuration works!")
        print(f"   DATABASE_URL={manual_url}")
        return manual_url
    else:
        print("\n❌ Manual configuration also failed.")
        print("\n🔧 Troubleshooting tips:")
        print("1. Make sure PostgreSQL is running")
        print("2. Check if the database 'dwed_db' exists")
        print("3. Verify your username and password")
        print("4. Try creating the database first:")
        print("   psql -U postgres -c 'CREATE DATABASE dwed_db;'")
        return None

if __name__ == "__main__":
    working_url = find_database_url()

    if working_url:
        print(f"\n📝 Update your .env file with:")
        print(f"DATABASE_URL={working_url}")

        # Optionally update .env file automatically
        update_env = input("\n🔄 Update .env file automatically? (y/n): ").strip().lower()
        if update_env == 'y':
            env_path = '.env'
            if os.path.exists(env_path):
                with open(env_path, 'r') as f:
                    content = f.read()

                # Replace DATABASE_URL line
                lines = content.split('\n')
                updated_lines = []
                for line in lines:
                    if line.startswith('DATABASE_URL='):
                        updated_lines.append(f'DATABASE_URL={working_url}')
                    else:
                        updated_lines.append(line)

                with open(env_path, 'w') as f:
                    f.write('\n'.join(updated_lines))

                print("✅ .env file updated!")
            else:
                print("❌ .env file not found")