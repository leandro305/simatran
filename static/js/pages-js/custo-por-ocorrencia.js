//Relógio no topo da página
var timeDisplay = document.getElementById("time");
function refreshTime() {
  var dateString = new Date().toLocaleString("pt-BR", {timeZone: "America/Manaus"});

  var formattedString = dateString.replace(", ", " - ");

  timeDisplay.innerHTML = formattedString;
}
setInterval(refreshTime, 1000);


// Máscara para campos de dinheiro:
function moeda(a, e, r, t) {
    let n = ""
      , h = j = 0
      , u = tamanho2 = 0
      , l = ajd2 = ""
      , o = window.Event ? t.which : t.keyCode;
    if (13 == o || 8 == o)
        return !0;
    if (n = String.fromCharCode(o),
    -1 == "0123456789".indexOf(n))
        return !1;
    for (u = a.value.length,
    h = 0; h < u && ("0" == a.value.charAt(h) || a.value.charAt(h) == r); h++)
        ;
    for (l = ""; h < u; h++)
        -1 != "0123456789".indexOf(a.value.charAt(h)) && (l += a.value.charAt(h));
    if (l += n,
    0 == (u = l.length) && (a.value = ""),
    1 == u && (a.value = "0" + r + "0" + l),
    2 == u && (a.value = "0" + r + l),
    u > 2) {
        for (ajd2 = "",
        j = 0,
        h = u - 3; h >= 0; h--)
            3 == j && (ajd2 += e,
            j = 0),
            ajd2 += l.charAt(h),
            j++;
        for (a.value = "",
        tamanho2 = ajd2.length,
        h = tamanho2 - 1; h >= 0; h--)
            a.value += ajd2.charAt(h);
        a.value += r + l.substr(u - 2, u)
    }
    return !1
}

// Ajax:
var protocoloParaHost = window.location.protocol + "//" + window.location.host
var pathUrl = window.location.pathname
$(".select-material").on("change",function(){
    codigo_material = this.value
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()
    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/selecionar-material-js",
            data: {
                'codigo_material': codigo_material,
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                $("input[name='preco_med_ou_item']").val(response.valor_material)
                iptQuant = $("input[name='quant_med_ou_item']")

                if (iptQuant.val()=="0"){
                    iptQuant.val("1")
                }

                // Calcular o valor total
                multiplicacao = formataReais(response.valor_material, iptQuant.val(), "*")
            
                $("input[name='produto_quant_com_item']").val(multiplicacao)
            }
        }
    );

});
$("#edicao-suprimentos-usados select[name='med_ou_item']").on("change",function(){
    codigo_material = this.value
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()
    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/selecionar-material-js",
            data: {
                'codigo_material': codigo_material,
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                $("#edicao-suprimentos-usados input[name='preco_med_ou_item']").val(response.valor_material)
                iptQuant = $("#edicao-suprimentos-usados input[name='quant_med_ou_item']")

                if (iptQuant.val()=="0"){
                    iptQuant.val("1")
                }

                // Calcular o valor total
                multiplicacao = formataReais(response.valor_material, iptQuant.val(), "*")
            
                $("#edicao-suprimentos-usados input[name='produto_quant_com_item']").val(multiplicacao)
            }
        }
    );

});

$(".btn-consultar-suprimentos").on("click",function(){
    codigo_material = this.value
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/selecionar-material-js",
            data: {
                'codigo_material': codigo_material,
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                ipt_codigo_material = $(".modal-sm-medicacao-ou-item input[name='codigo_material']")
                ipt_nome_material = $(".modal-sm-medicacao-ou-item input[name='nome_material']")
                ipt_valor_material = $(".modal-sm-medicacao-ou-item input[name='valor_material']")

                ipt_codigo_material.val(response.codigo_material)
                ipt_nome_material.val(response.nome_material)
                ipt_valor_material.val(response.valor_material)
            }
        }
    );
});

