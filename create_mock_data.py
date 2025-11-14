"""
PERSON 4: Run this file FIRST to create mock data!

This is your ONLY task for the first 40 minutes.
1. Run this script
2. Verify vector store has data
3. Then help others debug

Time: 30-40 minutes
"""

import json
from datetime import datetime

# Mock data for popular cities
MOCK_DATA = {
    "paris": {
        "restaurants": [
            {
                "name": "Le Comptoir du Relais",
                "cuisine": "French Bistro",
                "price": "$$",
                "rating": 4.5,
                "description": "Classic Parisian bistro serving traditional French dishes. Famous for their duck confit and coq au vin.",
                "location": "9 Carrefour de l'Odéon, 75006",
                "booking_url": "https://opentable.com/le-comptoir",
                "dietary": ["vegetarian options available"]
            },
            {
                "name": "Breizh Café",
                "cuisine": "Crêperie",
                "price": "$$",
                "rating": 4.7,
                "description": "Authentic Breton crêpes and galettes. Try the complete galette with ham, cheese, and egg.",
                "location": "109 Rue Vieille du Temple, 75003",
                "booking_url": "https://opentable.com/breizh",
                "dietary": ["gluten-free options", "vegetarian"]
            },
            {
                "name": "Septime",
                "cuisine": "Contemporary French",
                "price": "$$$",
                "rating": 4.8,
                "description": "Michelin-starred restaurant with innovative seasonal menu. Book months in advance.",
                "location": "80 Rue de Charonne, 75011",
                "booking_url": "https://opentable.com/septime",
                "dietary": ["vegetarian tasting menu available"]
            },
            {
                "name": "L'As du Fallafel",
                "cuisine": "Middle Eastern",
                "price": "$",
                "rating": 4.6,
                "description": "Best falafel in Paris. Always a line but moves fast. Cash only.",
                "location": "34 Rue des Rosiers, 75004",
                "dietary": ["vegetarian", "vegan"]
            }
        ],
        "attractions": [
            {
                "name": "Eiffel Tower",
                "type": "landmark",
                "rating": 4.6,
                "description": "Iconic iron lattice tower. Visit at sunset for best views. Book tickets online to skip lines.",
                "duration_minutes": 120,
                "cost": 26.00,
                "tips": ["Book online in advance", "Visit early morning or evening", "Bring a jacket - windy at top"],
                "categories": ["photography", "sightseeing", "romantic"]
            },
            {
                "name": "Louvre Museum",
                "type": "museum",
                "rating": 4.7,
                "description": "World's largest art museum. Home to Mona Lisa and Venus de Milo. Impossible to see everything in one day.",
                "duration_minutes": 180,
                "cost": 17.00,
                "tips": ["Buy tickets online", "Enter through less crowded entrances", "Visit Wednesday or Friday evening", "Don't try to see everything"],
                "categories": ["art", "culture", "indoor"]
            },
            {
                "name": "Montmartre & Sacré-Cœur",
                "type": "neighborhood",
                "rating": 4.8,
                "description": "Charming hilltop neighborhood with artists, cafes, and stunning basilica. Great views of Paris.",
                "duration_minutes": 150,
                "cost": 0,
                "tips": ["Wear comfortable shoes", "Visit in morning for fewer crowds", "Explore side streets", "Watch for pickpockets"],
                "categories": ["walking", "photography", "culture"]
            },
            {
                "name": "Seine River Cruise",
                "type": "activity",
                "rating": 4.4,
                "description": "Hour-long boat tour past major landmarks. Relaxing way to see the city.",
                "duration_minutes": 60,
                "cost": 15.00,
                "tips": ["Evening cruises are more romantic", "Sit on upper deck", "Bring a light jacket"],
                "categories": ["sightseeing", "relaxation", "romantic"]
            }
        ],
        "events": [
            {
                "name": "Jazz at Sunset - Parc de la Villette",
                "date": "2025-06-15",
                "time": "19:00",
                "venue": "Parc de la Villette",
                "description": "Free outdoor jazz concert series. Bring a picnic blanket.",
                "cost": 0,
                "categories": ["music", "outdoor", "free"]
            }
        ],
        "tips": [
            "Metro is fastest way to get around. Buy a carnet (10 tickets) for savings.",
            "Most museums closed on Mondays or Tuesdays. Check before going.",
            "Restaurants serve lunch 12-2pm, dinner after 7:30pm. Plan accordingly.",
            "Many places close in August when locals take vacation.",
            "Learn basic French phrases - locals appreciate the effort."
        ]
    },
    "tokyo": {
        "restaurants": [
            {
                "name": "Ichiran Ramen",
                "cuisine": "Ramen",
                "price": "$",
                "rating": 4.5,
                "description": "Famous tonkotsu ramen chain with individual booths for focused eating experience.",
                "location": "Shibuya, multiple locations",
                "dietary": ["pork-free options available"]
            },
            {
                "name": "Tsukiji Outer Market",
                "cuisine": "Seafood",
                "price": "$$",
                "rating": 4.7,
                "description": "Fresh sushi and street food near old fish market. Visit early morning for best selection.",
                "location": "Tsukiji, Chuo City",
                "dietary": ["many vegetarian options"]
            },
            {
                "name": "Sukiyabashi Jiro",
                "cuisine": "Sushi",
                "price": "$$$$",
                "rating": 4.9,
                "description": "3-Michelin star sushi. Featured in Jiro Dreams of Sushi. Book months ahead.",
                "location": "Ginza",
                "booking_url": "https://booking.com/jiro",
                "dietary": ["no vegetarian options"]
            }
        ],
        "attractions": [
            {
                "name": "Senso-ji Temple",
                "type": "temple",
                "rating": 4.6,
                "description": "Tokyo's oldest temple in Asakusa. Beautiful traditional architecture and shopping street.",
                "duration_minutes": 90,
                "cost": 0,
                "tips": ["Visit early morning to avoid crowds", "Try fortune telling", "Shop on Nakamise Street"],
                "categories": ["culture", "photography", "free"]
            },
            {
                "name": "teamLab Borderless",
                "type": "museum",
                "rating": 4.8,
                "description": "Immersive digital art museum. Stunning interactive installations.",
                "duration_minutes": 120,
                "cost": 35.00,
                "tips": ["Book tickets weeks in advance", "Wear comfortable shoes", "Best in evening"],
                "categories": ["art", "indoor", "photography"]
            },
            {
                "name": "Shibuya Crossing",
                "type": "landmark",
                "rating": 4.5,
                "description": "World's busiest pedestrian crossing. Best viewed from Starbucks above.",
                "duration_minutes": 30,
                "cost": 0,
                "tips": ["Visit at night when lit up", "Watch from above first", "Peak times more impressive"],
                "categories": ["photography", "sightseeing", "free"]
            }
        ],
        "events": [],
        "tips": [
            "Get a Suica/Pasmo card for trains and convenience stores.",
            "Tokyo is huge - focus on 2-3 neighborhoods per day.",
            "Many restaurants have English menus or picture menus.",
            "Cash is still king - have yen on hand.",
            "Trains stop around midnight - plan accordingly."
        ]
    },
    "new york": {
        "restaurants": [
            {
                "name": "Joe's Pizza",
                "cuisine": "Pizza",
                "price": "$",
                "rating": 4.5,
                "description": "Classic NY slice. Simple, delicious, no frills. Cash only.",
                "location": "7 Carmine St, Greenwich Village",
                "dietary": ["vegetarian"]
            },
            {
                "name": "Katz's Delicatessen",
                "cuisine": "Deli",
                "price": "$$",
                "rating": 4.6,
                "description": "Legendary Jewish deli since 1888. Famous pastrami sandwich. When Harry Met Sally filmed here.",
                "location": "205 E Houston St",
                "dietary": ["some vegetarian options"]
            },
            {
                "name": "Momofuku Noodle Bar",
                "cuisine": "Asian Fusion",
                "price": "$$",
                "rating": 4.4,
                "description": "David Chang's famous ramen spot. Try the pork buns.",
                "location": "171 1st Ave, East Village",
                "dietary": ["limited vegetarian options"]
            }
        ],
        "attractions": [
            {
                "name": "Central Park",
                "type": "park",
                "rating": 4.8,
                "description": "Massive urban park. Walk, bike, or just relax. Different areas have different vibes.",
                "duration_minutes": 180,
                "cost": 0,
                "tips": ["Rent a bike", "Visit Bethesda Fountain", "Check out Strawberry Fields"],
                "categories": ["outdoor", "walking", "free"]
            },
            {
                "name": "Metropolitan Museum of Art",
                "type": "museum",
                "rating": 4.7,
                "description": "One of world's greatest art museums. Could spend days here.",
                "duration_minutes": 180,
                "cost": 30.00,
                "tips": ["Suggested admission - pay what you wish", "Visit rooftop garden", "Egyptian wing is must-see"],
                "categories": ["art", "culture", "indoor"]
            },
            {
                "name": "Brooklyn Bridge Walk",
                "type": "activity",
                "rating": 4.6,
                "description": "Walk across iconic bridge from Manhattan to Brooklyn. Great views.",
                "duration_minutes": 45,
                "cost": 0,
                "tips": ["Go early morning for fewer tourists", "Walk back for different views", "Explore DUMBO after"],
                "categories": ["walking", "photography", "free"]
            }
        ],
        "events": [],
        "tips": [
            "Subway is 24/7 and cheapest way around. Get unlimited MetroCard.",
            "Walk between neighborhoods - distances are smaller than they seem.",
            "Avoid Times Square unless you want crowds and overpriced food.",
            "Free ferries give great views of Statue of Liberty.",
            "Brunch is a religion here - expect waits on weekends."
        ]
    }
}

