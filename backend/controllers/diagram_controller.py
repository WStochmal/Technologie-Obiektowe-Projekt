from flask import Blueprint, jsonify, request
from bson.json_util import dumps
import jwt
from models.diagram import Diagram
from models.user import User
from pymongo import MongoClient
from models.user import User 
from database import Database
import os
from bson import ObjectId

diagram_controller = Blueprint('diagram_controller', __name__)

# Połączenie z bazą danych MongoDB
db = Database().get_db()
diagram_model = Diagram(db)
user_model = User(db)

# Wczytanie klucza JWT z pliku .env
SECRET_KEY = os.getenv("SECRET_KEY")


@diagram_controller.route('/create', methods=['POST'])
def create_diagram():
    data = request.get_json()
    id = data['id']
    label = data['label']
    nodes = data.get('nodes', [])
    edges = data.get('edges', [])

    existing_diagram = diagram_model.find_diagram_by_id(id)
    if existing_diagram:
        return jsonify({"message": "Diagram już istnieje"}), 400

    diagram_model.create_diagram(id, label, nodes, edges)
    return jsonify({"message": "Diagram został utworzony"}), 201

@diagram_controller.route('/get/<string:id>', methods=['GET'])
def get_diagram(id):
    # Upewnij się, że identyfikator jest stringiem
    diagram = diagram_model.find_diagram_by_id(str(id))
    if not diagram:
        return jsonify({"message": "Diagram nie istnieje"}), 404

    # Konwertuj każde wystąpienie ObjectId na string
    for key, value in diagram.items():
        if isinstance(value, ObjectId):
            diagram[key] = str(value)

    return jsonify(diagram), 200



@diagram_controller.route('/update/<int:id>', methods=['PUT'])
def update_diagram(id):
    data = request.get_json()
    label = data.get('label')
    nodes = data.get('nodes')
    edges = data.get('edges')

    updated_diagram = diagram_model.update_diagram(id, label, nodes, edges)
    if not updated_diagram:
        return jsonify({"message": "Nie można znaleźć lub zaktualizować diagramu"}), 404

    return jsonify({"message": "Diagram został zaktualizowany"}), 200

@diagram_controller.route('/delete/<int:id>', methods=['DELETE'])
def delete_diagram(id):
    deleted = diagram_model.delete_diagram(id)
    if not deleted:
        return jsonify({"message": "Nie można znaleźć lub usunąć diagramu"}), 404

    return jsonify({"message": "Diagram został usunięty"}), 200



@diagram_controller.route('/get_by_user', methods=['POST'])
def get_diagrams_by_user():
    try:
        data = request.get_json()
        user_id = data.get('id')
        print(user_id)

        # Znajdź diagramy przypisane do użytkownika
        diagrams = diagram_model.find_diagram_by_member(user_id)
        
        # Konwertuj diagramy na format JSON
        diagrams_json = [diagram for diagram in diagrams]
        
        response = jsonify(diagrams_json)
        response.headers.add('Access-Control-Allow-Origin', '*')

        return response, 200

    except Exception as e:
        print("Błąd podczas pobierania diagramów:", str(e))
        return jsonify({"message": "Wystąpił błąd podczas pobierania diagramów"}), 500




