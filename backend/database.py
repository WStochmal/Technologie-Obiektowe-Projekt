from pymongo import MongoClient
import os

DATABASE_URL = os.getenv("DATABASE_URL");

class Database:
    def __init__(self):
        self.client = MongoClient(DATABASE_URL)
        self.db = self.client['Projekt-Technologie-Obiektowe']

    def get_db(self):
        return self.db
