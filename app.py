from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json
from config import Config
from models import db, User, DailyLog, Recommendation
from ai_rules import generate_recommendations

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

@app.route('/api/ping')
def ping():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True)
