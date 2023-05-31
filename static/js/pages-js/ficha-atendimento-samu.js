$.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});


var timeDisplay = document.getElementById("time");


function refreshTime() {
  var dateString = new Date().toLocaleString("pt-BR", {timeZone: "America/Manaus"});

  var formattedString = dateString.replace(", ", " - ");

  timeDisplay.innerHTML = formattedString;
}
setInterval(refreshTime, 1000);

// Requisição p\ edição de ocorrência
var protocoloParaHost = window.location.protocol + "//" + window.location.host
var pathUrl = window.location.pathname

$(".btn-edicao-ocorrencia").on("click",function(){
    numero_ocorrencia = this.value
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()
    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/consultar-ocorrencia",
            data: {
                'numero_ocorrencia': numero_ocorrencia,
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                inp_nome_ocorrencia = $("#formulario-editar-ocorrencia-modal-grande input[name=numero_ocorrencia]")
                inp_nome_ocorrencia.val(response.numero_ocorrencia)
            }
        }
    );

});

$(".btn-excluir-ocorrencia").on("click",function(){
    numero_ocorrencia = this.value
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()
    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/excluir-ocorrencia",
            data: {
                'numero_ocorrencia': numero_ocorrencia,
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                if(response.status=="deleted"){
                    location.reload()
                }
            }
        }
    );

});