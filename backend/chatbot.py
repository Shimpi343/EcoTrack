import random

# =====================================================
# CATEGORY-WISE SUGGESTIONS
# =====================================================

ELECTRICITY = [
    "Switch off lights and appliances when not in use.",
    "Use LED bulbs instead of incandescent bulbs.",
    "Avoid standby power usage.",
    "Use energy-efficient appliances with high star ratings.",
    "Limit AC usage and set it to optimal temperature."
]

TRANSPORT = [
    "Use public transport whenever possible.",
    "Carpool to reduce fuel usage.",
    "Walk or cycle for short distances.",
    "Avoid unnecessary vehicle trips.",
    "Maintain your vehicle properly for better mileage."
]

FOOD = [
    "Avoid food wastage.",
    "Prefer locally produced food.",
    "Reduce meat consumption occasionally.",
    "Store food properly to avoid spoilage.",
    "Choose seasonal fruits and vegetables."
]

LIFESTYLE = [
    "Reduce single-use plastics.",
    "Reuse and recycle products.",
    "Buy only what you need.",
    "Support eco-friendly brands.",
    "Plant trees or support green initiatives."
]

ECOTRACK_HELP = [
    "EcoTrack helps you track daily carbon emissions.",
    "Use AI Predictor to estimate your carbon footprint.",
    "Dashboard shows your emission trends.",
    "Suggestions help you reduce environmental impact.",
    "Tracking regularly improves awareness."
]

GENERAL = [
    "Small daily actions can reduce carbon footprint significantly.",
    "Be mindful of electricity, travel, and food habits.",
    "Sustainability starts with awareness.",
    "Tracking emissions helps change behavior.",
    "Eco-friendly habits protect future generations."
]

FAQ = {
    "what is ecotrack": "EcoTrack is a platform that helps you track and reduce your carbon footprint.",
    "what is carbon footprint": "Carbon footprint is the amount of CO₂ emissions caused by daily activities.",
    "why reduce carbon footprint": "Reducing carbon footprint helps fight climate change and protect nature.",
    "how does ecotrack work": "EcoTrack analyzes your activity data and provides insights and suggestions.",
}

# =====================================================
# CHATBOT LOGIC
# =====================================================

def ask_chatbot(user_message: str) -> str:
    msg = user_message.lower().strip()

    # ---- CATEGORY MATCHING ----
    if "electricity" in msg or "power" in msg:
        return random.choice(ELECTRICITY)

    if "travel" in msg or "transport" in msg or "vehicle" in msg or "fuel" in msg:
        return random.choice(TRANSPORT)

    if "food" in msg or "diet" in msg or "eat" in msg:
        return random.choice(FOOD)

    if "lifestyle" in msg or "plastic" in msg or "daily habits" in msg:
        return random.choice(LIFESTYLE)

    if "ecotrack" in msg or "dashboard" in msg or "predictor" in msg:
        return random.choice(ECOTRACK_HELP)

    if "reduce carbon" in msg or "reduce footprint" in msg or "save environment" in msg:
        return random.choice(GENERAL)

    # ---- FAQ MATCHING ----
    for key in FAQ:
        if key in msg:
            return FAQ[key]

    # ---- DEFAULT FALLBACK ----
    return (
        "I can help you with electricity, transport, food, lifestyle, "
        "and EcoTrack usage 🌱. Try asking category-based questions!"
    )