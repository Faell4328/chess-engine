// Arquivo principal

class Chess {
    static fim_do_jogo = false;
    // ex: 4096n (e2)
    static origem = null;
    // ex: 268435456n (e4)
    static destino = null;
    // "n", "b", "r" ou "q" (default)
    static promocao = null;
    // "movimento", "captura", "promocao", "Emapte", "xeque", "xeque mate" ou null (default)
    static status = null;

    static mover(origem, destino) {
        if (Chess.fim_do_jogo == true) {
            aviso('Jogo finalizado, inicie uma nova partida ou carregue um FEN personalizado', 'Aviso');
            return 'snapback';
        }

        // Verificar se a casa de origem e destino é a mesma
        if (origem == destino) {
            return 'snapback';
        }

        Chess.status = null;
        Chess.origem = converterCoordenadaParaBinario(origem.toLowerCase());
        Chess.destino = converterCoordenadaParaBinario(destino.toLowerCase());

        try {
            verificarVezJogando(Chess.origem);
            zerarEnPassant(partida_real.jogando);
            let peca_movida = identificarPecaMovida(Chess.origem);

            switch (peca_movida) {
                case 'p':
                    Peao.validar(Chess.origem, Chess.destino, Chess.promocao);
                    break;
                case 'n':
                    Cavalo.validar(Chess.origem, Chess.destino);
                    break;
                case 'b':
                    Bispo.validar(Chess.origem, Chess.destino);
                    break;
                case 'r':
                    Torre.validar(Chess.origem, Chess.destino);
                    break;
                case 'q':
                    Dama.validar(Chess.origem, Chess.destino);
                    break;
                case 'k':
                    Rei.validar(Chess.origem, Chess.destino);
                    break;
            }

            // Atualizando as casas atacadas depois de ter válidado e realizado o movimento
            Calcular.casas_atacadas();
            // Verificando se os reis estão atacados (atualizando o status)
            Calcular.se_rei_atacado('w');
            Calcular.se_rei_atacado('b');

            sincronizar_partida_real_com_partida_simulada();

            // Caso seja as pretas jogando implementa +1 no contador da partida
            if (partida_real.jogando == 'b') {
                partida_real.numero_lances_completo += 1;
            }

            verificarSeTorreCapturada(Chess.destino);

            // Invertendo a vez de jodar
            partida_real.jogando = partida_real.jogando == 'w' ? 'b' : 'w';

            Calcular.se_rei_tem_escaptoria(partida_real.jogando);

            verificarRepticaoFen();

            document.getElementById('titulo_relatorio').textContent = partida_real.jogando == 'w' ? 'Relatório das brancas' : 'Relatório das pretas';
            const todosMovimentosECaptura = Calcular.todos_possiveis_movimentos_de_todas_pecas(partida_real.jogando);
            gerarRelatorioMovimento(todosMovimentosECaptura);
            gerarRelatorioCaptura(todosMovimentosECaptura);
            gerarRelatorioMovimentoEspecial(todosMovimentosECaptura);
            console.clear();
            Calcular.casas_atacadas(true);

            return;
        } catch (error) {
            aviso(error.message, 'Erro');
            return 'snapback';
        }
    }
}

