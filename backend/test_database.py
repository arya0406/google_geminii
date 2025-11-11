#!/usr/bin/env python3
"""
Test script to verify PostgreSQL database connection and data
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Load environment variables
load_dotenv()

def test_database():
    """Test database connection and verify data"""

    DATABASE_URL = os.getenv('DATABASE_URL')
    if not DATABASE_URL:
        print("❌ DATABASE_URL not found in .env file")
        return False

    try:
        print("🔄 Testing database connection...")
        engine = create_engine(DATABASE_URL)

        with engine.connect() as conn:
            print("✅ Connected to database successfully!")

            # Test basic queries
            print("\n📊 Testing data queries...")

            # Count venues
            result = conn.execute(text("SELECT COUNT(*) as count FROM venues"))
            venue_count = result.fetchone()[0]
            print(f"✅ Found {venue_count} venues")

            # Count event planners
            result = conn.execute(text("SELECT COUNT(*) as count FROM event_planners"))
            planner_count = result.fetchone()[0]
            print(f"✅ Found {planner_count} event planners")

            # Test a venue query
            result = conn.execute(text("""
                SELECT v.name, c.name as city, vp.veg_price_per_plate
                FROM venues v
                LEFT JOIN venue_locations vl ON v.id = vl.venue_id
                LEFT JOIN cities c ON vl.city_id = c.id
                LEFT JOIN venue_pricing vp ON v.id = vp.venue_id AND vp.is_active = true
                LIMIT 3
            """))

            print("\n🏨 Sample venues:")
            for row in result:
                print(f"  - {row[0]} ({row[1]}) - ₹{row[2] or 'N/A'} per plate")

            # Test an event planner query
            result = conn.execute(text("""
                SELECT ep.name, c.name as city, pp.starting_price
                FROM event_planners ep
                LEFT JOIN planner_locations pl ON ep.id = pl.planner_id
                LEFT JOIN cities c ON pl.city_id = c.id
                LEFT JOIN planner_pricing pp ON ep.id = pp.planner_id AND pp.is_active = true
                LIMIT 3
            """))

            print("\n🎯 Sample event planners:")
            for row in result:
                print(f"  - {row[0]} ({row[1]}) - ₹{row[2] or 'N/A'} starting price")

            print("\n🎉 Database test completed successfully!")
            return True

    except Exception as e:
        print(f"❌ Database test failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("🧪 DWed Database Test")
    print("=" * 30)
    test_database()