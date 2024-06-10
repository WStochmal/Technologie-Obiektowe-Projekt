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
        diagram_data = {
            "members": [{"userId": ObjectId(userId), "type": "owner"}],
            "label": label,
            "diagram": {
                "nodes": nodes or [],
                "edges": edges or []
            },
            "createdAt": datetime.utcnow()
        }
        return self.collection.insert_one(diagram_data)

    def find_diagram_by_id(self, id):
        diagram = self.collection.find_one({"_id": ObjectId(id)})

        if diagram:
            diagram['_id'] = str(diagram['_id'])
            if 'members' in diagram:
                # Extract only userIds from the members list
                user_ids = [member['userId'] for member in diagram['members'] if 'userId' in member]
                users = user_model.find_users_by_ids(user_ids)

                # Create a dictionary for easy lookup of user details by their ID
                users_dict = {str(user['_id']): user for user in users}

                # Update the members list with user details, preserving the 'type' field
                diagram['members'] = [
                    {
                        'userId': str(member['userId']),
                        'type': member['type'],
                        'firstname': users_dict.get(str(member['userId']), {}).get('firstname', ''),
                        'lastname': users_dict.get(str(member['userId']), {}).get('lastname', ''),
                        'image': users_dict.get(str(member['userId']), {}).get('image', '')
                    }
                    for member in diagram['members']
                ]
        return diagram

    
    def find_diagram_by_member(self, user_id):
        # Znalezienie diagramów zawierających użytkownika
        diagrams = list(self.collection.find(
            {"members": {"$elemMatch": {"userId": ObjectId(user_id)}}},
            {"_id": 1, "label": 1, "diagram": 1, "createdAt": 1, "members": 1}
        ))

        # Konwersja _id na string
        for diagram in diagrams:
            diagram['_id'] = str(diagram['_id'])

        # Zbieranie wszystkich unikalnych userId z members
        all_user_ids = set()
        for diagram in diagrams:
            if 'members' in diagram:
                for member in diagram['members']:
                    all_user_ids.add(str(member['userId']))

        # Pobieranie danych użytkowników
        users = user_model.find_users_by_ids(list(all_user_ids))

        # Mapowanie userId na dane użytkowników
        user_data_map = {str(user['_id']): user for user in users}

        # Aktualizacja members w diagramach
        for diagram in diagrams:
            if 'members' in diagram:
                updated_members = []
                for member in diagram['members']:
                    user_id_str = str(member['userId'])
                    if user_id_str in user_data_map:
                        user_data = user_data_map[user_id_str]
                        updated_member = {
                            'userId': user_id_str,
                            'type': member.get('type'),
                            'firstname': user_data.get('firstname'),
                            'lastname': user_data.get('lastname'),
                            'image': user_data.get('image')
                        }
                        updated_members.append(updated_member)
                diagram['members'] = updated_members

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