$(".btn-editar-suprimentos").on("click",function(){
    codigo_material = $(".modal-sm-medicacao-ou-item input[name='codigo_material']").val()
    nome_material = $(".modal-sm-medicacao-ou-item input[name='nome_material']").val()
    valor_material = $(".modal-sm-medicacao-ou-item input[name='valor_material']").val()
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/editar-material",
            data: {
                'codigo_material': codigo_material,
                'nome_material': nome_material,
                'valor_material': valor_material,
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                if(response.status=="updated"){
                    // $(".modal-sm-medicacao-ou-item").modal('hide')
                    location.reload()
                }
            }
        }
    );
});

$(".btn-excluir-suprimentos").on("click",function(){
    codigo_material = this.value
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/excluir-material",
            data: {
                'codigo_material': codigo_material,
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                if(response.status=="deleted"){
                    // $(".modal-sm-medicacao-ou-item").modal('hide')
                    location.reload()
                }
            }
        }
    );
});


$(".btn-edicao-ocorrencia").on("click", function(){
    numero_ocorrencia = this.value
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/select-espec-ocorrencia",
            data: {
                'numero_ocorrencia': numero_ocorrencia,
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                //Partes de trazer os dados para o formulário:
                $("#form-editar-espec-ocorrencia input[name='numero_ocorrencia']").val(response[0].numero_ocorrencia)
                ipt_data_ocorrencia = $("#form-editar-espec-ocorrencia input[name='data_ocorrencia']").val(response[0].data_ocorrencia)

                document.querySelector("#form-editar-espec-ocorrencia select[name='turno_ocorrencia']").value = response[0].turno_ocorrencia;
                document.querySelector("#form-editar-espec-ocorrencia select[name='ambulancia_ocorrencia']").value = response[0].ambulancia_ocorrencia;
                document.querySelector("#form-editar-espec-ocorrencia select[name='categoria_ocorrencia']").value = response[0].categoria_ocorrencia;
                document.querySelector("#form-editar-espec-ocorrencia select[name='tipo_ocorrencia']").value = response[0].tipo_ocorrencia;
                
                document.querySelector("#edicao-suprimentos-usados select[name='med_ou_item']").value = response[0].med_ou_item;
                document.querySelector("#edicao-suprimentos-usados input[name='preco_med_ou_item']").value = response[0].preco_med_ou_item;
                document.querySelector("#edicao-suprimentos-usados input[name='quant_med_ou_item']").value = response[0].quant_med_ou_item;
                document.querySelector("#edicao-suprimentos-usados input[name='produto_quant_com_item']").value = response[0].produto_quant_com_item;
                
                // Formulário de suprimentos
                document.querySelector("#edicao-suprimentos-usados input[name='numero_ocorrencia']").value=response[0].numero_ocorrencia
                
                //Partes de trazer os dados para o formulário.

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
            url: protocoloParaHost + "/excluir-espec-ocorrencia",
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

$(".btn-show-modal-vtr").on("click",function(){
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/selecionar-viaturas-js",
            data: {
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                // Add trs with values
                for(x =0; x < response.length; x++){
                    $(".tabela-viaturas tbody").append('<tr> <td>'+ response[x].codigo_viatura +'</td> <td>'+ response[x].viatura +'</td> <td> <button type="button" class="btn btn-outline-secondary btn-sm btn-consultar-viatura" data-toggle="modal" data-target=".modal-sm-viatura" value="'+ response[x].codigo_viatura +'">Editar</button>        <button type="button" class="btn btn-outline-danger btn-sm btn-excluir-viatura" value="'+ response[x].codigo_viatura +'">Excluir</button> </td> </tr>')
                }
            }
        }
    );
}); $(".modal-lg-viatura").on("hidden.bs.modal",function(){
    $(".tabela-viaturas tbody").html("")
});

$("#btn-inserir-viatura").on("click", function (){
    codigo_viatura = $(".div-insercao-viaturas input[name='codigo_viatura']").val()
    viatura = $(".div-insercao-viaturas input[name='viatura']").val()
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/inserir-viatura-js",
            data: {
                'codigo_viatura': codigo_viatura,
                'viatura': viatura,
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                if(response.status=='inserted'){
                    // console.log(response.status)
                    location.reload()
                }
            }
        }
    );
});

