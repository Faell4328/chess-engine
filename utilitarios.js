// Arquivo de utilitários

function iniciarSom(arquivo) {
    document.getElementById('audio').pause();
    document.getElementById('audio').load();
    document.getElementById('audio').src = `som/${arquivo}.mp3`;
    document.getElementById('audio').play();
}

let ultimo_aviso;
function aviso(mensagem, status = '', som = true) {
    clearTimeout(ultimo_aviso);

    let cor = '#000';
    switch (status) {
        case 'Erro':
            cor = '#a00';
            break;
        case 'Sucesso':
            cor = '#0a0';
            break;
        case 'Aviso':
            cor = '#00a';
            break;
    }

    document.getElementById('aviso').innerHTML = `<span style="color: ${cor}">${mensagem}</span>`;
    som == true && iniciarSom('aviso');

    ultimo_aviso = setTimeout(() => {
        document.getElementById('aviso').innerHTML = '';
    }, 10000);
}

function converterCoordenadaParaBinario(valor) {
    let potencia = 0;
    let binario = 0n;
    potencia = Number(valor[1] - 1) * 8;

    if (Number(valor[0].toLowerCase() - 'a'.charCodeAt(0)) > 7) {
        throw new Error('Movimento inválido');
    } else if (Number(valor[1]) > 8) {
        throw new Error('Movimento inválido');
    }

    potencia += valor[0].toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
    binario = BigInt(2 ** potencia);

    return binario;
}

function converteBinarioParaCoordenada(valor) {
    let quantidade_casas = valor.toString(2).length - 1;
    let linhas = 0;
    let colunas = 0;
    while (true) {
        if (quantidade_casas >= 8) {
            quantidade_casas -= 8;
            linhas++;
        } else {
            colunas = quantidade_casas;
            break;
        }
    }

    let letra = String.fromCharCode(Number('a'.charCodeAt(0)) + colunas);
    let numero = Number(linhas + 1);

    return letra + numero;
}

