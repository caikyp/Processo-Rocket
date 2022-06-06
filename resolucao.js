const fs = require('fs');
var valAcessorio = 0;
var valEletrodomestico = 0;
var valEletronico = 0;
var valPanela = 0;

// Funções de Correção
function lerArquivo(){
    const data = fs.readFileSync('./broken-database.json', 'utf8');
    const produtos = JSON.parse(data);
    return produtos;
}

function arrumarNomes(produtos){
    produtos.forEach(obj => {
        obj.name = obj.name.replace(/æ/g, 'a').replace(/¢/g, 'c').replace(/ø/g, 'o').replace(/ß/g, 'b');
    });
    return produtos;
}

function arrumarPreco(produtos){
    produtos.forEach(obj => {
        obj.price = parseFloat(obj.price);
    });
    return produtos;
}

function arrumarQtd(produtos){
    produtos.forEach(obj => {
        if(!obj.quantity){
            var price = obj.price;
            var category = obj.category;
            delete obj.price;
            delete obj.category;
            obj.quantity = 0;
            obj.price = price;
            obj.category = category;
        }
    });
    return produtos;
}

function exportarJSON(produtos){
    fs.writeFileSync('./saida.json', JSON.stringify(produtos, null, 2), 'utf-8');
}

// Funções de Verificação
function listaProdutos(produtos) {
    produtos.sort(function(a, b) {
      if(a.category<b.category)
          return -1;
      else
          return true;
    });
    produtos.sort(function(a, b) {
        if(a.category==b.category) 
          return a.id - b.id;
    });
  
    console.log(produtos);
}

function totalCategoria(produtos) {
    produtos.forEach(obj => {
        if(obj.category == "Acessório")
            valAcessorio += (obj.quantity * obj.price);
        if(obj.category == "Eletrodomésticos")
            valEletrodomestico += (obj.quantity * obj.price);
        if(obj.category == "Eletrônicos")
            valEletronico += (obj.quantity * obj.price);
        if(obj.category == "Panelas")
            valPanela += (obj.quantity * obj.price);
    });

    console.log(" Valor de Acessórios: "+valAcessorio+"\n Valor de Eletromésticos: "+valEletrodomestico+"\n Valor de Eletrônicos: "+valEletronico+"\n Valor de Panelas: "+valPanela);
}


let dados = lerArquivo();
dados = arrumarNomes(dados);
dados = arrumarPreco(dados);
dados = arrumarQtd(dados);
exportarJSON(dados);

listaProdutos(dados);
totalCategoria(dados);