$(document).on("click", ".btn-excluir-viatura", function (){
    codigo_viatura = this.value
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/excluir-viatura-js",
            data: {
                'codigo_viatura': codigo_viatura,
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                if(response.status=='deleted'){
                    location.reload()
                }
            }
        }
    );
});

$(document).on("click", ".btn-consultar-viatura", function () {
    codigo_viatura = this.value
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/selecionar-viatura-js",
            data: {
                'codigo_viatura': codigo_viatura,
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                $(".modal-sm-viatura input[name='codigo_viatura']").val(response[0].codigo_viatura)
                $(".modal-sm-viatura input[name='viatura']").val(response[0].viatura)
                
                $(".modal-sm-viatura").append('<input name="codigo_viatura_antigo" style="display:none;visibility:hidden;" value="'+ response[0].codigo_viatura +'">')
            }
        }
    );
}); $(".modal-sm-viatura").on("hidden.bs.modal",function(){
    $(".modal-sm-viatura input[name='codigo_viatura_antigo']").remove();
});

$(document).on("click", ".btn-editar-viatura", function () {
    cod_vtr_old = $(".modal-sm-viatura input[name='codigo_viatura_antigo']").val()

    codigo_viatura = $(".modal-sm-viatura input[name='codigo_viatura']").val()
    viatura = $(".modal-sm-viatura input[name='viatura']").val()
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/editar-viatura-js",
            data: {
                'cod_vtr_old': cod_vtr_old,
                'codigo_viatura': codigo_viatura,
                'viatura': viatura,
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                location.reload()
            }
        }
    );
});

// Crud Turnos:
$(".btn-show-modal-turno").on("click", function (){
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/selecionar-turnos-js",
            data: {
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                // Add trs with values
                for(x =0; x < response.length; x++){
                    $(".modal-lg-turno tbody").append('<tr> <td>'+ response[x].codigo_turno +'</td> <td>'+ response[x].turno +'</td> <td> <button type="button" class="btn btn-outline-secondary btn-sm btn-consultar-turno" data-toggle="modal" data-target=".modal-sm-turno" value="'+ response[x].codigo_turno +'">Editar</button>        <button type="button" class="btn btn-outline-danger btn-sm btn-excluir-turno" value="'+ response[x].codigo_turno +'">Excluir</button> </td> </tr>')
                }
            }
        }
    );
}); $(".modal-lg-turno").on("hidden.bs.modal",function(){
    $(".tabela-turno tbody").html("")
});

$("#btn-inserir-turno").on("click", function (){
    codigo_turno = $(".div-insercao-turno input[name='codigo_turno']").val()
    turno = $(".div-insercao-turno input[name='turno']").val()
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/inserir-turno-js",
            data: {
                'codigo_turno': codigo_turno,
                'turno': turno,
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                if(response.status=='inserted'){
                    // console.log(response.status)
                    location.reload()
                }
            }
        }
    );
});

$(document).on("click", ".btn-excluir-turno", function (){
    codigo_turno = this.value
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/excluir-turno-js",
            data: {
                'codigo_turno': codigo_turno,
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                if(response.status=='deleted'){
                    location.reload()
                }
            }
        }
    );
});

