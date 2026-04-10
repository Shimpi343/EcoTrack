import joblib

model = joblib.load("co2_model.pkl")
print("✅ ML Model Loaded Successfully")
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import text
from pydantic import BaseModel, EmailStr
from passlib.hash import sha256_crypt
import os

from openai import OpenAI
from dotenv import load_dotenv

from db import get_connection
from auth_utils import create_access_token, verify_token
from suggestions import get_suggestions, get_predict_suggestions
from chatbot import ask_chatbot as fallback_chatbot

# ---------------------------------------------------------
# LOAD ENV + OPENAI
# ---------------------------------------------------------
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

# ---------------------------------------------------------
# FASTAPI + CORS
# ---------------------------------------------------------
app = FastAPI(title="EcoTrack API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

# ---------------------------------------------------------
# AUTH HELPERS
# ---------------------------------------------------------
def hash_password(password: str) -> str:
    return sha256_crypt.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return sha256_crypt.verify(plain, hashed)

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token)
    if not payload or "user_id" not in payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload["user_id"]

# ---------------------------------------------------------
# AUTH ROUTES
# ---------------------------------------------------------
class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

@app.post("/api/signup")
def signup(data: SignupRequest):
    conn = get_connection()

    exists = conn.execute(
        text("SELECT id FROM users WHERE email=:e"),
        {"e": data.email}
    ).first()

    if exists:
        raise HTTPException(status_code=400, detail="Email already registered")

    conn.execute(
        text("""
            INSERT INTO users(name, email, password_hash)
            VALUES (:n, :e, :p)
        """),
        {
            "n": data.name,
            "e": data.email,
            "p": hash_password(data.password)
        }
    )
    conn.commit()
    conn.close()

    return {"status": "success"}

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
from fastapi import Request
import pandas as pd

@app.post("/api/predict")
async def predict(request: Request, user_id=Depends(get_current_user)):
    import json

    conn = get_connection()
    rows = conn.execute(
        text("""
            SELECT travel_km, electricity_kwh, lpg_kg,
                   diet_type, raw_json, computed_co2
            FROM daily_logs
            WHERE user_id = :u
            ORDER BY log_date DESC
            LIMIT 7
        """),
        {"u": user_id}
    ).mappings().all()
    conn.close()

    if not rows:
        raise HTTPException(
            status_code=400,
            detail="No logs found. Add at least 1 daily log first."
        )

    DIET_MAP = {
        "veg": 1, "vegetarian": 1, "vegan": 0,
        "pescatarian": 2, "non-veg": 3, "omnivore": 3
    }
    VEHICLE_MAP = {
        "walk": 0, "cycle": 0, "ev": 0,
        "average": 1, "public": 1,
        "bike": 2, "petrol": 2, "car": 2, "diesel": 3
    }

    travel_list, elec_list, ac_list   = [], [], []
    fan_list, diet_list, vehicle_list = [], [], []
    past_co2_list = []

    for row in rows:
        raw = {}
        try:
            raw = json.loads(row["raw_json"]) if row["raw_json"] else {}
        except Exception:
            raw = {}

        appliances = raw.get("appliances", {})
        travel_list.append(float(row["travel_km"] or 0))
        elec_list.append(float(row["electricity_kwh"] or 0))
        past_co2_list.append(float(row["computed_co2"] or 0))
        ac_list.append(float(appliances.get("ac", 0)))
        fan_list.append(float(appliances.get("fan", 0)))

        diet_raw = str(raw.get("diet", row.get("diet_type", "vegetarian"))).lower().strip()
        diet_list.append(DIET_MAP.get(diet_raw, 1))

        vehicle_raw = str(raw.get("travelMode", "average")).lower().strip()
        vehicle_list.append(VEHICLE_MAP.get(vehicle_raw, 1))

    def avg(lst):
        return round(sum(lst) / len(lst), 3) if lst else 0

    avg_features = {
        "travel_km":       avg(travel_list),
        "electricity_kwh": avg(elec_list),
        "ac_hours":        avg(ac_list),
        "fan_hours":       avg(fan_list),
        "diet_type":       round(avg(diet_list)),
        "vehicle_type":    round(avg(vehicle_list)),
    }

    # ── Predict ONLY tomorrow (1 day) ──
    input_df = pd.DataFrame([avg_features])
    predicted_tomorrow = round(float(model.predict(input_df)[0]), 2)

    suggestions = get_predict_suggestions(avg_features, predicted_tomorrow)

    return {
        "past_logs_used":   len(rows),
        "past_avg_co2":     round(avg(past_co2_list), 2),
        "past_7_days":      [round(c, 2) for c in past_co2_list],
        "avg_features":     avg_features,
        "predicted_tomorrow": predicted_tomorrow,   # ← single value
        "suggestions":      suggestions,
    }
