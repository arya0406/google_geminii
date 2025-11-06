import pymongo
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get MongoDB URI
MONGO_URI = os.getenv('MONGO_URI')

# Connect to MongoDB
client = pymongo.MongoClient(MONGO_URI)

# Select database and collection
db = client['venue_db']
venues_collection = db['venues']

# Sample venue data
mock_venues = [
    {
        'name': 'Royal Palace Wedding Complex',
        'location': 'Delhi',
        'total_capacity': 1600,  # Sum of all banquet capacities
        'banquets': [
            {
                'name': 'Grand Crystal Ballroom',
                'capacity': 800,
                'price': 250000,  # Price per banquet
                'min_booking_hours': 6
            },
            {
                'name': 'Maharaja Hall',
                'capacity': 500,
                'price': 175000,
                'min_booking_hours': 5
            },
            {
                'name': 'Garden Court',
                'capacity': 300,
                'price': 125000,
                'min_booking_hours': 4
            }
        ],
        'facilities': {
            'parking': 'Valet parking for 200 vehicles',
            'catering': 'In-house + Outside allowed',
            'decor': 'In-house team available',
            'rooms': '25 luxury rooms',
            'amenities': [
                'Central AC',
                'Backup Power',
                'Bridal Room',
                'High-speed Wifi',
                'Professional Sound System',
                'LED Screens',
                'Dance Floor'
            ]
        },
        'description': 'Premier wedding destination with multiple banquet options, state-of-the-art facilities, and expert event management team.'
    },
    {
        'name': 'The Grand Celebrations',
        'location': 'Mumbai',
        'total_capacity': 2000,  # Sum of all banquet capacities
        'banquets': [
            {
                'name': 'Sea View Ballroom',
                'capacity': 1000,
                'price': 350000,
                'min_booking_hours': 6
            },
            {
                'name': 'Royal Banquet',
                'capacity': 600,
                'price': 225000,
                'min_booking_hours': 5
            },
            {
                'name': 'Celebration Hall',
                'capacity': 400,
                'price': 150000,
                'min_booking_hours': 4
            }
        ],
        'facilities': {
            'parking': 'Multi-level parking for 300 vehicles',
            'catering': 'Multiple exclusive caterers',
            'decor': 'Panel of decorators',
            'rooms': '40 premium rooms',
            'amenities': [
                'Central AC',
                'Generator Backup',
                'Bride & Groom Suites',
                'Wifi',
                'Premium Audio System',
                'Multiple LED Walls',
                'Wooden Dance Floor',
                'Elevators'
            ]
        },
        'description': 'Luxury wedding venue complex overlooking the Arabian Sea, offering world-class facilities and breathtaking views.',
    },
    {
        'name': 'Bangalore Convention Complex',
        'location': 'Bangalore',
        'total_capacity': 2500,  # Sum of all banquet capacities
        'banquets': [
            {
                'name': 'Diamond Convention Hall',
                'capacity': 1200,
                'price': 400000,
                'min_booking_hours': 8
            },
            {
                'name': 'Emerald Banquet',
                'capacity': 800,
                'price': 275000,
                'min_booking_hours': 6
            },
            {
                'name': 'Garden Pavilion',
                'capacity': 500,
                'price': 200000,
                'min_booking_hours': 5
            }
        ],
        'facilities': {
            'parking': 'Parking for 500 vehicles',
            'catering': 'Multiple approved vendors',
            'decor': 'Empaneled decorators',
            'rooms': '50 guest rooms',
            'amenities': [
                'Central AC',
                '100% Power Backup',
                'VIP Lounges',
                'High-speed Internet',
                'Banquet Sound System',
                'Multiple LED Screens',
                'Modular Stage',
                'Executive Lounge',
                'Helipad Access'
            ]
        },
        'description': 'Ultra-modern convention complex with versatile spaces and comprehensive facilities for grand celebrations.'
    },
    {
        'name': 'Heritage Palace Resort',
        'location': 'Jaipur',
        'total_capacity': 2200,  # Sum of all banquet capacities
        'banquets': [
            {
                'name': 'Sheesh Mahal',
                'capacity': 700,
                'price': 300000,
                'min_booking_hours': 6
            },
            {
                'name': 'Durbar Hall',
                'capacity': 500,
                'price': 200000,
                'min_booking_hours': 5
            },
            {
                'name': 'Royal Garden',
                'capacity': 1000,
                'price': 350000,
                'min_booking_hours': 6
            }
        ],
        'facilities': {
            'parking': 'Parking for 250 vehicles',
            'catering': 'Royal kitchen + Outside allowed',
            'decor': 'Heritage and modern décor options',
            'rooms': '60 heritage rooms and suites',
            'amenities': [
                'Climate Control',
                'Power Backup',
                'Royal Suites',
                'Wifi Coverage',
                'Heritage Architecture',
                'Modern AV System',
                'Multiple Terraces',
                'Pool Side Area',
                'Spa Services'
            ]
        },
        'description': 'Authentic Rajasthani palace converted into a luxury wedding destination, offering royal experience with modern comforts.'
    },
    {
        'name': 'Green Valley Lawn',
        'location': 'Pune',
        'total_capacity': 600,
        'capacity': 600,
        'price_per_head': 1000,
        'description': 'Sprawling outdoor lawn venue with lush greenery. Great for day weddings and sangeet ceremonies with ample parking space.'
    },
    {
        'name': 'Crystal Ballroom',
        'location': 'Hyderabad',
        'capacity': 350,
        'price_per_head': 1800,
        'description': 'Elegant ballroom with state-of-the-art lighting and sound systems. Air-conditioned comfort with exquisite decor options.'
    },
    {
        'name': 'Sunset Beach Resort',
        'location': 'Goa',
        'capacity': 250,
        'price_per_head': 3000,
        'description': 'Beachfront venue offering stunning sunset views. Perfect for destination weddings with a mix of indoor and outdoor spaces.'
    },
    {
        'name': 'Grand Empire Hotel',
        'location': 'Delhi',
        'capacity': 1000,
        'price_per_head': 2200,
        'description': 'Five-star hotel with multiple banquet halls. Offers comprehensive wedding packages including catering, decoration, and accommodation.'
    },
    {
        'name': 'Orchid Garden Pavilion',
        'location': 'Bangalore',
        'capacity': 200,
        'price_per_head': 1400,
        'description': 'Boutique venue surrounded by orchid gardens. Intimate setting perfect for smaller weddings and pre-wedding functions.'
    },
    {
        'name': 'Majestic Fort Palace',
        'location': 'Udaipur',
        'capacity': 450,
        'price_per_head': 3500,
        'description': 'Historic palace venue with breathtaking architecture. Offers a truly royal wedding experience with traditional Rajasthani hospitality.'
    },
    {
        'name': 'Metro Convention Hub',
        'location': 'Mumbai',
        'capacity': 700,
        'price_per_head': 1600,
        'description': 'Modern convention center in the heart of the city. Easy accessibility with metro connectivity and contemporary facilities.'
    },
    {
        'name': 'Riverside Retreat',
        'location': 'Chennai',
        'capacity': 400,
        'price_per_head': 1300,
        'description': 'Peaceful venue along the river with natural beauty. Offers both covered and open-air spaces for various wedding ceremonies.'
    }
]

# Clear existing data to avoid duplicates
venues_collection.delete_many({})

# Insert new data
venues_collection.insert_many(mock_venues)

print('Data imported successfully!')
print(f'Inserted {len(mock_venues)} venues into the database.')
