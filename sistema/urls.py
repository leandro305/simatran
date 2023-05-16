from django.urls import path

# Importando o arquivo de views
from .views import Views

app_name="sistema"

urlpatterns = [
    path('dashboard/', Views().dashboard, name='dashboard'),
    path('dashboard/filtro-por-periodo', Views().filterByPeriod, name='filtro_por_periodo')
]
