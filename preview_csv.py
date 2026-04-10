# preview_csv.py
import os, glob, pandas as pd

# look for CSV in data/ folder; fall back to cwd
data_dir = os.path.join(os.getcwd(), "data")
if not os.path.isdir(data_dir):
    data_dir = os.getcwd()

files = glob.glob(os.path.join(data_dir, "*.csv"))
if not files:
    print("No CSV found in", data_dir)
else:
    f = files[0]
    print("Using file:", f)
    try:
        df = pd.read_csv(f, nrows=5)
    except Exception as e:
        print("Error reading CSV with default params:", e)
        print("Retrying with engine='python' and on_bad_lines='skip' ...")
        df = pd.read_csv(f, nrows=5, engine="python", on_bad_lines="skip", encoding="utf-8")
    print("\nColumns:")
    print(list(df.columns))
    print("\nFirst 5 rows:")
    print(df.head().to_string(index=False))
