// Função para calcular todos movimentos e capturas válido do pião
function calcularAtaqueEMovimentoPecaPeao(jogando, origem, deslocamento, operador, movimento_peao, borda, calculando_casas_atacadas = false) {
    let pecas_aliadas = jogando == 'w' ? partida_simulada.bitboard_pecas_brancas : partida_simulada.bitboard_pecas_pretas;
    let pecas_inimigas = jogando == 'w' ? partida_simulada.bitboard_pecas_pretas : partida_simulada.bitboard_pecas_brancas;
    let en_passant_inimigo = jogando == 'w' ? partida_simulada.en_passant_pretas : partida_simulada.en_passant_brancas;
    let casas_iniciais_peao_aliado = jogando == 'w' ? informacoes_xadrez.casas_iniciais_peao_branco : informacoes_xadrez.casas_iniciais_peao_preto;

    let movimentos = [];
    let capturas = [];
    let en_passant = [];

    // Não deixa a peça fazer um wrap de coluna
    if ((origem & borda) !== 0n) {
        return { todos: [], movimentos: [], capturas: [], en_passant: [] };
    }
    // Verificando se foi feito um movimento na contagem de casas atacadas
    else if (movimento_peao == true && calculando_casas_atacadas == true) {
        return { todos: [], movimentos: [], capturas: [], en_passant: [] };
    }

    for (let cont = 0; cont < deslocamento.length; cont++) {
        const destino = operador == '<<' ? origem << deslocamento[cont] : origem >> deslocamento[cont];

        // Verificando se a peça passou do limite
        if (destino == 0n || destino > 9223372036854775808n) {
            break;
        }
        // Verificando se é um movimento e na casa de destino não tenha peça adversária
        else if (movimento_peao == true && (destino & pecas_inimigas) !== 0n) {
            break;
        }
        // Verificando se é um movimento duplo e se é válido
        else if (deslocamento[cont] == informacoes_xadrez.movimento_peao[1] && (origem & casas_iniciais_peao_aliado) == 0n) {
            break;
        }
        // Verificando se não é um movimento e se a casa de destino possui peça inimiga (captura)
        else if (movimento_peao == false && (destino & pecas_inimigas) !== 0n) {
            if (calculando_casas_atacadas == false) {
                efetuarCaptura(origem, destino, 'p');
                Calcular.casasAtacadas();
                if (Calcular.seReiAtacado(partida_real.jogando) == false) {
                    capturas.push(destino);
                }
                sincronizar_partida_simulada_com_partida_real();
            } else {
                capturas.push(destino);
            }
            break;
        }
        // Verificando se não é um movimento e se tem en passant
        else if (movimento_peao == false && (destino & en_passant_inimigo) !== 0n) {
            if (calculando_casas_atacadas == false) {
                Peao.efetuarEnPassant(origem, destino);
                Calcular.casasAtacadas();
                if (Calcular.seReiAtacado(partida_real.jogando) == false) {
                    en_passant.push(destino);
                }
                sincronizar_partida_simulada_com_partida_real();
            } else {
                en_passant.push(destino);
            }
            break;
        }
        // Verificando se casa está ocupada por um aliado
        else if ((destino & pecas_aliadas) !== 0n) {
            if (calculando_casas_atacadas == false) {
                break;
            } else {
                movimentos.push(destino);
            }
        }

        // Verificando se é um movimento e também se não está calculando as casas atacadas
        if (movimento_peao == true && calculando_casas_atacadas == false) {
            efetuarMovimento(origem, destino, 'p');
            Calcular.casasAtacadas();
            if (Calcular.seReiAtacado(partida_real.jogando) == false) {
                movimentos.push(destino);
            }
            sincronizar_partida_simulada_com_partida_real();
        }
        // Verificando se está calculando as casas atacadas e não é um movimento
        else if (movimento_peao == false && calculando_casas_atacadas == true) {
            capturas.push(destino);
        }
    }

    // Verificando se existe pelo menos um movimento possível (mover, capturar ou en passant)
    if (movimentos.length > 0 || capturas.length > 0 || en_passant.length > 0) {
        const movimentos_possiveis = {
            todos: [...movimentos, ...capturas, ...en_passant],
            movimentos: movimentos,
            capturas: capturas,
            en_passant: en_passant,
        };

        return movimentos_possiveis;
    } else {
        return { todos: [], movimentos: [], capturas: [], en_passant: [] };
    }
}

// Função para calcular todos movimentos e capturas válido do cavalo
function calcularAtaqueEMovimentoPecasSaltitante(jogando, origem, deslocamento, operador, calculando_casas_atacadas = false) {
    let pecas_aliadas = jogando == 'w' ? partida_simulada.bitboard_pecas_brancas : partida_simulada.bitboard_pecas_pretas;
    let pecas_inimigas = jogando == 'w' ? partida_simulada.bitboard_pecas_pretas : partida_simulada.bitboard_pecas_brancas;

    let movimentos = [];
    let capturas = [];

    for (let cont = 0; cont < deslocamento.length; cont++) {
        const destino = operador == '<<' ? origem << deslocamento[cont] : origem >> deslocamento[cont];

        // Verificando se a peça passou do limite do tabuleiro
        if (destino == 0n || destino > 9223372036854775808n) {
            continue;
        }
        // Verificando se foi feito um wrap de coluna (canto esquerdo para o canto direito)
        else if ((origem & informacoes_xadrez.casas_coluna_A_e_B) !== 0n && (destino & informacoes_xadrez.casas_coluna_G_e_H) !== 0n) {
            continue;
        }
        // Verificando se foi feito um wrap de coluna (canto direito para o canto esquerdo)
        else if ((origem & informacoes_xadrez.casas_coluna_G_e_H) !== 0n && (destino & informacoes_xadrez.casas_coluna_A_e_B) !== 0n) {
            continue;
        }
        // Verificiando se a casa está ocupada por um inimigo
        else if ((destino & pecas_inimigas) !== 0n) {
            if (calculando_casas_atacadas == false) {
                efetuarCaptura(origem, destino, 'n');
                Calcular.casasAtacadas();
                if (Calcular.seReiAtacado(partida_real.jogando) == false) {
                    capturas.push(destino);
                }
                sincronizar_partida_simulada_com_partida_real();
            } else {
                capturas.push(destino);
            }
            continue;
        }
        // Verificando se a casa está ocupada por um aliado
        else if ((destino & pecas_aliadas) !== 0n) {
            if (calculando_casas_atacadas == false) {
                continue;
            } else {
                movimentos.push(destino);
            }
        }

        if (calculando_casas_atacadas == false) {
            efetuarMovimento(origem, destino, 'n');
            Calcular.casasAtacadas();
            if (Calcular.seReiAtacado(partida_real.jogando) == false) {
                movimentos.push(destino);
            }
            sincronizar_partida_simulada_com_partida_real();
        } else {
            movimentos.push(destino);
        }
        continue;
    }

    // Verificando se existe pelo menos um movimento possível (mover ou capturar)
    if (movimentos.length > 0 || capturas.length > 0) {
        const movimentos_possiveis = {
            todos: [...movimentos, ...capturas],
            movimentos: movimentos,
            capturas: capturas,
        };

        return movimentos_possiveis;
    } else {
        return { todos: [], movimentos: [], capturas: [] };
    }
}

