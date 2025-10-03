let captura = false;

// Função orquestradora e que fica exporta (única).
function mover(origem, destino, promocao, movimentos = null){

  // Zerando os en passant caso tenha
  if(partida_real.jogando == "b" && partida_real.en_passant_pretas !== 0n){
    partida_real.en_passant_pretas = 0n;
    partida_simulada.en_passant_brancas = 0n;
  }
  else if(partida_real.jogando == "w" && partida_real.en_passant_brancas !== 0n){
    partida_real.en_passant_brancas = 0n;
    partida_simulada.en_passant_brancas = 0n;
  }

  // Função responsável por identificar a peça movida
  let peca_movida = identificar_peca_movida(origem);

  // Chamando a função principal da peça movida
  switch(peca_movida){
    case "p":
      Peao.validador(origem, destino, promocao, movimentos);
      break;
    case "n":
      Cavalo.validador(origem, destino, movimentos);
      break;
    case "b":
      Bispo.validador(origem, destino, movimentos);
      break;
    case "r":
      Torre.validador(origem, destino, movimentos);
      break;
    case "q":
      Dama.validador(origem, destino, movimentos);
      break;
    case "k":
      Rei.validador(origem, destino, movimentos);
      break;
  }

  // Atualizando as casas atacadas depois de ter válidado e realizado o movimento
  Calcular.casas_atacadas();
  // Verificando se os reis estão atacados (atualizando o status)
  Calcular.se_rei_atacado("w");
  Calcular.se_rei_atacado("b");

  sincronizar_partida_real_com_partida_simulada();

  // Caso seja as pretas jogando implementa +1 no contador da partida
  if(partida_real.jogando == "b"){
    partida_real.numero_lances_completo += 1;
  }

  // Verificando se a casa atacada é uma torre, se for, atualiza o status do roque (Evitando que o bitboard de roque fique desatualizado)
  if(partida_real.jogando == "w"){
    if((destino == informacoes_xadrez.casa_inicial_torre_esquerda_preto) && partida_real.status_roque_esquerda_preto == true){
      partida_real.status_roque_esquerda_preto = false;
    }
    else if((destino == informacoes_xadrez.casa_inicial_torre_direita_preto) && partida_real.status_roque_direita_preto == true){
      partida_real.status_roque_direita_preto = false;
    }
  }
  else{
    if((destino == informacoes_xadrez.casa_inicial_torre_esquerda_branca) && partida_real.status_roque_esquerda_branco == true){
      partida_real.status_roque_esquerda_branco = false;
    }
    else if((destino == informacoes_xadrez.casa_inicial_torre_direita_branca) && partida_real.status_roque_direita_branco == true){
      partida_real.status_roque_direita_branco = false;
    }
  }

  partida_real.jogando = (partida_real.jogando == "w") ? "b" : "w";

  Calcular.se_rei_tem_escaptoria(partida_real.jogando);

  // Verificando se foi feito um movimento repetido 3 vezes
  let fen_atual = converterFEN().split(" ").splice(0, 4).join(" ");

  let fen_repetido = partida_real.fen_jogados.filter((fen) => {
    return converterFEN().split(" ").splice(0, 4).join(" ") == fen;
  });

  if(fen_repetido.length >= 2){
    throw new Error("Empate por repetição");
  }

  partida_real.fen_jogados.push(fen_atual);

  if(captura == true){
    captura = false;
    throw new Error("Captura");
  }
}

