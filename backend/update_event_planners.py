from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Connect to MongoDB
MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI)
db = client['venue_db']
event_planners_collection = db['event_planners']

# Event planner dummy data
event_planners = [
    {
        "name": "Royal Wedding Planners",
        "city": "Mumbai",
        "rating": 4.8,
        "experience_years": 12,
        "services": {
            "pre_wedding": [
                "Concept & theme creation",
                "Budget planning",
                "Venue selection",
                "Vendor coordination",
                "Guest list management"
            ],
            "design_decor": [
                "Venue styling",
                "Floral arrangements",
                "Lighting design",
                "Stage & mandap setup"
            ],
            "entertainment": [
                "Music & DJ",
                "Live performances",
                "Dance choreography",
                "Cultural shows"
            ],
            "catering": [
                "Menu planning",
                "Bar management",
                "Guest accommodation",
                "Welcome kits"
            ]
        },
        "portfolio_images": ["royal_wedding_1.jpg", "royal_wedding_2.jpg"],
        "contact": {
            "phone": "+91 98XXXXXXXX",
            "email": "info@royalweddings.com"
        }
    },
    {
        "name": "Dream Weddings Delhi",
        "city": "Delhi",
        "rating": 4.9,
        "experience_years": 15,
        "services": {
            "pre_wedding": [
                "Full wedding planning",
                "Destination weddings",
                "Budget optimization",
                "Timeline planning"
            ],
            "design_decor": [
                "Theme decoration",
                "Custom mandap design",
                "Premium floral work",
                "Light installation"
            ],
            "entertainment": [
                "Celebrity performances",
                "Traditional events",
                "Band booking",
                "Entertainment coordination"
            ],
            "catering": [
                "Multi-cuisine options",
                "International chefs",
                "Personalized menus",
                "Luxury dining setups"
            ]
        },
        "portfolio_images": ["dream_wedding_1.jpg", "dream_wedding_2.jpg"],
        "contact": {
            "phone": "+91 99XXXXXXXX",
            "email": "contact@dreamweddings.com"
        }
    },
    {
        "name": "Bangalore Wedding Company",
        "city": "Bangalore",
        "rating": 4.7,
        "experience_years": 8,
        "services": {
            "pre_wedding": [
                "Modern wedding concepts",
                "Tech-integrated planning",
                "Vendor management",
                "Digital invitations"
            ],
            "design_decor": [
                "Contemporary designs",
                "Sustainable decorations",
                "LED installations",
                "Modern mandaps"
            ],
            "entertainment": [
                "Fusion performances",
                "International artists",
                "Tech-based entertainment",
                "Interactive sessions"
            ],
            "catering": [
                "Farm to table options",
                "International cuisine",
                "Themed food stations",
                "Special diet menus"
            ]
        },
        "portfolio_images": ["bangalore_wedding_1.jpg", "bangalore_wedding_2.jpg"],
        "contact": {
            "phone": "+91 97XXXXXXXX",
            "email": "hello@bangaloreweddings.com"
        }
    }
]

# Drop existing collection and insert new data
event_planners_collection.drop()
event_planners_collection.insert_many(event_planners)

print("Event planners data updated successfully!")