// Função para calcular todos movimentos e capturas das peças válido do: Bispo, Torre e Dama
function calcularAtaqueEMovimentoPecasDeslizante(jogando, origem, deslocamento, operador, borda, peca = null, calculando_casas_atacadas = false) {
    let pecas_aliadas = jogando == 'w' ? partida_simulada.bitboard_pecas_brancas : partida_simulada.bitboard_pecas_pretas;
    let pecas_inimigas = jogando == 'w' ? partida_simulada.bitboard_pecas_pretas : partida_simulada.bitboard_pecas_brancas;

    let movimentos = [];
    let capturas = [];

    // Não deixa a peça fazer um wrap de coluna
    if ((origem & borda) !== 0n) {
        return { todos: [], movimentos: [], capturas: [] };
    }

    for (let cont = 0; cont < deslocamento.length; cont++) {
        const destino = operador == '<<' ? origem << deslocamento[cont] : origem >> deslocamento[cont];

        // Verificando se a peça passou do limite do tabuleiro
        if (destino == 0n || destino > 9223372036854775808n) {
            break;
        }
        // Verificiando se a casa está ocupada por um inimigo e se não está na borda
        else if ((destino & pecas_inimigas) !== 0n && (destino & borda) !== 0n) {
            if (calculando_casas_atacadas == false) {
                efetuarCaptura(origem, destino, peca);
                Calcular.casasAtacadas();
                if (Calcular.seReiAtacado(partida_real.jogando) == false) {
                    capturas.push(destino);
                }
                sincronizar_partida_simulada_com_partida_real();
            } else {
                capturas.push(destino);
            }

            break;
        }
        // Verificiando se a casa está ocupada por um inimigo
        else if ((destino & pecas_inimigas) !== 0n) {
            if (calculando_casas_atacadas == false) {
                efetuarCaptura(origem, destino, peca);
                Calcular.casasAtacadas();
                if (Calcular.seReiAtacado(partida_real.jogando) == false) {
                    capturas.push(destino);
                }
                sincronizar_partida_simulada_com_partida_real();
            } else {
                capturas.push(destino);
            }

            break;
        }
        // Verificando se a casa está ocupada por um aliado e se não está na borda
        else if ((destino & pecas_aliadas) !== 0n) {
            if (calculando_casas_atacadas == true) {
                movimentos.push(destino);
            }
            break;
        }
        // Verificando se a peça está na borda
        else if ((destino & borda) !== 0n) {
            if (calculando_casas_atacadas == false) {
                efetuarMovimento(origem, destino, peca);
                Calcular.casasAtacadas();
                if (Calcular.seReiAtacado(partida_real.jogando) == false) {
                    movimentos.push(destino);
                }
                sincronizar_partida_simulada_com_partida_real();
            } else {
                movimentos.push(destino);
            }

            break;
        }

        if (calculando_casas_atacadas == false) {
            efetuarMovimento(origem, destino, peca);
            Calcular.casasAtacadas();
            if (Calcular.seReiAtacado(partida_real.jogando) == false) {
                movimentos.push(destino);
            }
            sincronizar_partida_simulada_com_partida_real();
        } else {
            movimentos.push(destino);
        }
    }

    // Verificando se existe pelo menos um movimento possível (mover ou capturar)
    if (movimentos.length > 0 || capturas.length > 0) {
        const movimentos_possiveis = {
            todos: [...movimentos, ...capturas],
            movimentos: movimentos,
            capturas: capturas,
        };

        return movimentos_possiveis;
    } else {
        return { todos: [], movimentos: [], capturas: [] };
    }
}

// Função para calcular todos movimentos e capturas das peças válido do Rei
function calcularAtaqueEMovimentoPecaRei(jogando, origem, deslocamento, operador, borda, calculando_casas_atacadas = false) {
    let pecas_aliadas = jogando == 'w' ? partida_simulada.bitboard_pecas_brancas : partida_simulada.bitboard_pecas_pretas;
    let pecas_inimigas = jogando == 'w' ? partida_simulada.bitboard_pecas_pretas : partida_simulada.bitboard_pecas_brancas;
    let casas_atacadas_inimigos = jogando == 'w' ? partida_simulada.casas_atacadas_pelas_pretas : partida_simulada.casas_atacadas_pelas_brancas;

    let movimentos = [];
    let capturas = [];

    // Não deixa a peça fazer um wrap de coluna
    if ((origem & borda) !== 0n) {
        return { todos: [], movimentos: [], capturas: [] };
    }

    for (let cont = 0; cont < deslocamento.length; cont++) {
        const destino = operador == '<<' ? origem << deslocamento[cont] : origem >> deslocamento[cont];

        // Verificando se a peça passou do limite do tabuleiro
        if (destino == 0n || destino > 9223372036854775808n) {
            break;
        }
        // Verifica se a casa está atacada por alguma peça inimiga
        else if ((destino & casas_atacadas_inimigos) !== 0n) {
            if (calculando_casas_atacadas == false) {
                break;
            } else {
                capturas.push(destino);
            }
        }
        // Verificiando se a casa está ocupada por um inimigo e se não está na borda
        else if ((destino & pecas_inimigas) !== 0n && (destino & borda) !== 0n) {
            if (calculando_casas_atacadas == false) {
                efetuarCaptura(origem, destino, 'k');
                Calcular.casasAtacadas();
                if (Calcular.seReiAtacado(partida_real.jogando) == false) {
                    capturas.push(destino);
                }
                sincronizar_partida_simulada_com_partida_real();
            } else {
                capturas.push(destino);
            }
        }
        // Verificiando se a casa está ocupada por um inimigo
        else if ((destino & pecas_inimigas) !== 0n) {
            if (calculando_casas_atacadas == false) {
                efetuarCaptura(origem, destino, 'k');
                Calcular.casasAtacadas();
                if (Calcular.seReiAtacado(partida_real.jogando) == false) {
                    capturas.push(destino);
                }
                sincronizar_partida_simulada_com_partida_real();
            } else {
                capturas.push(destino);
            }
            break;
        }
        // Verificando se a casa está ocupada por um aliado e se não está na borda
        else if ((destino & pecas_aliadas) !== 0n) {
            if (calculando_casas_atacadas == false) {
                continue;
            } else {
                movimentos.push(destino);
                break;
            }
        }
        // Verificando se a peça está na borda
        else if ((destino & borda) !== 0n) {
            if (calculando_casas_atacadas == false) {
                efetuarMovimento(origem, destino, 'k');
                Calcular.casasAtacadas();
                if (Calcular.seReiAtacado(partida_real.jogando) == false) {
                    movimentos.push(destino);
                }
                sincronizar_partida_simulada_com_partida_real();
            } else {
                movimentos.push(destino);
            }

            break;
        }

        if (calculando_casas_atacadas == false) {
            efetuarMovimento(origem, destino, 'k');
            Calcular.casasAtacadas();
            if (Calcular.seReiAtacado(partida_real.jogando) == false) {
                movimentos.push(destino);
            }
            sincronizar_partida_simulada_com_partida_real();
        } else {
            movimentos.push(destino);
        }
    }

    // Verificando se existe pelo menos um movimento possível (mover ou capturar)
    if (movimentos.length > 0 || capturas.length > 0) {
        const movimentos_possiveis = {
            todos: [...movimentos, ...capturas],
            movimentos: movimentos,
            capturas: capturas,
        };

        return movimentos_possiveis;
    } else {
        return { todos: [], movimentos: [], capturas: [] };
    }
}

// Função para calcular se é possível fazer roque para a esquerda
function calcularRoquePecaReiEsquerda(jogando) {
    let torre_aliada = jogando == 'w' ? partida_simulada.bitboard_torre_branco : partida_simulada.bitboard_torre_preto;
    let tabuleiro_completo = partida_simulada.bitboard_tabuleiro_completo;

    let status_rei_em_ataque_aliado = jogando == 'w' ? partida_simulada.rei_branco_em_ataque : partida_simulada.rei_preto_em_ataque;
    let status_roque_esquerda = jogando == 'w' ? partida_simulada.status_roque_esquerda_branco : partida_simulada.status_roque_esquerda_preto;

    let casas_atacadas_inimigo = jogando == 'w' ? partida_simulada.casas_atacadas_pelas_pretas : partida_simulada.casas_atacadas_pelas_brancas;
    let casas_que_nao_podem_estar_sendo_atacadas_pelo_inimigo = jogando == 'w' ? informacoes_xadrez.casas_nao_atacadas_roque_esquerda_branco : informacoes_xadrez.casas_nao_atacadas_roque_esquerda_preto;
    let casas_vazias_para_o_roque_esquerda = jogando == 'w' ? informacoes_xadrez.casas_vazias_roque_esquerda_branco : informacoes_xadrez.casas_vazias_roque_esquerda_preto;

    let casa_inicial_torre_aliada = jogando == 'w' ? informacoes_xadrez.casa_inicial_torre_esquerda_branca : informacoes_xadrez.casa_inicial_torre_esquerda_preto;
    let casa_destino_rei_roque = jogando == 'w' ? informacoes_xadrez.casa_destino_rei_roque_esquerda_branco : informacoes_xadrez.casa_destino_rei_roque_esquerda_preto;

    let roque_esquerda = [];

    let algum_erro_encontrado_no_roque_esquerdo = false;

    // Verificando se o rei está em xeque e status do roque
    if (status_rei_em_ataque_aliado == true || status_roque_esquerda == false) {
        return { roque_esquerda: [] };
    }

    // Verificando se existe alguma peça (alida ou inimiga) entre o rei e a torre
    if ((casas_vazias_para_o_roque_esquerda & tabuleiro_completo) != 0n) {
        algum_erro_encontrado_no_roque_esquerdo = true;
    }
    // Verificando se a torre está na casa inicial corretamente
    else if ((torre_aliada & casa_inicial_torre_aliada) == 0n) {
        algum_erro_encontrado_no_roque_esquerdo = true;
    }
    // Verificando as casas que o rei vai passar estão atacadas
    else if ((casas_atacadas_inimigo & casas_que_nao_podem_estar_sendo_atacadas_pelo_inimigo) !== 0n) {
        algum_erro_encontrado_no_roque_esquerdo = true;
    }

    // Verifica se é possível fazer roque na esquerda
    if (algum_erro_encontrado_no_roque_esquerdo == false) {
        roque_esquerda.push(casa_destino_rei_roque);
    }

    // Verificando se tem alguma pendência para fazer o roque
    if (roque_esquerda.length > 0) {
        const movimentos_possiveis = {
            roque_esquerda: roque_esquerda,
        };

        return movimentos_possiveis;
    } else {
        return { roque_esquerda: [] };
    }
}

