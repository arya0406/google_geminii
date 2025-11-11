from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import google.generativeai as genai
import pymongo
from dotenv import load_dotenv
from bson.objectid import ObjectId
import json
from datetime import datetime

# Load environment variables
load_dotenv()

# Database Setup
MONGO_URI = os.getenv('MONGO_URI')
client = pymongo.MongoClient(MONGO_URI)
db = client['venue_db']
venues_collection = db['venues']
event_planners_collection = db['event_planners']
conversations_collection = db['conversations']

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Store conversation history in memory for this session
conversation_history = []

def get_event_planners_response(query=None):
    try:
        # Query MongoDB
        mongo_query = query if query else {}
        planners = list(event_planners_collection.find(mongo_query))

        # Convert ObjectId to string for JSON serialization
        for planner in planners:
            planner["_id"] = str(planner["_id"])

        if not planners:
            return "I couldn't find any event planners matching your criteria. Would you like to see all available event planners?"

        # Format response
        response = "Here are some event planners that might interest you:\n\n"

        for planner in planners:
            response += f"🎯 {planner['name']} ({planner['city']})\n"
            response += f"⭐ Rating: {planner['rating']}/5.0 | Experience: {planner['experience_years']} years\n\n"
            response += "Services include:\n"

            # Add a sample of services from each category
            for category, services in planner['services'].items():
                category_name = category.replace('_', ' ').title()
                response += f"- {category_name}: {', '.join(services[:2])}...\n"

            response += f"\n📞 Contact: {planner['contact']['phone']}\n"
            response += f"📧 Email: {planner['contact']['email']}\n"
            response += "\n---\n\n"

        response += "Would you like more specific information about any of these planners or their services?"
        return response
    except Exception as e:
        print(f"Error in get_event_planners_response: {str(e)}")
        return "I encountered an error while fetching event planner information. Please try again."

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'DWed Venue Finder API is running!',
        'status': 'OK',
        'endpoints': {
            '/api/chat': 'POST - Send chat messages to the bot'
        }
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    global conversation_history
    try:
        # Get API key and message
        GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
        data = request.get_json()
        message = data.get('message', '')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Add user message to history
        conversation_history.append({
            'role': 'user',
            'content': message
        })
        
        # Configure Gemini
        genai.configure(api_key=GEMINI_API_KEY)
        
        # Define System Prompt with personality and tasks
        system_instruction = """You are DWed, a sophisticated and empathetic AI wedding expert with a deep understanding of Indian weddings and event planning. Your personality is warm, engaging, and creative. You use varied, natural language and never repeat responses in the same way.

PERSONALITY TRAITS:
- Enthusiastic and positive
- Creative in suggesting alternatives
- Understanding of wedding planning stress
- Knowledgeable about Indian wedding customs and event planning
- Professional yet friendly tone
- Remember previous conversations and build upon them

RESPONSE VARIATIONS:
When no venues or planners match the criteria, provide one of these response styles (vary them naturally):
1. "I've explored our collection, but haven't found exact matches. However, I'd love to suggest some beautiful alternatives! Would you like to explore [suggestion1] or [suggestion2]?"
2. "While I don't have exact matches, I'm curious - what's the most important aspect you're looking for? We can focus on that and find your perfect match!"
3. "Let's get creative with your search! The exact match isn't available, but I know some hidden gems that might surprise you. Shall we explore different [areas/styles/options]?"
4. "Though these specific criteria aren't matching right now, I'm excited to help you discover something even better! What aspects are non-negotiable for you?"

CRITICAL INSTRUCTIONS:

Task 1 (Venue Finding): 
When the user wants to find a venue (e.g., "I need a venue in Delhi", "Show me venues for 500 people"), you MUST respond with ONLY a pure JSON object:
{"task": "find_venue", "filters": {...}}

Task 2 (Event Planner Finding):
When the user wants to find an event planner (e.g., "I need a planner in Mumbai", "Show me wedding planners"), you MUST respond with ONLY a pure JSON object:
{"task": "find_planner", "filters": {...}}

The venue filters can include:
- "location": (string) city name
- "capacity": (integer) exact capacity requested
- "price_min": (integer) minimum price per head
- "price_max": (integer) maximum price per head

The planner filters can include:
- "location": (string) city name
- "budget_min": (integer) minimum budget
- "budget_max": (integer) maximum budget
- "style": (string) traditional/modern/luxury

Examples:
User: "venue in Delhi" → {"task": "find_venue", "filters": {"location": "Delhi"}}
User: "Show venues for 500 people" → {"task": "find_venue", "filters": {"capacity": 500}}
User: "Find me a wedding planner in Mumbai" → {"task": "find_planner", "filters": {"location": "Mumbai"}}"""
        
        # Initialize model with system instruction and conversation history
        model = genai.GenerativeModel(
            model_name='gemini-2.5-flash',
            system_instruction=system_instruction
        )
        
        # Prepare messages for API (including history)
        messages = [
            {'role': msg['role'], 'parts': [msg['content']]} 
            for msg in conversation_history
        ]
        
        # Generate response
        response = model.generate_content(messages)
        response_text = response.text.strip()
        
        # Add bot response to history
        conversation_history.append({
            'role': 'model',
            'content': response_text
        })
        
        # Try to parse as JSON (Task 1 - Venue Finding)
        try:
            parsed_response = json.loads(response_text)
            
            # Check if this is a venue finding task
            if parsed_response.get('task') == 'find_venue':
                filters = parsed_response.get('filters', {})
                
                # Build MongoDB query
                mongo_query = {}
                
                # Location filter
                if 'location' in filters:
                    mongo_query['location'] = {'$regex': filters['location'], '$options': 'i'}
                
                # Capacity filter for appropriate venue size
                if 'capacity' in filters:
                    requested_capacity = filters['capacity']
                    # Only show venues that can actually accommodate all guests
                    # Either with a single banquet hall or combined halls
                    mongo_query['$or'] = [
                        # Single banquet hall that can fit all guests
                        {
                            'banquets': {
                                '$elemMatch': {
                                    'capacity': {'$gte': requested_capacity}
                                }
                            }
                        },
                        # Or total venue capacity sufficient for all guests
                        {
                            'total_capacity': {'$gte': requested_capacity}
                        }
                    ]
                
                # Price filter - check banquets array
                price_query = {}
                if 'price_min' in filters:
                    price_query['$gte'] = filters['price_min']
                if 'price_max' in filters:
                    price_query['$lte'] = filters['price_max']
                if price_query:
                    if 'banquets' not in mongo_query:
                        mongo_query['banquets'] = {'$elemMatch': {}}
                    mongo_query['banquets']['$elemMatch']['price'] = price_query
                
                # Query database
                results = venues_collection.find(mongo_query)

                # Convert results to list and handle ObjectId
                matching_venues = []
                requested_capacity = filters.get('capacity', 0)

                for venue in results:
                    venue['_id'] = str(venue['_id'])
                    # Add the requested capacity to the venue object
                    venue['requestedCapacity'] = requested_capacity

                    # Only include venues that have at least one suitable banquet hall
                    has_suitable_hall = False
                    if requested_capacity > 0:
                        for banquet in venue.get('banquets', []):
                            if (banquet['capacity'] >= requested_capacity and
                                banquet['capacity'] <= requested_capacity + 100):
                                has_suitable_hall = True
                                break
                        if has_suitable_hall:
                            matching_venues.append(venue)
                    else:
                        matching_venues.append(venue)

                return jsonify({
                    'type': 'venues',
                    'data': matching_venues
                })
            
            # Check if this is an event planner finding task
            elif parsed_response.get('task') == 'find_planner':
                filters = parsed_response.get('filters', {})

                # Build MongoDB query for event planners
                mongo_query = {}

                # Location filter
                if 'location' in filters:
                    mongo_query['city'] = {'$regex': filters['location'], '$options': 'i'}

                # Budget filter
                budget_query = {}
                if 'budget_min' in filters:
                    budget_query['$gte'] = filters['budget_min']
                if 'budget_max' in filters:
                    budget_query['$lte'] = filters['budget_max']
                if budget_query:
                    mongo_query['min_budget'] = budget_query

                # Style/Event type filter
                if 'style' in filters:
                    style = filters['style'].lower()
                    if style == 'traditional':
                        mongo_query['event_types'] = {'$in': ['Traditional Ceremonies', 'Wedding']}
                    elif style == 'modern':
                        mongo_query['event_types'] = {'$in': ['Birthday Parties', 'Corporate Events']}
                    elif style == 'luxury':
                        mongo_query['event_types'] = {'$in': ['Destination Weddings', 'Beach Weddings']}

                # Query database
                results = event_planners_collection.find(mongo_query)

                # Convert results to list and handle ObjectId
                matching_planners = []
                for planner in results:
                    planner['_id'] = str(planner['_id'])
                    matching_planners.append(planner)

                return jsonify({
                    'type': 'event_planners',
                    'data': matching_planners
                })
        
        except json.JSONDecodeError:
            # Not JSON, so it's a text response (Task 2 or Task 3)
            pass
        
        # Return text response
        return jsonify({
            'type': 'text',
            'data': response_text
        })
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def get_event_planners(message):
    try:
        # Extract city from message if mentioned
        city = None
        cities = ['Mumbai', 'Delhi', 'Bangalore', 'Jaipur']
        for c in cities:
            if c.lower() in message.lower():
                city = c
                break

        # Build query
        query = {}
        if city:
            query['city'] = city

        # Get event planners
        planners = list(event_planners_collection.find(query))
        
        # Convert ObjectId to string
        for planner in planners:
            planner['_id'] = str(planner['_id'])

        if planners:
            response = "Here are some event planners that can help with your wedding:\n\n"
            for planner in planners:
                response += f"🎉 {planner['name']}\n"
                response += f"📍 {planner['location']}\n"
                response += f"⭐ Rating: {planner['rating']}/5\n"
                response += f"💫 Experience: {planner['experience_years']} years\n"
                response += f"💰 Price Range: {planner['price_range']} (Min. Budget: ₹{planner['min_budget']:,})\n\n"
                response += "Key Services:\n"
                for category, services in planner['services'].items():
                    if category == 'pre_wedding':
                        response += "🎯 Pre-Wedding: " + ", ".join(services[:3]) + "\n"
                    elif category == 'design_decor':
                        response += "🎨 Design & Décor: " + ", ".join(services[:3]) + "\n"
                    elif category == 'entertainment':
                        response += "🎵 Entertainment: " + ", ".join(services[:3]) + "\n"
                    elif category == 'catering':
                        response += "🍽️ Catering: " + ", ".join(services[:3]) + "\n"
                    elif category == 'photography':
                        response += "📸 Photography: " + ", ".join(services[:3]) + "\n"
                response += f"\n📞 Contact: {planner['contact']['phone']}\n"
                response += f"📧 Email: {planner['contact']['email']}\n"
                response += "\n-------------------\n\n"
        else:
            response = "I couldn't find any event planners matching your criteria. Would you like to search in a different city?"

        return {
            'type': 'text',
            'data': response
        }
    except Exception as e:
        print(f"Error getting event planners: {str(e)}")
@app.route('/api/chat/reset', methods=['POST'])
def reset_conversation():
    global conversation_history
    conversation_history = []
    return jsonify({
        'message': 'Conversation history cleared',
        'status': 'OK'
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
