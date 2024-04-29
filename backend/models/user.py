import hashlib
from bson import ObjectId


class User:
    def __init__(self, db):
        self.collection = db['users']

    def create_user(self, firstname, lastname, email, password,image):
        hashed_password = hashlib.sha256(password.encode()).hexdigest()
        user_data = {"firstname": firstname, "lastname": lastname, "email": email,"image":image, "password": hashed_password}
        return self.collection.insert_one(user_data)

    def find_user_by_email(self, email):
        return self.collection.find_one({"email": email})
    
    def find_user_by_id(self, id):
        return self.collection.find_one({"_id": id})
    
    def find_users_by_ids(self,user_ids):
        users = self.collection.find({"_id": {"$in": [ObjectId(user_id) for user_id in user_ids]}})
        return list(users)


    def validate_password(self, user, password):
        hashed_password = user['password']
        entered_password_hashed = hashlib.sha256(password.encode()).hexdigest()
        return hashed_password == entered_password_hashed
    
    def serialize(self, user):
        user['_id'] = str(user['_id'])
        return user