function identificar_peca_movida(origem){
  // Brancas jogam
  if(partida_real.jogando == "w"){
    // Verificando se a peça movida é um pião das brancas
    if(partida_real.bitboard_peao_branco & origem){
      return "p";
    }

    // Verificando se a peça movida é um cavalo da brancas
    else if(partida_real.bitboard_cavalo_branco & origem){
      return "n";
    }

    // Verificando se a peça movida é um bispo da brancas
    else if(partida_real.bitboard_bispo_branco & origem){
      return "b";
    }

    // Verificando se a peça movida é um torre da brancas
    else if(partida_real.bitboard_torre_branco & origem){
      return "r";
    }

    // Verificando se a peça movida é uma rainha da brancas
    else if(partida_real.bitboard_rainha_branco & origem){
      return "q";
    }

    // Verificando se a peça movida é um rei da brancas
    else if(partida_real.bitboard_rei_branco  & origem){
      return "k";
    }

    // Caso não encontre
    else{
      throw new Error("Vez do adversário");
    }
  }
  // Pretas joga,
  else{
    // Verificando se a peça movida é um pião das pretas
    if(partida_real.bitboard_peao_preto & origem){
      return "p";
    }

    // Verificando se a peça movida é um cavalo da pretas
    else if(partida_real.bitboard_cavalo_preto & origem){
      return "n";
    }

    // Verificando se a peça movida é um bispo da pretas
    else if(partida_real.bitboard_bispo_preto & origem){
      return "b";
    }

    // Verificando se a peça movida é um torre da pretas
    else if(partida_real.bitboard_torre_preto & origem){
      return "r";
    }

    // Verificando se a peça movida é uma rainha da pretas
    else if(partida_real.bitboard_rainha_preto & origem){
      return "q";
    }

    // Verificando se a peça movida é um rei da pretas
    else if(partida_real.bitboard_rei_preto & origem){
      return "k";
    }

    // Caso não encontre
    else{
      throw new Error("Vez do adversário");
    }
  }
}

class Peao{
  // Método principal, responsável por verificar se o movimento é válido, se for efetivar
  static validador(origem, destino, promocao){
    // Calculandos os movimentos legais da peça
    let movimentos_possiveis = Calcular.todos_ataques_e_movimentos_do_peao(partida_real.jogando, origem);
    
    // Verificando se o lance feito é um lance inválido
    if(movimentos_possiveis.todos.includes(destino) == false){
      throw new Error("Movimento inválido");
    }

    // Verificando se foi feito um en passant
    if((movimentos_possiveis.en_passant.length > 0) && movimentos_possiveis.en_passant.includes(destino)){
      Peao.efetuar_en_passant(origem, destino);
      captura = true;
    }
    // Verificando se foi feito uma captura
    else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
      efetuar_captura(origem, destino, "p");
      captura = true;
    }
    // Feito um movimento
    else{
      const destino_esperado_duplo = (partida_real.jogando == "w") ? origem << informacoes_xadrez.movimento_peao[1] : origem >> informacoes_xadrez.movimento_peao[1];
      const bitboard_peao_adversario = (partida_real.jogando == "w") ? partida_simulada.bitboard_peao_preto : partida_simulada.bitboard_peao_branco;
      const bitboard_com_en_passant = (partida_real.jogando == "w") ? origem << informacoes_xadrez.movimento_peao[0] : origem >> informacoes_xadrez.movimento_peao[0];
      
      // Verificando se foi feito um movimento duplo AND se tem inimigo ao lado. Se for feito vai atualizar o bitboard de en passant.
      if((destino_esperado_duplo == destino) && (((destino << 1n) | (destino >> 1n) & bitboard_peao_adversario) != 0n)){
        if(partida_real.jogando == "w"){
          partida_simulada.en_passant_brancas = bitboard_com_en_passant;
        }
        else{
          partida_simulada.en_passant_pretas = bitboard_com_en_passant;
        }
      }
      efetuar_movimento(origem, destino, "p");
    }
    
    // Entra se tiver promocao
    if(Calcular.se_tem_promocao(partida_real.jogando)){
      if(partida_real.jogando == "w"){
        if(promocao == "r"){
          partida_simulada.bitboard_torre_branco ^= partida_simulada.bitboard_peao_branco & destino;
        }
        else if(promocao == "b"){
          partida_simulada.bitboard_bispo_branco ^= partida_simulada.bitboard_peao_branco & destino;
        }
        else if(promocao == "n"){
          partida_simulada.bitboard_cavalo_branco ^= partida_simulada.bitboard_peao_branco & destino;
        }
        else{
          partida_simulada.bitboard_rainha_branco ^= partida_simulada.bitboard_peao_branco & destino;
        }

        partida_simulada.bitboard_peao_branco ^= partida_simulada.bitboard_peao_branco & destino;
      }
      else{
        if(promocao == "r"){
          partida_simulada.bitboard_torre_preto ^= partida_simulada.bitboard_peao_preto & destino;
        }
        else if(promocao == "b"){
          partida_simulada.bitboard_bispo_preto ^= partida_simulada.bitboard_peao_preto & destino;
        }
        else if(promocao == "n"){
          partida_simulada.bitboard_cavalo_preto ^= partida_simulada.bitboard_peao_preto & destino;
        }
        else{
          partida_simulada.bitboard_rainha_preto ^= partida_simulada.bitboard_peao_preto & destino;
        }

        partida_simulada.bitboard_peao_preto ^= partida_simulada.bitboard_peao_preto & destino;
      }
    }

