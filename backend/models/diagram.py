class Diagram:
    def __init__(self, db):
        self.collection = db['diagrams']

    def create_diagram(self, id, label, nodes=None, edges=None):
        diagram_data = {"id": id, "label": label, "nodes": nodes or [], "edges": edges or []}
        return self.collection.insert_one(diagram_data)

    def find_diagram_by_id(self, id):
        return self.collection.find_one({"id": id})

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
        return self.collection.delete_one({"id": id})
