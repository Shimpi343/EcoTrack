# import_carbon_csv.py
import os, glob, json
import pandas as pd
from sqlalchemy import create_engine, text
from datetime import date
import math
import ast

def clean_json_value(v):
    """Convert pandas/Numpy values to valid JSON-safe values."""
    if v is None:
        return None
    if isinstance(v, float) and math.isnan(v):
        return None
    if isinstance(v, str):
        # convert Python-style list strings -> real lists
        if v.startswith("[") and v.endswith("]"):
            try:
                return ast.literal_eval(v)
            except:
                return v
        return v
    return v


# ---------------- CONFIG ----------------
CSV_PATH = os.path.join(os.getcwd(), "data", "Carbon Emission.csv")
DB_URI = "mysql+pymysql://root:040301%40Shilki1@127.0.0.1/ecotrackdb"
# <- change if you have a password or different host
DEFAULT_USER_ID = 1
# ----------------------------------------

def safe_float(x):
    try:
        if pd.isna(x): return 0.0
        return float(x)
    except:
        return 0.0

def main():
    if not os.path.isfile(CSV_PATH):
        print("CSV not found at:", CSV_PATH)
        return

    print("Loading:", CSV_PATH)
    # read entire CSV (it's not huge)
    df = pd.read_csv(CSV_PATH, engine="python", on_bad_lines="skip", encoding="utf-8")
    print("Rows in CSV:", len(df))

    # ensure required DB driver installed
    engine = create_engine(DB_URI, future=True)

    inserted = 0
    with engine.begin() as conn:
        for idx, row in df.iterrows():
            # map CSV -> daily_logs fields
            user_id = DEFAULT_USER_ID

            # Use monthly vehicle distance to get approx daily travel_km
            vehicle_monthly = safe_float(row.get('Vehicle Monthly Distance Km', 0))
            travel_km = round(vehicle_monthly / 30.0, 3) if vehicle_monthly else 0.0

            # electricity isn't available; we keep 0 and store other fields in raw_json
            electricity_kwh = 0.0
            lpg_kg = 0.0

            diet_type = str(row.get('Diet', 'mixed')).strip().lower() or 'mixed'

            # if dataset has CarbonEmission, use it directly as computed_co2
            computed_co2 = safe_float(row.get('CarbonEmission', 0))

            # log_date: use today (can be changed later)
            log_date = date.today().isoformat()

           raw = {
    "Body Type": clean_json_value(row.get('Body Type')),
    "Sex": clean_json_value(row.get('Sex')),
    "Diet": clean_json_value(row.get('Diet')),
    "Transport": clean_json_value(row.get('Transport')),
    "Vehicle Type": clean_json_value(row.get('Vehicle Type')),
    "Monthly Grocery Bill": clean_json_value(row.get('Monthly Grocery Bill')),
    "vehicle_monthly_km": vehicle_monthly,
    "waste_bag_size": clean_json_value(row.get('Waste Bag Size')),
    "waste_bag_weekly_count": clean_json_value(row.get('Waste Bag Weekly Count')),
    "tv_pc_daily_hour": clean_json_value(row.get('How Long TV PC Daily Hour')),
    "internet_daily_hour": clean_json_value(row.get('How Long Internet Daily Hour')),
    "energy_efficiency": clean_json_value(row.get('Energy efficiency')),
    "recycling": clean_json_value(row.get('Recycling')),
    "cooking_with": clean_json_value(row.get('Cooking_With')),
    "source_file_row": int(idx)
}
# when inserting, use json.dumps(raw, default=str)

            # insert row
            conn.execute(text("""
                INSERT INTO daily_logs
                  (user_id, log_date, travel_km, electricity_kwh, lpg_kg, diet_type, other_emissions, computed_co2, raw_json)
                VALUES
                  (:user_id, :log_date, :travel_km, :electricity_kwh, :lpg_kg, :diet_type, :other_emissions, :computed_co2, :raw_json)
            """), {
                "user_id": int(user_id),
                "log_date": log_date,
                "travel_km": travel_km,
                "electricity_kwh": electricity_kwh,
                "lpg_kg": lpg_kg,
                "diet_type": diet_type,
                "other_emissions": 0.0,
                "computed_co2": computed_co2,
                "raw_json": json.dumps(raw, default=str)
            })
            inserted += 1

    print(f"Inserted {inserted} rows into daily_logs. You can view them in phpMyAdmin or via API /api/logs/{DEFAULT_USER_ID}")

if __name__ == "__main__":
    main()