// Função para calcular se é possível fazer roque para a direita
function calcularRoquePecaReiDireita(jogando) {
    let torre_aliada = jogando == 'w' ? partida_simulada.bitboard_torre_branco : partida_simulada.bitboard_torre_preto;
    let tabuleiro_completo = partida_simulada.bitboard_pecas_brancas | partida_simulada.bitboard_pecas_pretas;

    let status_rei_em_ataque_aliado = jogando == 'w' ? partida_simulada.rei_branco_em_ataque : partida_simulada.rei_preto_em_ataque;
    let status_roque_direita = jogando == 'w' ? partida_simulada.status_roque_direita_branco : partida_simulada.status_roque_direita_preto;

    let casas_atacadas_inimigo = jogando == 'w' ? partida_simulada.casas_atacadas_pelas_pretas : partida_simulada.casas_atacadas_pelas_brancas;
    let casas_livre_para_o_roque_direita = jogando == 'w' ? informacoes_xadrez.casas_vazias_roque_direita_branco : informacoes_xadrez.casas_vazias_roque_direita_preto;

    let casa_inicial_torre_aliada = jogando == 'w' ? informacoes_xadrez.casa_inicial_torre_direita_branca : informacoes_xadrez.casa_inicial_torre_direita_preto;
    let casa_destino_rei_roque = jogando == 'w' ? informacoes_xadrez.casa_destino_rei_roque_direita_branco : informacoes_xadrez.casa_destino_rei_roque_direita_preto;

    let roque_direita = [];

    let algum_erro_encontrado_no_roque_direito = false;

    // Verificando se o rei está em xeque ou se o status do roque é false
    if (status_rei_em_ataque_aliado == true || status_roque_direita == false) {
        return { roque_direita: [] };
    }

    // Verificando se existe alguma peça (alida ou inimiga) entre o rei e a torre
    if ((casas_livre_para_o_roque_direita & tabuleiro_completo) != 0n) {
        algum_erro_encontrado_no_roque_direito = true;
    }
    // Verificando se a torre está na casa inicial corretamente
    else if ((torre_aliada & casa_inicial_torre_aliada) == 0n) {
        algum_erro_encontrado_no_roque_direito = true;
    }
    // Verificando as casas que o rei vai passar estão atacadas
    else if ((casas_atacadas_inimigo & casas_livre_para_o_roque_direita) !== 0n) {
        algum_erro_encontrado_no_roque_direito = true;
    }

    // Verifica se é possível fazer roque
    if (algum_erro_encontrado_no_roque_direito == false) {
        roque_direita.push(casa_destino_rei_roque);
    }

    // Verificando se tem alguma pendência para fazer o roque
    if (roque_direita.length > 0) {
        const movimentos_possiveis = {
            roque_direita: roque_direita,
        };

        return movimentos_possiveis;
    } else {
        return { roque_direita: [] };
    }
}

class Calcular {
    static todosAtaquesEMovimentosDoPeao(jogando, origem, simplificar_retorno = false, calculando_casas_atacadas = false) {
        let movimentos_possiveis = {
            todos: [],
            movimentos: [],
            capturas: [],
            en_passant: [],
        };
        let movimentos_retornado;

        // Brancas jogam
        if (jogando == 'w') {
            movimentos_retornado = calcularAtaqueEMovimentoPecaPeao(jogando, origem, informacoes_xadrez.captura_peao_esquerda, '<<', false, informacoes_xadrez.casas_coluna_A | informacoes_xadrez.casas_linha_8, calculando_casas_atacadas);
            movimentos_possiveis = movimentos_retornado;

            movimentos_retornado = calcularAtaqueEMovimentoPecaPeao(jogando, origem, informacoes_xadrez.captura_peao_direita, '<<', false, informacoes_xadrez.casas_coluna_H | informacoes_xadrez.casas_linha_8, calculando_casas_atacadas);
            movimentos_possiveis = {
                todos: [...movimentos_possiveis.todos, ...movimentos_retornado.todos],
                movimentos: [...movimentos_possiveis.movimentos, ...movimentos_retornado.movimentos],
                capturas: [...movimentos_possiveis.capturas, ...movimentos_retornado.capturas],
                en_passant: [...movimentos_possiveis.en_passant, ...movimentos_retornado.en_passant],
            };

            movimentos_retornado = calcularAtaqueEMovimentoPecaPeao(jogando, origem, informacoes_xadrez.movimento_peao, '<<', true, informacoes_xadrez.casas_linha_8, calculando_casas_atacadas);
            movimentos_possiveis = {
                todos: [...movimentos_possiveis.todos, ...movimentos_retornado.todos],
                movimentos: [...movimentos_possiveis.movimentos, ...movimentos_retornado.movimentos],
                capturas: [...movimentos_possiveis.capturas, ...movimentos_retornado.capturas],
                en_passant: [...movimentos_possiveis.en_passant, ...movimentos_retornado.en_passant],
            };
        }
        // Pretas jogam
        else {
            movimentos_retornado = calcularAtaqueEMovimentoPecaPeao(jogando, origem, informacoes_xadrez.captura_peao_esquerda, '>>', false, informacoes_xadrez.casas_coluna_H | informacoes_xadrez.casas_linha_1, calculando_casas_atacadas);
            movimentos_possiveis = movimentos_retornado;

            movimentos_retornado = calcularAtaqueEMovimentoPecaPeao(jogando, origem, informacoes_xadrez.captura_peao_direita, '>>', false, informacoes_xadrez.casas_coluna_A | informacoes_xadrez.casas_linha_1, calculando_casas_atacadas);
            movimentos_possiveis = {
                todos: [...movimentos_possiveis.todos, ...movimentos_retornado.todos],
                movimentos: [...movimentos_possiveis.movimentos, ...movimentos_retornado.movimentos],
                capturas: [...movimentos_possiveis.capturas, ...movimentos_retornado.capturas],
                en_passant: [...movimentos_possiveis.en_passant, ...movimentos_retornado.en_passant],
            };

            movimentos_retornado = calcularAtaqueEMovimentoPecaPeao(jogando, origem, informacoes_xadrez.movimento_peao, '>>', true, informacoes_xadrez.casas_linha_1, calculando_casas_atacadas);
            movimentos_possiveis = {
                todos: [...movimentos_possiveis.todos, ...movimentos_retornado.todos],
                movimentos: [...movimentos_possiveis.movimentos, ...movimentos_retornado.movimentos],
                capturas: [...movimentos_possiveis.capturas, ...movimentos_retornado.capturas],
                en_passant: [...movimentos_possiveis.en_passant, ...movimentos_retornado.en_passant],
            };
        }

        if (calculando_casas_atacadas == true) {
            return movimentos_possiveis.capturas.concat(movimentos_possiveis.en_passant);
        } else if (simplificar_retorno == true) {
            return movimentos_possiveis.todos;
        } else {
            return movimentos_possiveis;
        }
    }

    static todosAtaquesEMovimentosDoCavalo(jogando, origem, simplificar_retorno = false, calculando_casas_atacadas = false) {
        let movimentos_retornado = {
            todos: [],
            movimentos: [],
            capturas: [],
        };
        let movimentos_possiveis;

        ((movimentos_retornado = calcularAtaqueEMovimentoPecasSaltitante(jogando, origem, informacoes_xadrez.movimento_cavalo_esquerda, '<<', calculando_casas_atacadas)), (movimentos_possiveis = movimentos_retornado));

        ((movimentos_retornado = calcularAtaqueEMovimentoPecasSaltitante(jogando, origem, informacoes_xadrez.movimento_cavalo_direita, '<<', calculando_casas_atacadas)),
            (movimentos_possiveis = {
                todos: [...movimentos_possiveis.todos, ...movimentos_retornado.todos],
                movimentos: [...movimentos_possiveis.movimentos, ...movimentos_retornado.movimentos],
                capturas: [...movimentos_possiveis.capturas, ...movimentos_retornado.capturas],
            }));

        movimentos_retornado = calcularAtaqueEMovimentoPecasSaltitante(jogando, origem, informacoes_xadrez.movimento_cavalo_esquerda, '>>', calculando_casas_atacadas);
        movimentos_possiveis = {
            todos: [...movimentos_possiveis.todos, ...movimentos_retornado.todos],
            movimentos: [...movimentos_possiveis.movimentos, ...movimentos_retornado.movimentos],
            capturas: [...movimentos_possiveis.capturas, ...movimentos_retornado.capturas],
        };

        ((movimentos_retornado = calcularAtaqueEMovimentoPecasSaltitante(jogando, origem, informacoes_xadrez.movimento_cavalo_direita, '>>', calculando_casas_atacadas)),
            (movimentos_possiveis = {
                todos: [...movimentos_possiveis.todos, ...movimentos_retornado.todos],
                movimentos: [...movimentos_possiveis.movimentos, ...movimentos_retornado.movimentos],
                capturas: [...movimentos_possiveis.capturas, ...movimentos_retornado.capturas],
            }));

        if (simplificar_retorno == true) {
            return movimentos_possiveis.todos;
        } else {
            return movimentos_possiveis;
        }
    }

