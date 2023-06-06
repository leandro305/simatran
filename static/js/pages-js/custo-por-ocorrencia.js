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
                $("input[name='valor_material']").val(response.valor_material)
                iptQuant = $("input[name='quantidade']")

                if (iptQuant.val()=="0"){
                    iptQuant.val("1")
                }

                // Calcular o valor total
                multiplicacao = formatBrazilianMoney(response.valor_material, iptQuant.val(), "*")
            
                $("input[name='valor_total']").val(multiplicacao)
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
                multiplicacao = formatBrazilianMoney(response.valor_material, iptQuant.val(), "*")
            
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


function listarSuprimentosNaTabela(response){
    // Limpar a tabela antes de atribuir qualquer coisa
    $('.tabela-edicao-medicamento tbody').html("")

    material = response[0].suprimentos.material
    codigo_material_selecteds = []
    for (x=0; x < material.length; x++){
        codigo_material_selecteds.push(material[x].codigo_material)
        $('.tabela-edicao-medicamento tbody').append('<tr class="tr-'+ x +'">        <td> <select name="codigo_material" id="'+ material[x].codigo_material +'"></select>        </td>  <td><input type="text" class="form-control form-control-sm" placeholder="" name="valor_material" value="'+ material[x].valor_material +'" readonly=""></td> <td><input type="number" min="0" class="form-control form-control-sm" placeholder="" name="quantidade" value="'+ material[x].quantidade +'" onchange="produtoDoValorComQuantidadeEdicaoMedicacaoUsada(this.value, '+ x +')"></td> <td><input type="text" class="form-control form-control-sm" placeholder="" name="valor_total" value="'+ material[x].valor_total +'" readonly=""></td>                                           <td style="display:flex; border:none;"><button type="button" class="btn btn-outline-secondary btn-sm btn-editar-material-espec-ocorrencia show-warning" value=""><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-save" viewBox="0 0 16 16"> <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/> </svg></button>                             <button type="button" class="btn btn-outline-danger btn-sm btn-excluir-material-espec-ocorrencia" value="'+ material[x].id +'"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/> <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/> </svg></button></td></tr>')
    }

    $(".dv-mostra-valor-final").html('<button type="button" class="btn btn-sm btn-outline-success">V. Final: R$ '+ response[0].suprimentos.valor_final +' </button>')

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/selecionar-materials-js",
            data: {
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                for (x=0; x < response.length; x++) {
                    $('.tabela-edicao-medicamento select[name="codigo_material"]').append("<option value='"+ response[x].codigo_material +"'>"+ response[x].nome_material +"</option>")
                }
                
                selects = $('.tabela-edicao-medicamento select[name="codigo_material"]')
                for (sel = 0; sel < selects.length; sel++){
                    for (opt = 0; opt < selects[sel].options.length; opt++){
                        if (selects[sel].options[opt].value == selects[sel].id){
                            selects[sel].options[opt].setAttribute("selected", "selected")
                        }
                    }
                }
            }
        }
    );

    // Formulário de suprimentos
    document.querySelector("#edicao-suprimentos-usados input[name='numero_ocorrencia']").value=response[0].numero_ocorrencia
}
$(".btn-edicao-ocorrencia").on("click", function(){
    numero_ocorrencia = this.value
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/select-espec-ocorrencia-js",
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


                listarSuprimentosNaTabela(response)
            }
        }
    );
}); $(".modal-lg-especificacao-ocorrencia").on("hidden.bs.modal",function(){
    $(".tabela-edicao-medicamento tbody").html("")
    $(".tabela-edicao-medicamento select[name='codigo_material']").html("")
    $(".dv-mostra-valor-final").html("")
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
$(".btn-mostrar-dv-carrinho-suprimento").on("click", function (){
    ipt_numero_ocorrencia = $(".dv-add-ocorrencia input[name='numero_ocorrencia']").val()

    // Além desse, criar outro script que verifique se número ocorrência existe ou não para bloquear possíveis duplicatas
    if(ipt_numero_ocorrencia == ""){
        alert("Especifique para qual ocorrência será este suprimento, preencha o campo número de ocorrencia!")
        return false
    }
    else{
        $(".dv-abrigar-numero-ocorrencia").html('<input style="visibility:hidden; display:none" type="text" name="numero_ocorrencia" value="'+ ipt_numero_ocorrencia +'">')
    }
}); $(".modal-lg-carrinho-suprimentos").on("hidden.bs.modal",function(){
    $(".dv-mostra-valor-final").html("");
});

$(".btn-adicionar-suprimento-no-carrinho").on("click", function (){
    codigo_carrinho_suprimentos = $(".dv-add-suprimentos input[name='codigo_carrinho_suprimentos']").val()
    numero_ocorrencia = $(".dv-add-suprimentos input[name='numero_ocorrencia']").val()
    
    codigo_material = $(".dv-add-suprimentos select[name='codigo_material']").val()
    valor_material = $(".dv-add-suprimentos input[name='valor_material']").val()
    quantidade = $(".dv-add-suprimentos input[name='quantidade']").val()
    valor_total = $(".dv-add-suprimentos input[name='valor_total']").val()
    // valor_final = 

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/inserir-carrinho-suprimento-js",
            data: {
                'codigo_carrinho_suprimentos': codigo_carrinho_suprimentos,
                'numero_ocorrencia': numero_ocorrencia,
                'codigo_material': codigo_material,
                'valor_material': valor_material,
                'quantidade': quantidade,
                'valor_total': valor_total,
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                selecionar_carrinho_suprimentos()
            }
        }
    );
});

