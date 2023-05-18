// Pegar a div pai do mapa e encolher ela, ou aumentar e aplicar estilos requeridos
$(".act-nav-lat").on("click",()=>{
    if(!document.querySelector(".contrair-mapa")){
        $("#div-row-map").addClass("contrair-mapa");
    }else if(document.querySelector(".contrair-mapa")){
        $("#div-row-map").removeClass("contrair-mapa");
    }
})

// Abrir modal ao clicar em busca por período
$(".btn-busca-por-periodo").on("click", ()=>{
    $(".modal-dashboard-2").modal("show")
});

// Script p\ arrastar modal
$(".btn-graf-barras").on("click", ()=>{
    $(".modal-dashboard-1").modal("show")
    // $(".corpo-modal-grafico-barras")
})
$(".modal-header").on("mousedown", function(mousedownEvt) {
    var $draggable = $(this);
    var x = mousedownEvt.pageX - $draggable.offset().left,
        y = mousedownEvt.pageY - $draggable.offset().top;
    $("body").on("mousemove.draggable", function(mousemoveEvt) {
        $draggable.closest(".modal-dialog").offset({
            "left": mousemoveEvt.pageX - x,
            "top": mousemoveEvt.pageY - y
        });
    });
    $("body").one("mouseup", ()=> {
        $("body").off("mousemove.draggable");
    });
    $draggable.closest(".modal").one("bs.modal.hide", function() {
        $("body").off("mousemove.draggable");
    });
});

$(document).ready(()=>{
    // P/ sidebar já carregar encolhido
    $("#page-top").addClass("sidebar-toggled")
    $(".ul-sidebar-lateral").addClass("toggled")
});

// P\ mudar o dd/mm/aaaa ao trocar as seleções do filtro por periodo
$(".seletor-filtrar-por-bairro").change(function (){
    if($(this).val()=="dd/mm/aaaa"){
        $(".input-selecionar-periodo").attr("type","date")
    }
    if($(this).val()=="mm/aaaa"){
        $(".input-selecionar-periodo").attr('type',"month")
    }
    if($(this).val()=="aaaa"){
        $(".input-selecionar-periodo").attr('type',"number")
        $("#periodo-de").attr("placeholder", "2019")
        $("#periodo-ate").attr("placeholder", "2020")
    }
});

$("#formulario_filtro_por_periodo").on("submit", () => {
    if($("#periodo-de").val()==""){
        alert("preencha os campos de data primeiro!")
        return false;
    }
    if($("#periodo-ate").val()==""){
        alert("preencha os campos de data primeiro!")
        return false;
    }
});

// Mostrar mensagem de aviso:
$(".show-warning").on("click",()=>{
    $(".mensagem-de-aviso").show();
    setTimeout(function(){
        $(".mensagem-de-aviso").hide(); 
    }, 2000);
});

$(".close-warning-msg").on("click",()=>{
    $(".mensagem-de-aviso").hide();
});