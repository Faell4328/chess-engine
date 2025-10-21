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

    // Verificando se o primeiro campo do FEN não possui mais de dois reis
    if (fen_separado[0].match(/[k]/gi).length !== 2) {
        aviso('O primeiro campo do FEN está incorreto, o FEN tem que ter 2 reis, nem menos e nem mais', 'Erro');
        throw new Error('O primeiro campo do FEN está incorreto, o FEN tem que ter 2 reis, nem menos e nem mais');
    }

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

function geradorTabuleiroASCII(bitboard_origem, cor, bitboard_casas_possiveis) {
    let casas_tabuleiro = [64];

    let tabuleiro = '';
    let casa_origem = '';
    let peca_origem = '';
    let casas_possiveis = bitboard_casas_possiveis.toString(2).padStart(64, '0').split('').reverse().join('');

    // Verificando se é alguma peça especifica
    if (bitboard_origem != null) {
        casa_origem = bitboard_origem.toString(2).padStart(64, '0').split('').reverse().join('');
        peca_origem = identificarPecaMovida(bitboard_origem);

        switch (peca_origem) {
            case 'p':
                tabuleiro += `<p style="text-align: center; padding: 0px; margin: 0px">Peão de ${converteBinarioParaCoordenada(bitboard_origem)}</p>\n\n`;
                break;
            case 'n':
                tabuleiro += `<p style="text-align: center; padding: 0px; margin: 0px">Cavalo de ${converteBinarioParaCoordenada(bitboard_origem)}</p>\n\n`;
                break;
            case 'b':
                tabuleiro += `<p style="text-align: center; padding: 0px; margin: 0px">Bispo de ${converteBinarioParaCoordenada(bitboard_origem)}</p>\n\n`;
                break;
            case 'r':
                tabuleiro += `<p style="text-align: center; padding: 0px; margin: 0px">Torre de ${converteBinarioParaCoordenada(bitboard_origem)}</p>\n\n`;
                break;
            case 'q':
                tabuleiro += `<p style="text-align: center; padding: 0px; margin: 0px">Rainha de ${converteBinarioParaCoordenada(bitboard_origem)}</p>\n\n`;
                break;
            case 'k':
                tabuleiro += `<p style="text-align: center; padding: 0px; margin: 0px">Rei de ${converteBinarioParaCoordenada(bitboard_origem)}</p>\n\n`;
                break;
        }
    } else {
        peca_origem = 'todas';
        tabuleiro += cor == 'w' ? 'Todas as casas atacadas pelas brancas\n\n' : 'Todas as casas atacadas pelas pretas\n\n';
    }

    for (let contador = 0; contador < 64; contador++) {
        if (casa_origem[contador] == '1') {
            if (cor == 'w') {
                casas_tabuleiro[contador] = peca_origem.toUpperCase();
            } else {
                casas_tabuleiro[contador] = peca_origem;
            }
        } else if (casas_possiveis[contador] == '1') {
            casas_tabuleiro[contador] = 'X';
        } else {
            casas_tabuleiro[contador] = '-';
        }
    }

    tabuleiro += '   +-----------------+\n';
    for (let contador = 7; contador >= 0; contador--) {
        tabuleiro += `${contador + 1}  | ${casas_tabuleiro[contador * 8]} ${casas_tabuleiro[contador * 8 + 1]} ${casas_tabuleiro[contador * 8 + 2]} ${casas_tabuleiro[contador * 8 + 3]} ${casas_tabuleiro[contador * 8 + 4]} ${casas_tabuleiro[contador * 8 + 5]} ${casas_tabuleiro[contador * 8 + 6]} ${casas_tabuleiro[contador * 8 + 7]} |\n`;
    }
    tabuleiro += '   +-----------------+\n';
    tabuleiro += '     a b c d e f g h  \n';

    //gerarRelatorioAtacados(peca_origem, tabuleiro);
    return tabuleiro;
}

function limparTextoRelatorio(campo) {
    let elementos = ['p', 'n', 'b', 'r', 'q', 'k'];
    for (let peca of elementos) {
        const elementoRelatorio = document.getElementById(`container_${campo}_${peca}`);
        elementoRelatorio.innerHTML = '';
    }
}

function gerarRelatorioMovimento(movimentos) {
    limparTextoRelatorio('movimentos');

    let tabuleiro = '';
    const elementos = ['p', 'n', 'b', 'r', 'q', 'k'];
    const todosMovimentosDaPeca = [movimentos.peao, movimentos.cavalo, movimentos.bispo, movimentos.torre, movimentos.rainha, movimentos.rei];

    for (let cont = 0; cont < elementos.length; cont++) {
        const elementoRelatorio = document.getElementById(`container_movimentos_${elementos[cont]}`);

        todosMovimentosDaPeca[cont].map((movimento) => {
            let bitboard_movimentos_possiveis = 0n;

            for (destino of movimento.destino.movimentos) {
                bitboard_movimentos_possiveis |= destino;
            }

            tabuleiro = geradorTabuleiroASCII(movimento.origem, partida_real.jogando, bitboard_movimentos_possiveis);

            let elemento_criado = document.createElement('span');
            elemento_criado.style.border = '1px solid #000';
            elemento_criado.style.padding = '30px';
            elemento_criado.style.fontFamily = 'monospace';
            elemento_criado.style.whiteSpace = 'pre';
            elemento_criado.innerHTML = tabuleiro;
            elementoRelatorio.appendChild(elemento_criado);
        });
    }
}