$(document).on("click", ".btn-consultar-turno", function () {
    codigo_turno = this.value
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/selecionar-turno-js",
            data: {
                'codigo_turno': codigo_turno,
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                $(".modal-sm-turno input[name='codigo_turno']").val(response[0].codigo_turno)
                $(".modal-sm-turno input[name='turno']").val(response[0].turno)
                
                $(".modal-sm-turno").append('<input name="codigo_turno_antigo" style="display:none;visibility:hidden;" value="'+ response[0].codigo_turno +'">')
            }
        }
    );
}); $(".modal-sm-turno").on("hidden.bs.modal",function(){
    $(".modal-sm-turno input[name='codigo_turno_antigo']").remove();
});

$(document).on("click", ".btn-editar-turno", function () {
    codigo_turno_antigo = $(".modal-sm-turno input[name='codigo_turno_antigo']").val()

    codigo_turno = $(".modal-sm-turno input[name='codigo_turno']").val()
    turno = $(".modal-sm-turno input[name='turno']").val()
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/editar-turno-js",
            data: {
                'codigo_turno_antigo': codigo_turno_antigo,
                'codigo_turno': codigo_turno,
                'turno': turno,
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                if(response.status=="updated"){
                    location.reload()
                }
            }
        }
    );
});
// Crud Turnos.

// Crud Ocorrências:
$(".btn-show-modal-ocorrencia").on("click", function (){
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/selecionar-ocorrencias-js",
            data: {
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                // Add trs with values
                for(x =0; x < response.length; x++){
                    $(".modal-lg-ocorrencia tbody").append('<tr> <td>'+ response[x].codigo +'</td> <td>'+ response[x].tipo +'</td> <td> <button type="button" class="btn btn-outline-secondary btn-sm btn-consultar-ocorrencia" data-toggle="modal" data-target=".modal-sm-ocorrencia" value="'+ response[x].codigo +'">Editar</button>        <button type="button" class="btn btn-outline-danger btn-sm btn-excluir-ocorrencia" value="'+ response[x].codigo +'">Excluir</button> </td> </tr>')
                }
            }
        }
    );
}); $(".modal-lg-ocorrencia").on("hidden.bs.modal",function(){
    $(".tabela-ocorrencia tbody").html("")
});

$("#btn-inserir-ocorrencia").on("click", function (){
    codigo = $(".div-insercao-ocorrencia input[name='codigo']").val()
    tipo = $(".div-insercao-ocorrencia input[name='tipo']").val()
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/inserir-ocorrencia-js",
            data: {
                'codigo': codigo,
                'tipo': tipo,
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                if(response.status=='inserted'){
                    location.reload()
                }
            }
        }
    );
});

$(document).on("click", ".btn-consultar-ocorrencia", function () {
    codigo = this.value
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/selecionar-ocorrencia-js",
            data: {
                'codigo': codigo,
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                $(".modal-sm-ocorrencia input[name='codigo']").val(response[0].codigo)
                $(".modal-sm-ocorrencia input[name='tipo']").val(response[0].tipo)
                
                $(".modal-sm-ocorrencia").append('<input name="codigo_ocorrencia_antigo" style="display:none;visibility:hidden;" value="'+ response[0].codigo +'">')
            }
        }
    );
}); $(".modal-sm-ocorrencia").on("hidden.bs.modal",function(){
    $(".modal-sm-ocorrencia input[name='codigo_ocorrencia_antigo']").remove();
});

$(document).on("click", ".btn-editar-ocorrencia", function () {
    codigo_ocorrencia_antigo = $(".modal-sm-ocorrencia input[name='codigo_ocorrencia_antigo']").val()

    codigo = $(".modal-sm-ocorrencia input[name='codigo']").val()
    tipo = $(".modal-sm-ocorrencia input[name='tipo']").val()
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/editar-ocorrencia-js",
            data: {
                'codigo_ocorrencia_antigo': codigo_ocorrencia_antigo,
                'codigo': codigo,
                'tipo': tipo,
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                if(response.status=="updated"){
                    location.reload()
                }
            }
        }
    );
});

