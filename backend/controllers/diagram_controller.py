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
from sqlalchemy.exc import (OperationalError, ProgrammingError, InterfaceError, DataError, 
                            DatabaseError, IntegrityError, InternalError, NotSupportedError, 
                            SQLAlchemyError)
from socket_manager import SocketManager
from sqlalchemy.engine.url import make_url


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

    print(f"{userId} {label}")
   
    result = diagram_model.create_diagram(userId, label)
    if result.inserted_id:
        # Pobierz pełny dokument
        new_diagram = db.diagrams.find_one({"_id": result.inserted_id})
        
        # Konwertuj ObjectId na string
        new_diagram['_id'] = str(new_diagram['_id'])
        for member in new_diagram['members']:
            member['userId'] = str(member['userId'])

        response = jsonify({
            "_id": new_diagram['_id'],
            "members": new_diagram['members'],
            "label": new_diagram['label'],
            "diagram": new_diagram['diagram'],
            "createdAt": new_diagram['createdAt'].isoformat()
        })
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



def generateQueriesArray(diagram):
    queries = []
    
    # Process nodes to create table creation queries
    for node in diagram['nodes']:
        table_name = node['data']['label']
        attributes = node['data']['attributes']
        
        columns = []
        for attr in attributes:
            column_def = f"{attr['label']} {attr['type']}"
            if attr.get('primaryKey'):
                column_def += " PRIMARY KEY"
            if attr.get('notNull'):
                column_def += " NOT NULL"
            if attr.get('unique'):
                column_def += " UNIQUE"
            columns.append(column_def)
        
        columns_str = ", ".join(columns)
        query = f"CREATE TABLE IF NOT EXISTS {table_name} ({columns_str});"
        
        queries.append({
            "type": "table",
            "name": table_name,
            "status": "pending",
            "query": query
        })
    
    # Process edges to create relationship queries
    for edge in diagram['edges']:
        print(edge);
        source_id = edge['source']
        target_id = edge['target']
        source_handle = edge['sourceHandle']
        target_handle = edge['targetHandle']
        
        source_node = next((node for node in diagram['nodes'] if node['id'] == source_id), None)
        target_node = next((node for node in diagram['nodes'] if node['id'] == target_id), None)
        
        if source_node and target_node:
            source_table = source_node['data']['label']
            target_table = target_node['data']['label']

            # Extract source column label from source node's attributes
            source_column_id = source_handle.split('-')[0]
            source_column = next((attr['label'] for attr in source_node['data']['attributes'] if attr['id'] == source_column_id), None)

            # Extract target column label from target node's attributes
            target_column_id = target_handle.split('-')[0]
            target_column = next((attr['label'] for attr in target_node['data']['attributes'] if attr['id'] == target_column_id), None)
            
            if source_column and target_column:
                query = f"ALTER TABLE {target_table} ADD CONSTRAINT fk_{source_table.lower()}_{target_table.lower()} FOREIGN KEY ({target_column}) REFERENCES {source_table}({source_column});"
                
                queries.append({
                    "type": "relationship",
                    "name": f"{source_table}-{target_table}",
                    "status": False,
                    "query": query
                })
    print(queries)
    return queries

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
                response = jsonify({"status": "success","queries":generateQueriesArray(diagram)})
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
    data = request.get_json()
    db_uri = data.get('db_url')
    json_queries = data.get('queries')
    print(json_queries)
    
    engine = create_engine(db_uri)
    db_url = make_url(db_uri)


    def generate_drop_queries(executed_queries):
            print(executed_queries);
            drop_queries = []
            for executed in executed_queries:
                if 'relationship' in executed['type']:
                    table_name = executed['query'].split(' ')[2]
                    constraint_name = executed['query'].split(' ')[5]
                    drop_query = f"ALTER TABLE {table_name} DROP CONSTRAINT {constraint_name};"
                    drop_queries.append(drop_query)
                elif 'table' in executed['type']:
                    table_name = executed['query'].split(' ')[5]
                    drop_query = f"DROP TABLE IF EXISTS {table_name};"
                    drop_queries.append(drop_query)
            return drop_queries[::-1]  # Drop connections first, then tables

    def emit_query_result(name, success, message, error=None):
        result = {'query': name, 'success': success, 'message': message}
        if error:
            result['error'] = str(error)
        socket_manager.get_socketio().emit('query_result', result)
        print(message)

    try:
        with engine.connect() as connection:
            print("Połączenie z bazą danych udane!")
            socket_manager.get_socketio().emit('query_start', {'message': 'Generating process started.'})

            if db_url.get_backend_name() == 'postgresql':
                trans = connection.begin()
                socket_manager.get_socketio().emit('query_start', {'message': 'Transaction started.'})

            executed_queries = []
            for obj in json_queries:
                try:
                    sql_query = text(obj['query'])
                    connection.execute(sql_query)
                    executed_queries.append(obj)
                    
                    # Wyślij wiadomość użytkownikowi o powodzeniu
                    emit_query_result(obj['name'], True, f"{obj['name']}: Zapytanie wykonane poprawnie.")
                except (OperationalError, ProgrammingError, InterfaceError, DataError, 
                        DatabaseError, IntegrityError, InternalError, NotSupportedError, SQLAlchemyError) as e:
                    emit_query_result(obj['name'], False, f"{obj['name']}: Wystąpił błąd podczas wykonywania zapytania.", e)
                    
                    # Generowanie zapytań DROP dla połączeń i tabel
                    drop_queries = generate_drop_queries(executed_queries)
                    
                    # Najpierw usuń połączenia, potem tabele
                    for drop_query in drop_queries:
                        try:
                            connection.execute(text(drop_query))
                            print(f"Zapytanie DROP wykonane: {drop_query}")
                        except Exception as drop_e:
                            print(f"Nie udało się wykonać zapytania DROP: {drop_query}, błąd: {drop_e}")
                    
                    response = jsonify({"success": False, "message": "An error occurred while executing queries. Performed DROP operations."})
                    response.headers.add('Access-Control-Allow-Origin', '*')
                    
                    if db_url.get_backend_name() == 'postgresql':
                        trans.rollback()

                    return response, 200
            
            if db_url.get_backend_name() == 'postgresql':
                trans.commit()

            response = jsonify({"success": True, "message": "All queries executed successfully."})
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response, 200
    
    except (OperationalError, ProgrammingError, InterfaceError) as e:
        print("Błąd połączenia z bazą danych:", e)
        return {"success": False, "message": "Błąd połączenia z bazą danych."}, 500