function selecionar_carrinho_suprimentos(){
    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/selecionar-carrinho-suprimento-js",
            data: {
                'codigo_carrinho_suprimentos': codigo_carrinho_suprimentos,
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response){
                if (response.length != 0) {
                    $(".tabela-carrinho-suprimentos tbody").html("")
                    for(x=0; x < response[0].material.length; x++){
                        $(".tabela-carrinho-suprimentos tbody").append('<tr> <td>'+ response[0].material[x].nome_material +'</td> <td>'+ response[0].material[x].quantidade +'</td> <td>'+ response[0].material[x].valor_material +'</td> <td>'+ response[0].material[x].valor_total +'</td> <td> <button type="button" class="btn btn-outline-danger btn-sm excluir-material-carrinho-suprimento" value="'+ response[0].material[x].id +'">Excluir</button> </td> </tr>')
                    }
                    $(".dv-mostra-valor-final").html('<button type="button" class="btn btn-sm btn-outline-success">V. Final: R$ '+ response[0].valor_final +'</button>')

                    // Esvaziar os inputs de adição depois de enviados
                    $(".dv-add-suprimentos select[name='codigo_material']").val("")
                    $(".dv-add-suprimentos input[name='valor_material']").val("")
                    $(".dv-add-suprimentos input[name='quantidade']").val(0)
                    $(".dv-add-suprimentos input[name='valor_total']").val("")
                }
                else if(response.length == 0){
                    $(".tabela-carrinho-suprimentos tbody").html("")
                    $(".dv-mostra-valor-final").html("")
                }
            }
        }
    );
}

$(document).on("click", ".excluir-material-carrinho-suprimento", function () {
    codigo_carrinho_suprimentos = $(".dv-add-suprimentos input[name='codigo_carrinho_suprimentos']").val()
    id = this.value
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/excluir-material-carrinho-suprimento-js",
            data: {
                'codigo_carrinho_suprimentos': codigo_carrinho_suprimentos,
                'id': id,
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response) {
                if(response.status=='deleted'){
                    selecionar_carrinho_suprimentos()
                }
            }
        }
    );
});
// Carrinho de Suprimentos:

// Suprimentos das ocorrências:
$(document).on("click", ".btn-excluir-material-espec-ocorrencia", function (){
    id = this.value
    numero_ocorrencia = $(".modal-lg-especificacao-ocorrencia input[name='numero_ocorrencia']").val()
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/excluir-material-espec-ocorrencia-js",
            data: {
                'numero_ocorrencia': numero_ocorrencia,
                'id': id,
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response) {
                $.ajax(
                    {
                        type: "POST",
                        url: protocoloParaHost + "/select-espec-ocorrencia-js",
                        data: {
                            'numero_ocorrencia': numero_ocorrencia,
                            'csrfmiddlewaretoken': csrfmiddlewaretoken
                        },
                        success: function(response) {
                            listarSuprimentosNaTabela(response)
                        }
                    }
                );
            }
        }
    );
});