$(document).on("click", ".btn-excluir-ocorrencia", function (){
    codigo = this.value
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/excluir-ocorrencia-js",
            data: {
                'codigo': codigo,
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                if(response.status=='deleted'){
                    location.reload()
                }
            }
        }
    );
});
// Crud Ocorrências.

// Cat. Ocorrência:
$(".btn-show-categoria-ocorrencia").on("click", function(){
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/selecionar-categoria-ocorrencias-js",
            data: {
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                // Add trs with values
                for(x =0; x < response.length; x++){
                    $(".modal-lg-categoria-ocorrencia tbody").append('<tr> <td>'+ response[x].codigo +'</td> <td>'+ response[x].ocorrencia.tipo +'</td> <td>'+ response[x].categoria_ocorrencia +'</td> <td> <button type="button" class="btn btn-outline-secondary btn-sm btn-consultar-categoria-ocorrencia" data-toggle="modal" data-target=".modal-sm-categoria-ocorrencia" value="'+ response[x].codigo +'">Editar</button>        <button type="button" class="btn btn-outline-danger btn-sm btn-excluir-categoria-ocorrencia" value="'+ response[x].codigo +'">Excluir</button> </td> </tr>')
                }
            }
        }
    );

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/selecionar-ocorrencias-js",
            data: {
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                // Add trs with values
                $(".div-insercao-categoria-ocorrencia select[name='codigo_ocorrencia']").append('<option>*** SELECIONE ***</option>')
                for (x=0; x < response.length; x++){
                    $(".div-insercao-categoria-ocorrencia select[name='codigo_ocorrencia']").append('<option value="'+ response[x].codigo +'">'+ response[x].tipo +'</option>')
                }
            }
        }
    );
}); $(".modal-lg-categoria-ocorrencia").on("hidden.bs.modal",function(){
    $(".tabela-categoria-ocorrencia tbody").html("")
    $(".div-insercao-categoria-ocorrencia select[name='codigo_ocorrencia']").html("")
});

$("#btn-inserir-categoria-ocorrencia").on("click", function (){

    codigo = $(".div-insercao-categoria-ocorrencia input[name='codigo']").val()
    codigo_ocorrencia = $(".div-insercao-categoria-ocorrencia select[name='codigo_ocorrencia']").val()
    categoria_ocorrencia = $(".div-insercao-categoria-ocorrencia input[name='categoria_ocorrencia']").val()
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/inserir-categoria-ocorrencia-js",
            data: {
                'codigo': codigo,
                'codigo_ocorrencia': codigo_ocorrencia,
                'categoria_ocorrencia': categoria_ocorrencia,
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                if(response.status=='inserted'){
                    location.reload()
                }
            }
        }
    );
});

$(document).on("click", ".btn-excluir-categoria-ocorrencia", function (){
    codigo = this.value
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/excluir-categoria-ocorrencia-js",
            data: {
                'codigo': codigo,
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response) {
                if(response.status=='deleted'){
                    location.reload()
                }
            }
        }
    );
});

$(document).on("click", ".btn-consultar-categoria-ocorrencia", function () {
    codigo = this.value
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/selecionar-categoria-ocorrencia-js",
            data: {
                'codigo': codigo,
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                $(".modal-sm-categoria-ocorrencia input[name='codigo']").val(response[0].codigo)
                $(".modal-sm-categoria-ocorrencia input[name='categoria_ocorrencia']").val(response[0].categoria_ocorrencia)
                
                $(".modal-sm-categoria-ocorrencia select[name='codigo_ocorrencia']").val(response[0].ocorrencia.codigo)

                $(".modal-sm-categoria-ocorrencia").append('<input name="codigo_categoria_ocorrencia_antigo" style="display:none;visibility:hidden;" value="'+ response[0].codigo +'">')
            }
        }
    );

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/selecionar-ocorrencias-js",
            data: {
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                // Add trs with values
                for (x=0; x < response.length; x++){
                    $(".modal-sm-categoria-ocorrencia select[name='codigo_ocorrencia']").append('<option value="'+ response[x].codigo +'">'+ response[x].tipo +'</option>')
                }
            }
        }
    );
}); $(".modal-sm-categoria-ocorrencia").on("hidden.bs.modal",function(){
    $(".modal-sm-categoria-ocorrencia input[name='codigo_categoria_ocorrencia_antigo']").remove();

    $(".modal-sm-categoria-ocorrencia select[name='codigo_ocorrencia']").html("");
});

