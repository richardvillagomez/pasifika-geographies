# USE FOR GEOJSON FILES

from django.shortcuts import render
from django.http import FileResponse
from django.conf import settings
import os

from django.http import JsonResponse
import os

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator # debugging

@csrf_exempt
def get_geojson(request, island):
    file_path = os.path.join(settings.BASE_DIR, 'api', 'geojson', f'{island}.geojson')
    if not os.path.exists(file_path):
        return JsonResponse({'error': 'Not found'}, status=404)
    return FileResponse(open(file_path, 'rb'), content_type='application/json')

@csrf_exempt
def list_geojson_layers(request): 
    folder_path = os.path.join(settings.BASE_DIR, 'api', 'geojson')

    try: 
        files = os.listdir(folder_path)
        geojson_files = [f[:-8] for f in files if f.endswith('.geojson')]
        return JsonResponse({'layers': geojson_files})
    
    except FileNotFoundError: 
        return JsonResponse({'error': 'geojson folder not found'}, status=500)