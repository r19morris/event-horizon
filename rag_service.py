"""
PERSON 1: Simplified RAG Service for 3-hour sprint

Your tasks (90 minutes total):
1. Initialize vector store (10 min)
2. Implement retrieval (20 min)
3. Build itinerary generation prompt (30 min)
4. Test and debug (30 min)

Keep it simple - just make it work!
"""

from langchain_community.vectorstores import Chroma
# from langchain_anthropic import ChatAnthropic
from langchain_community.embeddings import HuggingFaceEmbeddings
from typing import List, Dict, Any
import json
import os

class SimpleRAGService:
    """Simplified RAG service - no bells and whistles"""
    
    def __init__(self):
        self.embeddings = None
        self.vector_store = None
        self.llm = None
        
    def initialize(self):
        """Initialize RAG components"""
        print("🚀 Initializing RAG service...")
        
        # api_key = os.getenv('OPENAI_API_KEY')
        # if not api_key:
        #     raise ValueError("OPENAI_API_KEY not set!")
        
        # Initialize embeddings
        # self.embeddings = OpenAIEmbeddings(
        #     model="text-embedding-3-small",
        #     openai_api_key=api_key
        # )
        self.embeddings = HuggingFaceEmbeddings(
            model_name="all-MiniLM-L6-v2"
        )
        
        # Load existing vector store
        self.vector_store = Chroma(
            persist_directory="./chroma_db",
            embedding_function=self.embeddings,
            collection_name="travel_data"
        )
        
        # Initialize LLM
        # self.llm = ChatOpenAI(
        #     model="gpt-4o-mini",  # Faster and cheaper for demo
        #     temperature=0.7,
        #     openai_api_key=api_key
        # )

        self.llm = ChatAnthropic(
            model="claude-3-5-sonnet-20241022",  # or claude-3-5-haiku-20241022 for faster
            temperature=0.7,
            anthropic_api_key=os.getenv('ANTHROPIC_API_KEY')
        )
        
        print("RAG service initialized")
    
    def retrieve(self, query: str, city: str, k: int = 5) -> List[Dict]:
        """
        Retrieve relevant documents
        
        PERSON 1: This is your main retrieval function
        Keep it simple - just filter by city and return top-k
        """
        print(f"🔍 Searching for: {query} in {city}")
        
        # Search with city filter
        results = self.vector_store.similarity_search(
            query=query,
            k=k,
            filter={'city': city.lower()}
        )
        
        docs = []
        for doc in results:
            docs.append({
                'content': doc.page_content,
                'metadata': doc.metadata
            })
        
        print(f"Found {len(docs)} relevant documents")
        return docs
    
    def generate_itinerary(self, city: str, start_date: str, end_date: str, 
                          interests: List[str], num_travelers: int) -> Dict:
        """
        Generate itinerary using RAG
        
        PERSON 1: This is your main generation function
        Steps:
        1. Retrieve relevant info based on interests
        2. Build prompt with constraints
        3. Call LLM
        4. Parse response
        """
        
        from datetime import datetime
        start = datetime.fromisoformat(start_date)
        end = datetime.fromisoformat(end_date)
        num_days = (end - start).days + 1
        
        # Build query from interests
        interests_str = ", ".join(interests) if interests else "general sightseeing"
        query = f"{city} travel guide {interests_str} restaurants attractions"
        
        # Retrieve relevant documents
        docs = self.retrieve(query, city, k=10)
        
        # Build context from docs
        context = "\n\n".join([
            f"[{doc['metadata'].get('type', 'info')}] {doc['content']}"
            for doc in docs
        ])
        
        # Build prompt
        prompt = f"""You are a travel planner. Create a {num_days}-day itinerary for {city}.

REQUIREMENTS:
- Dates: {start_date} to {end_date} ({num_days} days)
- Travelers: {num_travelers}
- Interests: {interests_str}

AVAILABLE INFORMATION:
{context}

Create a realistic daily schedule with:
- Specific times (use 24-hour format like "09:00")
- Activity names and descriptions
- Locations
- Estimated duration in minutes
- Estimated costs

Return ONLY valid JSON in this exact format:
{{
  "daily_plans": [
    {{
      "date": "{start_date}",
      "day_number": 1,
      "items": [
        {{
          "time": "09:00",
          "activity": "Activity name",
          "location": "Address or area",
          "description": "What you'll do here",
          "duration_minutes": 120,
          "cost": 25.00
        }}
      ]
    }}
  ],
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}}

Include 4-6 activities per day. Mix meals, attractions, and free time.
RESPOND ONLY WITH JSON, NO OTHER TEXT."""

        print("🤖 Generating itinerary...")
        
        # Call LLM
        response = self.llm.invoke(prompt)
        
        # Parse response
        try:
            # Extract JSON from response
            content = response.content
            start_idx = content.find('{')
            end_idx = content.rfind('}') + 1
            json_str = content[start_idx:end_idx]
            
            itinerary = json.loads(json_str)
            itinerary['city'] = city
            itinerary['start_date'] = start_date
            itinerary['end_date'] = end_date
            
            print(f"✅ Generated {len(itinerary['daily_plans'])} day itinerary!")
            return itinerary
            
        except Exception as e:
            print(f"❌ Error parsing response: {e}")
            # Return minimal fallback
            return {
                'city': city,
                'start_date': start_date,
                'end_date': end_date,
                'daily_plans': [],
                'tips': [],
                'error': str(e)
            }
    
    def chat(self, message: str, city: str = None) -> str:
        """
        Simple chat function
        
        PERSON 1: Basic chat - retrieve context and respond
        """
        # If city mentioned, retrieve relevant info
        context = ""
        if city:
            docs = self.retrieve(message, city, k=3)
            context = "\n".join([doc['content'] for doc in docs])
        
        prompt = f"""You are a helpful travel assistant. Answer the user's question.

{"CONTEXT:\n" + context if context else ""}

USER: {message}

ASSISTANT:"""
        
        response = self.llm.invoke(prompt)
        return response.content

# Global instance
rag_service = None

def get_rag_service():
    """Get or create RAG service"""
    global rag_service
    if rag_service is None:
        rag_service = SimpleRAGService()
        rag_service.initialize()
    return rag_service
