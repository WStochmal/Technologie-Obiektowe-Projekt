from flask import Flask
from flask_cors import CORS
from controllers.user_controller import user_controller
from database import Database

app = Flask(__name__)
CORS(app,origins='*')  

app.register_blueprint(user_controller, url_prefix='/api/user')
db = Database()

if __name__ == '__main__':
    app.run(debug=True)
