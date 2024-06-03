from flask_socketio import SocketIO

class SocketManager:
    __instance = None

    def __new__(cls):
        if cls.__instance is None:
            cls.__instance = super().__new__(cls)
            cls.__instance.socketio = SocketIO()
        return cls.__instance

    def get_socketio(self):
        return self.socketio
