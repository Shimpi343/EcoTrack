# EcoTrack – Carbon Footprint Analyzer 🌱

## About the Project
EcoTrack is a web-based project that helps users calculate and understand their personal carbon footprint. It estimates CO₂ emissions based on daily activities and encourages people to adopt eco-friendly habits.

## Features
- Calculates carbon emissions from daily activities.
- Tracks travel and electricity usage.
- Considers AC usage, fan usage, and diet type.
- Uses emission factors to estimate CO₂ emissions.
- Supports machine learning for carbon footprint prediction.
- Displays carbon footprint results and insights.

## Technologies Used
- Python
- Machine Learning
- HTML, CSS, JavaScript
- FastAPI (if configured)
- JSON and CSV datasets

## Project Structure
- `app.py` – Main application file
- `ai_rules.py` – AI-related rules
- `config.py` – Configuration settings
- `models.py` – Model definitions
- `emission_factors.json` – Emission factors
- `import_carbon_csv.py` – Imports CSV data
- `preview_csv.py` – Previews CSV data
- `backend/` – Backend files
- `frontend/` – Frontend files
- `data/` – Dataset files
- `requirements.txt` – Required Python packages

## How to Run the Project

1. Open the project folder in VS Code.
2. Open the terminal.
3. Install the required packages:

   `pip install -r requirements.txt`

4. Run the application:

   `python app.py`

5. Open the local URL shown in the terminal, if the application starts a web server.

## Future Enhancements
- Add more carbon footprint visualizations.
- Improve prediction accuracy.
- Track daily carbon emissions.
- Provide personalized suggestions to reduce emissions.

## Author
**Shimpi Kumari**

## Note
EcoTrack provides estimated carbon emissions for educational and awareness purposes. Actual emissions may vary depending on the data and emission factors used.
