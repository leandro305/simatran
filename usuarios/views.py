from django.http import request, HttpResponseRedirect
from django.shortcuts import render

def login(request):
    if request.method=="GET":
        return render(request, 'usuarios/login.html')
    elif request.method=="POST":
        login = request.POST.get('login')
        senha = request.POST.get('senha')

        if login == 'simatran' and senha == '123':
            # return render(request, 'sistema/dashboard')
            return HttpResponseRedirect('/dashboard/')
        else:
            return HttpResponseRedirect('/login/')

def cadastro(request):
    if request.method=="GET":
        return render(request, 'usuarios/cadastro.html')