class Peao {
    // Método principal, responsável por verificar se o movimento é válido, se for efetivar
    static validar(origem, destino, promocao) {
        // Calculandos os movimentos legais da peça
        let movimentos_possiveis = Calcular.todos_ataques_e_movimentos_do_peao(partida_real.jogando, origem);

        // Verificando se o lance feito é um lance inválido
        if (movimentos_possiveis.todos.includes(destino) == false) {
            throw new Error('Movimento inválido');
        }

        Chess.promocao = verificarPromocao(Chess.origem, Chess.destino);

        // Verificando se foi feito um en passant
        if (movimentos_possiveis.en_passant.length > 0 && movimentos_possiveis.en_passant.includes(destino)) {
            Peao.efetuar_en_passant(origem, destino);
            Chess.status = 'captura';
            iniciarSom('captura');
        }
        // Verificando se foi feito uma captura
        else if (movimentos_possiveis.capturas.length > 0 && movimentos_possiveis.capturas.includes(destino)) {
            efetuar_captura(origem, destino, 'p');
            Chess.status = 'captura';
            iniciarSom('captura');
        }
        // Feito um movimento
        else {
            const destino_esperado_duplo = partida_real.jogando == 'w' ? origem << informacoes_xadrez.movimento_peao[1] : origem >> informacoes_xadrez.movimento_peao[1];
            const bitboard_peao_adversario = partida_real.jogando == 'w' ? partida_simulada.bitboard_peao_preto : partida_simulada.bitboard_peao_branco;
            const bitboard_com_en_passant = partida_real.jogando == 'w' ? origem << informacoes_xadrez.movimento_peao[0] : origem >> informacoes_xadrez.movimento_peao[0];

            // Verificando se foi feito um movimento duplo AND se tem inimigo ao lado. Se for feito vai atualizar o bitboard de en passant.
            if (destino_esperado_duplo == destino && ((destino << 1n) | ((destino >> 1n) & bitboard_peao_adversario)) != 0n) {
                if (partida_real.jogando == 'w') {
                    partida_simulada.en_passant_brancas = bitboard_com_en_passant;
                } else {
                    partida_simulada.en_passant_pretas = bitboard_com_en_passant;
                }
            }
            efetuar_movimento(origem, destino, 'p');
            Chess.status = 'movimento';
            iniciarSom('movimento');
        }

        // Entra se tiver promocao
        if (Calcular.se_tem_promocao(partida_real.jogando)) {
            if (partida_real.jogando == 'w') {
                if (promocao == 'r') {
                    partida_simulada.bitboard_torre_branco ^= partida_simulada.bitboard_peao_branco & destino;
                } else if (promocao == 'b') {
                    partida_simulada.bitboard_bispo_branco ^= partida_simulada.bitboard_peao_branco & destino;
                } else if (promocao == 'n') {
                    partida_simulada.bitboard_cavalo_branco ^= partida_simulada.bitboard_peao_branco & destino;
                } else {
                    partida_simulada.bitboard_rainha_branco ^= partida_simulada.bitboard_peao_branco & destino;
                }

                partida_simulada.bitboard_peao_branco ^= partida_simulada.bitboard_peao_branco & destino;
            } else {
                if (promocao == 'r') {
                    partida_simulada.bitboard_torre_preto ^= partida_simulada.bitboard_peao_preto & destino;
                } else if (promocao == 'b') {
                    partida_simulada.bitboard_bispo_preto ^= partida_simulada.bitboard_peao_preto & destino;
                } else if (promocao == 'n') {
                    partida_simulada.bitboard_cavalo_preto ^= partida_simulada.bitboard_peao_preto & destino;
                } else {
                    partida_simulada.bitboard_rainha_preto ^= partida_simulada.bitboard_peao_preto & destino;
                }

                partida_simulada.bitboard_peao_preto ^= partida_simulada.bitboard_peao_preto & destino;
            }
        }

        return;
    }

    static efetuar_en_passant(origem, destino) {
        // Brancas jogam
        if (partida_real.jogando == 'w') {
            partida_simulada.bitboard_peao_preto ^= partida_simulada.en_passant_pretas >> informacoes_xadrez.movimento_peao[0];
            partida_simulada.en_passant_pretas = 0n;
        }
        // Pretas jogam
        else {
            partida_simulada.bitboard_peao_branco ^= partida_simulada.en_passant_brancas << informacoes_xadrez.movimento_peao[0];
            partida_simulada.en_passant_brancas = 0n;
        }

        efetuar_movimento(origem, destino, 'p');
        Chess.status = 'movimento';
        iniciarSom('movimento');
        return;
    }
}

class Cavalo {
    // Método principal, responsável por verificar se o movimento é válido, se for efetivar
    static validar(origem, destino) {
        // Calculandos os movimentos legais da peça
        let movimentos_possiveis = Calcular.todos_ataques_e_movimentos_do_cavalo(partida_real.jogando, origem);

        // Verificando se o lance feito é um lance inválido
        if (movimentos_possiveis.todos.includes(destino) == false) {
            throw new Error('Movimento inválido');
        }

        // Verificando se foi feito uma captura
        else if (movimentos_possiveis.capturas.length > 0 && movimentos_possiveis.capturas.includes(destino)) {
            efetuar_captura(origem, destino, 'n');
            Chess.status = 'captura';
            iniciarSom('captura');
        }
        // Feito um movimento
        else {
            efetuar_movimento(origem, destino, 'n');
            Chess.status = 'movimento';
            iniciarSom('movimento');
        }

        return;
    }
}

