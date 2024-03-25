from jsonschema import validate
import jsonschema
from rest_framework.response import Response
from rest_framework.decorators import api_view

# Create your views here.
Json_data = {
  "tables": [
    {
      "name": "customers",
      "fields": [
        {
          "name": "customer_id",
          "type": "integer",
          "primary_key": True
        },
        {
          "name": "name",
          "type": "string",
          "max_length": 100
        },
        {
          "name": "email",
          "type": "string",
          "max_length": 255
        },
        {
          "name": "registration_date",
          "type": "date"
        }
      ]
    },
    {
      "name": "orders",
      "fields": [
        {
          "name": "order_id",
          "type": "integer",
          "primary_key": True
        },
        {
          "name": "customer_id",
          "type": "integer",
          "foreign_key": True,
          "references": "customers.customer_id"
        },
        {
          "name": "order_date",
          "type": "date"
        }
      ]
    }
  ]
}

schema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
      "tables": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "name": {"type": "string"},
            "fields": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "name": {"type": "string"},
                  "type": {"type": "string", "enum": ["string", "integer", "date"]},
                  "max_length": {"type": "integer"},
                  "primary_key": {"type": "boolean"},
                  "foreign_key": {"type": "boolean"},
                  "references": {"type": "string"}
                },
                "required": ["name", "type"]
              }
            }
          },
          "required": ["name", "fields"]
        }
      }
    },
    "required": ["tables"]
  }


@api_view(['POST'])
def test(request):
    if request.method == 'POST':
        # Pobierz dane z żądania POST
        data = Json_data

        # Wyświetl dane w konsoli
        print(data)

        try:
            validate(instance=data, schema=schema)
            print("Dane są poprawne zgodnie z JSON Schema.")
        except jsonschema.exceptions.ValidationError as e:
            print("Błąd walidacji:", e)

        return Response({'message': 'Item created successfully'}, status=201)
    else:
        return Response({'error': 'Only POST method is allowed'}, status=405)
