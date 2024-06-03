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
from sqlalchemy import create_engine, exc
from sqlalchemy.exc import OperationalError, ProgrammingError, InterfaceError,ArgumentError
from socket_manager import SocketManager


from sqlalchemy import text

diagram_controller = Blueprint('diagram_controller', __name__)
socket_manager = SocketManager()
socketio = socket_manager.get_socketio()

# Połączenie z bazą danych MongoDB
db = Database().get_db()
diagram_model = Diagram(db)
user_model = User(db)

# Wczytanie klucza JWT z pliku .env
SECRET_KEY = os.getenv("SECRET_KEY")


@diagram_controller.route('/create_diagram', methods=['POST'])
def create_diagram():
    data = request.get_json()
    userId = data['user_id']
    label = data['title']

    print(userId + " " + label);
   
    new_diagram =diagram_model.create_diagram(userId, label)
    if(new_diagram):
        response = jsonify({"message": "Diagram został utworzony"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    else:
        response = jsonify({"message": "Nie można utworzyć diagramu"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 500

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
@diagram_controller.route('/delete_diagram/<string:id>', methods=['DELETE'])
def delete_diagram(id):
    print(id);
    deleted = diagram_model.delete_diagram(id)
    print(deleted)

    if not deleted:
        response = jsonify({"message": "Nie można znaleźć lub usunąć diagramu"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 404
    

    response = jsonify({"message": "Usunieto diagram"})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response, 200



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


@diagram_controller.route('/generate-sql', methods=['POST'])
def generate_sql():
    processed_tables = set()
    try:
        data = request.get_json()
        diagram = data.get('diagram')
        
        mysql_code = ""
        for node in diagram["nodes"]:
            table_name = node["data"]["label"]
            attributes = node["data"]["attributes"]

            print(attributes)

            if table_name in processed_tables:
                continue

            mysql_code += f"CREATE TABLE IF NOT EXISTS {table_name} ("
            for attr in attributes:
                mysql_code += f"{attr['id']} {attr['type']} {'PRIMARY KEY' if attr.get('primaryKey', False) else ''} {'UNIQUE' if attr.get('unique', False) else ''} {'NOT NULL' if attr.get('notNull', False) else ''}, "
            mysql_code = mysql_code.rstrip(', ') + ");\n"  # Usuwamy ostatni przecinek i dodajemy średnik na końcu

            processed_tables.add(table_name)

        for edge in diagram["edges"]:
            source = edge["source"]
            target = edge["target"]
            sourceHandle = edge["sourceHandle"]
            targetHandle = edge["targetHandle"]

            source_attr_id = sourceHandle.split("-")[0]  # Pobieramy id atrybutu ze źródła
            target_attr_id = targetHandle.split("-")[0]  # Pobieramy id atrybutu z docelowego

            source_attr_label = None
            target_attr_label = None

            for node in diagram["nodes"]:
                if node["id"] == source:
                    for attr in node["data"]["attributes"]:
                        if attr["id"] == source_attr_id:
                            source_attr_label = attr["label"]
                            break
                elif node["id"] == target:
                    for attr in node["data"]["attributes"]:
                        if attr["id"] == target_attr_id:
                            target_attr_label = attr["label"]
                            break

            if source_attr_label and target_attr_label:
                mysql_code += f"ALTER TABLE {source} ADD CONSTRAINT {source_attr_id} FOREIGN KEY ({target_attr_id}) REFERENCES {target} ({target_attr_id});\n"
        print(mysql_code)
        response = jsonify({"sql_code": mysql_code})
        response.headers.add('Access-Control-Allow-Origin', '*')

        return response, 200

    except Exception as e:
        print("Błąd podczas generowania kodu SQL:", str(e))
        return jsonify({"message": "Wystąpił błąd podczas generowania kodu SQL"}), 500



def generateQueriesArray():
    return [{"type":"table","name":"Person","status":"pending","query":"CREATE TABLE IF NOT EXISTS Person (e1 INT PRIMARY KEY NOT NULL,e2 INT UNIQUE NOT NULL);"},{"type":"table","name":"Student","status":False,"query":"CREATE TABLE IF NOT EXISTS Student (e6 INT PRIMARY KEY,e7 VARCHAR(255));"},{"type":"relationship","name":"Person-Student","status":False,"query":"ALTER TABLE Student ADD CONSTRAINTpol fk_person_student FOREIGN KEY (e6) REFERENCES Person(e1);"}]
@diagram_controller.route('/generate-to-database-test-uri', methods=['POST'])
def generate_to_database_test_uri():
    try:
        data = request.get_json()
        db_uri = data.get('db_url')
        diagram = data.get('diagram')
        print(diagram)
        # Utwórz silnik (engine) bazy danych
        engine = create_engine(db_uri)


        try:
            with engine.connect() as connection:
                print("Połączenie z bazą danych udane!")
                response = jsonify({"status": "success","queries":[{"type":"table","name":"Person","status":"pending","query":"CREATE TABLE IF NOT EXISTS Person (e1 INT PRIMARY KEY NOT NULL,e2 INT UNIQUE NOT NULL);"},{"type":"table","name":"Student","status":False,"query":"CREATE TABLE IF NOT EXISTS Student (e6 INT PRIMARY KEY,e7 VARCHAR(255));"},{"type":"relationship","name":"Person-Student","status":False,"query":"ALTER TABLE Student ADD CONSTRAINT fk_person_student FOREIGN KEY (e6) REFERENCES Person(e1);"}]})
                response.headers.add('Access-Control-Allow-Origin', '*')
                return response, 200
        except (OperationalError, ProgrammingError, InterfaceError) as e:
            print("Błąd połączenia z bazą danych:", e)
            response = jsonify({"status": "error","error":str(e)})
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response, 200
        finally:
            engine.dispose()  # Zamyka wszystkie połączenia z bazą danych
            
    except (OperationalError, ArgumentError) as e:
        print("Błąd operacyjny:", e)
        response = jsonify({"status": "error","error":str(e)})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    
@diagram_controller.route('/generate-to-database', methods=['POST'])
def execute_queries():
    # socket_manager.get_socketio().emit('query_result', {'query':'Person','success': True, 'message': "Person: Zapytanie wykonane poprawnie."})
    data = request.get_json()
    db_uri = data.get('db_url')
    json_queries = data.get('queries')
    print(json_queries)
    # Utwórz silnik (engine) bazy danych
    engine = create_engine(db_uri)

    try:
        with engine.connect() as connection:
            print("Połączenie z bazą danych udane!")
            socket_manager.get_socketio().emit('query_start',{'message':'Generating process started.'});
            # Rozpocznij transakcję
            trans = connection.begin()
            socket_manager.get_socketio().emit('query_start',{'message':'Transaction started.'});
            try:
                for obj in json_queries:
                    sql_query = text(obj['query'])
                   
                    # Wykonaj zapytanie SQL
                    connection.execute(sql_query)

                    # Wyślij wiadomość użytkownikowi o powodzeniu
                    query_status  ={'query':obj['name'],'success': True, 'message': f"{obj['name']}: Zapytanie wykonane poprawnie."}
                    socket_manager.get_socketio().emit('query_result',query_status )
                    print("Zapytanie wykonane poprawnie.")
                # Zatwierdź transakcję
                trans.commit()

                response = jsonify({"success": True, "message": "All queries executed successfully."})
                response.headers.add('Access-Control-Allow-Origin', '*')
                return response, 200

            except (OperationalError, ProgrammingError, InterfaceError) as e:
                trans.rollback()
                print("Wystąpił błąd:", e)
                socket_manager.get_socketio().emit('query_result', {'query':obj['name'],'success': False, 'message': f"{obj['name']}: Wystąpił błąd podczas wykonywania zapytania.",'error':str(e)})
                # raise e
                response = jsonify({"success": False, "message": "An errror occured while executing queries. Rolling back transaction."})
                response.headers.add('Access-Control-Allow-Origin', '*')
                return response, 200
    except (OperationalError, ProgrammingError, InterfaceError) as e:
        print("Błąd połączenia z bazą danych:", e)
        return {"success": False, "message": "Błąd połączenia z bazą danych."}



    