    return;
  }

  static efetuar_en_passant(origem, destino){
    // Brancas jogam
    if(partida_real.jogando == "w"){
      partida_simulada.bitboard_peao_preto ^= (partida_simulada.en_passant_pretas >> informacoes_xadrez.movimento_peao[0]) 
      partida_simulada.en_passant_pretas = 0n;
    }
    // Pretas jogam
    else{
      partida_simulada.bitboard_peao_branco ^= (partida_simulada.en_passant_brancas << informacoes_xadrez.movimento_peao[0]) 
      partida_simulada.en_passant_brancas = 0n;
    }

    efetuar_movimento(origem, destino, "p");
    return;
  }
}

class Cavalo{
  // Método principal, responsável por verificar se o movimento é válido, se for efetivar
  static validador(origem, destino){
    // Calculandos os movimentos legais da peça
    let movimentos_possiveis = Calcular.todos_ataques_e_movimentos_do_cavalo(partida_real.jogando, origem);
    
    // Verificando se o lance feito é um lance inválido
    if(movimentos_possiveis.todos.includes(destino) == false){
      throw new Error("Movimento inválido");
    }

    // Verificando se foi feito uma captura
    else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
      efetuar_captura(origem, destino, "n");
      captura = true;
    }
    // Feito um movimento
    else{
      efetuar_movimento(origem, destino, "n");
    }

    return;
  }
}

class Bispo{
  // Método principal, responsável por verificar se o movimento é válido, se for efetivar
  static validador(origem, destino){
      // Calculandos os movimentos possiveis referente a peça
      let movimentos_possiveis = Calcular.todos_ataques_e_movimentos_do_bispo(partida_real.jogando, origem);

    // Verificando se o lance feito é um lance inválido
    if(movimentos_possiveis.todos.includes(destino) == false){
      throw new Error("Movimento inválido");
    }

    // Verificando se foi feito uma captura
    else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
      efetuar_captura(origem, destino, "b");
      captura = true;
    }
    // Feito um movimento
    else{
      efetuar_movimento(origem, destino, "b");
    }

    return;
  }
}

class Torre{
  // Método principal, responsável por verificar se o movimento é válido, se for efetivar
  static validador(origem, destino){
    // Calculandos os movimentos possiveis referente a peça
    let movimentos_possiveis = Calcular.todos_ataques_e_movimentos_do_torre(partida_real.jogando, origem);

    // Verificando se o lance feito é um lance inválido
    if(movimentos_possiveis.todos.includes(destino) == false){
      throw new Error("Movimento inválido");
    }

    // Verificando se foi feito uma captura
    else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
      efetuar_captura(origem, destino, "r");
      captura = true;
    }
    // Feito um movimento
    else{
      efetuar_movimento(origem, destino, "r");
    }

    return;
  }
}

class Dama{
  // Método principal, responsável por verificar se o movimento é válido, se for efetivar
  static validador(origem, destino){
    // Calculandos os movimentos legais da peça
    let movimentos_possiveis = Calcular.todos_ataques_e_movimentos_do_rainha(partida_real.jogando, origem);

    // Verificando se o lance feito é um lance inválido
    if(movimentos_possiveis.todos.includes(destino) == false){
      throw new Error("Movimento inválido");
    }

    // Verificando se foi feito uma captura
    else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
      efetuar_captura(origem, destino, "q");
      captura = true;
    }
    // Feito um movimento
    else{
      efetuar_movimento(origem, destino, "q");
    }

    return;
  }
}

class Rei{
  // Método principal, responsável por verificar se o movimento é válido, se for efetivar
  static validador(origem, destino){
    // Calculandos os movimentos legais da peça
    let movimentos_possiveis = Calcular.todos_ataques_e_movimentos_do_rei(partida_real.jogando, origem);

    // Verificando se o lance feito é um lance inválido
    if(movimentos_possiveis.todos.includes(destino) == false){
      throw new Error("Movimento inválido");
    }
    // Verificando se foi feito roque para esquerda
    else if((movimentos_possiveis.roque_esquerda.length > 0) && movimentos_possiveis.roque_esquerda.includes(destino)){
      Rei.efetuar_roque_esquerda(origem, destino);
    }
    // Verificando se foi feito roque para direita
    else if((movimentos_possiveis.roque_direita.length > 0) && movimentos_possiveis.roque_direita.includes(destino)){
      Rei.efetuar_roque_direita(origem, destino);
    }
    // Verificando se foi feito uma captura
    else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
      efetuar_captura(origem, destino, "k");
      captura = true;
    }
    // Feito um movimento
    else{
      efetuar_movimento(origem, destino, "k");
    }