function gerarRelatorioCaptura(capturas) {
    limparTextoRelatorio('capturas');

    const elementos = ['p', 'n', 'b', 'r', 'q', 'k'];
    const todasCapturasDaPeca = [capturas.peao, capturas.cavalo, capturas.bispo, capturas.torre, capturas.rainha, capturas.rei];

    for (let cont = 0; cont < elementos.length; cont++) {
        const elementoRelatorio = document.getElementById(`container_capturas_${elementos[cont]}`);

        todasCapturasDaPeca[cont].map((movimento) => {
            let bitboard_movimentos_possiveis = 0n;

            for (destino of movimento.destino.capturas) {
                bitboard_movimentos_possiveis |= destino;
            }

            tabuleiro = geradorTabuleiroASCII(movimento.origem, partida_real.jogando, bitboard_movimentos_possiveis);

            let elemento_criado = document.createElement('span');
            elemento_criado.style.border = '1px solid #000';
            elemento_criado.style.padding = '30px';
            elemento_criado.style.fontFamily = 'monospace';
            elemento_criado.style.whiteSpace = 'pre';
            elemento_criado.innerHTML = tabuleiro;
            elementoRelatorio.appendChild(elemento_criado);
        });
    }
}

function gerarRelatorioMovimentoEspecial(movimentos_especiais) {
    // Limpando relatórios antigos
    document.getElementById('container_en_passant').innerHTML = '';
    document.getElementById('container_roque').innerHTML = '';

    const elementos = ['en_passant', 'roque'];
    const todasCapturasDaPeca = [capturas.peao, capturas.cavalo, capturas.bispo, capturas.torre, capturas.rainha, capturas.rei];

    for (let cont = 0; cont < elementos.length; cont++) {
        const elementoRelatorio = document.getElementById(`container_capturas_${elementos[cont]}`);

        todasCapturasDaPeca[cont].map((movimento) => {
            let bitboard_movimentos_possiveis = 0n;

            for (destino of movimento.destino.capturas) {
                bitboard_movimentos_possiveis |= destino;
            }

            tabuleiro = geradorTabuleiroASCII(movimento.origem, partida_real.jogando, bitboard_movimentos_possiveis);

            let elemento_criado = document.createElement('span');
            elemento_criado.style.border = '1px solid #000';
            elemento_criado.style.padding = '30px';
            elemento_criado.style.fontFamily = 'monospace';
            elemento_criado.style.whiteSpace = 'pre';
            elemento_criado.innerHTML = tabuleiro;
            elementoRelatorio.appendChild(elemento_criado);
        });
    }
}

function gerarRelatorioMovimentoEspecial(movimentos_especiais) {
    // Limpando relatórios antigos
    document.getElementById('container_en_passant').innerHTML = '';
    document.getElementById('container_roque').innerHTML = '';

    movimentos_especiais.peao.map((movimento) => {
        let bitboard_movimentos_possiveis = 0n;

        if (movimento.destino.en_passant[0] !== undefined) {
            tabuleiro = geradorTabuleiroASCII(movimento.origem, partida_real.jogando, movimento.destino.en_passant[0]);

            let elemento_criado = document.createElement('span');
            elemento_criado.style.border = '1px solid #000';
            elemento_criado.style.padding = '30px';
            elemento_criado.style.fontFamily = 'monospace';
            elemento_criado.style.whiteSpace = 'pre';
            elemento_criado.innerHTML = tabuleiro;
            document.getElementById('container_en_passant').appendChild(elemento_criado);
        }
    });

    if (movimentos_especiais.rei[0].destino.roque_esquerda[0] !== undefined) {
        tabuleiro = geradorTabuleiroASCII(movimentos_especiais.rei[0].origem, partida_real.jogando, movimentos_especiais.rei[0].destino.roque_esquerda[0]);

        let elemento_criado = document.createElement('span');
        elemento_criado.style.border = '1px solid #000';
        elemento_criado.style.padding = '30px';
        elemento_criado.style.fontFamily = 'monospace';
        elemento_criado.style.whiteSpace = 'pre';
        elemento_criado.innerHTML = tabuleiro;
        document.getElementById('container_roque').appendChild(elemento_criado);
    }

    if (movimentos_especiais.rei[0].destino.roque_direita[0] !== undefined) {
        tabuleiro = geradorTabuleiroASCII(movimentos_especiais.rei[0].origem, partida_real.jogando, movimentos_especiais.rei[0].destino.roque_direita[0]);

        let elemento_criado = document.createElement('span');
        elemento_criado.style.border = '1px solid #000';
        elemento_criado.style.padding = '30px';
        elemento_criado.style.fontFamily = 'monospace';
        elemento_criado.style.whiteSpace = 'pre';
        elemento_criado.innerHTML = tabuleiro;
        document.getElementById('container_roque').appendChild(elemento_criado);
    }
}

function limparTextoRelatorioAtacados() {
    let elementos = ['p', 'n', 'b', 'r', 'q', 'k', 'todas'];
    for (let peca of elementos) {
        const elementoRelatorio = document.getElementById(`container_atacando_${peca}`);
        elementoRelatorio.innerHTML = '';
    }
}
function gerarRelatorioAtacados(bitboard_origem, cor, bitboard_casas_atacadas) {
    let elementoRelatorio;

    if (bitboard_origem == null) {
        elementoRelatorio = document.getElementById(`container_atacando_todas`);
    } else {
        elementoRelatorio = document.getElementById(`container_atacando_${identificarPecaMovida(bitboard_origem)}`);
    }

    const tabuleiro = geradorTabuleiroASCII(bitboard_origem, cor, bitboard_casas_atacadas);

    let elemento_criado = document.createElement('span');
    elemento_criado.style.border = '1px solid #000';
    elemento_criado.style.padding = '30px';
    elemento_criado.style.fontFamily = 'monospace';
    elemento_criado.style.whiteSpace = 'pre';
    elemento_criado.innerHTML = tabuleiro;
    elementoRelatorio.appendChild(elemento_criado);
}