$(document).on("click", ".btn-editar-categoria-ocorrencia", function () {
    codigo_categoria_ocorrencia_antigo = $(".modal-sm-categoria-ocorrencia input[name='codigo_categoria_ocorrencia_antigo']").val()

    codigo = $(".modal-sm-categoria-ocorrencia input[name='codigo']").val()
    categoria_ocorrencia = $(".modal-sm-categoria-ocorrencia input[name='categoria_ocorrencia']").val()
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()

    codigo_ocorrencia = $(".modal-sm-categoria-ocorrencia select[name='codigo_ocorrencia']").val()

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/editar-categoria-ocorrencia-js",
            data: {
                'codigo_categoria_ocorrencia_antigo': codigo_categoria_ocorrencia_antigo,
                'codigo': codigo,
                'categoria_ocorrencia': categoria_ocorrencia,
                'codigo_ocorrencia': codigo_ocorrencia,
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                if(response.status=="updated"){
                    location.reload()
                }
            }
        }
    );
});
// Cat. Ocorrência.


// Carrinho de Suprimentos:

// Carrinho de Suprimentos:


// Quando a pag. é carregada:
$(document).ready(function (){
    // Carregar select de viaturas
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()
    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/selecionar-viaturas-js",
            data: {
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                for(x =0; x < response.length; x++){
                    $(".primeira-grande-linha select[name='ambulancia_ocorrencia']").append('<option value="'+ response[x].viatura +'">'+ response[x].viatura +'</option>')
                }
            }
        }
    );

    // Carregar select de turnos
    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/selecionar-turnos-js",
            data: {
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                for(x =0; x < response.length; x++){
                    $(".primeira-grande-linha select[name='turno_ocorrencia']").append('<option value="'+ response[x].turno +'">'+ response[x].turno +'</option>')
                

                    $(".modal-lg-especificacao-ocorrencia select[name='turno_ocorrencia']").append('<option value="'+ response[x].turno +'">'+ response[x].turno +'</option>')
                }
            }
        }
    );

    // Carregar select de categoria_ocorrencia
    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/selecionar-categoria-ocorrencias-js",
            data: {
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                for(x =0; x < response.length; x++){
                    $(".primeira-grande-linha select[name='categoria_ocorrencia']").append('<option value="'+ response[x].categoria_ocorrencia +'">'+ response[x].categoria_ocorrencia +'</option>')


                    $(".modal-lg-especificacao-ocorrencia select[name='categoria_ocorrencia']").append('<option value="'+ response[x].categoria_ocorrencia +'">'+ response[x].categoria_ocorrencia +'</option>')
                }
            }
        }
    );

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/selecionar-ocorrencias-js",
            data: {
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                for(x =0; x < response.length; x++){
                    $(".primeira-grande-linha select[name='tipo_ocorrencia']").append('<option value="'+ response[x].tipo +'">'+ response[x].tipo +'</option>')


                    $(".modal-lg-especificacao-ocorrencia select[name='tipo_ocorrencia']").append('<option value="'+ response[x].tipo +'">'+ response[x].tipo +'</option>')
                }
            }
        }
    );
});
// Quando a pag. é carregada.
// Ajax.