    return;
  }

  static efetuar_roque_esquerda(){
    // Brancas jogam
    if(partida_real.jogando == "w"){
      partida_simulada.bitboard_torre_branco = ((partida_real.bitboard_torre_branco ^ 0x0000000000000001n) | informacoes_xadrez.casa_destino_torre_roque_esquerda_branco);
      partida_simulada.bitboard_rei_branco = informacoes_xadrez.casa_destino_rei_roque_esquerda_branco;
      partida_simulada.status_roque_esquerda_branco = false;
      partida_simulada.status_roque_direita_branco = false;
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{
      partida_simulada.bitboard_torre_preto= ((partida_real.bitboard_torre_preto ^ 0x0100000000000000n) | informacoes_xadrez.casa_destino_torre_roque_esquerda_preto);
      partida_simulada.bitboard_rei_preto = informacoes_xadrez.casa_destino_rei_roque_esquerda_preto;
      partida_simulada.status_roque_esquerda_preto = false;
      partida_simulada.status_roque_direita_preto = false;
      atualizarTabuleiro();
      return;
    }
    
  }

  static efetuar_roque_direita(){
    // Brancas jogam
    if(partida_real.jogando == "w"){
      partida_simulada.bitboard_torre_branco = ((partida_simulada.bitboard_torre_branco ^ 0x0000000000000080n) | informacoes_xadrez.casa_destino_torre_roque_direita_branco);
      partida_simulada.bitboard_rei_branco = informacoes_xadrez.casa_destino_rei_roque_direita_branco;
      partida_simulada.status_roque_esquerda_branco = false;
      partida_simulada.status_roque_direita_branco = false;
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{
      partida_simulada.bitboard_torre_preto = ((partida_simulada.bitboard_torre_preto ^ 0x8000000000000000n) | informacoes_xadrez.casa_destino_torre_roque_direita_preto);
      partida_simulada.bitboard_rei_preto = informacoes_xadrez.casa_destino_rei_roque_direita_preto;
      partida_simulada.status_roque_esquerda_preto = false;
      partida_simulada.status_roque_direita_preto = false;
      atualizarTabuleiro();
      return;
    }
  }
}

function efetuar_movimento(origem, destino, peca){
  // Brancas jogam
  if(partida_real.jogando == "w"){
    // Realiza o movimento do pião
    if(peca == "p"){
      partida_simulada.bitboard_peao_branco ^= origem;
      partida_simulada.bitboard_peao_branco |= destino;
    }
    // Realiza o movimento do cavalo
    else if(peca == "n"){
      partida_simulada.bitboard_cavalo_branco ^= origem;
      partida_simulada.bitboard_cavalo_branco |= destino;
    }
    // Realiza o movimento do bispo
    else if(peca == "b"){
      partida_simulada.bitboard_bispo_branco ^= origem;
      partida_simulada.bitboard_bispo_branco |= destino;
    }
    // Realiza o movimento da torre
    else if(peca == "r"){
      // Caso a torre seja movida, vai desativar o roque do lado movido
      if((origem & informacoes_xadrez.casa_inicial_torre_direita_branca) != 0n){
        partida_simulada.status_roque_direita_branco = false;
      }
      else if((origem & informacoes_xadrez.casa_inicial_torre_esquerda_branca) != 0n){
        partida_simulada.status_roque_esquerda_branco = false;
      }

      partida_simulada.bitboard_torre_branco ^= origem;
      partida_simulada.bitboard_torre_branco |= destino;
    }
    // Realiza o movimento da dama
    else if(peca == "q"){
      partida_simulada.bitboard_rainha_branco ^= origem;
      partida_simulada.bitboard_rainha_branco |= destino;
    }
    // Realiza o movimento do rei
    else if(peca == "k"){
      // Caso o rei seja movido, vai desativar o roque
      partida_simulada.status_roque_direita_branco = false;
      partida_simulada.status_roque_esquerda_branco = false;
      
      // Realizando movimento
      partida_simulada.bitboard_rei_branco ^= origem;
      partida_simulada.bitboard_rei_branco |= destino;
    }
  }

  // Pretas jogam
  else{
    // Realiza o movimento do pião
    if(peca == "p"){
      partida_simulada.bitboard_peao_preto ^= origem;
      partida_simulada.bitboard_peao_preto |= destino;
    }
    // Realiza o movimento do cavalo
    else if(peca == "n"){
      partida_simulada.bitboard_cavalo_preto ^= origem;
      partida_simulada.bitboard_cavalo_preto |= destino;
    }
    // Realiza o movimento do bispo
    else if(peca == "b"){
      partida_simulada.bitboard_bispo_preto ^= origem;
      partida_simulada.bitboard_bispo_preto |= destino;
    }
    // Realiza o movimento da torre
    else if(peca == "r"){
      // Caso a torre seja movida, vai desativar o roque do lado movido
      if((origem & informacoes_xadrez.casa_inicial_torre_direita_preto) != 0n){
        partida_simulada.status_roque_direita_preto = false;
      }
      else if((origem & informacoes_xadrez.casa_inicial_torre_esquerda_preto) != 0n){
        partida_simulada.status_roque_esquerda_preto = false;
      }

      partida_simulada.bitboard_torre_preto ^= origem;
      partida_simulada.bitboard_torre_preto |= destino;
    }
    // Realiza o movimento da dama
    else if(peca == "q"){
      partida_simulada.bitboard_rainha_preto ^= origem;
      partida_simulada.bitboard_rainha_preto |= destino;
    }
    // Realiza o movimento do rei
    else if(peca == "k"){
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

function efetuar_captura(origem, destino, peca){
  // Brancas jogam
  if(partida_real.jogando == "w"){
    //  Atualizando o bitboard das pretas (capturando a peça)
    partida_simulada.bitboard_peao_preto ^= (partida_simulada.bitboard_peao_preto & destino);
    partida_simulada.bitboard_cavalo_preto ^= (partida_simulada.bitboard_cavalo_preto & destino);
    partida_simulada.bitboard_bispo_preto ^= (partida_simulada.bitboard_bispo_preto & destino);
    partida_simulada.bitboard_torre_preto ^= (partida_simulada.bitboard_torre_preto & destino);
    partida_simulada.bitboard_rainha_preto ^= (partida_simulada.bitboard_rainha_preto & destino);
  }
  // Pretas jogam
  else{
    //  Atualizando o bitboard das brancas (capturando a peça)
    partida_simulada.bitboard_peao_branco ^= (partida_simulada.bitboard_peao_branco & destino);
    partida_simulada.bitboard_cavalo_branco ^= (partida_simulada.bitboard_cavalo_branco & destino);
    partida_simulada.bitboard_bispo_branco ^= (partida_simulada.bitboard_bispo_branco & destino);
    partida_simulada.bitboard_torre_branco ^= (partida_simulada.bitboard_torre_branco & destino);
    partida_simulada.bitboard_rainha_branco ^= (partida_simulada.bitboard_rainha_branco & destino);
  }

  efetuar_movimento(origem, destino, peca)
  return;
}

function atualizarTabuleiro(){
  // Atualizando o bitboard de todas as peças brancas
  partida_simulada.bitboard_pecas_brancas = partida_simulada.bitboard_peao_branco | partida_simulada.bitboard_cavalo_branco | partida_simulada.bitboard_bispo_branco | partida_simulada.bitboard_torre_branco | partida_simulada.bitboard_rainha_branco | partida_simulada.bitboard_rei_branco;

  // Atualizando o bitboard de todas as peças pretas
  partida_simulada.bitboard_pecas_pretas = partida_simulada.bitboard_peao_preto | partida_simulada.bitboard_cavalo_preto | partida_simulada.bitboard_bispo_preto | partida_simulada.bitboard_torre_preto | partida_simulada.bitboard_rainha_preto | partida_simulada.bitboard_rei_preto;
  
  // Atualizando o bitboard com todas as casas ocupadas
  partida_simulada.bitboard_tabuleiro_completo = partida_simulada.bitboard_pecas_brancas | partida_simulada.bitboard_pecas_pretas;
}