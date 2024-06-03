from bson import ObjectId
from models.user import User
from database import Database
from datetime import datetime
from bson import ObjectId

db = Database().get_db()
user_model = User(db)


class Diagram:
    def __init__(self, db):
        self.collection = db['diagrams']

    def create_diagram(self, userId, label, nodes=None, edges=None):
        diagram_data = {"members": [ObjectId(userId)], "label": label, "diagram": {"nodes": nodes or [], "edges": edges or []}, "createdAt": datetime.utcnow()}
        return self.collection.insert_one(diagram_data)

    def find_diagram_by_id(self, id):
        diagram = self.collection.find_one({"_id": ObjectId(id)})
        if diagram:
            diagram['_id'] = str(diagram['_id'])
            if 'members' in diagram:
                user_ids = [str(member) for member in diagram['members']]
                users = user_model.find_users_by_ids(user_ids)
                diagram['members'] = users
                diagram['members'] = [
                    {'_id': str(member['_id']), 'image': member.get('image'), 'firstname': member.get('firstname'), 'lastname': member.get('lastname')}
                    for member in users
                ]
        return diagram

    
    def find_diagram_by_member(self, user_id):
        diagrams = list(self.collection.find({"members": {"$elemMatch": {"$eq": ObjectId(user_id)}}}, {"_id": 1, "label": 1,"label": 1,"diagram":1,"createdAt":1}))
        for diagram in diagrams:
            diagram['_id'] = str(diagram['_id'])
        return diagrams

       
    def update_diagram(self, id, label=None, nodes=None, edges=None):
        update_data = {}
        if label is not None:
            update_data["label"] = label
        if nodes is not None:
            update_data["nodes"] = nodes
        if edges is not None:
            update_data["edges"] = edges
        return self.collection.update_one({"id": id}, {"$set": update_data})

    def delete_diagram(self, id):
        return self.collection.delete_one({"_id": ObjectId(id)})
