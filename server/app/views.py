from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from jsonschema import validate
import jsonschema


schema = {
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "nazwisko": {"type": "string"},
        "wiek": {"type": "integer", "minimum": 0},
        "email": {"type": "string", "format": "email"},
    },
    "required": ["name", "nazwisko", "wiek", "email"]   
}

@csrf_exempt
def create_item(request):
    if request.method == 'POST':
        # Pobierz dane z żądania POST
        data = json.loads(request.body)

        # Wyświetl dane w konsoli
        #print(data)

        try:
            validate(instance=data, schema=schema)
            print("Dane są poprawne zgodnie z JSON Schema.")
        except jsonschema.exceptions.ValidationError as e:
            print("Błąd walidacji:", e)

        return JsonResponse({'message': 'Item created successfully'}, status=201)
    else:
        return JsonResponse({'error': 'Only POST method is allowed'}, status=405)

