from datetime import datetime, tzinfo, timezone
from typing import Any
from django.shortcuts import render
import pandas as pd
import matplotlib.pyplot as plt
import folium
from folium.plugins import HeatMap
from django.http import HttpResponse
from . import conn
from django.views import View
from datetime import date
from calendar import monthrange

class Views(View):
    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)
        self.views = self
        self.mapa_rr : folium.Map()

    def dashboard(self, request):
        #Instancia a própria class p\ poder usar os métodos
        self.views._set_map_rr_folium()
        mapa_rr_html = self.views._get_map_rr_folium_html()

        return render(request, 'pages/dashboard/dashboard.html', {'mapa_rr_html':mapa_rr_html})


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
            return HttpResponse("vc está acessando esta página por GET!")
        
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
            periodosAteMesDia = ["12", "31"]

            for x in periodosDeMesDia:
                periodoDeSpt.append(x)
            for x in periodosAteMesDia:
                periodoAteSpt.append(x)

        filter = {
            'data_acidente': {
                '$gte': datetime(int(periodoDeSpt[0]), int(periodoDeSpt[1]), int(periodoDeSpt[2]), 0, 0, 0, tzinfo=timezone.utc),
                '$lte': datetime(int(periodoAteSpt[0]), int(periodoAteSpt[1]), int(periodoAteSpt[2]), 0, 0, 0, tzinfo=timezone.utc)
            }
        }

        db = conn.connection()
        dbd = db['Acidentes_RR'].find(filter=filter)

        return dbd
    