class Bispo {
    // Método principal, responsável por verificar se o movimento é válido, se for efetivar
    static validar(origem, destino) {
        // Calculandos os movimentos possiveis referente a peça
        let movimentos_possiveis = Calcular.todos_ataques_e_movimentos_do_bispo(partida_real.jogando, origem);

        // Verificando se o lance feito é um lance inválido
        if (movimentos_possiveis.todos.includes(destino) == false) {
            throw new Error('Movimento inválido');
        }

        // Verificando se foi feito uma captura
        else if (movimentos_possiveis.capturas.length > 0 && movimentos_possiveis.capturas.includes(destino)) {
            efetuar_captura(origem, destino, 'b');
            Chess.status = 'captura';
            iniciarSom('captura');
        }
        // Feito um movimento
        else {
            efetuar_movimento(origem, destino, 'b');
            Chess.status = 'movimento';
            iniciarSom('movimento');
        }

        return;
    }
}

class Torre {
    // Método principal, responsável por verificar se o movimento é válido, se for efetivar
    static validar(origem, destino) {
        // Calculandos os movimentos possiveis referente a peça
        let movimentos_possiveis = Calcular.todos_ataques_e_movimentos_do_torre(partida_real.jogando, origem);

        // Verificando se o lance feito é um lance inválido
        if (movimentos_possiveis.todos.includes(destino) == false) {
            throw new Error('Movimento inválido');
        }

        // Verificando se foi feito uma captura
        else if (movimentos_possiveis.capturas.length > 0 && movimentos_possiveis.capturas.includes(destino)) {
            efetuar_captura(origem, destino, 'r');
            Chess.status = 'captura';
            iniciarSom('captura');
        }
        // Feito um movimento
        else {
            efetuar_movimento(origem, destino, 'r');
            Chess.status = 'movimento';
            iniciarSom('movimento');
        }

        return;
    }
}

class Dama {
    // Método principal, responsável por verificar se o movimento é válido, se for efetivar
    static validar(origem, destino) {
        // Calculandos os movimentos legais da peça
        let movimentos_possiveis = Calcular.todos_ataques_e_movimentos_do_rainha(partida_real.jogando, origem);

        // Verificando se o lance feito é um lance inválido
        if (movimentos_possiveis.todos.includes(destino) == false) {
            throw new Error('Movimento inválido');
        }

        // Verificando se foi feito uma captura
        else if (movimentos_possiveis.capturas.length > 0 && movimentos_possiveis.capturas.includes(destino)) {
            efetuar_captura(origem, destino, 'q');
            Chess.status = 'captura';
            iniciarSom('captura');
        }
        // Feito um movimento
        else {
            efetuar_movimento(origem, destino, 'q');
            Chess.status = 'movimento';
            iniciarSom('movimento');
        }

        return;
    }
}

class Rei {
    // Método principal, responsável por verificar se o movimento é válido, se for efetivar
    static validar(origem, destino) {
        // Calculandos os movimentos legais da peça
        let movimentos_possiveis = Calcular.todos_ataques_e_movimentos_do_rei(partida_real.jogando, origem);

        // Verificando se o lance feito é um lance inválido
        if (movimentos_possiveis.todos.includes(destino) == false) {
            throw new Error('Movimento inválido');
        }
        // Verificando se foi feito roque para esquerda
        else if (movimentos_possiveis.roque_esquerda.length > 0 && movimentos_possiveis.roque_esquerda.includes(destino)) {
            Rei.efetuar_roque_esquerda(origem, destino);
        }
        // Verificando se foi feito roque para direita
        else if (movimentos_possiveis.roque_direita.length > 0 && movimentos_possiveis.roque_direita.includes(destino)) {
            Rei.efetuar_roque_direita(origem, destino);
        }
        // Verificando se foi feito uma captura
        else if (movimentos_possiveis.capturas.length > 0 && movimentos_possiveis.capturas.includes(destino)) {
            efetuar_captura(origem, destino, 'k');
            Chess.status = 'captura';
            iniciarSom('captura');
        }
        // Feito um movimento
        else {
            efetuar_movimento(origem, destino, 'k');
            Chess.status = 'movimento';
            iniciarSom('movimento');
        }

        return;
    }

