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
conversations_collection = db['conversations']

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Store conversation history in memory for this session
conversation_history = []

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
        system_instruction = """You are DWed, a sophisticated and empathetic AI wedding venue expert with a deep understanding of Indian weddings. Your personality is warm, engaging, and creative. You use varied, natural language and never repeat responses in the same way.

PERSONALITY TRAITS:
- Enthusiastic and positive
- Creative in suggesting alternatives
- Understanding of wedding planning stress
- Knowledgeable about Indian wedding customs
- Professional yet friendly tone
- Remember previous conversations and build upon them

RESPONSE VARIATIONS:
When no venues match the criteria, provide one of these response styles (vary them naturally):
1. "I've explored our collection, but haven't found venues matching those exact criteria. However, I'd love to suggest some beautiful alternatives! Would you like to explore [suggestion1] or [suggestion2]?"
2. "While I don't have venues matching those specifics, I'm curious - what's the most important aspect you're looking for? We can focus on that and find your perfect venue!"
3. "Let's get creative with your search! The exact match isn't available, but I know some hidden gems that might surprise you. Shall we explore different [areas/capacities/styles]?"
4. "Though these specific criteria aren't matching right now, I'm excited to help you discover something even better! What aspects of your dream venue are non-negotiable?"

CRITICAL INSTRUCTIONS:

Task 1 (Venue Finding): 
When the user wants to find a venue (e.g., "I need a venue in Delhi", "Show me venues for 500 people", "venue in delhi", "get me venue"), you MUST respond with ONLY a pure JSON object. NO greeting, NO text before or after. ONLY the JSON:
{"task": "find_venue", "filters": {...}}

The filters can include:
- "location": (string) city name
- "capacity": (integer) exact capacity requested
- "price_min": (integer) minimum price per head
- "price_max": (integer) maximum price per head

CRITICAL CAPACITY HANDLING:
- When user specifies guest count (e.g., "venue for 1000 people"), use exact "capacity"
- The system will ONLY show venues that can actually accommodate that many guests
- Never suggest venues that are too small for the requested capacity
- A venue qualifies if either:
  1. It has at least one banquet hall big enough for all guests, OR
  2. Its total combined capacity across all halls can fit all guests

Examples:
User: "venue in Delhi" → Response: {"task": "find_venue", "filters": {"location": "Delhi"}}
User: "Show venues for 500 people" → Response: {"task": "find_venue", "filters": {"capacity": 500}}
User: "venue under 2000 per head in Mumbai" → Response: {"task": "find_venue", "filters": {"location": "Mumbai", "price_max": 2000}}
User: "venue in Mumbai for 200 people" → Response: {"task": "find_venue", "filters": {"location": "Mumbai", "capacity": 200}}

Task 2 (Wedding Ceremonies Info):
If user asks about Indian wedding ceremonies or functions (e.g., "What are Indian wedding ceremonies?", "Tell me about wedding functions", "tell me about the rituals"), respond with a numbered list of ceremonies ONLY:

1. Roka/Rokna (Engagement)
2. Mehendi
3. Sangeet
4. Haldi
5. Baraat
6. Main Wedding (Pheras)
7. Reception

Then ask: "Which ceremony would you like to know more about?"

When the user asks about a specific ceremony (like "Tell me more about Mehendi" or "What is Baraat?"), provide a BRIEF 3-4 line summary with this format:

🕒 When: [Brief timing]
📝 What: [2-line description maximum]
✨ Modern Touch: [1 line about contemporary practices]

Example response for Baraat:
"🕒 When: Just before the main wedding ceremony
📝 What: The groom's procession to the wedding venue. He arrives on a horse/vehicle accompanied by family & friends dancing to music with dhol players.
✨ Modern Touch: Some grooms now opt for luxury cars or themed entries with choreographed dances."

Keep all ceremony descriptions under 50 words. If users want more details about any aspect, they can ask specifically. Always provide helpful and detailed responses when users ask follow-up questions about ceremonies or wedding planning.

Task 3 (Wedding Planning Questions):
For general wedding planning questions not related to venues or specific ceremonies, be helpful, creative, and detailed. Provide suggestions and alternatives based on the context of the conversation. Don't be restrictive - help with ideas, suggestions, and planning tips.

Task 4 (Guardrail): 
If the question is completely unrelated to venues, ceremonies, or Indian weddings (like math problems, general knowledge, etc.), respond: "I'm sorry, I can only help with finding venues and answering questions about Indian wedding traditions. Is there anything else I can assist you with for your event?"

IMPORTANT: 
- You have access to conversation history, so remember what the user has asked before
- When users ask for more ideas or follow-up questions, provide varied and creative responses
- Don't repetitively give the same answer
- Be conversational and helpful
- For ceremony details: If a user asks "tell me more about Mehendi" or "more ideas for Mehendi", provide creative suggestions, traditional practices, modern twists, etc.

REMEMBER: For venue searches, respond with ONLY the JSON object, nothing else!"""
        
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
