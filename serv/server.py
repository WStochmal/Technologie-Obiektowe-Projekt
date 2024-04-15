from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/generate_sql', methods=['POST'])
def generate_sql():
    try:
        data = request.json

        if not isinstance(data, dict):
            return jsonify({"error": "JSON data should be an object"}), 400

        sql_statements = []

        for node in data.get('nodes', []):
            if not isinstance(node, dict):
                return jsonify({"error": "Each 'nodes' item should be an object"}), 400

            table_name = f"table_{node.get('id', 'unknown_id')}"

            create_table_sql = f"CREATE TABLE {table_name} (\n"

            columns = []

            for attribute in node.get('data', {}).get('attributes', []):
                if not isinstance(attribute, dict):
                    return jsonify({"error": "Each 'attributes' item should be an object"}), 400

                column_name = f"col_{attribute.get('id', 'unknown_id')}"
                column_type = attribute.get('type', 'VARCHAR')
                columns.append(f"  {column_name} {column_type}")

            create_table_sql += ",\n".join(columns)
            create_table_sql += "\n);"

            sql_statements.append(create_table_sql)

        return jsonify({"sql_statements": sql_statements})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