def create_mock_data_file():
    """Save mock data to JSON file"""
    with open('mock_travel_data.json', 'w') as f:
        json.dump(MOCK_DATA, f, indent=2)
    print("✅ Created mock_travel_data.json")

def format_for_vector_store(city_data, city_name):
    """Convert mock data to documents for vector store"""
    documents = []
    
    # Restaurants
    for restaurant in city_data.get('restaurants', []):
        text = f"""
        Restaurant: {restaurant['name']}
        Location: {city_name}, {restaurant.get('location', 'N/A')}
        Cuisine: {restaurant['cuisine']}
        Price: {restaurant['price']}
        Rating: {restaurant['rating']}/5
        Description: {restaurant['description']}
        Dietary Options: {', '.join(restaurant.get('dietary', []))}
        """
        
        documents.append({
            'text': text.strip(),
            'metadata': {
                'type': 'restaurant',
                'city': city_name.lower(),
                'name': restaurant['name'],
                'rating': restaurant['rating'],
                'price': restaurant['price'],
                'booking_url': restaurant.get('booking_url', '')
            }
        })
    
    # Attractions
    for attraction in city_data.get('attractions', []):
        text = f"""
        Attraction: {attraction['name']}
        Location: {city_name}
        Type: {attraction['type']}
        Rating: {attraction['rating']}/5
        Description: {attraction['description']}
        Duration: {attraction['duration_minutes']} minutes
        Cost: ${attraction['cost']}
        Tips: {' '.join(attraction.get('tips', []))}
        Categories: {', '.join(attraction.get('categories', []))}
        """
        
        documents.append({
            'text': text.strip(),
            'metadata': {
                'type': 'attraction',
                'city': city_name.lower(),
                'name': attraction['name'],
                'rating': attraction['rating'],
                'cost': attraction['cost'],
                'duration': attraction['duration_minutes']
            }
        })
    
    # Tips
    for tip in city_data.get('tips', []):
        text = f"Travel Tip for {city_name}: {tip}"
        
        documents.append({
            'text': text,
            'metadata': {
                'type': 'tip',
                'city': city_name.lower()
            }
        })
    
    return documents