    static todosAtaquesEMovimentosDoBispo(jogando, origem, simplificar_retorno = false, calculando_casas_atacadas = false) {
        let movimentos_retornado = {
            todos: [],
            movimentos: [],
            capturas: [],
        };
        let movimentos_possiveis;

        ((movimentos_retornado = calcularAtaqueEMovimentoPecasDeslizante(jogando, origem, informacoes_xadrez.movimento_bispo_esquerda, '<<', informacoes_xadrez.casas_coluna_A | informacoes_xadrez.casas_linha_8, 'b', calculando_casas_atacadas)), (movimentos_possiveis = movimentos_retornado));

        ((movimentos_retornado = calcularAtaqueEMovimentoPecasDeslizante(jogando, origem, informacoes_xadrez.movimento_bispo_esquerda, '>>', informacoes_xadrez.casas_coluna_H | informacoes_xadrez.casas_linha_1, 'b', calculando_casas_atacadas)),
            (movimentos_possiveis = {
                todos: [...movimentos_possiveis.todos, ...movimentos_retornado.todos],
                movimentos: [...movimentos_possiveis.movimentos, ...movimentos_retornado.movimentos],
                capturas: [...movimentos_possiveis.capturas, ...movimentos_retornado.capturas],
            }));

        ((movimentos_retornado = calcularAtaqueEMovimentoPecasDeslizante(jogando, origem, informacoes_xadrez.movimento_bispo_direita, '<<', informacoes_xadrez.casas_coluna_H | informacoes_xadrez.casas_linha_8, 'b', calculando_casas_atacadas)),
            (movimentos_possiveis = {
                todos: [...movimentos_possiveis.todos, ...movimentos_retornado.todos],
                movimentos: [...movimentos_possiveis.movimentos, ...movimentos_retornado.movimentos],
                capturas: [...movimentos_possiveis.capturas, ...movimentos_retornado.capturas],
            }));

        ((movimentos_retornado = calcularAtaqueEMovimentoPecasDeslizante(jogando, origem, informacoes_xadrez.movimento_bispo_direita, '>>', informacoes_xadrez.casas_coluna_A | informacoes_xadrez.casas_linha_1, 'b', calculando_casas_atacadas)),
            (movimentos_possiveis = {
                todos: [...movimentos_possiveis.todos, ...movimentos_retornado.todos],
                movimentos: [...movimentos_possiveis.movimentos, ...movimentos_retornado.movimentos],
                capturas: [...movimentos_possiveis.capturas, ...movimentos_retornado.capturas],
            }));

        if (simplificar_retorno == true) {
            return movimentos_possiveis.todos;
        } else {
            return movimentos_possiveis;
        }
    }

    static todosAtaquesEMovimentosDaTorre(jogando, origem, simplificar_retorno = false, calculando_casas_atacadas = false) {
        let movimentos_retornado = {
            todos: [],
            movimentos: [],
            capturas: [],
        };
        let movimentos_possiveis;

        movimentos_retornado = calcularAtaqueEMovimentoPecasDeslizante(jogando, origem, informacoes_xadrez.movimento_torre_frente, '<<', informacoes_xadrez.casas_linha_8, 'r', calculando_casas_atacadas);
        movimentos_possiveis = movimentos_retornado;

        movimentos_retornado = calcularAtaqueEMovimentoPecasDeslizante(jogando, origem, informacoes_xadrez.movimento_torre_frente, '>>', informacoes_xadrez.casas_linha_1, 'r', calculando_casas_atacadas);
        movimentos_possiveis = {
            todos: [...movimentos_possiveis.todos, ...movimentos_retornado.todos],
            movimentos: [...movimentos_possiveis.movimentos, ...movimentos_retornado.movimentos],
            capturas: [...movimentos_possiveis.capturas, ...movimentos_retornado.capturas],
        };

        movimentos_retornado = calcularAtaqueEMovimentoPecasDeslizante(jogando, origem, informacoes_xadrez.movimento_torre_direita, '<<', informacoes_xadrez.casas_coluna_H, 'r', calculando_casas_atacadas);
        movimentos_possiveis = {
            todos: [...movimentos_possiveis.todos, ...movimentos_retornado.todos],
            movimentos: [...movimentos_possiveis.movimentos, ...movimentos_retornado.movimentos],
            capturas: [...movimentos_possiveis.capturas, ...movimentos_retornado.capturas],
        };

        movimentos_retornado = calcularAtaqueEMovimentoPecasDeslizante(jogando, origem, informacoes_xadrez.movimento_torre_direita, '>>', informacoes_xadrez.casas_coluna_A, 'r', calculando_casas_atacadas);
        movimentos_possiveis = {
            todos: [...movimentos_possiveis.todos, ...movimentos_retornado.todos],
            movimentos: [...movimentos_possiveis.movimentos, ...movimentos_retornado.movimentos],
            capturas: [...movimentos_possiveis.capturas, ...movimentos_retornado.capturas],
        };

        if (simplificar_retorno == true) {
            return movimentos_possiveis.todos;
        } else {
            return movimentos_possiveis;
        }
    }

    static todosAtaquesEMovimentosDaRainha(jogando, origem, simplificar_retorno = false, calculando_casas_atacadas = false) {
        let movimentos_retornado = {
            todos: [],
            movimentos: [],
            capturas: [],
        };
        let movimentos_possiveis;

        ((movimentos_retornado = calcularAtaqueEMovimentoPecasDeslizante(jogando, origem, informacoes_xadrez.movimento_torre_frente, '<<', informacoes_xadrez.casas_linha_8, 'q', calculando_casas_atacadas)), (movimentos_possiveis = movimentos_retornado));

        ((movimentos_retornado = calcularAtaqueEMovimentoPecasDeslizante(jogando, origem, informacoes_xadrez.movimento_torre_frente, '>>', informacoes_xadrez.casas_linha_1, 'q', calculando_casas_atacadas)),
            (movimentos_possiveis = {
                todos: [...movimentos_possiveis.todos, ...movimentos_retornado.todos],
                movimentos: [...movimentos_possiveis.movimentos, ...movimentos_retornado.movimentos],
                capturas: [...movimentos_possiveis.capturas, ...movimentos_retornado.capturas],
            }));

        ((movimentos_retornado = calcularAtaqueEMovimentoPecasDeslizante(jogando, origem, informacoes_xadrez.movimento_torre_direita, '<<', informacoes_xadrez.casas_coluna_H, 'q', calculando_casas_atacadas)),
            (movimentos_possiveis = {
                todos: [...movimentos_possiveis.todos, ...movimentos_retornado.todos],
                movimentos: [...movimentos_possiveis.movimentos, ...movimentos_retornado.movimentos],
                capturas: [...movimentos_possiveis.capturas, ...movimentos_retornado.capturas],
            }));

        ((movimentos_retornado = calcularAtaqueEMovimentoPecasDeslizante(jogando, origem, informacoes_xadrez.movimento_torre_direita, '>>', informacoes_xadrez.casas_coluna_A, 'q', calculando_casas_atacadas)),
            (movimentos_possiveis = {
                todos: [...movimentos_possiveis.todos, ...movimentos_retornado.todos],
                movimentos: [...movimentos_possiveis.movimentos, ...movimentos_retornado.movimentos],
                capturas: [...movimentos_possiveis.capturas, ...movimentos_retornado.capturas],
            }));

        ((movimentos_retornado = calcularAtaqueEMovimentoPecasDeslizante(jogando, origem, informacoes_xadrez.movimento_bispo_esquerda, '<<', informacoes_xadrez.casas_coluna_A | informacoes_xadrez.casas_linha_8, 'q', calculando_casas_atacadas)),
            (movimentos_possiveis = {
                todos: [...movimentos_possiveis.todos, ...movimentos_retornado.todos],
                movimentos: [...movimentos_possiveis.movimentos, ...movimentos_retornado.movimentos],
                capturas: [...movimentos_possiveis.capturas, ...movimentos_retornado.capturas],
            }));

        ((movimentos_retornado = calcularAtaqueEMovimentoPecasDeslizante(jogando, origem, informacoes_xadrez.movimento_bispo_esquerda, '>>', informacoes_xadrez.casas_coluna_H | informacoes_xadrez.casas_linha_1, 'q', calculando_casas_atacadas)),
            (movimentos_possiveis = {
                todos: [...movimentos_possiveis.todos, ...movimentos_retornado.todos],
                movimentos: [...movimentos_possiveis.movimentos, ...movimentos_retornado.movimentos],
                capturas: [...movimentos_possiveis.capturas, ...movimentos_retornado.capturas],
            }));

        ((movimentos_retornado = calcularAtaqueEMovimentoPecasDeslizante(jogando, origem, informacoes_xadrez.movimento_bispo_direita, '<<', informacoes_xadrez.casas_coluna_H | informacoes_xadrez.casas_linha_8, 'q', calculando_casas_atacadas)),
            (movimentos_possiveis = {
                todos: [...movimentos_possiveis.todos, ...movimentos_retornado.todos],
                movimentos: [...movimentos_possiveis.movimentos, ...movimentos_retornado.movimentos],
                capturas: [...movimentos_possiveis.capturas, ...movimentos_retornado.capturas],
            }));

        ((movimentos_retornado = calcularAtaqueEMovimentoPecasDeslizante(jogando, origem, informacoes_xadrez.movimento_bispo_direita, '>>', informacoes_xadrez.casas_coluna_A | informacoes_xadrez.casas_linha_1, 'q', calculando_casas_atacadas)),
            (movimentos_possiveis = {
                todos: [...movimentos_possiveis.todos, ...movimentos_retornado.todos],
                movimentos: [...movimentos_possiveis.movimentos, ...movimentos_retornado.movimentos],
                capturas: [...movimentos_possiveis.capturas, ...movimentos_retornado.capturas],
            }));

        if (simplificar_retorno == true) {
            return movimentos_possiveis.todos;
        } else {
            return movimentos_possiveis;
        }
    }

