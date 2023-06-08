from importlib.resources import path

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include('sistema.urls', namespace="sistema")),
    path('', include('usuarios.urls', namespace="usuarios")),
    # path('admin/', admin.site.urls),

    path('accounts/', include("django.contrib.auth.urls")),
]

