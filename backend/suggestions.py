def get_suggestions(data: dict, predicted_co2: float) -> list:
    tips = []

    travel  = float(data.get("travel_km",       0))
    kwh     = float(data.get("electricity_kwh", 0))
    ac      = float(data.get("ac_hours",        0))
    fan     = float(data.get("fan_hours",       0))
    diet    = str(data.get("diet_type",    "vegetarian")).lower()
    vehicle = str(data.get("vehicle_type", "average")).lower()

    # ── Travel ──
    if travel > 20 and vehicle in ("petrol", "diesel", "car", "bike"):
        tips.append({
            "icon": "🚌",
            "title": "Switch to public transport",
            "detail": f"Your {travel} km trip by {vehicle} emits ~{round(travel * 0.21, 1)} kg CO₂. Bus or metro cuts this by 70%."
        })
    elif travel > 5:
        tips.append({
            "icon": "🚴",
            "title": "Cycle short trips",
            "detail": f"Trips under 5 km by bike = near-zero emissions. You travelled {travel} km today."
        })

    # ── Electricity ──
    if kwh > 10:
        tips.append({
            "icon": "⚡",
            "title": "Reduce electricity usage",
            "detail": f"You used {kwh} kWh today. Switching off standby devices saves ~1–2 kWh/day."
        })

    # ── AC ──
    if ac > 3:
        tips.append({
            "icon": "❄️",
            "title": "Reduce AC hours",
            "detail": f"AC ran {ac} hrs today. Each hour saved cuts ~0.5 kg CO₂. Try fans for 1–2 hours instead."
        })

    # ── Diet ──
    if diet in ("omnivore", "non-veg"):
        tips.append({
            "icon": "🥦",
            "title": "Try 2 meat-free days/week",
            "detail": "Meat production is carbon-heavy. Two plant-based days cuts food emissions by ~30%."
        })

    # ── Overall score ──
    if predicted_co2 > 10:
        tips.append({
            "icon": "🌳",
            "title": "High footprint day",
            "detail": f"Today's estimate is {predicted_co2} kg CO₂ — 2.5× the daily target. Focus on travel first."
        })
    elif predicted_co2 <= 4:
        tips.append({
            "icon": "🏆",
            "title": "Excellent! Below 4 kg target",
            "detail": f"Only {predicted_co2} kg today. Your streak is safe — keep it up!"
        })
    else:
        tips.append({
            "icon": "📉",
            "title": "Getting close to target",
            "detail": f"{predicted_co2} kg today. Cut AC by 1 hr or one less car trip to hit the 4 kg goal."
        })

    return tips[:3]  # top 3 only
# Add this single line at the bottom of suggestions.py
get_predict_suggestions = get_suggestions
def get_predict_suggestions(features: dict, predicted_co2: float) -> list:
    tips = []

    travel  = float(features.get("travel_km",       0))
    kwh     = float(features.get("electricity_kwh", 0))
    ac      = float(features.get("ac_hours",        0))
    diet    = int(features.get("diet_type",    1))
    vehicle = int(features.get("vehicle_type", 1))

    if travel > 15 and vehicle >= 2:
        saving = round(travel * 0.13, 1)
        tips.append({
            "icon": "🚌",
            "title": "Switch to public transport",
            "detail": f"You travel {travel} km/day by petrol/diesel. Switching saves ~{saving} kg CO\u2082 daily."
        })
    elif travel > 5:
        tips.append({
            "icon": "🚴",
            "title": "Cycle short trips",
            "detail": f"Average {travel} km/day. Cycling trips under 5 km = near-zero emissions."
        })

    if ac > 3:
        tips.append({
            "icon": "❄️",
            "title": "Reduce AC usage",
            "detail": f"AC runs {ac} hrs/day on average. Cutting to 2 hrs saves ~{round((ac-2)*0.5,1)} kg CO\u2082 daily."
        })

    if kwh > 8:
        tips.append({
            "icon": "💡",
            "title": "Lower electricity usage",
            "detail": f"Average {kwh} kWh/day is above target. Switching off standby devices saves 1\u20132 kWh/day."
        })

    if diet == 3:
        tips.append({
            "icon": "🥦",
            "title": "Try 2 meat-free days/week",
            "detail": "Omnivore diet adds ~0.8 kg CO\u2082/day vs vegetarian. Two plant-based days cuts food emissions by 30%."
        })

    weekly = round(predicted_co2 * 7, 1)
    if predicted_co2 <= 4:
        tips.append({
            "icon": "🏆",
            "title": "You are on target!",
            "detail": f"Predicted {predicted_co2} kg/day \u2014 below the 4 kg goal. 7-day total: {weekly} kg."
        })
    elif predicted_co2 > 8:
        tips.append({
            "icon": "🌳",
            "title": "High footprint week ahead",
            "detail": f"At {predicted_co2} kg/day you will emit {weekly} kg this week \u2014 {round(weekly-28,1)} kg above the 28 kg target."
        })
    else:
        tips.append({
            "icon": "📉",
            "title": "Close to target",
            "detail": f"Predicted {predicted_co2} kg/day. Reduce AC or travel by car to hit the 4 kg daily goal."
        })

    return tips[:3]