@app.post("/api/login")
def login(data: LoginRequest):
    conn = get_connection()
    user = conn.execute(
        text("""
            SELECT id, name, email, password_hash
            FROM users WHERE email=:e
        """),
        {"e": data.email}
    ).mappings().first()
    conn.close()

    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"user_id": user["id"]})

    return {
        "status": "success",
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"]
        }
    }

# ---------------------------------------------------------
# STATS
# ---------------------------------------------------------
@app.get("/api/stats")
def stats(user_id=Depends(get_current_user)):
    conn = get_connection()
    row = conn.execute(
        text("""
            SELECT 
                COALESCE(SUM(computed_co2),0) AS total_co2,
                COALESCE(AVG(computed_co2),0) AS avg_daily,
                COALESCE(MIN(computed_co2),0) AS min_daily,
                COALESCE(MAX(computed_co2),0) AS max_daily
            FROM daily_logs
            WHERE user_id=:u
        """),
        {"u": user_id}
    ).mappings().first()
    conn.close()
    return row

# ---------------------------------------------------------
# DAILY LOGS (SAVE)
# ---------------------------------------------------------
class DailyLogRequest(BaseModel):
    log_date: str
    travel_km: float
    electricity_kwh: float
    lpg_kg: float
    diet_type: str
    other_emissions: float
    computed_co2: float
    raw_json: str

@app.post("/api/logs")
def add_log(data: DailyLogRequest, user_id=Depends(get_current_user)):
    conn = get_connection()

    conn.execute(
        text("""
            INSERT INTO daily_logs (
                user_id, log_date,
                travel_km, electricity_kwh, lpg_kg,
                diet_type, other_emissions,
                computed_co2, raw_json
            )
            VALUES (:u, :d, :t, :e, :l, :diet, :o, :c, :r)
        """),
        {
            "u": user_id,
            "d": data.log_date,
            "t": data.travel_km,
            "e": data.electricity_kwh,
            "l": data.lpg_kg,
            "diet": data.diet_type,
            "o": data.other_emissions,
            "c": data.computed_co2,
            "r": data.raw_json,
        }
    )

    conn.commit()
    conn.close()
    return {"status": "success"}

# ---------------------------------------------------------
# DAILY LOGS (FETCH)
# ---------------------------------------------------------
@app.get("/api/logs")
def get_logs(user_id=Depends(get_current_user)):
    conn = get_connection()
    rows = conn.execute(
        text("""
            SELECT id, log_date, computed_co2, raw_json
            FROM daily_logs
            WHERE user_id=:u
            ORDER BY log_date DESC
        """),
        {"u": user_id}
    ).mappings().all()
    conn.close()
    return rows

# ---------------------------------------------------------
# AI SUGGESTIONS
# ---------------------------------------------------------
@app.get("/api/suggestions")
def suggestions(user_id=Depends(get_current_user)):
    conn = get_connection()
    row = conn.execute(
        text("""
            SELECT 
                COALESCE(AVG(travel_km),0) AS avg_travel_km,
                COALESCE(AVG(electricity_kwh),0) AS avg_electricity_kwh,
                COALESCE(AVG(lpg_kg),0) AS avg_lpg_kg,
                COALESCE(AVG(other_emissions),0) AS avg_other_emissions
            FROM daily_logs
            WHERE user_id=:u
        """),
        {"u": user_id}
    ).mappings().first()
    conn.close()

    if not row:
        return {"suggestions": ["Add daily logs to receive suggestions 🌱"]}

    return {"suggestions": get_suggestions(row)}

# ---------------------------------------------------------
# CHATBOT (OPENAI + FALLBACK)
# ---------------------------------------------------------
class ChatRequest(BaseModel):
    message: str

def ask_openai(message: str) -> str:
    if not client:
        raise Exception("OpenAI not configured")

    res = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are EcoBot, an assistant for EcoTrack. "
                    "Answer only questions related to carbon footprint, "
                    "sustainability, and EcoTrack usage."
                )
            },
            {"role": "user", "content": message}
        ],
        temperature=0.6
    )
    return res.choices[0].message.content

@app.post("/api/chat")
def chat_endpoint(data: ChatRequest, user_id=Depends(get_current_user)):
    if not data.message.strip():
        return {"reply": "Please ask something 🙂"}

    try:
        reply = ask_openai(data.message)
    except Exception as e:
        print("OpenAI failed → fallback used:", e)
        reply = fallback_chatbot(data.message)

    return {"reply": reply}
