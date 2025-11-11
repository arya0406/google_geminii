def get_event_planners_response(message):
    try:
        # Extract city if mentioned
        city_query = None
        cities = ["mumbai", "delhi", "bangalore"]
        message_lower = message.lower()
        
        for city in cities:
            if city in message_lower:
                city_query = city.capitalize()
                break
        
        # Query MongoDB
        query = {}
        if city_query:
            query["city"] = city_query
            
        planners = list(event_planners_collection.find(query))
        
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