from flask import Flask, render_template, request, session
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from controllers.user_controller import user_controller
from controllers.diagram_controller import diagram_controller
from database import Database
from models.diagram import Diagram
from bson import ObjectId
from socket_manager import SocketManager
# Inicjalizacja aplikacji Flask
app = Flask(__name__)
CORS(app, origins='*')
app.config['SECRET_KEY'] = 'secret!' # Klucz sekretny dla sesji Flask

socket_manager = SocketManager()
socket_manager.get_socketio().init_app(app, cors_allowed_origins="*")

# Rejestracja kontrolerów
app.register_blueprint(user_controller, url_prefix='/api/user')
app.register_blueprint(diagram_controller, url_prefix='/api/diagram')

# Połączenie z bazą danych
db = Database().get_db()

diagram_model = Diagram(db)
@app.route('/api/user/login', methods=['OPTIONS'])
# Obsługa połączenia klienta Socket.IO
@socket_manager.get_socketio().on('connect')
def handle_connect():
    print('Client connected:', request.sid)

@socket_manager.get_socketio().on('disconnect')
def handle_disconnect():
    print('Client disconnected:', request.sid)
    emit('userLeftDiagram', {"userSid":request.sid}, broadcast=True, include_self=False)
# Obsługa dołączenia do edytowanego diagramu
@socket_manager.get_socketio().on('joinDiagram')
def handle_join_diagram(data):
    userId = data['userId']

    print('User joined diagram:', userId);

    # Emitowanie zdarzenia z informacją o dołączeniu użytkownika do edycji diagramu
    emit('userJoinedDiagram', {'userId': userId,"userSid":request.sid}, broadcast=True)


# Obsługa ruchu kursora
@socket_manager.get_socketio().on('cursorMove')
def handle_cursor_move(data):
    x, y = data['x'], data['y']
    username = data['username']
    
    # Prześlij ruch kursora do wszystkich klientów poza klientem, który wysłał ruch
    emit('otherCursorMove', {'userSid': request.sid, 'username': username, 'x': x, 'y': y}, broadcast=True, include_self=False)
# Obsluga przeciagania wezla
@socket_manager.get_socketio().on('nodeDrag')
def handle_node_drag(data):
    print(data)
    node= data


    db['diagrams'].update_one(
        {'_id': ObjectId(data['id']), 'diagram.nodes.id': data['node']['id']},
        {'$set': {'diagram.nodes.$.position.x': data['node']['position']['x'], 'diagram.nodes.$.position.y': data['node']['position']['y']}}
    )
    emit('nodeDragged', {'node': node}, broadcast=True, include_self=False)

@socket_manager.get_socketio().on('nodeCreate')
def handle_node_drag(data):
    print(data)
    new_node = data['newNode']
    diagram_id = data['diagramId']
    db['diagrams'].update_one(
        {'_id': ObjectId(diagram_id)},
        {'$push': {'diagram.nodes': new_node}}
    )

    

    emit('nodeCreated', {'node': new_node}, broadcast=True, include_self=False)

@socket_manager.get_socketio().on('add-edge')
def handle_add_edge(data):
    print(data)
    new_edge = data['edge']
    diagram_id = data['diagramId']
    db['diagrams'].update_one(
        {'_id': ObjectId(diagram_id)},
        {'$push': {'diagram.edges': new_edge}}
    )

    emit('edgeCreated', {'edge': new_edge}, broadcast=True, include_self=False)

# Obsługa usunięcia wezla
@socket_manager.get_socketio().on('nodeRemove')
def handle_node_delete(data):
    print(data)
    diagram_id = data['diagramId']
    node_id = data['nodeId']
    db['diagrams'].update_one(
        {'_id': ObjectId(diagram_id)},
        {'$pull': {'diagram.nodes': {'id': node_id}}}
    )
    emit('nodeRemoved', {'id': node_id}, broadcast=True, include_self=False)
# Obsluga dodawania atrybutu do wezla
@socket_manager.get_socketio().on('attributeCreate')    
def handle_add_attribute(data):
    print(data)
    diagram_id = data['diagramId']
    node_id = data['nodeId']
    attribute = data['newAttribute']
    db['diagrams'].update_one(
        {'_id': ObjectId(diagram_id), 'diagram.nodes.id': node_id},
        {'$push': {'diagram.nodes.$.data.attributes': attribute}}
    )
    emit('attributeAdded', {'nodeId': node_id, 'attribute': attribute}, broadcast=True, include_self=False)
# Obsluga zmian w wezle (label,color)
@socket_manager.get_socketio().on('nodeChange')
def handle_node_change(data):
    print(data)
    diagram_id = data['diagramId']
    node_id = data['nodeId']
    label = data['label']
    color = data['color']
    db['diagrams'].update_one(
        {'_id': ObjectId(diagram_id), 'diagram.nodes.id': node_id},
        {'$set': {'diagram.nodes.$.data.label': label, 'diagram.nodes.$.data.color': color}}
    )
    emit('nodeChanged', {'nodeId': node_id, 'label': label, 'color': color}, broadcast=True, include_self=False)
# Obsluga usuniecia atrybutu z wezla
@socket_manager.get_socketio().on('attributeRemove')
def handle_remove_attribute(data):
    print(data)
    diagram_id = data['diagramId']
    node_id = data['nodeId']
    attribute_id = data['attributeId']
    db['diagrams'].update_one(
        {'_id': ObjectId(diagram_id), 'diagram.nodes.id': node_id},
        {'$pull': {'diagram.nodes.$.data.attributes': {'id': attribute_id}}}
    )
    emit('attributeRemoved', {'nodeId': node_id, 'attributeId': attribute_id}, broadcast=True, include_self=False)
def handle_options_login():
    response = jsonify({'message': 'Preflight request successful'})
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'POST')
    return response


if __name__ == '__main__':
    socket_manager.get_socketio().run(app, debug=True)

#postgresql://postgres@localhost/pto
#mysql+mysqlconnector://root:@localhost/PTO