    static efetuar_roque_esquerda() {
        // Brancas jogam
        if (partida_real.jogando == 'w') {
            partida_simulada.bitboard_torre_branco = (partida_real.bitboard_torre_branco ^ 0x0000000000000001n) | informacoes_xadrez.casa_destino_torre_roque_esquerda_branco;
            partida_simulada.bitboard_rei_branco = informacoes_xadrez.casa_destino_rei_roque_esquerda_branco;
            partida_simulada.status_roque_esquerda_branco = false;
            partida_simulada.status_roque_direita_branco = false;
            atualizarTabuleiro();
            Chess.status = 'movimento';
            iniciarSom('movimento');
            return;
        }

        // Pretas jogam
        else {
            partida_simulada.bitboard_torre_preto = (partida_real.bitboard_torre_preto ^ 0x0100000000000000n) | informacoes_xadrez.casa_destino_torre_roque_esquerda_preto;
            partida_simulada.bitboard_rei_preto = informacoes_xadrez.casa_destino_rei_roque_esquerda_preto;
            partida_simulada.status_roque_esquerda_preto = false;
            partida_simulada.status_roque_direita_preto = false;
            atualizarTabuleiro();
            Chess.status = 'movimento';
            iniciarSom('movimento');
            return;
        }
    }

    static efetuar_roque_direita() {
        // Brancas jogam
        if (partida_real.jogando == 'w') {
            partida_simulada.bitboard_torre_branco = (partida_simulada.bitboard_torre_branco ^ 0x0000000000000080n) | informacoes_xadrez.casa_destino_torre_roque_direita_branco;
            partida_simulada.bitboard_rei_branco = informacoes_xadrez.casa_destino_rei_roque_direita_branco;
            partida_simulada.status_roque_esquerda_branco = false;
            partida_simulada.status_roque_direita_branco = false;
            atualizarTabuleiro();
            Chess.status = 'movimento';
            iniciarSom('movimento');
            return;
        }

        // Pretas jogam
        else {
            partida_simulada.bitboard_torre_preto = (partida_simulada.bitboard_torre_preto ^ 0x8000000000000000n) | informacoes_xadrez.casa_destino_torre_roque_direita_preto;
            partida_simulada.bitboard_rei_preto = informacoes_xadrez.casa_destino_rei_roque_direita_preto;
            partida_simulada.status_roque_esquerda_preto = false;
            partida_simulada.status_roque_direita_preto = false;
            atualizarTabuleiro();
            Chess.status = 'movimento';
            iniciarSom('movimento');
            return;
        }
    }
}

// Gera o FEN com base nos bitboards e outra variáveis de controle do jogo
function gerarFenDaPosicao() {
    let fen = '';
    let casas_vazias = 0;
    let posicao_tabuleiro = 0n;

    for (let linha = 0; linha < 8; linha++) {
        for (let coluna = 0; coluna < 8; coluna++) {
            posicao_tabuleiro = posicao_tabuleiro == 0n ? 1n : posicao_tabuleiro * 2n;

            // Verificando se na casa tem peça
            if ((partida_real.bitboard_tabuleiro_completo & posicao_tabuleiro) !== 0n) {
                // Encerrando o contador de casas vazias
                if (casas_vazias != 0) {
                    fen += casas_vazias;
                    casas_vazias = 0;
                }

                // Verificando se é uma peça preta
                if (partida_real.bitboard_pecas_pretas & posicao_tabuleiro) {
                    if (partida_real.bitboard_peao_preto & posicao_tabuleiro) {
                        fen += 'p';
                    } else if (partida_real.bitboard_cavalo_preto & posicao_tabuleiro) {
                        fen += 'n';
                    } else if (partida_real.bitboard_bispo_preto & posicao_tabuleiro) {
                        fen += 'b';
                    } else if (partida_real.bitboard_torre_preto & posicao_tabuleiro) {
                        fen += 'r';
                    } else if (partida_real.bitboard_rainha_preto & posicao_tabuleiro) {
                        fen += 'q';
                    } else if (partida_real.bitboard_rei_preto & posicao_tabuleiro) {
                        fen += 'k';
                    }
                } else {
                    if (partida_real.bitboard_peao_branco & posicao_tabuleiro) {
                        fen += 'P';
                    } else if (partida_real.bitboard_cavalo_branco & posicao_tabuleiro) {
                        fen += 'N';
                    } else if (partida_real.bitboard_bispo_branco & posicao_tabuleiro) {
                        fen += 'B';
                    } else if (partida_real.bitboard_torre_branco & posicao_tabuleiro) {
                        fen += 'R';
                    } else if (partida_real.bitboard_rainha_branco & posicao_tabuleiro) {
                        fen += 'Q';
                    } else if (partida_real.bitboard_rei_branco & posicao_tabuleiro) {
                        fen += 'K';
                    }
                }
            }
            // Casa vazia
            else {
                casas_vazias++;
            }
        }

        // Encerrando o contador de casas vazias
        if (casas_vazias != 0) {
            fen += casas_vazias;
            casas_vazias = 0;
        }

        // Adicionando o "/", com exceção do último
        if (linha < 7) {
            fen += '/';
            casas_vazias = 0;
        }
    }

    // Invertendo a ordem do FEN
    fen = fen.split('/').reverse().join('/');

    // Adicionando de quem é a vez de jogar ao FEN
    fen += ` ${partida_real.jogando}`;

    // Adicionando o(s) direito(s) de roque ao FEN
    let roques = partida_real.status_roque_direita_branco == true ? 'K' : '';
    roques += partida_real.status_roque_esquerda_branco == true ? 'Q' : '';
    roques += partida_real.status_roque_direita_preto == true ? 'k' : '';
    roques += partida_real.status_roque_esquerda_preto == true ? 'q' : '';
    fen += roques == '' ? ' -' : ` ${roques}`;

    // Adicionando o en passanto ao FEN
    if ((partida_real.en_passant_brancas | partida_real.en_passant_pretas) !== 0n) {
        fen += ` ${converteBinarioParaCoordenada(partida_real.en_passant_pretas | partida_real.en_passant_brancas)}`;
    } else {
        fen += ' -';
    }

    // Adicionando o contador da regra dos 50 lances (não implementado) ao FEN
    fen += ' 0';

    // Adicionando o contando de lances do FEN
    fen += ` ${partida_real.numero_lances_completo}`;

    return fen;
}

