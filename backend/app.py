from flask import Flask, render_template, request, session
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from controllers.user_controller import user_controller
from controllers.diagram_controller import diagram_controller
from database import Database

# Inicjalizacja aplikacji Flask
app = Flask(__name__)
CORS(app, origins='*')
app.config['SECRET_KEY'] = 'secret!'  # Klucz sekretny dla sesji Flask
socketio = SocketIO(app, cors_allowed_origins="*")  # Inicjalizacja Socket.IO

# Rejestracja kontrolerów
app.register_blueprint(user_controller, url_prefix='/api/user')
app.register_blueprint(diagram_controller, url_prefix='/api/diagram')

# Połączenie z bazą danych
db = Database()

# Obsługa połączenia klienta Socket.IO
@socketio.on('connect')
def handle_connect():
    print('Client connected:', request.sid)

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected:', request.sid)
    emit('userLeftDiagram', {"userSid":request.sid}, broadcast=True, include_self=False)
# Obsługa dołączenia do edytowanego diagramu
@socketio.on('joinDiagram')
def handle_join_diagram(data):
    userId = data['userId']

    print('User joined diagram:', userId);

    # Emitowanie zdarzenia z informacją o dołączeniu użytkownika do edycji diagramu
    emit('userJoinedDiagram', {'userId': userId,"userSid":request.sid}, broadcast=True)


# Obsługa ruchu kursora
@socketio.on('cursorMove')
def handle_cursor_move(data):
    x, y = data['x'], data['y']
    username = data['username']
    
    # Prześlij ruch kursora do wszystkich klientów poza klientem, który wysłał ruch
    emit('otherCursorMove', {'userSid': request.sid, 'username': username, 'x': x, 'y': y}, broadcast=True, include_self=False)

@app.route('/api/user/login', methods=['OPTIONS'])
def handle_options_login():
    response = jsonify({'message': 'Preflight request successful'})
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'POST')
    return response


if __name__ == '__main__':
    socketio.run(app, debug=True)  # Uruchomienie aplikacji z obsługą Socket.IO
