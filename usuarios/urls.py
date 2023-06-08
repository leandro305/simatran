from django.urls import path, include
from django.contrib.auth import views as auth_views
from . import views

app_name="usuarios"

urlpatterns = [
    # Autenticações:
    path('accounts/login/', views.viewLogin, name='login'),
    path('fazer-login/', views.fazerLogin, name='fazer-login'),

    path('cadastro/', views.cadastro, name='cadastro'),
    # Autenticações.

    #Testes:
    # path('pagina-teste/', views.helloWorld, name='pagina-teste'),
    #Testes.
]