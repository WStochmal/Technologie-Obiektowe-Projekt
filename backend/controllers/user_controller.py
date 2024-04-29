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
    image = data['image']

    existing_user = user_model.find_user_by_email(email)
    if existing_user:
        return jsonify({"message": "Użytkownik już istnieje"}), 400

    user_model.create_user(firstname,lastname,email, password,image)

    response = jsonify({"message": "Użytkownik został zarejestrowany"})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response, 201


@user_controller.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        response = jsonify({"message": "Nieprawidłowa nazwa użytkownika lub hasło", "error": "Unauthorized"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 401

    user = user_model.find_user_by_email(email)
    if not user or not user_model.validate_password(user, password):
        response = jsonify({"message": "Nieprawidłowa nazwa użytkownika lub hasło", "error": "Unauthorized"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 401

    # Konwertuj ObjectId na string
    user_id = str(user.get('_id'))

    # Generuj token JWT
    token = jwt.encode({"email": email}, SECRET_KEY, algorithm='HS256')
    
    # Twórz odpowiedź JSON
    response_data = {
        "token": token, 
        "firstname": user.get('firstname'), 
        "image": user.get('image'),
        "_id": user_id
    }
    response = jsonify(response_data)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response, 200
