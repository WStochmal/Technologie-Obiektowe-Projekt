from flask import Blueprint, jsonify, request
from bson.json_util import dumps
import jwt
from models.diagram import Diagram
from pymongo import MongoClient
from database import Database
import os

diagram_controller = Blueprint('diagram_controller', __name__)

# Połączenie z bazą danych MongoDB
db = Database().get_db()
diagram_model = Diagram(db)

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

@diagram_controller.route('/get/<int:id>', methods=['GET'])
def get_diagram(id):
    diagram = diagram_model.find_diagram_by_id(id)
    if not diagram:
        return jsonify({"message": "Diagram nie istnieje"}), 404

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
