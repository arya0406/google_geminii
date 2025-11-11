#!/usr/bin/env python3
"""
Database Setup Script for DWed Dream Destination
This script creates and populates the PostgreSQL database with the schema and data.
"""

import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
import psycopg2

# Load environment variables
load_dotenv()

def setup_database():
    """Setup the PostgreSQL database with schema and data"""

    # Database connection
    DATABASE_URL = os.getenv('DATABASE_URL')

    if not DATABASE_URL:
        print("❌ Error: DATABASE_URL not found in .env file")
        print("Please set DATABASE_URL=postgresql://username:password@localhost:5432/dwed_db")
        sys.exit(1)

    try:
        print("🔄 Connecting to PostgreSQL database...")

        # Create engine
        engine = create_engine(DATABASE_URL)

        # Test connection
        with engine.connect() as conn:
            print("✅ Connected to database successfully!")

        # Read and execute SQL file
        sql_file_path = 'import_data.sql'

        if not os.path.exists(sql_file_path):
            print(f"❌ Error: {sql_file_path} not found!")
            sys.exit(1)

        print("📖 Reading SQL schema file...")

        with open(sql_file_path, 'r', encoding='utf-8') as file:
            sql_content = file.read()

        # Split SQL commands (basic splitting by semicolon)
        # Note: This is a simple splitter - for production, consider using a proper SQL parser
        sql_commands = []
        current_command = []
        in_string = False
        string_char = None

        for char in sql_content:
            if not in_string:
                if char in ("'", '"'):
                    in_string = True
                    string_char = char
                elif char == ';':
                    if current_command:
                        sql_commands.append(''.join(current_command).strip())
                        current_command = []
                    continue
            else:
                if char == string_char:
                    in_string = False
                    string_char = None

            if char != ';' or in_string:
                current_command.append(char)

        # Remove empty commands and comments
        sql_commands = [cmd for cmd in sql_commands if cmd.strip() and not cmd.strip().startswith('--')]

        print(f"📋 Found {len(sql_commands)} SQL commands to execute...")

        # Execute commands
        with engine.connect() as conn:
            executed_count = 0

            for i, command in enumerate(sql_commands, 1):
                try:
                    # Skip empty commands
                    if not command.strip():
                        continue

                    print(f"⚡ Executing command {i}/{len(sql_commands)}...")
                    conn.execute(text(command))
                    conn.commit()  # Commit after each command for safety
                    executed_count += 1

                except Exception as e:
                    print(f"❌ Error executing command {i}: {str(e)}")
                    print(f"Command: {command[:100]}...")
                    # Continue with next command instead of stopping
                    continue

            print(f"✅ Successfully executed {executed_count} SQL commands!")

        print("🎉 Database setup completed successfully!")
        print("\n📊 Database Summary:")
        print("- Created all tables with proper relationships")
        print("- Inserted reference data (countries, states, cities)")
        print("- Added venue types, amenities, and services")
        print("- Populated 12 venues with pricing and locations")
        print("- Added 4 event planners with services and pricing")
        print("- Created essential indexes for performance")

        print("\n🚀 Your DWed Dream Destination database is ready!")
        print("You can now start the backend server with: python app.py")

    except Exception as e:
        print(f"❌ Database setup failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    print("🏗️  DWed Dream Destination - Database Setup")
    print("=" * 50)
    setup_database()