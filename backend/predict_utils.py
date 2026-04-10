# predict_utils.py
import joblib
import numpy as np
import os

# Load model once at import time
MODEL_PATH = os.path.join(os.path.dirname(__file__), "co2_model.pkl")
model = joblib.load(MODEL_PATH)

# ── Encoding maps (must match your training label encoding) ──
DIET_MAP = {
    "vegan":        0,
    "vegetarian":   1,
    "pescatarian":  2,
    "omnivore":     3,
    "non-veg":      3,   # alias used in DailyLog.js
    "veg":          1,   # alias used in DailyLog.js
}

VEHICLE_MAP = {
    "ev":       0,
    "average":  1,
    "petrol":   2,
    "diesel":   3,
    "walk":     0,   # no emissions
    "cycle":    0,
    "public":   1,
    "bike":     2,
    "car":      2,
}

def build_features(data: dict) -> np.ndarray:
    """
    Build feature vector in the EXACT same column order
    as your Carbon Emission.csv training data.
    Adjust column order here if your CSV differs.
    """
    features = np.array([[
        float(data.get("travel_km",       0)),
        float(data.get("electricity_kwh", 0)),
        float(data.get("ac_hours",        0)),
        float(data.get("fan_hours",       0)),
        DIET_MAP.get(str(data.get("diet_type", "vegetarian")).lower(), 1),
        VEHICLE_MAP.get(str(data.get("vehicle_type", "average")).lower(), 1),
    ]])
    return features

def predict_co2(data: dict) -> float:
    features = build_features(data)
    result = model.predict(features)
    return round(float(result[0]), 2)