from django.http import JsonResponse

def apply_code(request):
    return JsonResponse({
        'result': "success"
    })