$(document).on("click", ".btn-inserir-material-espec-ocorrencia", function (){
    numero_ocorrencia = $(".modal-lg-especificacao-ocorrencia input[name='numero_ocorrencia']").val()
    codigo_material = $(".modal-sm-especificacao-ocorrencia select[name='codigo_material']").val()
    valor_material = $(".modal-sm-especificacao-ocorrencia input[name='valor_material']").val()
    quantidade = $(".modal-sm-especificacao-ocorrencia input[name='quantidade']").val()
    valor_total = $(".modal-sm-especificacao-ocorrencia input[name='valor_total']").val()
    csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val()

    console.log()

    $.ajax(
        {
            type: "POST",
            url: protocoloParaHost + "/adicionar-material-espec-ocorrencia-js",
            data: {
                'numero_ocorrencia': numero_ocorrencia,
                'codigo_material': codigo_material,
                'valor_material':valor_material,
                'quantidade':quantidade,
                'valor_total':valor_total,
                'csrfmiddlewaretoken': csrfmiddlewaretoken
            },
            success: function(response) {
                $(".modal-sm-especificacao-ocorrencia").hide()

                $.ajax(
                    {
                        type: "POST",
                        url: protocoloParaHost + "/select-espec-ocorrencia-js",
                        data: {
                            'numero_ocorrencia': numero_ocorrencia,
                            'csrfmiddlewaretoken': csrfmiddlewaretoken
                        },
                        success: function(response) {
                            listarSuprimentosNaTabela(response)
                        }
                    }
                );
            }
        }
    );
})
// Suprimentos das ocorrências.


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

// Quando a pag. é carregada (NÃO É AJAX):
// codigo randomico dos carrinhos de suprimentos 
$(".dv-abrigar-codigo-carrinho-suprimentos").html('<input style="display:none; visibility:hidden;" type="text" name="codigo_carrinho_suprimentos" value="'+ getRandomInt(0, 100000000) +'"></input>')
// Quando a pag. é carregada (NÃO É AJAX).


function produtoDoValorComQuantidade(val){
    if(val!="0"){
        preco_medicacao = $("input[name='valor_material']").val()

        // console.log(val)
        // console.log(preco_medicacao)

        produto = formatBrazilianMoney(val, preco_medicacao, "*")

        $("input[name='valor_total']").val(produto)
    }
    if (val=="0"){
        document.querySelector("#form-espec-ocorrencia select[name='codigo_material']").value=""
        $("input[name='valor_material']").val("")
        $("input[name='valor_total']").val("")
    }
}
function produtoDoValorComQuantidadeEdicaoMedicacaoUsada(val, id_tr){
    if(val!="0"){
        preco_medicacao = $("#edicao-suprimentos-usados .tr-"+ id_tr +" input[name='valor_material']").val()
        produto = formatBrazilianMoney(val, preco_medicacao, "*")
        $("#edicao-suprimentos-usados .tr-"+ id_tr +" input[name='valor_total']").val(produto)
    }
    if (val=="0"){
        document.querySelector("#edicao-suprimentos-usados .tr-"+ id_tr +" select[name='codigo_material']").value=""
        $("#edicao-suprimentos-usados .tr-"+ id_tr +" input[name='valor_material']").val("")
        $("#edicao-suprimentos-usados .tr-"+ id_tr +" input[name='valor_total']").val("")
    }
}

// Funçoes auxiliares:
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
            $t = $valor1 * $valor2
            if ($t != $resultado){
                $retorna = "0,"+$resultado;
            }else {
                $retorna = $resultado+",00"
            }

            break;

        // 3 : 9,99 reais
        case 3:

            $d1 = $resultado.substring(0,1);
            $d2 = $resultado.substring(1,3);

            console.log($d1)
            console.log($d2)

            

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

function formatBrazilianMoney(valor1, valor2, operacao){
    valor1 = String(valor1)
    valor2 = String(valor2)

    var rawPrice = parseInt(valor1.replace(/[.,]/g, ''));
    var rawPrice2 = parseInt(valor2.replace(/[.,]/g, ''));

    if (operacao=="*"){
        var total = (rawPrice * rawPrice2 / 100);
    }

    console.log(valor1)
    console.log(valor2)
    console.log(total)

    var resultado = `${total.toLocaleString('pt-BR', { style: 'decimal', useGrouping: 'true', minimumFractionDigits: '2', maximumFractionDigits: '2' })}`

    console.log('R$' + resultado)

    return resultado
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function ajusteR(nr, casas) {
    const og = Math.pow(10, casas);
    return String(Math.trunc(nr * og) / og);
}

$(document).on("click", ".show-warning",()=>{
    $(".mensagem-de-aviso").show();
    setTimeout(function(){
        $(".mensagem-de-aviso").hide(); 
    }, 2000);
});

$(document).on("click", ".close-warning-msg",()=>{
    $(".mensagem-de-aviso").hide();
});
// Funçoes auxiliares.