    static todosAtaquesEMovimentosDoRei(jogando, origem, simplificar_retorno = false, calculando_casas_atacadas = false) {
        let movimentos_retornado;
        let movimentos_possiveis = {
            todos: [],
            movimentos: [],
            capturas: [],
            roque_esquerda: [],
            roque_direita: [],
        };

        movimentos_retornado = calcularAtaqueEMovimentoPecaRei(jogando, origem, informacoes_xadrez.movimento_rei_frente, '<<', informacoes_xadrez.casas_linha_8, calculando_casas_atacadas);
        movimentos_possiveis = {
            todos: [...movimentos_possiveis.todos, ...movimentos_retornado.todos],
            movimentos: [...movimentos_possiveis.movimentos, ...movimentos_retornado.movimentos],
            capturas: [...movimentos_possiveis.capturas, ...movimentos_retornado.capturas],
        };

        movimentos_retornado = calcularAtaqueEMovimentoPecaRei(jogando, origem, informacoes_xadrez.movimento_rei_frente_esquerda, '<<', informacoes_xadrez.casas_coluna_A | informacoes_xadrez.casas_linha_8, calculando_casas_atacadas);
        movimentos_possiveis = {
            todos: [...movimentos_possiveis.todos, ...movimentos_retornado.todos],
            movimentos: [...movimentos_possiveis.movimentos, ...movimentos_retornado.movimentos],
            capturas: [...movimentos_possiveis.capturas, ...movimentos_retornado.capturas],
        };

        movimentos_retornado = calcularAtaqueEMovimentoPecaRei(jogando, origem, informacoes_xadrez.movimento_rei_frente_direita, '<<', informacoes_xadrez.casas_coluna_H | informacoes_xadrez.casas_linha_8, calculando_casas_atacadas);
        movimentos_possiveis = {
            todos: [...movimentos_possiveis.todos, ...movimentos_retornado.todos],
            movimentos: [...movimentos_possiveis.movimentos, ...movimentos_retornado.movimentos],
            capturas: [...movimentos_possiveis.capturas, ...movimentos_retornado.capturas],
        };

        movimentos_retornado = calcularAtaqueEMovimentoPecaRei(jogando, origem, informacoes_xadrez.movimento_rei_direita, '<<', informacoes_xadrez.casas_coluna_H, calculando_casas_atacadas);
        movimentos_possiveis = {
            todos: [...movimentos_possiveis.todos, ...movimentos_retornado.todos],
            movimentos: [...movimentos_possiveis.movimentos, ...movimentos_retornado.movimentos],
            capturas: [...movimentos_possiveis.capturas, ...movimentos_retornado.capturas],
        };

        movimentos_retornado = calcularAtaqueEMovimentoPecaRei(jogando, origem, informacoes_xadrez.movimento_rei_frente, '>>', informacoes_xadrez.casas_linha_1, calculando_casas_atacadas);
        movimentos_possiveis = {
            todos: [...movimentos_possiveis.todos, ...movimentos_retornado.todos],
            movimentos: [...movimentos_possiveis.movimentos, ...movimentos_retornado.movimentos],
            capturas: [...movimentos_possiveis.capturas, ...movimentos_retornado.capturas],
        };

        movimentos_retornado = calcularAtaqueEMovimentoPecaRei(jogando, origem, informacoes_xadrez.movimento_rei_frente_esquerda, '>>', informacoes_xadrez.casas_coluna_H | informacoes_xadrez.casas_linha_1, calculando_casas_atacadas);
        movimentos_possiveis = {
            todos: [...movimentos_possiveis.todos, ...movimentos_retornado.todos],
            movimentos: [...movimentos_possiveis.movimentos, ...movimentos_retornado.movimentos],
            capturas: [...movimentos_possiveis.capturas, ...movimentos_retornado.capturas],
        };

        movimentos_retornado = calcularAtaqueEMovimentoPecaRei(jogando, origem, informacoes_xadrez.movimento_rei_frente_direita, '>>', informacoes_xadrez.casas_coluna_A | informacoes_xadrez.casas_linha_1, calculando_casas_atacadas);
        movimentos_possiveis = {
            todos: [...movimentos_possiveis.todos, ...movimentos_retornado.todos],
            movimentos: [...movimentos_possiveis.movimentos, ...movimentos_retornado.movimentos],
            capturas: [...movimentos_possiveis.capturas, ...movimentos_retornado.capturas],
        };

        movimentos_retornado = calcularAtaqueEMovimentoPecaRei(jogando, origem, informacoes_xadrez.movimento_rei_direita, '>>', informacoes_xadrez.casas_coluna_A, calculando_casas_atacadas);
        movimentos_possiveis = {
            todos: [...movimentos_possiveis.todos, ...movimentos_retornado.todos],
            movimentos: [...movimentos_possiveis.movimentos, ...movimentos_retornado.movimentos],
            capturas: [...movimentos_possiveis.capturas, ...movimentos_retornado.capturas],
        };

        movimentos_retornado = calcularRoquePecaReiEsquerda(jogando);
        movimentos_possiveis = {
            todos: [...movimentos_possiveis.todos, ...movimentos_retornado.roque_esquerda],
            movimentos: [...movimentos_possiveis.movimentos],
            capturas: [...movimentos_possiveis.capturas],
            roque_esquerda: [...movimentos_retornado.roque_esquerda],
        };

        movimentos_retornado = calcularRoquePecaReiDireita(jogando);
        movimentos_possiveis = {
            todos: [...movimentos_possiveis.todos, ...movimentos_retornado.roque_direita],
            movimentos: [...movimentos_possiveis.movimentos],
            capturas: [...movimentos_possiveis.capturas],
            roque_esquerda: [...movimentos_possiveis.roque_esquerda],
            roque_direita: [...movimentos_retornado.roque_direita],
        };

        if (simplificar_retorno == true) {
            return movimentos_possiveis.todos;
        } else {
            return movimentos_possiveis;
        }
    }

