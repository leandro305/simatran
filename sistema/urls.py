# Autenticações:
from django.contrib.auth.decorators import login_required
#Autenticações.

from django.urls import path

# Importando o arquivo de views
from .views import Views

app_name="sistema"

urlpatterns = [

    path('dashboard/', Views().dashboard, name='dashboard'),
    path('dashboard/filtro-por-periodo', Views().filterByPeriod, name='filtro_por_periodo'),
    
    # No momento este conjunto de rotas não está sendo usado
    # path('ficha-atendimento-samu', Views().viewfichaAtendimentoSamu, name='ficha-atendimento-samu'),
    # path('registrar-ocorrencias', Views().registrarOcorrencia, name='registrar-ocorrencias'),
    # path('consultar-ocorrencia', Views().consultarOcorrencia, name='consultar-ocorrencias'),
    # path('excluir-ocorrencia', Views().excluirOcorrencia, name='excluir-ocorrencia'),
    # path('editar-ocorrencia', Views().editarOcorrencia, name='editar-ocorrencia'),

    # Td relacionado ao custo por ocorrência daqui pra baixo
    path('custo-por-ocorrencia', login_required(Views().viewCustoPorOcorrencia), name='custo-por-ocorrencia'),
    path('select-espec-ocorrencia-js', Views().selectEspecOcorrenciaJS, name='select-espec-ocorrencia-js'),
    path('inserir-espec-ocorrencia', Views().inserirEspecOcorrencia, name='inserir-espec-ocorrencia'),
    path('excluir-espec-ocorrencia', Views().excluirEspecOcorrencia, name='excluir-espec-ocorrencia'),
    path('editar-espec-ocorrencia', Views().editarEspecOcorrencia, name='editar-espec-ocorrencia'),
    # path('selecionar-material-espec-ocorrencia-js', Views().selecionarMaterialEspecOcorrenciaJS, name='selecionar-material-espec-ocorrencia-js'),
    path('adicionar-material-espec-ocorrencia-js', Views().adicionarMaterialEspecOcorrenciaJS, name='adicionar-material-espec-ocorrencia-js'),
    path('excluir-material-espec-ocorrencia-js', Views().excluirMaterialEspecOcorrenciaJS, name='excluir-material-espec-ocorrencia-js'),


    path('inserir-material', Views().inserirMaterial, name='inserir-material'),
    path('selecionar-material-js', Views().selectMaterialJs, name='selecionar-material-js'),
    path('selecionar-materials-js', Views().selectMaterialsJS, name='selecionar-materials-js'),
    path('editar-material', Views().editarMaterial, name='editar-material'),
    path('excluir-material', Views().excluirMaterial, name='excluir-material'),
    # path('ambulancia', Views().viewAmbulancia, name='ambulancia'),

    path('selecionar-viaturas-js', Views().selectViaturasJS, name='selecionar-viaturas-js'),
    path('selecionar-viatura-js', Views().selectViaturaJS, name='selecionar-viatura-js'),
    path('editar-viatura-js', Views().editarViaturaJS, name='editar-viaturas-js'),
    path('inserir-viatura-js', Views().inserirViaturaJS, name='inserir-viaturas-js'),
    path('excluir-viatura-js', Views().excluirViaturaJS, name='excluir-viaturas-js'),

    path('selecionar-turnos-js', Views().selectTurnosJS, name='selecionar-turnos-js'),
    path('selecionar-turno-js', Views().selectTurnoJS, name='selecionar-turno-js'),
    path('editar-turno-js', Views().editarTurnoJS, name='editar-turno-js'),
    path('inserir-turno-js', Views().inserirTurnoJS, name='inserir-turno-js'),
    path('excluir-turno-js', Views().excluirTurnoJS, name='excluir-turno-js'),

    path('selecionar-ocorrencias-js', Views().selectOcorrenciasJS, name='selecionar-ocorrencias-js'),
    path('inserir-ocorrencia-js', Views().inserirOcorrenciaJS, name='inserir-ocorrencia-js'),
    path('selecionar-ocorrencia-js', Views().selectOcorrenciaJS, name='selecionar-ocorrencia-js'),
    path('editar-ocorrencia-js', Views().editarOcorrenciaJS, name='editar-ocorrencia-js'),
    path('excluir-ocorrencia-js', Views().excluirOcorrenciaJS, name='excluir-ocorrencia-js'),

    path('selecionar-categoria-ocorrencias-js', Views().selectCategoriaOcorrenciasJS, name='selecionar-categoria-ocorrencias-js'),
    path('inserir-categoria-ocorrencia-js', Views().inserirCategoriaOcorrenciaJS, name='inserir-categoria-ocorrencia-js'),
    path('excluir-categoria-ocorrencia-js', Views().excluirCategoriaOcorrenciaJS, name='excluir-categoria-ocorrencia-js'),
    path('selecionar-categoria-ocorrencia-js', Views().selectCategoriaOcorrenciaJS, name='selecionar-categoria-ocorrencia-js'),
    path('editar-categoria-ocorrencia-js', Views().editarCategoriaOcorrenciaJS, name='editar-categoria-ocorrencia-js'),

    path('inserir-carrinho-suprimento-js', Views().inserirCarrinhoSuprimentoJS, name='inserir-carrinho-suprimento-js'),
    path('selecionar-carrinho-suprimento-js', Views().selectCarrinhoSuprimentoJs, name='selecionar-carrinho-suprimento-js'),
    path('excluir-material-carrinho-suprimento-js', Views().excluirMaterialCarrinhoSuprimentoJS, name='excluir-material-carrinho-suprimento-js'),

]
