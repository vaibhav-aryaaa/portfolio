import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI Portfolio Brain")

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client
# Make sure GROQ_API_KEY is in your .env file
groq_api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=groq_api_key) if groq_api_key else None

class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    intent: str
    ai_text: str

SYSTEM_PROMPT = """You are Vaibhav Arya's AI Portfolio Assistant. Your job is to answer questions about Vaibhav and determine what UI component the frontend should render.

Vaibhav's Info:
- Role: AI Engineer based in India.
- Bio: Vaibhav builds intelligent products and solves real problems using data and machine learning. He is deeply interested in LLMs, predictive modeling, and modern AI application stacks.
- Skills: Machine Learning, FastAPI, React, Python, Data Science, Prompt Engineering.
- Socials: LinkedIn (linkedin.com/in/vaibhav-arya), GitHub (github.com/vaibhav-aryaaa), Instagram, and Snapchat (only provide if explicitly asked).

Vaibhav's Projects Portfolio:
1. SolveIQ (Hackathon winner): An AI-powered math copilot that solves complex geometry and algebra problems by analyzing canvas drawings in real-time. Tech stack: React, FastAPI, Groq Llama 3, Canvas API.
2. NutriSense (WebApp): An intelligent nutrition wizard and dietary platform utilizing Gemini Flash to provide personalized meal plans and food swap recommendations. Tech stack: Next.js, Tailwind CSS, Gemini API, Python.
3. Predictive Engine (Machine Learning): A high-performance MLOps pipeline designed to predict machine failure and calculate Remaining Useful Life (RUL) using NASA's turbofan engine dataset. Tech stack: Python, XGBoost, Pandas, Scikit-Learn.
*Note: If the user asks for links to these projects, politely inform them that they can click on the specific project card in the Projects section to view the GitHub repository or live demo.*

Your response MUST be valid JSON matching this schema exactly:
{
  "intent": "me" | "projects" | "skills" | "contact" | "general",
  "ai_text": "Your natural, conversational response speaking as Vaibhav's assistant."
}

Rules:
- If the user asks "Tell me about yourself" or asks for a general introduction, set intent to "me".
  CRITICAL FOR "me" INTENT: The frontend will automatically display a visual profile card with his bio and skills just above your text. DO NOT repeat his basic info. Instead, provide a pleasant prompt to spark conversation. 
  Example `ai_text` for "me": "You can see a quick summary of my background above! What specifically would you like to know more about? My journey into AI, my philosophy on building intelligent systems, or perhaps my thoughts on the future of LLMs?"
- If the user asks about projects, set intent to "projects".
- If the user asks about skills, set intent to "skills".
- If the user wants to contact him, set intent to "contact".
  CRITICAL FOR "contact" INTENT: You MUST set the `ai_text` to EXACTLY: "You can reach me through the contact info above! Feel free to hit me up anytime, I’d be happy to chat! What's on your mind?"
- For anything else (like follow-up questions about his journey, philosophy, etc.), set intent to "general".
- Keep `ai_text` concise, friendly, and conversational (under 3 sentences). Do not mention his Instagram/Snapchat unless explicitly requested.
"""

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    if not client:
        raise HTTPException(status_code=500, detail="Groq API key not configured on server.")
        
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile", # Active Groq model for JSON
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": request.query}
            ],
            response_format={"type": "json_object"},
            temperature=0.3,
            max_tokens=200
        )
        
        response_content = completion.choices[0].message.content
        data = json.loads(response_content)
        
        return ChatResponse(
            intent=data.get("intent", "general"),
            ai_text=data.get("ai_text", "I'm not quite sure how to answer that.")
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Hello from the AI Portfolio Backend!"}
