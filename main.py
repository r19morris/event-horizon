"""
PERSON 2: Simplified FastAPI Server for 3-hour sprint

Your tasks (60 minutes total):
1. Basic FastAPI setup (10 min)
2. /chat endpoint (20 min)
3. /generate endpoint (30 min)

NO database, NO authentication, NO fancy stuff
Just make the endpoints work!
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from rag_service import get_rag_service

app = FastAPI(title="Travel Planner API - 3hr version")

# CORS - allow frontend to talk to us
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ChatRequest(BaseModel):
    message: str
    city: Optional[str] = None

class ChatResponse(BaseModel):
    message: str

class ItineraryRequest(BaseModel):
    city: str
    start_date: str  # "2025-06-01"
    end_date: str    # "2025-06-05"
    interests: List[str] = []
    num_travelers: int = 1

@app.get("/")
def root():
    """Health check"""
    return {"status": "ok", "message": "Travel Planner API is running!"}

@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    """
    PERSON 2: Chat endpoint
    
    Simple chat with optional city context
    Time: 20 minutes
    """
    try:
        rag = get_rag_service()
        response = rag.chat(request.message, request.city)
        return ChatResponse(message=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate")
def generate_itinerary(request: ItineraryRequest):
    """
    PERSON 2: Main itinerary generation endpoint
    
    This is the most important endpoint!
    Calls RAG service and returns JSON
    Time: 30 minutes
    """
    try:
        # Validate dates
        from datetime import datetime
        start = datetime.fromisoformat(request.start_date)
        end = datetime.fromisoformat(request.end_date)
        
        if end < start:
            raise HTTPException(status_code=400, detail="End date must be after start date")
        
        # Generate itinerary
        rag = get_rag_service()
        itinerary = rag.generate_itinerary(
            city=request.city,
            start_date=request.start_date,
            end_date=request.end_date,
            interests=request.interests,
            num_travelers=request.num_travelers
        )
        
        return itinerary
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# That's it! Only 2 endpoints needed for 3-hour version
# No database, no auth, no fancy features
# Just working RAG-based travel planning

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