// Verifica se o FEN é válido
function validarFen(fen) {
    // VERIFICANDO O FEN COMPLETO

    const fen_separado = fen.split(' ');

    // Verificar a quantidade de campos
    if (fen_separado.length !== 6) {
        aviso(`Quantidade de campos no FEN incorreto, esperado é 6 e o fornecido tem ${fen_separado.length}`, 'Erro');
        throw new Error(`Quantidade de campos no FEN incorreto, esperado é 6 e o fornecido tem ${fen_separado.length}`);
    }

    // VERIFICANDO A PRIMEIRA CAMPO DO FEN (peças no tabuleiro)

    const primeiro_campo_fen = fen_separado[0].split('/');

    // Verificando se o primeiro campo do FEN está válido
    if (primeiro_campo_fen.length !== 8) {
        aviso(`O primeiro campo do FEN está incorreto, esperado é 8 e o fornecido tem ${primeiro_campo_fen.length}`, 'Erro');
        throw new Error(`O primeiro campo do FEN está incorreto, esperado é 8 e o fornecido tem ${primeiro_campo_fen.length}`);
    }

    // Verificando se existe alguma letra ou número inválido (válidos: "r", "n", "b", "q", "k", "p", "R", "N", "B", "Q", "K", "P", "/", 1, 2, 3, 4, 5, 6, 7, 8)
    if (fen_separado[0].match(/[^r|n|b|q|k|p|/|1-8]/gi) !== null) {
        aviso('O primeiro campo do FEN está incorreto, possui caractere que não é válido', 'Erro');
        throw new Error('O primeiro campo do FEN está conrreto, possui caractere que não é válido');
    }

    // Verificando se em cada linha possui a quantidade de peça e casas vazias corretas
    for (var cont = 0; cont < 8; cont++) {
        let quantidade = 0;

        const letras = primeiro_campo_fen[cont].match(/[rnbqkp]/gi);
        if (letras !== null) {
            quantidade += letras.length;
        }

        const numeros = primeiro_campo_fen[cont].match(/[1-8]/g);
        if (numeros !== null) {
            for (let numero of numeros) {
                quantidade += Number(numero);
            }
        }

        // Esperado é que tenha 8 (contando peças e casas vazias)
        if (Number(quantidade) !== 8) {
            aviso(`O primeiro campo do FEN está incorreto: Na ${cont + 1}° parte está com a quantidade de peça e casas varias está errado, o esperado é 8 e possui ${Number(quantidade)}`, 'Erro');
            throw new Error(`O primeiro campo do FEN está incorreto: Na ${cont + 1}° parte está com a quantidade quantidade de peça e casas está errado, o esperado é 8 e possui ${Number(quantidade)}`);
        }
    }

    // VERIFICANDO A SEGUNDA CAMPO DO FEN (vez de jogar)

    // Verificando se a segunda campo do FEN é diferente de "w" ou "b"
    if (fen_separado[1] !== 'w' && fen_separado[1] !== 'b') {
        aviso('O segundo campo do FEN não está incorreto, é esperado "w" ou "b"', 'Erro');
        throw new Error('O segundo campo do FEN não está incorreto, é esperado "w" ou "b"');
    }

    // VERIFICANDO O TERCEIRO CAMPO DO FEN (roque)

    // Verificando se o terceiro campo do FEN é diferente de "q", "k", "Q", "K" e "-"
    if (fen_separado[2].match(/[^qk-]/gi)) {
        aviso('O terceiro campo do FEN está incorreto, só é permitido "Q", "K", "q", "k" e "-"', 'Erro');
        throw new Error('O terceiro campo do FEN está incorreto, só é permitido "Q", "K", "q", "k" e "-"');
    }
    // Verificando se tem o "-" com alguma possibilidade de roque (o que é inválido, já que o "-" significa que não tem possibilidade de roque)
    // ex: "-KQkq" ou "KQkq-"
    else if (fen_separado[2].match(/[qk]/gi) !== null && fen_separado[2].match(/[-]/g) !== null) {
        aviso('O terceiro campo do FEN está incorreto, o símbolo "-" deve aparecer sozinho quando não há roques disponíveis', 'Erro');
        throw new Error('O terceiro campo do FEN está incorreto, o símbolo "-" deve aparecer sozinho quando não há roques disponíveis');
    }

    // VERIFICANDO O QUARTO CAMPO DO FEN (en passant)

    // Verificando é uma coordenada de xadrez válida ou não possui
    if (fen_separado[3].match(/[^a-h1-8-]/gi)) {
        aviso('O quarto campo do FEN está incorreto, só é permitido coordenadas de "a" até "h" e "1" até "8" ou "-"', 'Erro');
        throw new Error('O quarto campo do FEN está incorreto, só é permitido coordenadas de "a" até "h" e "1" até "8" ou "-"');
    }
    // Verificando se tem o "-" com alguma possibilidade de enpassant (o que é inválido, já que o "-" significa que não tem possibilidade de enpassant)
    // ex: "-e4" ou "e4-"
    else if (fen_separado[3].match(/[a-h1-8]/gi) !== null && fen_separado[3].match(/[-]/g) !== null) {
        aviso('O quarto campo do FEN está incorreto, o símbolo "-" deve aparecer sozinho quando não há enpassant disponíveis', 'Erro');
        throw new Error('O quarto campo do FEN está incorreto, o símbolo "-" deve aparecer sozinho quando não há enpassant disponíveis');
    }

    // VERIFICANDO O QUINTO CAMPO DO FEN (contador de meio-lances)

    if (fen_separado[4].match(/[^0-9]/g) !== null) {
        aviso('O quinto campo do FEN está incorreto, só é permitido número nesse campo', 'Erro');
        throw new Error('O quinto campo do FEN está incorreto, só é permitido número nesse campo');
    }

    // VERIFICANDO O SEXTO CAMPO DO FEN (contador de lances da partida)

    if (fen_separado[5].match(/[^0-9]/g) !== null) {
        aviso('O sexto campo do FEN está incorreto, só é permitido número nesse campo', 'Erro');
        throw new Error('O sexto campo do FEN está incorreto, só é permitido número nesse campo');
    } else if (fen_separado[5] == 0) {
        aviso('O sexto campo do FEN está incorreto, não começa em "0" e sim em "1"', 'Erro');
        throw new Error('O sexto campo do FEN está incorreto, não começa em "0" e sim em "1"');
    }
}