    // Essa função é responsável por calcular todos os movimentos de todas as peças das brancas ou das pretas (dependendo do parâmetro)
    static todosPossiveisMovimentosDeTodasPecas(jogando) {
        let movimentos_possiveis_peao = [];
        let movimentos_possiveis_cavalo = [];
        let movimentos_possiveis_bispo = [];
        let movimentos_possiveis_torre = [];
        let movimentos_possiveis_rainha = [];
        let movimentos_possiveis_rei = [];
        let todos_movimentos_possiveis = [];
        let quantidade_movimentos_possiveis = 0;
        let bitboard_todas_pecas = 0n;

        // Brancas jogam
        if (jogando == 'w') {
            bitboard_todas_pecas = partida_simulada.bitboard_peao_branco | partida_simulada.bitboard_cavalo_branco | partida_simulada.bitboard_bispo_branco | partida_simulada.bitboard_torre_branco | partida_simulada.bitboard_rainha_branco | partida_simulada.bitboard_rei_branco;

            let bitboard_restante = bitboard_todas_pecas;

            // Algoritmo Brian Kernighan
            for (let cont = 0; cont < 16; cont++) {
                let origem = bitboard_restante ^ (bitboard_restante & (bitboard_restante - 1n));

                if (bitboard_restante == 0n) {
                    break;
                }

                // Verificando se é um pião das brancas
                if ((origem & partida_simulada.bitboard_peao_branco) !== 0n && jogando == 'w') {
                    let movimentos_retornado = Calcular.todosAtaquesEMovimentosDoPeao('w', origem);
                    quantidade_movimentos_possiveis += movimentos_retornado.todos.length;

                    movimentos_possiveis_peao = movimentos_possiveis_peao.concat({ origem: origem, destino: movimentos_retornado });
                }
                // Verifica se é um cavalo das brancas
                else if ((origem & partida_simulada.bitboard_cavalo_branco) !== 0n && jogando == 'w') {
                    let movimentos_retornado = Calcular.todosAtaquesEMovimentosDoCavalo('w', origem);
                    quantidade_movimentos_possiveis += movimentos_retornado.todos.length;

                    movimentos_possiveis_cavalo = movimentos_possiveis_cavalo.concat({ origem: origem, destino: movimentos_retornado });
                }
                // Verifica se é um bispo das brancas
                else if ((origem & partida_simulada.bitboard_bispo_branco) !== 0n && jogando == 'w') {
                    let movimentos_retornado = Calcular.todosAtaquesEMovimentosDoBispo('w', origem);
                    quantidade_movimentos_possiveis += movimentos_retornado.todos.length;

                    movimentos_possiveis_bispo = movimentos_possiveis_bispo.concat({ origem: origem, destino: movimentos_retornado });
                }
                // Verifica se é uma torre das brancas
                else if ((origem & partida_simulada.bitboard_torre_branco) !== 0n && jogando == 'w') {
                    let movimentos_retornado = Calcular.todosAtaquesEMovimentosDaTorre('w', origem);
                    quantidade_movimentos_possiveis += movimentos_retornado.todos.length;

                    movimentos_possiveis_torre = movimentos_possiveis_torre.concat({ origem: origem, destino: movimentos_retornado });
                }
                // Verifica se é uma rainha das brancas
                else if ((origem & partida_simulada.bitboard_rainha_branco) !== 0n && jogando == 'w') {
                    let movimentos_retornado = Calcular.todosAtaquesEMovimentosDaRainha('w', origem);
                    quantidade_movimentos_possiveis += movimentos_retornado.todos.length;

                    movimentos_possiveis_rainha = movimentos_possiveis_rainha.concat({ origem: origem, destino: movimentos_retornado });
                }
                // Verifica se é um rei das brancas
                else if ((origem & partida_simulada.bitboard_rei_branco) !== 0n && jogando == 'w') {
                    let movimentos_retornado = Calcular.todosAtaquesEMovimentosDoRei('w', origem);
                    quantidade_movimentos_possiveis += movimentos_retornado.todos.length;

                    movimentos_possiveis_rei = movimentos_possiveis_rei.concat({ origem: origem, destino: movimentos_retornado });
                }

                // Atualizando a variável com o restante do bitboard
                bitboard_restante = bitboard_restante & (bitboard_restante - 1n);
            }

            todos_movimentos_possiveis = [...movimentos_possiveis_peao, ...movimentos_possiveis_cavalo, ...movimentos_possiveis_bispo, ...movimentos_possiveis_torre, ...movimentos_possiveis_rainha, ...movimentos_possiveis_rei];
        }

        // Pretas jogam
        else {
            bitboard_todas_pecas = partida_simulada.bitboard_peao_preto | partida_simulada.bitboard_cavalo_preto | partida_simulada.bitboard_bispo_preto | partida_simulada.bitboard_torre_preto | partida_simulada.bitboard_rainha_preto | partida_simulada.bitboard_rei_preto;

            let bitboard_restante = bitboard_todas_pecas;
            // Algoritmo Brian Kernighan
            for (let cont = 0; cont < 16; cont++) {
                let origem = bitboard_restante ^ (bitboard_restante & (bitboard_restante - 1n));

                if (bitboard_restante == 0n) {
                    break;
                }

                // Verifica se é um pião das pretas
                if ((origem & partida_simulada.bitboard_peao_preto) !== 0n && jogando == 'b') {
                    let movimentos_retornado = Calcular.todosAtaquesEMovimentosDoPeao('b', origem);
                    quantidade_movimentos_possiveis += movimentos_retornado.todos.length;

                    movimentos_possiveis_peao = movimentos_possiveis_peao.concat({ origem: origem, destino: movimentos_retornado });
                }
                // Verifica se é um cavalo das pretas
                else if ((origem & partida_simulada.bitboard_cavalo_preto) !== 0n && jogando == 'b') {
                    let movimentos_retornado = Calcular.todosAtaquesEMovimentosDoCavalo('b', origem);
                    quantidade_movimentos_possiveis += movimentos_retornado.todos.length;

                    movimentos_possiveis_cavalo = movimentos_possiveis_cavalo.concat({ origem: origem, destino: movimentos_retornado });
                }
                // Verifica se é um bispo das pretas
                else if ((origem & partida_simulada.bitboard_bispo_preto) !== 0n && jogando == 'b') {
                    let movimentos_retornado = Calcular.todosAtaquesEMovimentosDoBispo('b', origem);
                    quantidade_movimentos_possiveis += movimentos_retornado.todos.length;

                    movimentos_possiveis_bispo = movimentos_possiveis_bispo.concat({ origem: origem, destino: movimentos_retornado });
                }
                // Verifica se é uma torre das pretas
                else if ((origem & partida_simulada.bitboard_torre_preto) !== 0n && jogando == 'b') {
                    let movimentos_retornado = Calcular.todosAtaquesEMovimentosDaTorre('b', origem);
                    quantidade_movimentos_possiveis += movimentos_retornado.todos.length;

                    movimentos_possiveis_torre = movimentos_possiveis_torre.concat({ origem: origem, destino: movimentos_retornado });
                }
                // Verifica se é uma rainha das pretas
                else if ((origem & partida_simulada.bitboard_rainha_preto) !== 0n && jogando == 'b') {
                    let movimentos_retornado = Calcular.todosAtaquesEMovimentosDaRainha('b', origem);
                    quantidade_movimentos_possiveis += movimentos_retornado.todos.length;

                    movimentos_possiveis_rainha = movimentos_possiveis_rainha.concat({ origem: origem, destino: movimentos_retornado });
                }
                // Verifica se é um rei das pretas
                else if ((origem & partida_simulada.bitboard_rei_preto) !== 0n && jogando == 'b') {
                    let movimentos_retornado = Calcular.todosAtaquesEMovimentosDoRei('b', origem);
                    quantidade_movimentos_possiveis += movimentos_retornado.todos.length;

                    movimentos_possiveis_rei = movimentos_possiveis_rei.concat({ origem: origem, destino: movimentos_retornado });
                }

                // Atualizando a variável com o restante do bitboard
                bitboard_restante = bitboard_restante & (bitboard_restante - 1n);
            }

            todos_movimentos_possiveis = [...movimentos_possiveis_peao, ...movimentos_possiveis_cavalo, ...movimentos_possiveis_bispo, ...movimentos_possiveis_torre, ...movimentos_possiveis_rainha, ...movimentos_possiveis_rei];
        }

        const movimentos_possiveis = {
            peao: movimentos_possiveis_peao,
            cavalo: movimentos_possiveis_cavalo,
            bispo: movimentos_possiveis_bispo,
            torre: movimentos_possiveis_torre,
            rainha: movimentos_possiveis_rainha,
            rei: movimentos_possiveis_rei,
            todos: todos_movimentos_possiveis,
            quantidade: quantidade_movimentos_possiveis,
        };

        return movimentos_possiveis;
    }

