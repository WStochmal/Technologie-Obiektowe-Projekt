from django.http import JsonResponse

def convert_to_mysql(request):
    try:
        json_data = [
            {
                "id": 11112,
                "label": "Diagram 1",
                "nodes": [
                    {
                        "id": "1",
                        "type": "customNode",
                        "position": {
                            "x": 100,
                            "y": 100,
                        },
                        "data": {
                            "label": "Entity 1",
                            "attributes": [
                                {
                                    "id": "e1",
                                    "label": "Attribute 1",
                                    "type": "SMALLINT",
                                },
                                {
                                    "id": "e2",
                                    "label": "Attribute 2",
                                    "type": "SMALLINT",
                                },
                                {
                                    "id": "e3",
                                    "label": "Attribute 3",
                                    "type": "SMALLINT",
                                },
                                {
                                    "id": "e4",
                                    "label": "Attribute 4",
                                    "type": "VARCHAR",
                                },
                                {
                                    "id": "e5",
                                    "label": "Attribute 5",
                                    "type": "VARCHAR",
                                },
                            ],
                        },
                    },
                    {
                        "id": "2",
                        "type": "customNode",
                        "position": {
                            "x": 400,
                            "y": 100,
                        },
                        "data": {
                            "label": "Entity 2",
                            "attributes": [
                                {
                                    "id": "e6",
                                    "label": "Attribute 6",
                                    "type": "VARCHAR",
                                },
                                {
                                    "id": "e7",
                                    "label": "Attribute 7",
                                    "type": "VARCHAR",
                                },
                            ],
                        },
                    },
                ],
                "edges": [
                    {
                        "id": "e1-e6",
                        "source": "1",
                        "target": "2",
                        "sourceHandle": "e5-handle",
                        "targetHandle": "e7-handle",
                        "type": "default",
                    },
                ],
            },
            {
                "id": 2222,
                "label": "Diagram 2",
                "nodes": [
                    {
                        "id": "1",
                        "type": "customNode",
                        "position": {
                            "x": 100,
                            "y": 100,
                        },
                        "data": {
                            "label": "Entity 1",
                            "attributes": [],
                        },
                    },
                ],
                "edges": [],
            },
        ]

        mysql_code = ""
        processed_tables = set()

        for diagram in json_data:
            for node in diagram["nodes"]:
                table_name = node["data"]["label"]
                attributes = node["data"]["attributes"]

                if table_name in processed_tables:
                    continue

                mysql_code += f"CREATE TABLE IF NOT EXISTS `{table_name}` ("
                for attr in attributes:
                    mysql_code += f"    `{attr['id']}` SMALLINT" # Change this line replace SMALLINT with attr['type'] when frontend will send correct data
                    if attr != attributes[-1]:
                        mysql_code += ","
                mysql_code += ");"
                processed_tables.add(table_name)

        return JsonResponse({'mysql_code': mysql_code})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
