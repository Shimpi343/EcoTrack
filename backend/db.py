from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

DB_URL = "mysql+pymysql://root:040301%40Shilki1@127.0.0.1/ecotrackdb"


engine = create_engine(DB_URL, echo=False, future=True)

def get_connection():
    return engine.connect()
