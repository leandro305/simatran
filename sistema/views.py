from datetime import datetime, tzinfo, timezone
import json
from typing import Any
from django.shortcuts import render
import pandas as pd
import matplotlib.pyplot as plt
import folium
from folium.plugins import HeatMap
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from . import conn
from django.views import View
from datetime import date
from calendar import monthrange
from random import randint
from bson import json_util
import json
from geopy.geocoders import Nominatim


class Views(View):
    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)
        self.views = self
        self.mapa_rr : folium.Map()
        self.db = conn.connection()

    def dashboard(self, request):
        # Para exibição da página em manutenção
        # return render(request, 'pages/dashboard/manutencao.html')

        #Instancia a própria class p\ poder usar os métodos
        self.views._set_map_rr_folium()
        mapa_rr_html = self.views._get_map_rr_folium_html()

        return render(request, 'pages/dashboard/dashboard.html', {'mapa_rr_html':mapa_rr_html})

    # Função apenas de teste
    def geraGraficoPlot():
        # Comente e descomente para gerar a imagem de gráfico, apenas para testes
        #Dados p\ python se basear
        # meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
        # valores = [550, 280, 250, 299, 310, 156, 340, 153, 249, 154, 287, 394]
        # plt.plot(meses,valores)
        # plt.savefig("static/imagens/graficos/repPlot1.png")

        #Dados p\ python gerar depois de treinado
        meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
        valores = [320, 300, 180, 330, 120, 201, 245, 195, 158, 149, 293, 380]
        plt.plot(meses,valores)
        plt.savefig("static/imagens/graficos/repPlot2.png")
        # pass

    # Função apenas de teste
    def geraGraficoBarras():
        # Comente e descomente para gerar a imagem de gráfico, apenas para testes
        # meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
        # df=pd.DataFrame([
        #                 ["jan",7,10,20,10,13,4,18,17,16,2],
        #                 ["fev",12,12,12,17,12,9,12,15,12,13],
        #                 ["mar",15,15,2,15,15,16,15,15,15,15],
        #                 ["abr",13,13,13,15,13,13,13,11,13,13],
        #                 ["mai",14,19,13,14,14,18,8,16,14,17],
        #                 ["jun",19,19,13,14,3,18,14,16,14,17],
        #                 ["jul",18,19,13,15,14,18,14,16,14,9],
        #                 ["ago",17,17,13,5,18,18,14,13,18,14],
        #                 ["set",7,19,19,14,14,18,14,16,11,6],
        #                 ["out",14,10,13,19,19,18,12,16,14,15],
        #                 ["nov",15,19,13,14,14,18,14,16,12,13],
        #                 ["dez",9,19,15,14,11,18,14,18,15,1]
        #                 ],columns=['Trechos', 'Trecho1', 'Trecho2', 'Trecho3', 'Trecho4', 'Trecho5', 'Trecho6', 'Trecho7', 'Trecho8', 'Trecho9', 'Trecho10'])

        # df.index=meses
        # ax = df.plot(figsize=[12,5], xlabel='Trechos', ylabel="Mortos/Grav. Ferido", kind='bar', stacked=True, title='Quantidade de Feridos/Mortos dos classificados: 10 trechos mais violentos durante o ano de 2022')
        # ax.legend(bbox_to_anchor=(1.0, 1.0))

        # #Gera imagem do gráfico de barras
        # fig = ax.get_figure()
        # fig.savefig("static/imagens/graficos/repBar1.png")

        #Dados p\ python gerar depois de treinado
        meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
        df=pd.DataFrame([
                        ["jan",9,11,21,9,8,20,15,20,10,3],
                        ["fev",18,19,22,10,12,9,17,15,8,2],
                        ["mar",22,8,2,6,15,16,17,15,22,2],
                        ["abr",6,25,13,1,13,20,13,8,13,10],
                        ["mai",1,1,19,14,7,18,25,16,22,19],
                        ["jun",10,19,10,14,30,18,25,1,14,2],
                        ["jul",19,2,2,15,25,22,14,11,14,5],
                        ["ago",1,25,13,7,18,3,14,9,18,4],
                        ["set",7,3,19,11,19,18,25,16,10,0],
                        ["out",0,10,1,19,25,18,10,16,11,15],
                        ["nov",17,19,12,14,11,18,1,16,4,13],
                        ["dez",7,8,22,14,25,18,8,18,10,1]
                        ],columns=['Trechos', 'Trecho1', 'Trecho2', 'Trecho3', 'Trecho4', 'Trecho5', 'Trecho6', 'Trecho7', 'Trecho8', 'Trecho9', 'Trecho10'])

        df.index=meses
        ax = df.plot(figsize=[12,5], xlabel='Trechos', ylabel="Mortos/Grav. Ferido", kind='bar', stacked=True, title='Quantidade de Feridos/Mortos dos classificados: 10 trechos mais violentos para o ano de 2023 (PREVISÃO)')
        ax.legend(bbox_to_anchor=(1.0, 1.0))

        #Gera imagem do gráfico de barras
        fig = ax.get_figure()
        fig.savefig("static/imagens/graficos/repBar2.png")
        pass


    # Validações do template
    def filterByPeriod(self, request):
        if(request.method=="POST"):
            # Pega os valores do formulário
            periodoDe = request.POST["periodo-de"]
            periodoAte = request.POST["periodo-ate"]
            # bairro  = request.POST["bairro"]

            # Valida os valores do formulário
            #[...]

            # Busca os valores do form no DB
            
            databydate = self._obterAcidentesPorPeriodo(periodoDe, periodoAte)

            #Obter somente as latitude longitude; Jogar as coordenadas no mapa de calor
            self.views._setLatitudeLongitude(databydate)
            lat_long = self.views._getLatitudeLongitude()

            self.views._set_map_rr_folium_HM(lat_long)
            mapa_rr_html = self.views._get_map_rr_folium_html()

            #Enviar dados p\ tabela de previsões
            dt = self._obterAcidentesPorPeriodo(periodoDe, periodoAte)

            # Trás os valores do DB p\ o form
            return render(request, 'pages/dashboard/dashboard.html', {'mapa_rr_html':mapa_rr_html, 'datatable': dt})

        if(request.method=="GET"):
            return HttpResponse("Vc está acessando esta página por GET!")
        
    #Vai receber uma carga de dados e vai se encarregar de separar somente latitude e longitude
    def _setLatitudeLongitude(self, dataLoad):
        self.latitude_longitude = []

        for xdl in dataLoad:
            if xdl.get("latitude_acidente") is not None and xdl.get("longitude_acidente") is not None:
                self.latitude_longitude.append([xdl['latitude_acidente'], xdl['longitude_acidente']])
            if xdl.get("latitude_acidente") is None and xdl.get("longitude_acidente") is None:
                pass

    def _getLatitudeLongitude(self):
        return self.latitude_longitude

    def _set_map_rr_folium(self):
        #Mapa e algumas camadas
        self.views.mapa_rr = folium.Map([2.82543, -60.70324], zoom_start=12)

        folium.TileLayer('openstreetmap').add_to(self.views.mapa_rr)
        folium.TileLayer('stamentoner').add_to(self.views.mapa_rr)
        #Geojson do mapa
        geojson_rr = "./static/json/geojson_municipio_rr.json"
        folium.GeoJson(geojson_rr, name="Municipios").add_to(self.views.mapa_rr)
        # Adiciona o alternador de camadas do mapa
        folium.LayerControl(position='topleft').add_to(self.views.mapa_rr)
        return

    def _set_map_rr_folium_HM(self, lats_longs):
        #Mapa e algumas camadas
        self.views.mapa_rr = folium.Map([2.82543, -60.70324], zoom_start=12)

        #Aplicação do calor aqui
        HeatMap(lats_longs).add_to(self.views.mapa_rr)

        folium.TileLayer('openstreetmap').add_to(self.views.mapa_rr)
        folium.TileLayer('stamentoner').add_to(self.views.mapa_rr)
        #Geojson do mapa
        geojson_rr = "./static/json/geojson_municipio_rr.json"
        folium.GeoJson(geojson_rr, name="Municipios").add_to(self.views.mapa_rr)
        # Adiciona o alternador de camadas do mapa
        folium.LayerControl(position='topleft').add_to(self.views.mapa_rr)
        return
    
    def _get_map_rr_folium_nrml(self):
        return self.views.mapa_rr
    
    def _get_map_rr_folium_html(self):
        return self.views.mapa_rr._repr_html_()
    

    def _datatotable(self, dbd):
        datatable = []
        for x in dbd:
            datatable.append(x)
        
        return datatable
    

    """ Formatos de recebimento:
        - yyyy-mm-dd
        - yyyy-mm
        - yyyy
        -para este periodo: 2021-10 | 2021-11, busque todos os dados de por ex: 01/10/2021 até 31/11/2021 """
    def _obterAcidentesPorPeriodo(self, periodoDe, periodoAte):
        periodoDeSpt = periodoDe.split("-")
        periodoAteSpt =  periodoAte.split("-")

        # Formatação p\ o caso yyyy-mm e converte p\ yyyy-mm-dd e pega desde 01 a 31 do periodomin p\ o periodomax
        if len(periodoDeSpt) == 2 and len(periodoAteSpt) == 2:
            periodoDeSpt.append("01")
            
            dataAte = date(int(periodoAteSpt[0]),int(periodoAteSpt[1]),1)
            last_date = dataAte.replace(day=monthrange(int(periodoAteSpt[0]), int(periodoAteSpt[1]))[1])
            last_date = str(last_date)
            periodoAteSpt = last_date.split("-")
        
        # Formatação p\ o caso yyyy em que faz uma busca entre um ano e outro
        if len(periodoDeSpt) == 1 and len(periodoAteSpt) == 1:
            periodosDeMesDia = ["01", "01"]
            for x in periodosDeMesDia:
                periodoDeSpt.append(x)
            
            dataAte = date(int(periodoAteSpt[0]), 12, 1)
            last_date = dataAte.replace(day=monthrange(int(periodoAteSpt[0]), 12)[1])
            last_date = str(last_date)
            periodoAteSpt = last_date.split("-")

        filter = {
            'data_acidente': {
                '$gte': datetime(int(periodoDeSpt[0]), int(periodoDeSpt[1]), int(periodoDeSpt[2]), 0, 0, 0, tzinfo=timezone.utc),
                '$lte': datetime(int(periodoAteSpt[0]), int(periodoAteSpt[1]), int(periodoAteSpt[2]), 0, 0, 0, tzinfo=timezone.utc)
            }
        }

        db = conn.connection()
        dbd = db['simatran.Acidentes_RR'].find(filter=filter)

        return dbd
    

    def viewfichaAtendimentoSamu(self, request):
        numero_ocorrencia = self.getCodAleatorio()

        #Mandar as ocorrências para página
        ocorrencias = self.getAllOcorrencias()

        return render(request, 'pages/dashboard/ficha-atendimento-samu.html', {"ocorrencias": ocorrencias, 'numero_ocorrencia': numero_ocorrencia})
    
    def registrarOcorrencia(self, request):
        numero_ocorrencia = request.POST["numero_ocorrencia"]
        telefone_ocorrencia = request.POST["telefone_ocorrencia"]
        solicitante = request.POST["solicitante"]
        tipo_ocorrencia = request.POST["tipo_ocorrencia"]
        motivo_ou_queixa = request.POST["motivo_ou_queixa"]

        # Formatação dos dados
        # [...]

        # Registrar os dados
        ocorrencia = {
            "numero_ocorrencia": numero_ocorrencia,
            "telefone_ocorrencia" : telefone_ocorrencia,
            "solicitante" : solicitante,
            "tipo_ocorrencia" : tipo_ocorrencia,
            "motivo_ou_queixa" : motivo_ou_queixa
        }
        self.setOcorrencia(ocorrencia)

        return HttpResponseRedirect('/ficha-atendimento-samu?msg='+"Ocorrencia registrada com sucesso!")
    
    def selectEspecOcorrenciaJS(self, request):
        if request.method=="POST":
            numero_ocorrencia = request.POST['numero_ocorrencia']

            #Formatar os dados vindos da request
            # [...]

            #Buscar no banco
            espec_ocorrencia = self.getOneOcorrencia(numero_ocorrencia)
            espec_ocorrencia = self.parse_json_v2(espec_ocorrencia)
            return JsonResponse(espec_ocorrencia, safe=False)
        
    def excluirOcorrencia(self, request):
        if request.method=="POST":
            numero_ocorrencia = request.POST['numero_ocorrencia']

            # Formata o valor vindo do post
            # [...]

            # Excluir o valor no Banco
            self.dropOcorrencia(numero_ocorrencia)

            return JsonResponse({'status': 'deleted'})
    
    def editarOcorrencia(self, request):
        if request.method=="POST":
            numero_ocorrencia = request.POST['numero_ocorrencia']
            data_ocorrencia = request.POST['data_ocorrencia']
            endereco_ocorrencia = request.POST['endereco_ocorrencia'] #rua
            bairro_ocorrencia = request.POST['bairro_ocorrencia']
            municipio_ocorrencia = request.POST['municipio_ocorrencia']
            num_end_ocorrencia = request.POST['numero_endereco_ocorrencia']

            data_ocorrencia_spt = data_ocorrencia.split("-")

            endereco = endereco_ocorrencia + ", " + num_end_ocorrencia + " - " + bairro_ocorrencia + ", " + municipio_ocorrencia + " - RR"

            # Localiza latitude, longitude
            locator = Nominatim(user_agent="simatran")
            location = locator.geocode(endereco)

            # print(data_ocorrencia + ' ' + endereco_ocorrencia + ' ' + bairro_ocorrencia + ' ' + municipio_ocorrencia + ' ' + num_end_ocorrencia)
            # print(endereco)
            # print(location.latitude)
            # print(location.longitude)

            #Adiciona na collection Acidentes_RR
            data_ocorrencia = self.dataFormatoMongo(data_ocorrencia_spt[0], data_ocorrencia_spt[1], data_ocorrencia_spt[2])

            ac_rr = {
                "num_acidente": "",
                "numero_ocorrencia": numero_ocorrencia,
                "chv_localidade": "",
                "data_acidente": data_ocorrencia,
                "uf_acidente": "RR",
                "ano_acidente": data_ocorrencia_spt[0],
                "mes_acidente": data_ocorrencia_spt[1],
                "mes_ano_acidente": data_ocorrencia_spt[1]+data_ocorrencia_spt[0],
                "codigo_ibge": "",
                "dia_semana": "",
                "fase_dia": "",
                "tp_acidente": "",
                "cond_meteorologica": "NAO INFORMADO",
                "end_acidente": endereco_ocorrencia,
                "num_end_acidente": num_end_ocorrencia,
                "cep_acidente": 0,
                "bairro_acidente": bairro_ocorrencia,
                "km_via_acidente": 0,
                "latitude_acidente": location.latitude,
                "longitude_acidente": location.longitude,
                "hora_acidente": "",
                "tp_rodovia": "NAO INFORMADO",
                "cond_pista": "NAO INFORMADO",
                "tp_cruzamento": "DESCONHECIDO",
                "tp_pavimento": "NAO INFORMADO",
                "tp_curva": "NAO INFORMADO",
                "lim_velocidade": "NAO INFORMADO",
                "tp_pista": "NAO INFORMADO",
                "ind_guardrail": "NAO INFORMADO",
                "ind_cantcentral": "NAO INFORMADO",
                "ind_acostamento": "NAO INFORMADO",
                "qtde_acidente": 1,
                "qtde_acid_com_obitos": 0,
                "qtde_envolvidos": "",
                "qtde_feridosilesos": "",
            }
            
            self.inserirAcidentesRR(ac_rr)

            return HttpResponse('Inseridos com sucesso!')


    def dataFormatoMongo(self, ano,mes,dia):
        dt = datetime(int(ano), int(mes), int(dia), 0, 0, 0, tzinfo=timezone.utc)
        return dt

    def parse_json(self, data):
        oc = []
        for m in data:
            oc.append(m)

        return json.loads(json_util.dumps(oc[0]))
    
    def parse_json_v2(self, data):
        oc = []
        for m in data:
            oc.append(m)

        return json.loads(json_util.dumps(oc))

    def setOcorrencia(self, ocorrencia):
        self.db['simatran'].ocorrencias.insert_one(ocorrencia)
    
    def getAllOcorrencias(self):
        ocorrencias = self.db['simatran'].ocorrencias.find({})
        return ocorrencias
    
    def getOneOcorrencia(self, numero_ocorrencia):
        ocorrencia = self.db['simatran'].especOcorrencia.find({"numero_ocorrencia": int(numero_ocorrencia)})
        return ocorrencia
    
    def dropOcorrencia(self, numero_ocorrencia):
        filter = {"numero_ocorrencia": numero_ocorrencia}
        self.db['simatran'].ocorrencias.delete_one(filter=filter)

    def getCodAleatorio(self):
        return (randint(0,100000000))
    
    def getCodAleatorioUnico(self, collection, codigo_collection):
        rang = 100000000
        for x in range(rang):
            codigo_collection_x = (randint(0,rang))

            documento = self.db['simatran'][collection].find({codigo_collection: codigo_collection_x})
            documento = self.parse_json_v2(documento)

            if len(documento) == 0:
                return codigo_collection_x

    def alteracaoRelogio(self):
        pass

    def inserirAcidentesRR(self, dados):
        self.db['simatran']['Acidentes_RR'].insert_one(dados)


    # Td relacionado ao custo por ocorrência

    def viewCustoPorOcorrencia(self, request):
        # Para exibição da página em manutenção
        # return render(request, 'pages/dashboard/manutencao.html')

        # Pegar somente da data de hoje e jogar na página

        # especOcorrenciaToday = self.selectEspecOcorrenciaByOneDate(str(date.today()))
        especOcorrencia = self.selectAllEspecOcorrencia()

        materials = self.selectMaterial(); materialstemp = self.selectMaterial()
        materials = self.parse_json_v2(materials)

        return render(request, 'pages/dashboard/custo-por-ocorrencia.html', {'especOcorrencia': especOcorrencia, 'materials': materials, 'materialstemp': materialstemp})

    def inserirEspecOcorrencia(self, request):
        numero_ocorrencia = request.POST['numero_ocorrencia']
        ambulancia_ocorrencia = request.POST['ambulancia_ocorrencia']
        data_ocorrencia = request.POST['data_ocorrencia']
        turno_ocorrencia = request.POST['turno_ocorrencia']
        categoria_ocorrencia = request.POST['categoria_ocorrencia']
        tipo_ocorrencia = request.POST['tipo_ocorrencia']
        
        # med_ou_item = request.POST['med_ou_item']
        # preco_med_ou_item = request.POST['preco_med_ou_item']
        # quant_med_ou_item = request.POST['quant_med_ou_item']
        # produto_quant_com_item = request.POST['produto_quant_com_item']

        #Formatação dos campos
        # [...]

        carrinho_suprimento = self.db['simatran'].carrinho_suprimentos.find({'numero_ocorrencia': int(numero_ocorrencia)})
        carrinho_suprimento = self.parse_json_v2(carrinho_suprimento)

        especOcorrencia = {
            'numero_ocorrencia': int(numero_ocorrencia),
            'ambulancia_ocorrencia':ambulancia_ocorrencia,
            'data_ocorrencia':data_ocorrencia,
            'turno_ocorrencia':turno_ocorrencia,
            'categoria_ocorrencia':categoria_ocorrencia,
            'tipo_ocorrencia':tipo_ocorrencia,
            "suprimentos": carrinho_suprimento[0]
        }

        # return HttpResponse(especOcorrencia)

        #Inserir no respectivo db
        self.insertEspecOcorrencia(especOcorrencia)

        filter = {"numero_ocorrencia": int(numero_ocorrencia)}
        self.db['simatran'].carrinho_suprimentos.delete_one(filter=filter)

        return HttpResponseRedirect('/custo-por-ocorrencia')

        
    def insertEspecOcorrencia(self, dados):
        self.db['simatran.especOcorrencia'].insert_one(dados)

    def selectAllEspecOcorrencia(self):
        data = self.db['simatran']['especOcorrencia'].find({})
        return data
    
    def selectEspecOcorrenciaByOneDate(self, date):
        especOcorrencia = self.db['simatran']['especOcorrencia'].find({"data_ocorrencia": date})
        return especOcorrencia
    
    def excluirEspecOcorrencia(self, request):
        numero_ocorrencia = request.POST['numero_ocorrencia']
        self.deleteEspecOcorrencia(numero_ocorrencia)
        return JsonResponse({'status': 'deleted'})
    
    def excluirMaterialEspecOcorrenciaJS(self, request):
        id = request.POST['id']
        numero_ocorrencia = request.POST['numero_ocorrencia']

        especOcorrencia = self.db['simatran']['especOcorrencia'].find({"numero_ocorrencia": int(numero_ocorrencia)})
        especOcorrencia = self.parse_json_v2(especOcorrencia)


        sup = especOcorrencia[0]['suprimentos']
        mat = sup['material']

        for x, v in enumerate(mat):
            if mat[x]['id'] == int(id):
                mat.pop(x)
                break

        # Atualiza valor_final
        valor_final = self.somarMaterials(mat)

        sup['material'] = mat
        sup['valor_final'] = valor_final

        qr = {
                "numero_ocorrencia": int(numero_ocorrencia)
        }
        filter={ "$set": {
                'suprimentos': sup,
            }
        }
        self.db['simatran'].especOcorrencia.update_one(qr, filter)
        return JsonResponse({'status': 'deleted'})
    
    def adicionarMaterialEspecOcorrenciaJS(self, request):
        numero_ocorrencia = request.POST['numero_ocorrencia']
        codigo_material = request.POST['codigo_material']
        valor_material = request.POST['valor_material']
        quantidade = request.POST['quantidade']
        valor_total = request.POST['valor_total']

        material = self.db['simatran']['material'].find({"codigo_material": int(codigo_material)})
        material = self.parse_json_v2(material)

        especOcorrencia = self.db['simatran']['especOcorrencia'].find({"numero_ocorrencia": int(numero_ocorrencia)})
        especOcorrencia = self.parse_json_v2(especOcorrencia)

        mat = especOcorrencia[0]['suprimentos']['material']
        mat.append({
            "id": self.getCodAleatorio(),
            "codigo_material": int(codigo_material),
            "nome_material": material[0]["nome_material"],
            "valor_material": valor_material,
            "quantidade": quantidade,
            "valor_total": valor_total
        })

        # Somar o valor_final
        valor_final = self.somarMaterials(mat)


        qr = {
                "numero_ocorrencia": int(numero_ocorrencia)
        }
        filter={ "$set": {
                'suprimentos': {
                    "numero_ocorrencia": int(numero_ocorrencia),
                    "material": mat,
                    "valor_final": valor_final
                }
            }
        }
        self.db['simatran'].especOcorrencia.update_one(qr, filter)

        return JsonResponse({"status": "inserted"})

    # def selecionarMaterialEspecOcorrenciaJS(self, request):
    #     codigo_ocorrencia = request.POST['codigo_ocorrencia']

    #     especOcorrencia = self.db['simatran'].especOcorrencia.find({'codigo_ocorrencia': int(codigo_ocorrencia)})
    #     especOcorrencia = self.parse_json_v2(especOcorrencia)
    #     material = especOcorrencia[0]['suprimentos']['material']
    #     return JsonResponse(material, safe=False)

    def inserirMaterial(self, request):
        nome_material = request.POST['nome_material']
        valor_material = request.POST['valor_material']

        # Formatação dos campos
        # [...]

        material = {
            'codigo_material':self.getCodAleatorio(),
            'nome_material':nome_material,
            'valor_material':valor_material
        }
        
        # Inserção no Db
        self.insertMaterial(material)

        # Voltar p\ página e mostrar que inseriu
        return HttpResponseRedirect('/custo-por-ocorrencia')


    def insertMaterial(self, material):
        self.db['simatran']['material'].insert_one(material)

    def selectMaterial(self):
        materials = self.db['simatran']['material'].find({})
        return materials
    
    def selectOneMaterial(self, codigo_material):
        material = self.db['simatran'].material.find({"codigo_material":int(codigo_material)})
        return material

    def selectMaterialJs(self, request):
        codigo_material = request.POST['codigo_material']

        material = self.selectOneMaterial(codigo_material)
        json_material = self.parse_json(material)
        return JsonResponse(json_material)
    
    def selectMaterialsJS(self, request):
        materials = self.db['simatran']['material'].find({})
        materials = self.parse_json_v2(materials)
        return JsonResponse(materials, safe=False)
    
    def deleteEspecOcorrencia(self, numero_ocorrencia):
        filter = {"numero_ocorrencia": int(numero_ocorrencia)}
        self.db['simatran'].especOcorrencia.delete_one(filter=filter)

    def selectOneEspecOcorrencia(self, numero_ocorrencia):
        filter = {"numero_ocorrencia": numero_ocorrencia}
        return self.db['simatran'].especOcorrencia.find(filter)


    def editarEspecOcorrencia(self, request):
        # Do formulário das ocorrências
        if (request.POST.get('numero_ocorrencia') is not None and request.POST.get("turno_ocorrencia") is not None and request.POST.get("ambulancia_ocorrencia") is not None and request.POST.get("categoria_ocorrencia") is not None and request.POST.get("tipo_ocorrencia")):
            numero_ocorrencia = request.POST["numero_ocorrencia"]
            data_ocorrencia = request.POST['data_ocorrencia']
            turno_ocorrencia = request.POST["turno_ocorrencia"]
            ambulancia_ocorrencia = request.POST["ambulancia_ocorrencia"]
            categoria_ocorrencia = request.POST["categoria_ocorrencia"]
            tipo_ocorrencia = request.POST["tipo_ocorrencia"]
            
            qr = {
                "numero_ocorrencia": int(numero_ocorrencia)
            }
            mod = { "$set": {
                    "data_ocorrencia":data_ocorrencia, "turno_ocorrencia":turno_ocorrencia, "ambulancia_ocorrencia": ambulancia_ocorrencia,
                    "categoria_ocorrencia": categoria_ocorrencia, "tipo_ocorrencia": tipo_ocorrencia,
                }
            }
            self.db['simatran'].especOcorrencia.update_one(qr, mod)

            return HttpResponseRedirect('/custo-por-ocorrencia')
        
        # Do formulário dos suprimentos/medicações
        elif (request.POST.get('numero_ocorrencia') is not None and request.POST.get("med_ou_item") is not None and request.POST.get("preco_med_ou_item") is not None and request.POST.get("quant_med_ou_item") is not None and request.POST.get("produto_quant_com_item")):
            numero_ocorrencia = request.POST["numero_ocorrencia"]
            med_ou_item = request.POST['med_ou_item']
            preco_med_ou_item = request.POST["preco_med_ou_item"]
            quant_med_ou_item = request.POST["quant_med_ou_item"]
            produto_quant_com_item = request.POST["produto_quant_com_item"]
            
            qr = {
                "numero_ocorrencia": int(numero_ocorrencia)
            }
            mod = { "$set": {
                    "med_ou_item":int(med_ou_item), "preco_med_ou_item":preco_med_ou_item, "quant_med_ou_item": quant_med_ou_item,
                    "produto_quant_com_item": produto_quant_com_item,
                }
            }
            self.db['simatran'].especOcorrencia.update_one(qr, mod)

            return HttpResponseRedirect('/custo-por-ocorrencia')
    
    # Crud das ambulâncias:
    def viewAmbulancia(self):
        pass
    # Crud das ambulâncias.

    # Crud dos suprimentos:
    def editarMaterial(self, request):
        codigo_material = request.POST['codigo_material']
        nome_material = request.POST['nome_material']
        valor_material = request.POST['valor_material']
        
        qr = {
            "codigo_material": int(codigo_material)
        }
        mod = { "$set": {
                "nome_material":nome_material, "valor_material":valor_material
            }
        }
        self.db['simatran'].material.update_one(qr, mod)
    
        return JsonResponse({"status": "updated"})
    
    def excluirMaterial(self, request):
        codigo_material = request.POST['codigo_material']

        filter = {"codigo_material": int(codigo_material)}
        self.db['simatran'].material.delete_one(filter=filter)

        return JsonResponse({"status": "deleted"})
    # Crud dos suprimentos.

    def selectViaturasJS(self,request):
        all_vtr = self.db['simatran'].viaturas.find({})
        vtrs = self.parse_json_v2(all_vtr)
        return JsonResponse(vtrs, safe=False)
    
    def selectViaturaJS(self, request):
        codigo_viatura = request.POST['codigo_viatura']

        vtr = self.db['simatran'].viaturas.find({'codigo_viatura': int(codigo_viatura)})
        vtr = self.parse_json_v2(vtr)

        return JsonResponse(vtr, safe=False)
    
    def inserirViaturaJS(self, request):
        codigo_viatura = request.POST['codigo_viatura']
        viatura = request.POST['viatura']

        filter={
            'codigo_viatura':int(codigo_viatura),
            'viatura':viatura
        }
        self.db['simatran'].viaturas.insert_one(filter)

        return JsonResponse({'status': 'inserted'})
    
    def excluirViaturaJS(self, request):
        codigo_viatura = request.POST['codigo_viatura']

        filter = {"codigo_viatura": int(codigo_viatura)}
        self.db['simatran'].viaturas.delete_one(filter=filter)

        return JsonResponse({"status": "deleted"})
    
    def editarViaturaJS(self, request):
        cod_vtr_old = request.POST['cod_vtr_old']

        codigo_viatura = request.POST['codigo_viatura']
        viatura = request.POST['viatura']
        
        qr = {
            "codigo_viatura": int(cod_vtr_old)
        }
        mod = { "$set": {
                "codigo_viatura": int(codigo_viatura), "viatura":viatura
            }
        }
        self.db['simatran'].viaturas.update_one(qr, mod)
    
        return JsonResponse({"status": "updated"})
    
    # Crud Turnos:
    def selectTurnosJS(self, request):
        all_turnos = self.db['simatran'].turnos.find({})

        turnos = self.parse_json_v2(all_turnos)

        return JsonResponse(turnos, safe=False)
    
    def inserirTurnoJS(self, request):
        codigo_turno = request.POST['codigo_turno']
        turno = request.POST['turno']

        filter={
            'codigo_turno':int(codigo_turno),
            'turno':turno
        }
        self.db['simatran'].turnos.insert_one(filter)

        return JsonResponse({'status': 'inserted'})
    
    def excluirTurnoJS(self, request):
        codigo_turno = request.POST['codigo_turno']

        filter = {"codigo_turno": int(codigo_turno)}
        self.db['simatran'].turnos.delete_one(filter=filter)

        return JsonResponse({"status": "deleted"})
    
    def selectTurnoJS(self, request):
        codigo_turno = request.POST['codigo_turno']

        turno = self.db['simatran'].turnos.find({'codigo_turno': int(codigo_turno)})

        turno = self.parse_json_v2(turno)

        return JsonResponse(turno, safe=False)
    
    def editarTurnoJS(self, request):
        codigo_turno_antigo = request.POST['codigo_turno_antigo']

        codigo_turno = request.POST['codigo_turno']
        turno = request.POST['turno']
        
        qr = {
            "codigo_turno": int(codigo_turno_antigo)
        }
        mod = { "$set": {
                "codigo_turno": int(codigo_turno), "turno":turno
            }
        }
        self.db['simatran'].turnos.update_one(qr, mod)
    
        return JsonResponse({"status": "updated"})
    
    # Crud Turnos.

    # Crud Ocorrências:
    def selectOcorrenciasJS(self, request):
        ocorrencias = self.db['simatran'].ocorrencias.find({})
        ocorrencias = self.parse_json_v2(ocorrencias)
        return JsonResponse(ocorrencias, safe=False)
    
    def inserirOcorrenciaJS(self, request):
        codigo = request.POST['codigo']
        tipo = request.POST['tipo']

        filter={
            'codigo':int(codigo),
            'tipo':tipo
        }
        self.db['simatran'].ocorrencias.insert_one(filter)

        return JsonResponse({'status': 'inserted'})
    
    def selectOcorrenciaJS(self, request):
        codigo = request.POST['codigo']

        ocorrencia = self.db['simatran'].ocorrencias.find({'codigo': int(codigo)})

        ocorrencia = self.parse_json_v2(ocorrencia)

        return JsonResponse(ocorrencia, safe=False)
    
    def editarOcorrenciaJS(self, request):
        codigo_ocorrencia_antigo = request.POST['codigo_ocorrencia_antigo']

        codigo = request.POST['codigo']
        tipo = request.POST['tipo']
        
        qr = {
            "codigo": int(codigo_ocorrencia_antigo)
        }
        mod = { "$set": {
                "codigo": int(codigo), "tipo":tipo
            }
        }
        self.db['simatran'].ocorrencias.update_one(qr, mod)
    
        return JsonResponse({"status": "updated"})
    
    def excluirOcorrenciaJS(self, request):
        codigo = request.POST['codigo']

        filter = {"codigo": int(codigo)}
        self.db['simatran'].ocorrencias.delete_one(filter=filter)

        return JsonResponse({"status": "deleted"})
    # Crud Ocorrências.

    # Crud Cat. Ocorrencias:
    def selectCategoriaOcorrenciasJS(self, request):
        categoria_ocorrencias = self.db['simatran'].categoria_ocorrencias.find({})

        categoria_ocorrencias = self.parse_json_v2(categoria_ocorrencias)
        return JsonResponse(categoria_ocorrencias, safe=False)

    def inserirCategoriaOcorrenciaJS(self, request):
        codigo = request.POST['codigo']
        codigo_ocorrencia = request.POST['codigo_ocorrencia']
        categoria_ocorrencia = request.POST['categoria_ocorrencia']

        # Vincular ocorrencia c/ Categoria Ocorrência
        ocorrencia = self.db['simatran'].ocorrencias.find({'codigo': int(codigo_ocorrencia)})

        ocorrencia = self.parse_json_v2(ocorrencia)

        filter={
            'codigo':int(codigo),
            'ocorrencia': {
                'tipo': ocorrencia[0]['tipo'],
                'codigo': ocorrencia[0]['codigo']
            },
            'categoria_ocorrencia':categoria_ocorrencia
        }

        self.db['simatran'].categoria_ocorrencias.insert_one(filter)

        return JsonResponse({'status': 'inserted'})

    def excluirCategoriaOcorrenciaJS(self, request):
        codigo = request.POST['codigo']

        filter = {"codigo": int(codigo)}
        self.db['simatran'].categoria_ocorrencias.delete_one(filter=filter)

        return JsonResponse({"status": "deleted"})
    
    def selectCategoriaOcorrenciaJS(self, request):
        codigo = request.POST['codigo']
        ocorrencia = self.db['simatran'].categoria_ocorrencias.find({'codigo': int(codigo)})
        ocorrencia = self.parse_json_v2(ocorrencia)
        return JsonResponse(ocorrencia, safe=False)
    
    def editarCategoriaOcorrenciaJS(self, request):
        codigo_categoria_ocorrencia_antigo = request.POST['codigo_categoria_ocorrencia_antigo']

        codigo = request.POST['codigo']
        categoria_ocorrencia = request.POST['categoria_ocorrencia']
        
        codigo_ocorrencia = request.POST['codigo_ocorrencia']

        ocorrencia = self.db['simatran'].ocorrencias.find({'codigo': int(codigo_ocorrencia)})
        ocorrencia = self.parse_json_v2(ocorrencia)


        qr = {
            "codigo": int(codigo_categoria_ocorrencia_antigo)
        }
        mod = { "$set": {
                "codigo": int(codigo),
                "categoria_ocorrencia":categoria_ocorrencia,
                "ocorrencia": {
                    "tipo": ocorrencia[0]['tipo'],
                    "codigo": ocorrencia[0]['codigo']
                }
            }
        }
        self.db['simatran'].categoria_ocorrencias.update_one(qr, mod)
    
        return JsonResponse({"status": "updated"})
    # Crud Cat. Ocorrencias.

    #Crud Carrinho Suprimento:
    def inserirCarrinhoSuprimentoJS(self, request):
        codigo_carrinho_suprimentos = request.POST['codigo_carrinho_suprimentos']
        numero_ocorrencia = request.POST['numero_ocorrencia']
        codigo_material = request.POST['codigo_material']
        # valor_material = request.POST['valor_material']
        quantidade = request.POST['quantidade']
        valor_total = request.POST['valor_total']

        material = self.db['simatran'].material.find({'codigo_material': int(codigo_material)})
        material = self.parse_json_v2(material)

        carrinho_suprimento = self.db['simatran'].carrinho_suprimentos.find({'codigo_carrinho_suprimentos': int(codigo_carrinho_suprimentos)})
        carrinho_suprimento = self.parse_json_v2(carrinho_suprimento)

        # Atualiza o carrinho_suprimentos, caso já exista suprimentos adicionados
        if len(carrinho_suprimento) > 0:
            qr = {
                "codigo_carrinho_suprimentos": int(codigo_carrinho_suprimentos)
            }

            mat = carrinho_suprimento[0]['material']
            # for x, v in enumerate(material):
            mat.append({
                'id': self.getCodAleatorio(),
                'codigo_material': material[0]['codigo_material'],
                'nome_material': material[0]['nome_material'],
                'valor_material': material[0]['valor_material'],
                'quantidade': quantidade,
                'valor_total': valor_total
            })

            valor_final = self.somarMaterials(mat)

            filter={ "$set": {
                    'material': mat,
                    'valor_final': valor_final
                }
            }
            self.db['simatran'].carrinho_suprimentos.update_one(qr, filter)

        # Inserir em carrinho_suprimentos, caso não exista suprimentos adicionados
        elif len(carrinho_suprimento) == 0:
            filter={
                'codigo_carrinho_suprimentos': int(codigo_carrinho_suprimentos),
                'numero_ocorrencia': int(numero_ocorrencia),
                'material': [
                    {
                        'id': self.getCodAleatorio(),
                        'codigo_material': material[0]['codigo_material'],
                        'nome_material': material[0]['nome_material'],
                        'valor_material': material[0]['valor_material'],
                        'quantidade': quantidade,
                        'valor_total': valor_total
                    }
                ],
                'valor_final': valor_total
            }
            self.db['simatran'].carrinho_suprimentos.insert_one(filter)

        return JsonResponse({'status': 'inserted'})
    
    def selectCarrinhoSuprimentoJs(self, request):
        codigo_carrinho_suprimentos = request.POST['codigo_carrinho_suprimentos']

        carrinho_suprimentos = self.db['simatran'].carrinho_suprimentos.find({'codigo_carrinho_suprimentos':int(codigo_carrinho_suprimentos)})
        carrinho_suprimentos = self.parse_json_v2(carrinho_suprimentos)

        return JsonResponse(carrinho_suprimentos, safe=False)
    
    def excluirMaterialCarrinhoSuprimentoJS(self, request):
        codigo_carrinho_suprimentos = request.POST['codigo_carrinho_suprimentos']
        id = request.POST['id']

        carrinho_suprimento = self.db['simatran'].carrinho_suprimentos.find({'codigo_carrinho_suprimentos': int(codigo_carrinho_suprimentos)})
        carrinho_suprimento = self.parse_json_v2(carrinho_suprimento)

        mat = carrinho_suprimento[0]['material']

        for x, v in enumerate(mat):
            if len(mat) == 1:
                filter = {"codigo_carrinho_suprimentos": int(codigo_carrinho_suprimentos)}
                self.db['simatran'].carrinho_suprimentos.delete_one(filter=filter)

            if mat[x]['id'] == int(id):
                mat.pop(x)
                break

        # Atualizar valor_final
        valor_final = self.somarMaterials(mat)

        qr = {
                "codigo_carrinho_suprimentos": int(codigo_carrinho_suprimentos)
        }
        filter={ "$set": {
                'material': mat,
                'valor_final': valor_final
            }
        }
        self.db['simatran'].carrinho_suprimentos.update_one(qr, filter)

        return JsonResponse({'status': 'deleted'})

    #Crud Carrinho Suprimento.

    def somarMaterials(self, mat):
        valores_total = []
        valor_final = 0
        for x, v in enumerate(mat):
            v_t = mat[x]['valor_total'].replace(",", ".")
            valores_total.append(float(v_t))
        valor_final = sum(valores_total)
        # Arredondar o valor_final se for o caso
        valor_final = "%.2f" % valor_final
        return valor_final