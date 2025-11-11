import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
import psycopg2

# Load environment variables
load_dotenv()

# Database connection
DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    print("DATABASE_URL not found in .env file")
    exit(1)

def import_sql_file():
    try:
        # Connect to PostgreSQL
        engine = create_engine(DATABASE_URL)

        # Read the SQL file
        with open('import_data.py', 'r', encoding='utf-8') as f:
            sql_content = f.read()

        # Split SQL commands (basic splitting by semicolon)
        # Note: This is a simple approach - for complex SQL files, you might need a more sophisticated parser
        sql_commands = [cmd.strip() for cmd in sql_content.split(';') if cmd.strip()]

        with engine.connect() as conn:
            print("Connected to PostgreSQL database")

            # Execute each SQL command
            for i, command in enumerate(sql_commands):
                if command:  # Skip empty commands
                    try:
                        print(f"Executing command {i+1}/{len(sql_commands)}...")
                        conn.execute(text(command))
                        conn.commit()  # Commit after each command
                    except Exception as e:
                        print(f"Error executing command {i+1}: {str(e)}")
                        # Continue with next command instead of stopping
                        continue

            print("SQL import completed successfully!")

    except Exception as e:
        print(f"Error importing SQL file: {str(e)}")

if __name__ == "__main__":
    import_sql_file()