    // Essa funçao é responsável por calcular todas as casas que estão sendo atacadas pelas pretas e brancas.
    static casasAtacadas(relatorio = false) {
        let casas_atacada_peao_brancas = [];
        let casas_atacada_cavalo_brancas = [];
        let casas_atacada_bispo_brancas = [];
        let casas_atacada_torre_brancas = [];
        let casas_atacada_rainha_brancas = [];
        let casas_atacada_rei_brancas = [];
        let casas_atacada_brancas = [];

        let casas_atacada_peao_pretas = [];
        let casas_atacada_cavalo_pretas = [];
        let casas_atacada_bispo_pretas = [];
        let casas_atacada_torre_pretas = [];
        let casas_atacada_rainha_pretas = [];
        let casas_atacada_rei_pretas = [];
        let casas_atacada_pretas = [];

        let bitboard_todas_pecas_brancas = partida_simulada.bitboard_peao_branco | partida_simulada.bitboard_cavalo_branco | partida_simulada.bitboard_bispo_branco | partida_simulada.bitboard_torre_branco | partida_simulada.bitboard_rainha_branco | partida_simulada.bitboard_rei_branco;
        let bitboard_todas_pecas_pretas = partida_simulada.bitboard_peao_preto | partida_simulada.bitboard_cavalo_preto | partida_simulada.bitboard_bispo_preto | partida_simulada.bitboard_torre_preto | partida_simulada.bitboard_rainha_preto | partida_simulada.bitboard_rei_preto;
        let bitboard_tabuleiro = bitboard_todas_pecas_brancas | bitboard_todas_pecas_pretas;

        let bitboard_restante = bitboard_tabuleiro;

        // Algoritmo Brian Kernighan
        for (let cont = 0; cont < 32; cont++) {
            let origem = bitboard_restante ^ (bitboard_restante & (bitboard_restante - 1n));

            if (bitboard_restante == 0n) {
                break;
            }

            if ((origem & partida_simulada.bitboard_peao_branco) !== 0n) {
                // Vai entrar caso senha "true" no parâmetro de relatório
                if (relatorio == true) {
                    const retorno_casas_atacadas = Calcular.todosAtaquesEMovimentosDoPeao('w', origem, true, true);
                    casas_atacada_peao_brancas = casas_atacada_peao_brancas.concat(retorno_casas_atacadas);
                    let soma_casas_atacadas = 0n;
                    for (let casa_atacada of retorno_casas_atacadas) {
                        soma_casas_atacadas |= casa_atacada;
                    }
                    gerarRelatorioAtacados(origem, 'w', soma_casas_atacadas);
                } else {
                    casas_atacada_peao_brancas = casas_atacada_peao_brancas.concat(Calcular.todosAtaquesEMovimentosDoPeao('w', origem, true, true));
                }
            } else if ((origem & partida_simulada.bitboard_cavalo_branco) !== 0n) {
                // Vai entrar caso senha "true" no parâmetro de relatório
                if (relatorio == true) {
                    const retorno_casas_atacadas = Calcular.todosAtaquesEMovimentosDoCavalo('w', origem, true, true);
                    casas_atacada_cavalo_brancas = casas_atacada_cavalo_brancas.concat(retorno_casas_atacadas);
                    let soma_casas_atacadas = 0n;
                    for (let casa_atacada of retorno_casas_atacadas) {
                        soma_casas_atacadas |= casa_atacada;
                    }
                    gerarRelatorioAtacados(origem, 'w', soma_casas_atacadas);
                } else {
                    casas_atacada_cavalo_brancas = casas_atacada_cavalo_brancas.concat(Calcular.todosAtaquesEMovimentosDoCavalo('w', origem, true, true));
                }
            } else if ((origem & partida_simulada.bitboard_bispo_branco) !== 0n) {
                // Vai entrar caso senha "true" no parâmetro de relatório
                if (relatorio == true) {
                    const retorno_casas_atacadas = Calcular.todosAtaquesEMovimentosDoBispo('w', origem, true, true);
                    casas_atacada_bispo_brancas = casas_atacada_bispo_brancas.concat(retorno_casas_atacadas);
                    let soma_casas_atacadas = 0n;
                    for (let casa_atacada of retorno_casas_atacadas) {
                        soma_casas_atacadas |= casa_atacada;
                    }
                    gerarRelatorioAtacados(origem, 'w', soma_casas_atacadas);
                } else {
                    casas_atacada_bispo_brancas = casas_atacada_bispo_brancas.concat(Calcular.todosAtaquesEMovimentosDoBispo('w', origem, true, true));
                }
            } else if ((origem & partida_simulada.bitboard_torre_branco) !== 0n) {
                // Vai entrar caso senha "true" no parâmetro de relatório
                if (relatorio == true) {
                    const retorno_casas_atacadas = Calcular.todosAtaquesEMovimentosDaTorre('w', origem, true, true);
                    casas_atacada_torre_brancas = casas_atacada_torre_brancas.concat(retorno_casas_atacadas);
                    let soma_casas_atacadas = 0n;
                    for (let casa_atacada of retorno_casas_atacadas) {
                        soma_casas_atacadas |= casa_atacada;
                    }
                    gerarRelatorioAtacados(origem, 'w', soma_casas_atacadas);
                } else {
                    casas_atacada_torre_brancas = casas_atacada_torre_brancas.concat(Calcular.todosAtaquesEMovimentosDaTorre('w', origem, true, true));
                }
            } else if ((origem & partida_simulada.bitboard_rainha_branco) !== 0n) {
                // Vai entrar caso senha "true" no parâmetro de relatório
                if (relatorio == true) {
                    const retorno_casas_atacadas = Calcular.todosAtaquesEMovimentosDaRainha('w', origem, true, true);
                    casas_atacada_rainha_brancas = casas_atacada_rainha_brancas.concat(retorno_casas_atacadas);
                    let soma_casas_atacadas = 0n;
                    for (let casa_atacada of retorno_casas_atacadas) {
                        soma_casas_atacadas |= casa_atacada;
                    }
                    gerarRelatorioAtacados(origem, 'w', soma_casas_atacadas);
                } else {
                    casas_atacada_rainha_brancas = casas_atacada_rainha_brancas.concat(Calcular.todosAtaquesEMovimentosDaRainha('w', origem, true, true));
                }
            } else if ((origem & partida_simulada.bitboard_rei_branco) !== 0n) {
                // Vai entrar caso senha "true" no parâmetro de relatório
                if (relatorio == true) {
                    const retorno_casas_atacadas = Calcular.todosAtaquesEMovimentosDoRei('w', origem, true, true);
                    casas_atacada_rei_brancas = casas_atacada_rei_brancas.concat(retorno_casas_atacadas);
                    let soma_casas_atacadas = 0n;
                    for (let casa_atacada of retorno_casas_atacadas) {
                        soma_casas_atacadas |= casa_atacada;
                    }
                    gerarRelatorioAtacados(origem, 'w', soma_casas_atacadas);
                } else {
                    casas_atacada_rei_brancas = casas_atacada_rei_brancas.concat(Calcular.todosAtaquesEMovimentosDoRei('w', origem, true, true));
                }
            } else if ((origem & partida_simulada.bitboard_peao_preto) !== 0n) {
                // Vai entrar caso senha "true" no parâmetro de relatório
                if (relatorio == true) {
                    const retorno_casas_atacadas = Calcular.todosAtaquesEMovimentosDoPeao('b', origem, true, true);
                    casas_atacada_peao_pretas = casas_atacada_peao_pretas.concat(retorno_casas_atacadas);
                    let soma_casas_atacadas = 0n;
                    for (let casa_atacada of retorno_casas_atacadas) {
                        soma_casas_atacadas |= casa_atacada;
                    }
                    gerarRelatorioAtacados(origem, 'b', soma_casas_atacadas);
                } else {
                    casas_atacada_peao_pretas = casas_atacada_peao_pretas.concat(Calcular.todosAtaquesEMovimentosDoPeao('b', origem, true, true));
                }
            } else if ((origem & partida_simulada.bitboard_cavalo_preto) !== 0n) {
                // Vai entrar caso senha "true" no parâmetro de relatório
                if (relatorio == true) {
                    const retorno_casas_atacadas = Calcular.todosAtaquesEMovimentosDoCavalo('b', origem, true, true);
                    casas_atacada_cavalo_pretas = casas_atacada_cavalo_pretas.concat(retorno_casas_atacadas);
                    let soma_casas_atacadas = 0n;
                    for (let casa_atacada of retorno_casas_atacadas) {
                        soma_casas_atacadas |= casa_atacada;
                    }
                    gerarRelatorioAtacados(origem, 'b', soma_casas_atacadas);
                } else {
                    casas_atacada_cavalo_pretas = casas_atacada_cavalo_pretas.concat(Calcular.todosAtaquesEMovimentosDoCavalo('b', origem, true, true));
                }
            } else if ((origem & partida_simulada.bitboard_bispo_preto) !== 0n) {
                // Vai entrar caso senha "true" no parâmetro de relatório
                if (relatorio == true) {
                    const retorno_casas_atacadas = Calcular.todosAtaquesEMovimentosDoBispo('b', origem, true, true);
                    casas_atacada_bispo_pretas = casas_atacada_bispo_pretas.concat(retorno_casas_atacadas);
                    let soma_casas_atacadas = 0n;
                    for (let casa_atacada of retorno_casas_atacadas) {
                        soma_casas_atacadas |= casa_atacada;
                    }
                    gerarRelatorioAtacados(origem, 'b', soma_casas_atacadas);
                } else {
                    casas_atacada_bispo_pretas = casas_atacada_bispo_pretas.concat(Calcular.todosAtaquesEMovimentosDoBispo('b', origem, true, true));
                }
            } else if ((origem & partida_simulada.bitboard_torre_preto) !== 0n) {
                // Vai entrar caso senha "true" no parâmetro de relatório
                if (relatorio == true) {
                    const retorno_casas_atacadas = Calcular.todosAtaquesEMovimentosDaTorre('b', origem, true, true);
                    casas_atacada_torre_pretas = casas_atacada_torre_pretas.concat(retorno_casas_atacadas);
                    let soma_casas_atacadas = 0n;
                    for (let casa_atacada of retorno_casas_atacadas) {
                        soma_casas_atacadas |= casa_atacada;
                    }
                    gerarRelatorioAtacados(origem, 'b', soma_casas_atacadas);
                } else {
                    casas_atacada_torre_pretas = casas_atacada_torre_pretas.concat(Calcular.todosAtaquesEMovimentosDaTorre('b', origem, true, true));
                }
            } else if ((origem & partida_simulada.bitboard_rainha_preto) !== 0n) {
                // Vai entrar caso senha "true" no parâmetro de relatório
                if (relatorio == true) {
                    const retorno_casas_atacadas = Calcular.todosAtaquesEMovimentosDaRainha('b', origem, true, true);
                    casas_atacada_rainha_pretas = casas_atacada_rainha_pretas.concat(retorno_casas_atacadas);
                    let soma_casas_atacadas = 0n;
                    for (let casa_atacada of retorno_casas_atacadas) {
                        soma_casas_atacadas |= casa_atacada;
                    }
                    gerarRelatorioAtacados(origem, 'b', soma_casas_atacadas);
                } else {
                    casas_atacada_rainha_pretas = casas_atacada_rainha_pretas.concat(Calcular.todosAtaquesEMovimentosDaRainha('b', origem, true, true));
                }
            } else if ((origem & partida_simulada.bitboard_rei_preto) !== 0n) {
                // Vai entrar caso senha "true" no parâmetro de relatório
                if (relatorio == true) {
                    const retorno_casas_atacadas = Calcular.todosAtaquesEMovimentosDoRei('b', origem, true, true);
                    casas_atacada_rei_pretas = casas_atacada_rei_pretas.concat(retorno_casas_atacadas);
                    let soma_casas_atacadas = 0n;
                    for (let casa_atacada of retorno_casas_atacadas) {
                        soma_casas_atacadas |= casa_atacada;
                    }
                    gerarRelatorioAtacados(origem, 'b', soma_casas_atacadas);
                } else {
                    casas_atacada_rei_pretas = casas_atacada_rei_pretas.concat(Calcular.todosAtaquesEMovimentosDoRei('b', origem, true, true));
                }
            }

            // Atualizando a variável com o restante do bitboard
            bitboard_restante = bitboard_restante & (bitboard_restante - 1n);
        }

        casas_atacada_brancas = [...casas_atacada_peao_brancas, ...casas_atacada_cavalo_brancas, ...casas_atacada_bispo_brancas, ...casas_atacada_torre_brancas, ...casas_atacada_rainha_brancas, ...casas_atacada_rei_brancas];
        casas_atacada_pretas = [...casas_atacada_peao_pretas, ...casas_atacada_cavalo_pretas, ...casas_atacada_bispo_pretas, ...casas_atacada_torre_pretas, ...casas_atacada_rainha_pretas, ...casas_atacada_rei_pretas];

        if (relatorio == false) {
            partida_simulada.casas_atacadas_pelas_brancas = 0n;
            partida_simulada.casas_atacadas_pelas_pretas = 0n;

            casas_atacada_brancas.map((movimento) => {
                partida_simulada.casas_atacadas_pelas_brancas |= movimento;
            });
            casas_atacada_pretas.map((movimento) => {
                partida_simulada.casas_atacadas_pelas_pretas |= movimento;
            });
        } else {
            let casas_atacadas_pelas_brancas = 0n;
            let casas_atacadas_pelas_pretas = 0n;

            casas_atacada_brancas.map((movimento) => {
                casas_atacadas_pelas_brancas |= movimento;
            });
            gerarRelatorioAtacados(null, 'w', casas_atacadas_pelas_brancas);

            casas_atacada_pretas.map((movimento) => {
                casas_atacadas_pelas_pretas |= movimento;
            });
            gerarRelatorioAtacados(null, 'b', casas_atacadas_pelas_pretas);
        }
    }