def index_mock_data():
    """Index all mock data into vector store"""
    print("🚀 Starting to index mock data...")
    
    # Import here to avoid issues if not installed yet
    try:
        from langchain_openai import OpenAIEmbeddings
        from langchain_community.vectorstores import Chroma
        import os
    except ImportError:
        print("❌ Missing dependencies. Run: pip install -r requirements.txt")
        return
    
    # Check for API key
    if not os.getenv('OPENAI_API_KEY'):
        print("❌ OPENAI_API_KEY not set. Add to .env file or export OPENAI_API_KEY=...")
        return
    
    # Initialize embeddings
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    
    # Collect all documents
    all_documents = []
    for city_name, city_data in MOCK_DATA.items():
        docs = format_for_vector_store(city_data, city_name.title())
        all_documents.extend(docs)
        print(f"  📍 Formatted {len(docs)} documents for {city_name.title()}")
    
    print(f"\n📦 Total documents to index: {len(all_documents)}")
    
    # Create vector store
    texts = [doc['text'] for doc in all_documents]
    metadatas = [doc['metadata'] for doc in all_documents]
    
    vector_store = Chroma.from_texts(
        texts=texts,
        metadatas=metadatas,
        embedding=embeddings,
        persist_directory="./chroma_db",
        collection_name="travel_data"
    )
    
    print("✅ Successfully indexed all mock data into Chroma!")
    print(f"📊 Vector store location: ./chroma_db")
    
    # Test retrieval
    print("\n🧪 Testing retrieval...")
    results = vector_store.similarity_search("best restaurants in Paris", k=3)
    print(f"✅ Retrieved {len(results)} results for test query")
    if results:
        print(f"   Top result: {results[0].metadata.get('name', 'N/A')}")

if __name__ == '__main__':
    print("=" * 50)
    print("PERSON 4: Mock Data Generator")
    print("=" * 50)
    print()
    
    # Step 1: Create JSON file
    create_mock_data_file()
    
    # Step 2: Index into vector store
    index_mock_data()
    
    print("\n" + "=" * 50)
    print("✅ DONE! You can now start the backend server.")
    print("=" * 50)