// Carrega o FEN do usuário na engine
function carregarFenPersonalizado() {
    const campo_input_fen_personalizado = document.getElementById('fen');
    const fen = campo_input_fen_personalizado.value;

    // Verificando se o FEN está vazio
    if (fen == '') {
        aviso('O campo do FEN personalizado está vazio', 'Erro');
        return;
    }

    validarFen(fen);

    Chess.fim_do_jogo = false;

    let fen_separado = fen.split(' ');
    const campo_fen_pecas = fen_separado[0].split('/').reverse();
    const campo_fen_jogando = fen_separado[1];
    const campo_fen_roque = fen_separado[2];
    const campo_fen_en_passant = fen_separado[3];
    const campo_fen_contador_movimento = fen_separado[5];

    // Zerando bitboard das peças
    partida_real.bitboard_peao_branco = 0n;
    partida_real.bitboard_peao_preto = 0n;
    partida_real.bitboard_bispo_branco = 0n;
    partida_real.bitboard_bispo_preto = 0n;
    partida_real.bitboard_cavalo_branco = 0n;
    partida_real.bitboard_cavalo_preto = 0n;
    partida_real.bitboard_torre_branco = 0n;
    partida_real.bitboard_torre_preto = 0n;
    partida_real.bitboard_rainha_branco = 0n;
    partida_real.bitboard_rainha_preto = 0n;
    partida_real.bitboard_rei_branco = 0n;
    partida_real.bitboard_rei_preto = 0n;

    // Bitboard de quem joga
    partida_real.jogando = campo_fen_jogando;
    // Bitboard do contador de lances
    partida_real.numero_lances_completo = campo_fen_contador_movimento;

    // Bitboards do enpassant
    partida_real.en_passant_brancas = campo_fen_jogando == 'b' && campo_fen_en_passant != '-' ? converterCoordenadaParaBinario(campo_fen_en_passant) : 0n;
    partida_real.en_passant_pretas = campo_fen_jogando == 'w' && campo_fen_en_passant != '-' ? converterCoordenadaParaBinario(campo_fen_en_passant) : 0n;

    // Bitboards roque
    partida_real.status_roque_esquerda_branco = campo_fen_roque.indexOf('K') != -1 ? true : false;
    partida_real.status_roque_direita_branco = campo_fen_roque.indexOf('Q') != -1 ? true : false;
    partida_real.status_roque_esquerda_preto = campo_fen_roque.indexOf('k') != -1 ? true : false;
    partida_real.status_roque_direita_preto = campo_fen_roque.indexOf('q') != -1 ? true : false;

    // Percorrendo todas as casas do tabuleiro
    for (let linha = 0; linha < 8; linha++) {
        const elementos_linha_atual = campo_fen_pecas[linha].split('');
        let casas_vazias = 0;

        for (let coluna = 0; coluna < elementos_linha_atual.length; coluna++) {
            let potencia = linha * 8 + (coluna + casas_vazias);
            // É basicamente um ponteiro
            let posicao_tabuleiro = BigInt(2 ** potencia);

            switch (elementos_linha_atual[coluna]) {
                case 'p':
                    partida_real.bitboard_peao_preto |= posicao_tabuleiro;
                    break;
                case 'n':
                    partida_real.bitboard_cavalo_preto |= posicao_tabuleiro;
                    break;
                case 'b':
                    partida_real.bitboard_bispo_preto |= posicao_tabuleiro;
                    break;
                case 'r':
                    partida_real.bitboard_torre_preto |= posicao_tabuleiro;
                    break;
                case 'q':
                    partida_real.bitboard_rainha_preto |= posicao_tabuleiro;
                    break;
                case 'k':
                    partida_real.bitboard_rei_preto |= posicao_tabuleiro;
                    break;

                case 'P':
                    partida_real.bitboard_peao_branco |= posicao_tabuleiro;
                    break;
                case 'N':
                    partida_real.bitboard_cavalo_branco |= posicao_tabuleiro;
                    break;
                case 'B':
                    partida_real.bitboard_bispo_branco |= posicao_tabuleiro;
                    break;
                case 'R':
                    partida_real.bitboard_torre_branco |= posicao_tabuleiro;
                    break;
                case 'Q':
                    partida_real.bitboard_rainha_branco |= posicao_tabuleiro;
                    break;
                case 'K':
                    partida_real.bitboard_rei_branco |= posicao_tabuleiro;
                    break;

                default:
                    casas_vazias += Number(elementos_linha_atual[coluna]) - 1;
                    break;
            }
        }
    }
    partida_real.bitboard_pecas_pretas = partida_real.bitboard_peao_preto | partida_real.bitboard_cavalo_preto | partida_real.bitboard_bispo_preto | partida_real.bitboard_torre_preto | partida_real.bitboard_rainha_preto | partida_real.bitboard_rei_preto;
    partida_real.bitboard_pecas_brancas = partida_real.bitboard_peao_branco | partida_real.bitboard_cavalo_branco | partida_real.bitboard_bispo_branco | partida_real.bitboard_torre_branco | partida_real.bitboard_rainha_branco | partida_real.bitboard_rei_branco;
    partida_real.bitboard_tabuleiro_completo = partida_real.bitboard_pecas_pretas | partida_real.bitboard_pecas_brancas;

    sincronizar_partida_simulada_com_partida_real();

    Calcular.casas_atacadas();
    Calcular.se_rei_tem_escaptoria('w');
    Calcular.se_rei_tem_escaptoria('b');

    partida_real.fen_jogados = [campo_input_fen_personalizado.value.split(' ').splice(0, 4).join(' ')];

    board.position(gerarFenDaPosicao());
    campo_input_fen_personalizado.value = '';

    document.getElementById('titulo_relatorio').textContent = partida_real.jogando == 'w' ? 'Relatório das brancas' : 'Relatório das pretas';
    const todosMovimentosECaptura = Calcular.todos_possiveis_movimentos_de_todas_pecas(partida_real.jogando);
    gerarRelatorioMovimento(todosMovimentosECaptura);
    gerarRelatorioCaptura(todosMovimentosECaptura);
    gerarRelatorioMovimentoEspecial(todosMovimentosECaptura);

    return;
}