function limparTextoRelatorioMovimento(){
    document.getElementById("movimentos_peao").innerHTML = "";
    document.getElementById("movimentos_cavalo").innerHTML = "";
    document.getElementById("movimentos_bispo").innerHTML = "";
    document.getElementById("movimentos_torre").innerHTML = "";
    document.getElementById("movimentos_rainha").innerHTML = "";
    document.getElementById("movimentos_rei").innerHTML = "";
}

function gerarRelatorioMovimento(){
    limparTextoRelatorioMovimento();

    document.getElementById("titulo_relatorio").textContent = (partida_real.jogando == "w") ? "Relatório das brancas" : "Relatório das pretas";
    
    // Todos os movimentos estão em binário (por isso está sendo utilizando o "converteBinarioParaCoordenada")
    const todosMovimentosECaptura = Calcular.todos_possiveis_movimentos_de_todas_pecas(partida_real.jogando);
    const elementoRelatorioPeao = document.getElementById("movimentos_peao");
    let estaVazio = true;

    todosMovimentosECaptura.peao.map((movimento) => {
        const origem = converteBinarioParaCoordenada(movimento.origem);
        const destino = movimento.destino.movimentos.map((movimento_destino) => { return converteBinarioParaCoordenada(movimento_destino); }).join(", ")
        if(destino){
            elementoRelatorioPeao.innerHTML += `${origem} -> ${destino}<br />`
            estaVazio = false;
        }
    });

    (estaVazio == true) ? document.getElementById("container_movimentos_peao").style = "display: none" : document.getElementById("container_movimentos_peao").style = ""


    const elementoRelatorioCavalo = document.getElementById("movimentos_cavalo");
    estaVazio = true;

    todosMovimentosECaptura.cavalo.map((movimento) => {
        const origem = converteBinarioParaCoordenada(movimento.origem);
        const destino = movimento.destino.movimentos.map((movimento_destino) => { return converteBinarioParaCoordenada(movimento_destino); }).join(", ")
        if(destino){
            elementoRelatorioCavalo.innerHTML += `${origem} -> ${destino}<br />`
            estaVazio = false;
        }
    });

    (estaVazio == true) ? document.getElementById("container_movimentos_cavalo").style = "display: none" : document.getElementById("container_movimentos_cavalo").style = ""
  

    document.getElementById("container_movimentos_bispo").style = ""

    const elementoRelatorioBispo = document.getElementById("movimentos_bispo");
    estaVazio = true;

    todosMovimentosECaptura.bispo.map((movimento) => {
        const origem = converteBinarioParaCoordenada(movimento.origem);
        const destino = movimento.destino.movimentos.map((movimento_destino) => { return converteBinarioParaCoordenada(movimento_destino); }).join(", ")
        if(destino){
            elementoRelatorioBispo.innerHTML += `${origem} -> ${destino}<br />`
            estaVazio = false;
        }
    });

    (estaVazio == true) ? document.getElementById("container_movimentos_bispo").style = "display: none" : document.getElementById("container_movimentos_bispo").style = ""


    const elementoRelatorioTorre = document.getElementById("movimentos_torre");
    estaVazio = true;

    todosMovimentosECaptura.torre.map((movimento) => {
        const origem = converteBinarioParaCoordenada(movimento.origem);
        const destino = movimento.destino.movimentos.map((movimento_destino) => { return converteBinarioParaCoordenada(movimento_destino); }).join(", ")
        if(destino){
            elementoRelatorioTorre.innerHTML += `${origem} -> ${destino}<br />`
            estaVazio = false;
        }
    });
   
    (estaVazio == true) ? document.getElementById("container_movimentos_torre").style = "display: none" : document.getElementById("container_movimentos_torre").style = ""


    const elementoRelatorioRainha = document.getElementById("movimentos_rainha");
    estaVazio = true;

    todosMovimentosECaptura.rainha.map((movimento) => {
        const origem = converteBinarioParaCoordenada(movimento.origem);
        const destino = movimento.destino.movimentos.map((movimento_destino) => { return converteBinarioParaCoordenada(movimento_destino); }).join(", ")
        if(destino){
            elementoRelatorioRainha.innerHTML += `${origem} -> ${destino}<br />`
            estaVazio = false;
        }
    });
   
    (estaVazio == true) ? document.getElementById("container_movimentos_rainha").style = "display: none" : document.getElementById("container_movimentos_rainha").style = ""


    const elementoRelatorioRei = document.getElementById("movimentos_rei");
    estaVazio = true;

    todosMovimentosECaptura.rei.map((movimento) => {
        const origem = converteBinarioParaCoordenada(movimento.origem);
        const destino = movimento.destino.movimentos.map((movimento_destino) => { return converteBinarioParaCoordenada(movimento_destino); }).join(", ")
        if(destino){
            elementoRelatorioRei.innerHTML += `${origem} -> ${destino}<br />`
            estaVazio = false;
        }
    });

    (estaVazio == true) ? document.getElementById("container_movimentos_rei").style = "display: none" : document.getElementById("container_movimentos_rei").style = ""
}

