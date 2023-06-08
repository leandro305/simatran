from django.http import HttpResponse, request, HttpResponseRedirect
from django.shortcuts import redirect, render

from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate
from django.contrib import messages
from django.contrib.auth import login

# Login:
def viewLogin(request):
    if request.method=="GET":
        form_login = AuthenticationForm()
        if request.user.is_authenticated:
            return HttpResponseRedirect('/custo-por-ocorrencia')
        
        else:
            return render(request, 'registration/login.html', {'form_login': form_login})
    
def fazerLogin(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]

        usuario = authenticate(request, username=username, password=password)

        if usuario is not None:
            login(request, usuario)
            return HttpResponseRedirect('/custo-por-ocorrencia')
        else:
            messages.info(request, 'Usuário ou senha inválidos!')
            return redirect('/accounts/login')

# Login.

def cadastro(request):
    if request.method=="GET":
        return render(request, 'usuarios/cadastro.html')


# Tests:
# def helloWorld():
#     pass
# Tests.