function zerarEnPassant(color) {
    if (color == 'w') {
        partida_real.en_passant_brancas = 0n;
    } else {
        partida_real.en_passant_pretas = 0n;
    }
}

// OBS: Antes de chamar essa função é necessário verificar se o lance é válido
function verificarPromocao(origem, destino) {
    // Verificando se a peça que foi movida é um peão
    if ((origem & (partida_real.bitboard_peao_branco | partida_real.bitboard_peao_preto)) !== 0n) {
        // Verificando se o peão está indo para linha 1 (pretas) ou linha 8 (brancas)
        if ((destino & (informacoes_xadrez.casas_linha_1 | informacoes_xadrez.casas_linha_8)) !== 0n) {
            promocao = prompt('Você pode promover!\n"q" para rainha\n"r" para torre\n"b" para bispo \n"n" para cavalo\nO default é rainha') || 'q';
            return promocao.toLowerCase();
        }
    }

    return null;
}

function identificarPecaMovida(origem) {
    if ((partida_real.bitboard_peao_branco | partida_real.bitboard_peao_preto) & origem) {
        return 'p';
    } else if ((partida_real.bitboard_cavalo_branco | partida_real.bitboard_cavalo_preto) & origem) {
        return 'n';
    } else if ((partida_real.bitboard_bispo_branco | partida_real.bitboard_bispo_preto) & origem) {
        return 'b';
    } else if ((partida_real.bitboard_torre_branco | partida_real.bitboard_torre_preto) & origem) {
        return 'r';
    } else if ((partida_real.bitboard_rainha_branco | partida_real.bitboard_rainha_preto) & origem) {
        return 'q';
    } else if ((partida_real.bitboard_rei_branco | partida_real.bitboard_rei_preto) & origem) {
        return 'k';
    } else {
        throw new Error('Peça não existe');
    }
}

