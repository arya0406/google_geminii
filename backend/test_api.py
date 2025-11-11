import requests
import json

# Test the backend API
def test_backend():
    try:
        # Test with a simple venue query
        print("🧪 Testing venue query...")
        response = requests.post('http://127.0.0.1:5000/api/chat',
                               json={'message': 'Show me venues in Delhi'},
                               headers={'Content-Type': 'application/json'})

        if response.status_code == 200:
            data = response.json()
            print(f"✅ Venue query response: {data.get('type')}")
            if data.get('type') == 'venues':
                print(f"   Found {len(data.get('data', []))} venues")
        else:
            print(f"❌ Venue query failed: {response.status_code}")

        # Test with an event planner query
        print("\n🧪 Testing event planner query...")
        response = requests.post('http://127.0.0.1:5000/api/chat',
                               json={'message': 'Find me wedding planners in Mumbai'},
                               headers={'Content-Type': 'application/json'})

        if response.status_code == 200:
            data = response.json()
            print(f"✅ Event planner query response: {data.get('type')}")
            if data.get('type') == 'event_planners':
                print(f"   Found {len(data.get('data', []))} event planners")
            elif data.get('type') == 'text':
                print(f"   Text response: {data.get('data', '')[:100]}...")
        else:
            print(f"❌ Event planner query failed: {response.status_code}")

    except Exception as e:
        print(f"❌ Test failed: {str(e)}")
        print("Make sure the backend server is running on http://127.0.0.1:5000")

if __name__ == "__main__":
    test_backend()