function limparTextoRelatorioCaptura(){
    document.getElementById("capturas_peao").innerHTML = "";
    document.getElementById("capturas_cavalo").innerHTML = "";
    document.getElementById("capturas_bispo").innerHTML = "";
    document.getElementById("capturas_torre").innerHTML = "";
    document.getElementById("capturas_rainha").innerHTML = "";
    document.getElementById("capturas_rei").innerHTML = "";
}

function gerarRelatorioCaptura(){
    limparTextoRelatorioCaptura();

    document.getElementById("titulo_relatorio").textContent = (partida_real.jogando == "w") ? "Relatório das brancas" : "Relatório das pretas";

    // Todos as capturas estão em binário (por isso está sendo utilizando o "converteBinarioParaCoordenada")
    const todosMovimentosECaptura = Calcular.todos_possiveis_movimentos_de_todas_pecas(partida_real.jogando);
    const elementoRelatorioPeao = document.getElementById("capturas_peao");
    let estaVazio = true;

    todosMovimentosECaptura.peao.map((movimento) => {
        const origem = converteBinarioParaCoordenada(movimento.origem);
        const destino = movimento.destino.capturas.map((movimento_destino) => { return converteBinarioParaCoordenada(movimento_destino); }).join(", ")
        if(destino){
            elementoRelatorioPeao.innerHTML += `${origem} -> ${destino}<br />`
            estaVazio = false;
        }
    });

    (estaVazio == true) ? document.getElementById("container_capturas_peao").style = "display: none" : document.getElementById("container_capturas_peao").style = ""

    
    const elementoRelatorioCavalo = document.getElementById("capturas_cavalo");
    estaVazio = true;

    todosMovimentosECaptura.cavalo.map((movimento) => {
        const origem = converteBinarioParaCoordenada(movimento.origem);
        const destino = movimento.destino.capturas.map((movimento_destino) => { return converteBinarioParaCoordenada(movimento_destino); }).join(", ")
        if(destino){
            elementoRelatorioCavalo.innerHTML += `${origem} -> ${destino}<br />`
            estaVazio = false;
        }
    });

    (estaVazio == true) ? document.getElementById("container_capturas_cavalo").style = "display: none" : document.getElementById("container_capturas_cavalo").style = ""
  

    document.getElementById("container_capturas_bispo").style = ""

    const elementoRelatorioBispo = document.getElementById("capturas_bispo");
    estaVazio = true;

    todosMovimentosECaptura.bispo.map((movimento) => {
        const origem = converteBinarioParaCoordenada(movimento.origem);
        const destino = movimento.destino.capturas.map((movimento_destino) => { return converteBinarioParaCoordenada(movimento_destino); }).join(", ")
        if(destino){
            elementoRelatorioBispo.innerHTML += `${origem} -> ${destino}<br />`
            estaVazio = false;
        }
    });

    (estaVazio == true) ? document.getElementById("container_capturas_bispo").style = "display: none" : document.getElementById("container_capturas_bispo").style = ""


    const elementoRelatorioTorre = document.getElementById("capturas_torre");
    estaVazio = true;

    todosMovimentosECaptura.torre.map((movimento) => {
        const origem = converteBinarioParaCoordenada(movimento.origem);
        const destino = movimento.destino.capturas.map((movimento_destino) => { return converteBinarioParaCoordenada(movimento_destino); }).join(", ")
        if(destino){
            elementoRelatorioTorre.innerHTML += `${origem} -> ${destino}<br />`
            estaVazio = false;
        }
    });
   
    (estaVazio == true) ? document.getElementById("container_capturas_torre").style = "display: none" : document.getElementById("container_capturas_torre").style = ""


    const elementoRelatorioRainha = document.getElementById("capturas_rainha");
    estaVazio = true;

    todosMovimentosECaptura.rainha.map((movimento) => {
        const origem = converteBinarioParaCoordenada(movimento.origem);
        const destino = movimento.destino.capturas.map((movimento_destino) => { return converteBinarioParaCoordenada(movimento_destino); }).join(", ")
        if(destino){
            elementoRelatorioRainha.innerHTML += `${origem} -> ${destino}<br />`
            estaVazio = false;
        }
    });
   
    (estaVazio == true) ? document.getElementById("container_capturas_rainha").style = "display: none" : document.getElementById("container_capturas_rainha").style = ""


    const elementoRelatorioRei = document.getElementById("capturas_rei");
    estaVazio = true;

    todosMovimentosECaptura.rei.map((movimento) => {
        const origem = converteBinarioParaCoordenada(movimento.origem);
        const destino = movimento.destino.capturas.map((movimento_destino) => { return converteBinarioParaCoordenada(movimento_destino); }).join(", ")
        if(destino){
            elementoRelatorioRei.innerHTML += `${origem} -> ${destino}<br />`
            estaVazio = false;
        }
    });

    (estaVazio == true) ? document.getElementById("container_capturas_rei").style = "display: none" : document.getElementById("container_capturas_rei").style = ""
}