function verificarVezJogando(origem) {
    if (partida_real.jogando == 'w' && (partida_real.bitboard_pecas_pretas & origem) !== 0n) {
        aviso('Vez do adversário', 'Erro');
        throw new Error('Vez do adversário');
    } else if (partida_real.jogando == 'b' && (partida_real.bitboard_pecas_brancas & origem) !== 0n) {
        aviso('Vez do adversário', 'Erro');
        throw new Error('Vez do adversário');
    }
}

// Verifica se a casa atacada é uma torre, se for, atualiza o status do roque (Evitando que o bitboard de roque fique desatualizado)
function verificarSeTorreCapturada(destino) {
    if (partida_real.jogando == 'w') {
        if (destino == informacoes_xadrez.casa_inicial_torre_esquerda_preto && partida_real.status_roque_esquerda_preto == true) {
            partida_real.status_roque_esquerda_preto = false;
        } else if (destino == informacoes_xadrez.casa_inicial_torre_direita_preto && partida_real.status_roque_direita_preto == true) {
            partida_real.status_roque_direita_preto = false;
        }
    } else {
        if (destino == informacoes_xadrez.casa_inicial_torre_esquerda_branca && partida_real.status_roque_esquerda_branco == true) {
            partida_real.status_roque_esquerda_branco = false;
        } else if (destino == informacoes_xadrez.casa_inicial_torre_direita_branca && partida_real.status_roque_direita_branco == true) {
            partida_real.status_roque_direita_branco = false;
        }
    }
}

// Verifica se foi feito um movimento repetido 3 vezes
function verificarRepticaoFen() {
    let fen_atual = gerarFenDaPosicao().split(' ').splice(0, 4).join(' ');

    let fen_repetido = partida_real.fen_jogados.filter((fen) => {
        return gerarFenDaPosicao().split(' ').splice(0, 4).join(' ') == fen;
    });

    if (fen_repetido.length >= 2) {
        Chess.status = 'empate';
        Chess.fim_do_jogo = true;
        aviso('Fim de jogo: Empate (repetição)', '', false);
        iniciarSom('empate');
    }

    partida_real.fen_jogados.push(fen_atual);
}

