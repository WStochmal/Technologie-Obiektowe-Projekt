from flask import Blueprint, jsonify, request
from bson.json_util import dumps
import jwt
from models.user import User
from pymongo import MongoClient
from database import Database
import os

user_controller = Blueprint('user_controller', __name__)

# Połączenie z bazą danych MongoDB
db = Database().get_db()
user_model = User(db)

# Wczytanie klucza JWT z pliku .env
SECRET_KEY = os.getenv("SECRET_KEY")


@user_controller.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    firstname = data['firstname']
    lastname = data['lastname']
    email = data['email']
    password = data['password']

    existing_user = user_model.find_user_by_email(email)
    if existing_user:
        return jsonify({"message": "Użytkownik już istnieje"}), 400

    user_model.create_user(firstname,lastname,email, password)
    return jsonify({"message": "Użytkownik został zarejestrowany"}), 201

@user_controller.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    user = user_model.find_user_by_email(email)
    if not user:
        return jsonify({"message": "Nieprawidłowa nazwa użytkownika lub hasło","error":"Unauthorized"}), 401

    if not user_model.validate_password(user, password):
        return jsonify({"message": "Nieprawidłowa nazwa użytkownika lub hasło","error":"Unauthorized"}), 401

    token = jwt.encode({"email": email}, SECRET_KEY, algorithm='HS256')
    return jsonify({"token": token}), 200