function limparTextoRelatorioMovimentoEspecial(){
    document.getElementById("en_passant").innerHTML = "";
    document.getElementById("roque").innerHTML = "";
}

function gerarRelatorioMovimentoEspecial(){
    limparTextoRelatorioMovimentoEspecial();

    document.getElementById("titulo_relatorio").textContent = (partida_real.jogando == "w") ? "Relatório das brancas" : "Relatório das pretas";

    // Todos as capturas estão em binário (por isso está sendo utilizando o "converteBinarioParaCoordenada")
    const todosMovimentosECaptura = Calcular.todos_possiveis_movimentos_de_todas_pecas(partida_real.jogando);
    const elementoRelatorioPeao = document.getElementById("en_passant");
    let estaVazio = true;

    todosMovimentosECaptura.peao.map((movimento) => {
        const origem = converteBinarioParaCoordenada(movimento.origem);
        const destino = movimento.destino.en_passant.map((movimento_destino) => { return converteBinarioParaCoordenada(movimento_destino); }).join(", ")
        if(destino){
            elementoRelatorioPeao.innerHTML += `${origem} -> ${destino}<br />`
            estaVazio = false;
        }
    });

    (estaVazio == true) ? document.getElementById("container_en_passant").style = "display: none" : document.getElementById("container_en_passant").style = ""

    
    const elementoRelatorioRei = document.getElementById("roque");
    estaVazio = true;

    todosMovimentosECaptura.rei.map((movimento) => {
        const origem = converteBinarioParaCoordenada(movimento.origem);
        let destino = movimento.destino.roque_direita.map((movimento_destino) => { return converteBinarioParaCoordenada(movimento_destino); }).join(", ")
        if(destino){
            elementoRelatorioRei.innerHTML += `${origem} -> ${destino}<br />`
            estaVazio = false;
        }

        destino = movimento.destino.roque_esquerda.map((movimento_destino) => { return converteBinarioParaCoordenada(movimento_destino); }).join(", ")
        if(destino){
            elementoRelatorioRei.innerHTML += `${origem} -> ${destino}<br />`
            estaVazio = false;
        }
    });

    (estaVazio == true) ? document.getElementById("container_roque").style = "display: none" : document.getElementById("container_roque").style = ""
  
}