function efetuar_movimento(origem, destino, peca) {
    // Brancas jogam
    if (partida_real.jogando == 'w') {
        // Realiza o movimento do pião
        if (peca == 'p') {
            partida_simulada.bitboard_peao_branco ^= origem;
            partida_simulada.bitboard_peao_branco |= destino;
        }
        // Realiza o movimento do cavalo
        else if (peca == 'n') {
            partida_simulada.bitboard_cavalo_branco ^= origem;
            partida_simulada.bitboard_cavalo_branco |= destino;
        }
        // Realiza o movimento do bispo
        else if (peca == 'b') {
            partida_simulada.bitboard_bispo_branco ^= origem;
            partida_simulada.bitboard_bispo_branco |= destino;
        }
        // Realiza o movimento da torre
        else if (peca == 'r') {
            // Caso a torre seja movida, vai desativar o roque do lado movido
            if ((origem & informacoes_xadrez.casa_inicial_torre_direita_branca) != 0n) {
                partida_simulada.status_roque_direita_branco = false;
            } else if ((origem & informacoes_xadrez.casa_inicial_torre_esquerda_branca) != 0n) {
                partida_simulada.status_roque_esquerda_branco = false;
            }

            partida_simulada.bitboard_torre_branco ^= origem;
            partida_simulada.bitboard_torre_branco |= destino;
        }
        // Realiza o movimento da dama
        else if (peca == 'q') {
            partida_simulada.bitboard_rainha_branco ^= origem;
            partida_simulada.bitboard_rainha_branco |= destino;
        }
        // Realiza o movimento do rei
        else if (peca == 'k') {
            // Caso o rei seja movido, vai desativar o roque
            partida_simulada.status_roque_direita_branco = false;
            partida_simulada.status_roque_esquerda_branco = false;

            // Realizando movimento
            partida_simulada.bitboard_rei_branco ^= origem;
            partida_simulada.bitboard_rei_branco |= destino;
        }
    }

    // Pretas jogam
    else {
        // Realiza o movimento do pião
        if (peca == 'p') {
            partida_simulada.bitboard_peao_preto ^= origem;
            partida_simulada.bitboard_peao_preto |= destino;
        }
        // Realiza o movimento do cavalo
        else if (peca == 'n') {
            partida_simulada.bitboard_cavalo_preto ^= origem;
            partida_simulada.bitboard_cavalo_preto |= destino;
        }
        // Realiza o movimento do bispo
        else if (peca == 'b') {
            partida_simulada.bitboard_bispo_preto ^= origem;
            partida_simulada.bitboard_bispo_preto |= destino;
        }
        // Realiza o movimento da torre
        else if (peca == 'r') {
            // Caso a torre seja movida, vai desativar o roque do lado movido
            if ((origem & informacoes_xadrez.casa_inicial_torre_direita_preto) != 0n) {
                partida_simulada.status_roque_direita_preto = false;
            } else if ((origem & informacoes_xadrez.casa_inicial_torre_esquerda_preto) != 0n) {
                partida_simulada.status_roque_esquerda_preto = false;
            }

            partida_simulada.bitboard_torre_preto ^= origem;
            partida_simulada.bitboard_torre_preto |= destino;
        }
        // Realiza o movimento da dama
        else if (peca == 'q') {
            partida_simulada.bitboard_rainha_preto ^= origem;
            partida_simulada.bitboard_rainha_preto |= destino;
        }
        // Realiza o movimento do rei
        else if (peca == 'k') {
            // Caso o rei seja movido, vai desativar o roque
            partida_simulada.status_roque_direita_preto = false;
            partida_simulada.status_roque_esquerda_preto = false;

            // Realizando movimento
            partida_simulada.bitboard_rei_preto ^= origem;
            partida_simulada.bitboard_rei_preto |= destino;
        }
    }

    // Atualiza todos os bitboards restantes
    atualizarTabuleiro();
    return;
}

function efetuar_captura(origem, destino, peca) {
    // Brancas jogam
    if (partida_real.jogando == 'w') {
        //  Atualizando o bitboard das pretas (capturando a peça)
        partida_simulada.bitboard_peao_preto ^= partida_simulada.bitboard_peao_preto & destino;
        partida_simulada.bitboard_cavalo_preto ^= partida_simulada.bitboard_cavalo_preto & destino;
        partida_simulada.bitboard_bispo_preto ^= partida_simulada.bitboard_bispo_preto & destino;
        partida_simulada.bitboard_torre_preto ^= partida_simulada.bitboard_torre_preto & destino;
        partida_simulada.bitboard_rainha_preto ^= partida_simulada.bitboard_rainha_preto & destino;
    }
    // Pretas jogam
    else {
        //  Atualizando o bitboard das brancas (capturando a peça)
        partida_simulada.bitboard_peao_branco ^= partida_simulada.bitboard_peao_branco & destino;
        partida_simulada.bitboard_cavalo_branco ^= partida_simulada.bitboard_cavalo_branco & destino;
        partida_simulada.bitboard_bispo_branco ^= partida_simulada.bitboard_bispo_branco & destino;
        partida_simulada.bitboard_torre_branco ^= partida_simulada.bitboard_torre_branco & destino;
        partida_simulada.bitboard_rainha_branco ^= partida_simulada.bitboard_rainha_branco & destino;
    }

    efetuar_movimento(origem, destino, peca);
    return;
}

function atualizarTabuleiro() {
    // Atualizando o bitboard de todas as peças brancas
    partida_simulada.bitboard_pecas_brancas = partida_simulada.bitboard_peao_branco | partida_simulada.bitboard_cavalo_branco | partida_simulada.bitboard_bispo_branco | partida_simulada.bitboard_torre_branco | partida_simulada.bitboard_rainha_branco | partida_simulada.bitboard_rei_branco;

    // Atualizando o bitboard de todas as peças pretas
    partida_simulada.bitboard_pecas_pretas = partida_simulada.bitboard_peao_preto | partida_simulada.bitboard_cavalo_preto | partida_simulada.bitboard_bispo_preto | partida_simulada.bitboard_torre_preto | partida_simulada.bitboard_rainha_preto | partida_simulada.bitboard_rei_preto;

    // Atualizando o bitboard com todas as casas ocupadas
    partida_simulada.bitboard_tabuleiro_completo = partida_simulada.bitboard_pecas_brancas | partida_simulada.bitboard_pecas_pretas;
}