    static seReiAtacado(jogando) {
        // Brancas jogam
        if (jogando == 'w') {
            if ((partida_simulada.bitboard_rei_branco & partida_simulada.casas_atacadas_pelas_pretas) !== 0n) {
                partida_simulada.rei_branco_em_ataque = true;
                return true;
            } else {
                partida_simulada.rei_branco_em_ataque = false;
                return false;
            }
        }

        // Pretas jogam
        else {
            if ((partida_simulada.bitboard_rei_preto & partida_simulada.casas_atacadas_pelas_brancas) !== 0n) {
                partida_simulada.rei_preto_em_ataque = true;
                return true;
            } else {
                partida_simulada.rei_preto_em_ataque = false;
                return false;
            }
        }
    }

    // Função responsável por verificar se o rei está em xeque (depende da função "Calcular.seReiAtacado")
    static seReiTemEscaptaria(jogando) {
        // Brancas jogam
        if (jogando == 'w') {
            const rei_atacado = Calcular.seReiAtacado('w');
            const todos_possiveis_movimentos = Calcular.todosPossiveisMovimentosDeTodasPecas(jogando);

            if (rei_atacado) {
                if (todos_possiveis_movimentos.quantidade == 0) {
                    Chess.status = 'xeque mate';
                    Chess.fim_do_jogo = true;
                    aviso('Fim de jogo: Xeque Mate', '', false);
                    iniciarSom('xeque mate');
                } else {
                    // Está em xeque
                    Chess.status = 'xeque';
                    aviso('Xeque', '', false);
                    iniciarSom('xeque');
                }
            } else if (todos_possiveis_movimentos.quantidade <= 0) {
                Chess.status = 'empate';
                Chess.fim_do_jogo = true;
                aviso('Fim de jogo: Empate (afogamento)', '', false);
                iniciarSom('empate');
            }
            // Não está em xeque
            return false;
        }
        // Pretas jogam
        else {
            const rei_atacado = Calcular.seReiAtacado('b');
            const todos_possiveis_movimentos = Calcular.todosPossiveisMovimentosDeTodasPecas(jogando);

            if (rei_atacado) {
                if (todos_possiveis_movimentos.quantidade == 0) {
                    Chess.status = 'xeque mate';
                    Chess.fim_do_jogo = true;
                    aviso('Fim de jogo: Xeque Mate', '', false);
                    iniciarSom('xeque mate');
                } else {
                    // Está em xeque
                    Chess.status = 'xeque';
                    aviso('Xeque', '', false);
                    iniciarSom('xeque');
                }
            } else if (todos_possiveis_movimentos.quantidade <= 0) {
                Chess.status = 'empate';
                Chess.fim_do_jogo = true;
                aviso('Fim de jogo: Empate (afogamento)', '', false);
                iniciarSom('empate');
            }
            // Não está em xeque
            return false;
        }
    }

    // Função responsável por verificar se é possível fazer a promoção do pião
    static seTemPromocao(jogando) {
        // Brancas jogam
        if (jogando == 'w') {
            // Entra caso tenha pião nas casas de promoção
            if ((informacoes_xadrez.casas_linha_8 & partida_simulada.bitboard_peao_branco) != 0n) {
                return true;
            } else {
                return false;
            }
        }
        // Pretas jogam
        else {
            // Entra caso tenha pião nas casas de promoção
            if ((informacoes_xadrez.casas_linha_1 & partida_simulada.bitboard_peao_preto) != 0n) {
                return true;
            } else {
                return false;
            }
        }
    }
}