function produtoDoValorComQuantidade(val){
    if(val!="0"){
        preco_medicacao = $("input[name='preco_med_ou_item']").val()
        produto = formataReais(val, preco_medicacao, "*")
        $("input[name='produto_quant_com_item']").val(produto)
    }
    if (val=="0"){
        document.querySelector("#form-espec-ocorrencia select[name='med_ou_item']").value=""
        $("input[name='preco_med_ou_item']").val("")
        $("input[name='produto_quant_com_item']").val("")
    }
}
function produtoDoValorComQuantidadeEdicaoMedicacaoUsada(val){
    if(val!="0"){
        preco_medicacao = $("#edicao-suprimentos-usados input[name='preco_med_ou_item']").val()
        produto = formataReais(val, preco_medicacao, "*")
        $("#edicao-suprimentos-usados input[name='produto_quant_com_item']").val(produto)
    }
    if (val=="0"){
        document.querySelector("#edicao-suprimentos-usados select[name='med_ou_item']").value=""
        $("#edicao-suprimentos-usados input[name='preco_med_ou_item']").val("")
        $("#edicao-suprimentos-usados input[name='produto_quant_com_item']").val("")
    }
}

//Operações c\ javascript
function formataReais($valor1, $valor2, $operacao) {
    /*     function formataReais ($valor1, $valor2, $operacao)
    *
    *     $valor1 = Primeiro valor da operação
    *     $valor2 = Segundo valor da operação
    *     $operacao = Tipo de operações possíveis . Pode ser :
    *     "+" = adição,
    *     "-" = subtração,
    *     "*" = multiplicação
    *     "%" = porcentagem
    *
    */

    // Antes de tudo , arrancamos os "," e os "." dos dois valores passados a função . Para isso , podemos usar str_replace :
    // Script para substituir vírgula para ponto para valores abaixo de mil que tem o seguinte formato (0,10 - 100,00 - 999,99) ou seja que não tem ponto (resolver um bug de cálculo)
    if ($valor1.indexOf(",") !== -1 && $valor1.indexOf(".") === -1) {
        $valor1 = $valor1.replace(",", ".");
    }
    else {
        $valor1 = $valor1.replace(",", "");
        $valor1 = $valor1.replace(".", "");
    }
    if ($valor2.indexOf(",") !== -1 && $valor2.indexOf(".") === -1) {
        $valor2 = $valor2.replace(",", ".");
    }
    else {
        $valor2 = $valor2.replace(",", "");
        $valor2 = $valor2.replace(".", "");
    }

    // Agora vamos usar um switch para determinar qual o tipo de operação que foi definida :
    switch ($operacao) {
        // Adição :
        case "+":
            $resultado = $valor1 + $valor2;
            break;

        // Subtração :
        case "-":
            $resultado = $valor1 - $valor2;
            break;

        // Multiplicação :
        case "*":
            $resultado = $valor1 * $valor2;
            break;
        case "%":
            $resultado = $valor1 * $valor2 / 100;

    }

    //Arredondamento de valores que podem surgir nos cálculos como (3.607, 0.512)
    //$resultado = round($resultado, 2); // Deixar somente duas casas decimais a frente depois do ponto (.)
    $resultado = ajusteR($resultado, 2);

    // Forçar entrada de valores 20.4 no "case 4", quando na verdade esses valores deviam ser 20.40 com duas casas a frente
    if ($resultado.indexOf(".") !== -1) {
        //$dopontoadiante = strstr($resultado, "."); //Pegar os valores do ponto adiante
        $dopontoadiante = $resultado.substring($resultado.indexOf("."));


        $centavos = $dopontoadiante.replace(".", ""); //Tirar o ponto e deixar só os centavos '00' ou '04'
        
        $tamCentavos = $centavos.length;
        if ($tamCentavos == 1) {
            $centavos = $centavos+"0"; //Adicionar o segundo zero caso tenha só um centavo de tamanho '0' ao invés de '00'
            
            // $real = strstr($resultado, ".", true);
            $real = $resultado.substring(0, $resultado.indexOf("."));
            
            $resultado = $real + $centavos; // se resultado antes era 20.4 agora passou a ser 20.40 ou 2040
        }
    }

    // console.log($resultado)

    //Criar um script para remover os pontos do resultado (resolvendo o bug do calculo do valor que tem vírgula "0,10 - 100,00 - 999,99" abaixo de mil)
    $resultado = $resultado.replace(",", "");
    $resultado = $resultado.replace(".", "");

    // Calcula o tamanho do resultado com strlen
    $len = $resultado.length;

    // console.log($resultado)

    // Novamente um switch , dessa vez de acordo com o tamanho do resultado da operação ($len) :
    // De acordo com o tamanho de $len , realizamos uma ação para dividir o resultado e colocar as vírgulas e os pontos
    
    // console.log($resultado)

    switch ($len) {
        // 1 : 0,1,2,3,4,5,6,7,8,9 prevenção dos cálculos que retornam números individuais
        case 1:
            $retorna = $resultado+",00";
            break;

        
        // 2 : 0,99 centavos
        case 2:
            $retorna = "0,"+$resultado;
            break;

        // 3 : 9,99 reais
        case 3:
            // console.log($resultado)

            $d1 = $resultado.substring(0,1);
            $d2 = $resultado.substring(1,3);

            // console.log($d1)
            // console.log($d2)

            $retorna = $d1+","+$d2;
            break;

        // 4 : 99,99 reais
        case 4:
            $d1 = $resultado.substring(0,2);
            $d2 = $resultado.substring(2,4);
            $retorna = $d1+","+$d2;
            break;

        // 5 : 999,99 reais
        case 5:
            $d1 = $resultado.substring(0,3);
            $d2 = $resultado.substring(3,5);
            $retorna = $d1+","+$d2;
            break;

        // 6 : 9.999,99 reais
        case 6:
            $d1 = $resultado.substring(1,3);
            $d2 = $resultado.substring(4,6);
            $d3 = $resultado.substring(0,1);
            $retorna = $d3+"."+$d1+","+$d2;
            break;

        // 7 : 99.999,99 reais
        case 7:
            $d1 = $resultado.substring(2,3);
            $d2 = $resultado.substring(5,7);
            $d3 = $resultado.substring(0,2);
            $retorna = $d3+"."+$d1+","+$d2;
            break;

        // 8 : 999.999,99 reais
        case 8:
            $d1 = $resultado.substring(3,3);
            $d2 = $resultado.substring(6,8);
            $d3 = $resultado.substring(0,3);
            $retorna = $d3+"."+$d1+","+$d2;
            break;
        // 9 : 1.000.000,00 (1 milhão de reais)
        case 9:
            $d1 = $resultado.substring(0, 1);
            $d2 = $resultado.substring(7, 9);
            $d3 = $resultado.substring(4, 3);
            $d4 = $resultado.substring(7, 2);
            $retorna = $d1+"."+$d2+"."+$d3+","+$d4;
            break;
        // 10 : 10.100.000,10 (dez milhões, cem mil e dez centavos)
        case 10:
            $d1 = substr("$resultado", 0, 2);
            $d2 = substr("$resultado", 2, 3);
            $d3 = substr("$resultado", 5, 3);
            $d4 = substr("$resultado", 8, 2);
            $retorna = "$d1.$d2.$d3,$d4";
            break;
        // 11: 100.100.000,10 (cem milhões, cem mil e dez centavos)
        case 11:
            $d1 = substr("$resultado", 0, 3);
            $d2 = substr("$resultado", 3, 3);
            $d3 = substr("$resultado", 6, 3);
            $d4 = substr("$resultado", 9, 2);
            $retorna = "$d1.$d2.$d3,$d4";
            break;
    }

    // console.log($retorna)

    // Por fim , retorna o resultado já formatado
    return $retorna;
}
function ajusteR(nr, casas) {
    const og = Math.pow(10, casas);
    return String(Math.trunc(nr * og) / og);
}

