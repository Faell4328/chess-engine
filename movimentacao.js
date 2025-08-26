import { Calcular, verificar_se_esta_em_xeque, verificar_se_tem_promocao } from './calcular.js';
import { partida, partida_virtual, informacoes_xadrez, sincronizar_estado_com_simulado, sincronizar_simulado_com_estado } from './variaveis.js'
import { visualizadeiro } from './visualizador.js';

// Função orquestradora e que fica exporta (única).
export function mover(origem, destino, promocao, movimentos = null){

  // Zerando os en passant caso tenha
  if(partida.jogando == "b" && partida.en_passant_pretas !== 0n){
    partida.en_passant_pretas = 0n;
  }
  else if(partida.jogando == "w" && partida.en_passant_brancas !== 0n){
    partida.en_passant_brancas = 0n;
  }

  sincronizar_simulado_com_estado();

  Calcular.calcular_casas_atacadas();
  Calcular.verificar_rei_atacado("w");
  Calcular.verificar_rei_atacado("b");

  sincronizar_estado_com_simulado();

  let peca_movida = "";

  // Desobre a peça e já realiza o movimento
  peca_movida = descobrir_peca(origem);

  // Classificando qual movimento foi feito (movimento, captura, en passant, roque e etc) e dependendo validando
  switch(peca_movida){
    case "p":
      Piao.validador(origem, destino, promocao, movimentos);
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

  // Verificando se o movimento realizado coloquei o rei em xeque
  Calcular.calcular_casas_atacadas();
  Calcular.verificar_rei_atacado("w");
  Calcular.verificar_rei_atacado("b");

  // Efetivando o movimento (OBS: o rei não está em xeque)
  sincronizar_estado_com_simulado();

  // Caso seja as pretas jogando implementa +1 no contador de lances da partida
  partida.jogando == "b" && partida.numero_lances_completo++;

  // Verificando se a casa atacada é da torre e se o status de roque é true (evitando que o bitboard de roque fique desatualizado, caso a torre seja capturada)
  if(partida.jogando == "w"){
    if((destino == informacoes_xadrez.casa_inicial_torre_esquerda_preto) && partida.status_roque_esquerda_preto == true){
      partida.status_roque_esquerda_preto = false;
    }
    else if((destino == informacoes_xadrez.casa_inicial_torre_direita_preto) && partida.status_roque_direita_preto == true){
      partida.status_roque_direita_preto = false;
    }
  }
  else{
    if((destino == informacoes_xadrez.casa_inicial_torre_esquerda_branca) && partida.status_roque_esquerda_branco == true){
      partida.status_roque_esquerda_branco = false;
    }
    else if((destino == informacoes_xadrez.casa_inicial_torre_direita_branca) && partida.status_roque_direita_branco == true){
      partida.status_roque_direita_branco = false;
    }
  }

  partida.jogando = (partida.jogando == "w") ? "b" : "w";

  verificar_se_esta_em_xeque(partida.jogando);
}

export function descobrir_peca(origem){
  if(partida.jogando == "w"){
    // Verificando se a peça movida é um pião das brancas
    if(partida.bitboard_piao_branco & origem){
      return "p";
    }

    // Verificando se a peça movida é um cavalo da brancas
    else if(partida.bitboard_cavalo_branco & origem){
      return "n";
    }

    // Verificando se a peça movida é um bispo da brancas
    else if(partida.bitboard_bispo_branco & origem){
      return "b";
    }

    // Verificando se a peça movida é um torre da brancas
    else if(partida.bitboard_torre_branco & origem){
      return "r";
    }

    // Verificando se a peça movida é uma rainha da brancas
    else if(partida.bitboard_rainha_branco & origem){
      return "q";
    }

    // Verificando se a peça movida é um rei da brancas
    else if(partida.bitboard_rei_branco  & origem){
      return "k";
    }

    // Caso não encontre
    else{
      throw new Error("Vez do adversário");
    }
  }
  else{
    // Verificando se a peça movida é um pião das brancas
    if(partida.bitboard_piao_preto & origem){
      return "p";
    }

    // Verificando se a peça movida é um cavalo da brancas
    else if(partida.bitboard_cavalo_preto & origem){
      return "n";
    }

    // Verificando se a peça movida é um bispo da brancas
    else if(partida.bitboard_bispo_preto & origem){
      return "b";
    }

    // Verificando se a peça movida é um torre da brancas
    else if(partida.bitboard_torre_preto & origem){
      return "r";
    }

    // Verificando se a peça movida é uma rainha da brancas
    else if(partida.bitboard_rainha_preto & origem){
      return "q";
    }

    // Verificando se a peça movida é um rei da brancas
    else if(partida.bitboard_rei_preto & origem){
      return "k";
    }

    // Caso não encontre
    else{
      throw new Error("Vez do adversário");
    }
  }
}

export class Piao{
  static validador(origem, destino, promocao, movimentos){
    let movimentos_possiveis = [];

    if(movimentos == null){
      // Calculandos os movimentos possiveis referente a peça
      movimentos_possiveis = Calcular.ataque_e_movimento_piao(partida.jogando, origem);
    }
    else{
      // Recebendo os movimentos já calculados
      movimentos_possiveis = movimentos;
    }
    
    // Verificando se o lance feito é um lance inválido
    if(movimentos_possiveis.todos.includes(destino) == false){
      throw new Error("Movimento inválido");
    }

    // Entra se foi feito um en passant
    if((movimentos_possiveis.en_passant.length > 0) && movimentos_possiveis.en_passant.includes(destino)){
      Piao.efetuar_en_passant(origem, destino);
    }
    // Entra se foi feito uma captura
    else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
      efetuar_captura(origem, destino, "p");
    }
    // Entra se foi feito um movimento
    else{
      const destino_esperado_duplo = (partida.jogando == "w") ? origem << informacoes_xadrez.movimento_piao[1] : origem >> informacoes_xadrez.movimento_piao[1];
      const bitboard_piao_adversario = (partida.jogando == "w") ? partida_virtual.bitboard_piao_preto : partida_virtual.bitboard_piao_branco;
      const bitboard_com_en_passant = (partida.jogando == "w") ? origem << informacoes_xadrez.movimento_piao[0] : origem >> informacoes_xadrez.movimento_piao[0];
      
      // Verificando se foi feito um movimento duplo AND se tem inimigo ao lado. Se for feito vai atualizar o bitboard de en passant.
      if((destino_esperado_duplo == destino) && (((destino << 1n) | (destino >> 1n) & bitboard_piao_adversario) != 0n)){
        if(partida.jogando == "w"){
          partida_virtual.en_passant_brancas = bitboard_com_en_passant;
        }
        else{
          partida_virtual.en_passant_pretas = bitboard_com_en_passant;
        }
      }
      efetuar_movimento(origem, destino, "p");
    }
    
    // Entra se tiver promocao
    if(verificar_se_tem_promocao(partida.jogando)){
      if(partida.jogando == "w"){
        if(promocao == "r"){
          partida_virtual.bitboard_torre_branco ^= partida_virtual.bitboard_piao_branco & destino;
        }
        else if(promocao == "b"){
          partida_virtual.bitboard_bispo_branco ^= partida_virtual.bitboard_piao_branco & destino;
        }
        else if(promocao == "n"){
          partida_virtual.bitboard_cavalo_branco ^= partida_virtual.bitboard_piao_branco & destino;
        }
        else{
          partida_virtual.bitboard_rainha_branco ^= partida_virtual.bitboard_piao_branco & destino;
        }

        partida_virtual.bitboard_piao_branco ^= partida_virtual.bitboard_piao_branco & destino;
      }
      else{
        if(promocao == "r"){
          partida_virtual.bitboard_torre_preto ^= partida_virtual.bitboard_piao_preto & destino;
        }
        else if(promocao == "b"){
          partida_virtual.bitboard_bispo_preto ^= partida_virtual.bitboard_piao_preto & destino;
        }
        else if(promocao == "n"){
          partida_virtual.bitboard_cavalo_preto ^= partida_virtual.bitboard_piao_preto & destino;
        }
        else{
          partida_virtual.bitboard_rainha_preto ^= partida_virtual.bitboard_piao_preto & destino;
        }

        partida_virtual.bitboard_piao_preto ^= partida_virtual.bitboard_piao_preto & destino;
      }
    }

    return;
  }

  static efetuar_en_passant(origem, destino){
    // Brancas jogam
    if(partida.jogando == "w"){
      partida_virtual.bitboard_piao_preto ^= (partida_virtual.en_passant_pretas >> informacoes_xadrez.movimento_piao[0]) 
      partida_virtual.en_passant_pretas = 0n;
    }
    // Pretas jogam
    else{
      partida_virtual.bitboard_piao_branco ^= (partida_virtual.en_passant_brancas << informacoes_xadrez.movimento_piao[0]) 
      partida_virtual.en_passant_brancas = 0n;
    }

    efetuar_movimento(origem, destino, "p");
    return;
  }
}

class Cavalo{
  static validador(origem, destino, movimentos){
    let movimentos_possiveis = [];

    if(movimentos == null){
      // Calculandos os movimentos possiveis referente a peça
      movimentos_possiveis = Calcular.ataque_e_movimento_cavalo(partida.jogando, origem);
    }
    else{
      // Recebendo os movimentos já calculados
      movimentos_possiveis = movimentos;
    }
    
    // Verificando se o lance feito é um lance inválido
    if(movimentos_possiveis.todos.includes(destino) == false){
      throw new Error("Movimento inválido");
    }

    // Entra se foi feito uma captura
    else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
      efetuar_captura(origem, destino, "n");
    }
    // Entra se foi feito um movimento
    else{
      efetuar_movimento(origem, destino, "n");
    }

    return;
  }
}

class Bispo{
  static validador(origem, destino, movimentos = null){
    let movimentos_possiveis = [];

    if(movimentos == null){
      // Calculandos os movimentos possiveis referente a peça
      movimentos_possiveis = Calcular.ataque_e_movimento_bispo(partida.jogando, origem);
    }
    else{
      // Recebendo os movimentos já calculados
      movimentos_possiveis = movimentos;
    }

    // Verificando se o lance feito é um lance inválido
    if(movimentos_possiveis.todos.includes(destino) == false){
      throw new Error("Movimento inválido");
    }

    // Entra se foi feito uma captura
    else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
      efetuar_captura(origem, destino, "b");
    }
    // Entra se foi feito um movimento
    else{
      efetuar_movimento(origem, destino, "b");
    }

    return;
  }
}

class Torre{
  static validador(origem, destino, movimentos = null){
    let movimentos_possiveis = [];

    if(movimentos == null){
      // Calculandos os movimentos possiveis referente a peça
      movimentos_possiveis = Calcular.ataque_e_movimento_torre(partida.jogando, origem);
    }
    else{
      // Recebendo os movimentos já calculados
      movimentos_possiveis = movimentos;
    }

    // Verificando se o lance feito é um lance inválido
    if(movimentos_possiveis.todos.includes(destino) == false){
      throw new Error("Movimento inválido");
    }

    // Entra se foi feito uma captura
    else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
      efetuar_captura(origem, destino, "r");
    }
    // Entra se foi feito um movimento
    else{
      efetuar_movimento(origem, destino, "r");
    }

    return;
  }
}

class Dama{
  static validador(origem, destino, movimentos = null){
    let movimentos_possiveis = [];

    if(movimentos == null){
      // Calculandos os movimentos possiveis referente a peça
      movimentos_possiveis = Calcular.ataque_e_movimento_rainha(partida.jogando, origem);
    }
    else{
      // Recebendo os movimentos já calculados
      movimentos_possiveis = movimentos;
    }

    // Verificando se o lance feito é um lance inválido
    if(movimentos_possiveis.todos.includes(destino) == false){
      throw new Error("Movimento inválido");
    }

    // Entra se foi feito uma captura
    else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
      efetuar_captura(origem, destino, "q");
    }
    // Entra se foi feito um movimento
    else{
      efetuar_movimento(origem, destino, "q");
    }

    return;
  }
}

export class Rei{
  static validador(origem, destino, movimentos = null){
    let movimentos_possiveis = [];

    if(movimentos == null){
      // Calculandos os movimentos possiveis referente a peça
      movimentos_possiveis = Calcular.ataque_e_movimento_rei(partida.jogando, origem);
    }
    else{
      // Recebendo os movimentos já calculados
      movimentos_possiveis = movimentos;
    }

    // Verificando se o lance feito é um lance inválido
    if(movimentos_possiveis.todos.includes(destino) == false){
      throw new Error("Movimento inválido");
    }
    // Entra se foi feito um roque para direita
    else if((movimentos_possiveis.roque_esquerda.length > 0) && movimentos_possiveis.roque_esquerda.includes(destino)){
      Rei.efetuar_roque_esquerda(origem, destino);
    }
    // Entra se foi feito uma captura
    else if((movimentos_possiveis.roque_direita.length > 0) && movimentos_possiveis.roque_direita.includes(destino)){
      Rei.efetuar_roque_direita(origem, destino);
    }
    // Entra se foi feito uma captura
    else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
      efetuar_captura(origem, destino, "k");
    }
    // Entra se foi feito um movimento
    else{
      efetuar_movimento(origem, destino, "k");
    }

    return;
  }

  static efetuar_roque_esquerda(){
    // Brancas jogam
    if(partida.jogando == "w"){
      partida_virtual.bitboard_torre_branco = ((partida.bitboard_torre_branco ^ 0x0000000000000001n) | informacoes_xadrez.casa_destino_torre_roque_esquerda_branco);
      partida_virtual.bitboard_rei_branco = informacoes_xadrez.casa_destino_rei_roque_esquerda_branco;
      partida_virtual.status_roque_esquerda_branco = false;
      partida_virtual.status_roque_direita_branco = false;
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{
      partida_virtual.bitboard_torre_preto= ((partida.bitboard_torre_preto ^ 0x0100000000000000n) | informacoes_xadrez.casa_destino_torre_roque_esquerda_preto);
      partida_virtual.bitboard_rei_preto = informacoes_xadrez.casa_destino_rei_roque_esquerda_preto;
      partida_virtual.status_roque_esquerda_preto = false;
      partida_virtual.status_roque_direita_preto = false;
      atualizarTabuleiro();
      return;
    }
    
  }

  static efetuar_roque_direita(){
    // Brancas jogam
    if(partida.jogando == "w"){
      partida_virtual.bitboard_torre_branco = ((partida_virtual.bitboard_torre_branco ^ 0x0000000000000080n) | informacoes_xadrez.casa_destino_torre_roque_direita_branco);
      partida_virtual.bitboard_rei_branco = informacoes_xadrez.casa_destino_rei_roque_direita_branco;
      partida_virtual.status_roque_esquerda_branco = false;
      partida_virtual.status_roque_direita_branco = false;
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{
      partida_virtual.bitboard_torre_preto = ((partida_virtual.bitboard_torre_preto ^ 0x8000000000000000n) | informacoes_xadrez.casa_destino_torre_roque_direita_preto);
      partida_virtual.bitboard_rei_preto = informacoes_xadrez.casa_destino_rei_roque_direita_preto;
      partida_virtual.status_roque_esquerda_preto = false;
      partida_virtual.status_roque_direita_preto = false;
      atualizarTabuleiro();
      return;
    }
  }
}

export function efetuar_movimento(origem, destino, peca){
  // Brancas jogam
  if(partida.jogando == "w"){
    // Realiza o movimento do pião
    if(peca == "p"){
      partida_virtual.bitboard_piao_branco ^= origem;
      partida_virtual.bitboard_piao_branco |= destino;
    }
    // Realiza o movimento do cavalo
    else if(peca == "n"){
      partida_virtual.bitboard_cavalo_branco ^= origem;
      partida_virtual.bitboard_cavalo_branco |= destino;
    }
    // Realiza o movimento do bispo
    else if(peca == "b"){
      partida_virtual.bitboard_bispo_branco ^= origem;
      partida_virtual.bitboard_bispo_branco |= destino;
    }
    // Realiza o movimento da torre
    else if(peca == "r"){
      // Caso a torre seja movida, vai desativar o roque do lado movido
      if((origem & informacoes_xadrez.casa_inicial_torre_direita_branca) != 0n){
        partida_virtual.status_roque_direita_branco = false;
      }
      else if((origem & informacoes_xadrez.casa_inicial_torre_esquerda_branca) != 0n){
        partida_virtual.status_roque_esquerda_branco = false;
      }

      partida_virtual.bitboard_torre_branco ^= origem;
      partida_virtual.bitboard_torre_branco |= destino;
    }
    // Realiza o movimento da dama
    else if(peca == "q"){
      partida_virtual.bitboard_rainha_branco ^= origem;
      partida_virtual.bitboard_rainha_branco |= destino;
    }
    // Realiza o movimento do rei
    else if(peca == "k"){
      // Caso o rei seja movido, vai desativar o roque
      partida_virtual.status_roque_direita_branco = false;
      partida_virtual.status_roque_esquerda_branco = false;
      
      // Realizando movimento
      partida_virtual.bitboard_rei_branco ^= origem;
      partida_virtual.bitboard_rei_branco |= destino;
    }
  }

  // Pretas jogam
  else{
    // Realiza o movimento do pião
    if(peca == "p"){
      partida_virtual.bitboard_piao_preto ^= origem;
      partida_virtual.bitboard_piao_preto |= destino;
    }
    // Realiza o movimento do cavalo
    else if(peca == "n"){
      partida_virtual.bitboard_cavalo_preto ^= origem;
      partida_virtual.bitboard_cavalo_preto |= destino;
    }
    // Realiza o movimento do bispo
    else if(peca == "b"){
      partida_virtual.bitboard_bispo_preto ^= origem;
      partida_virtual.bitboard_bispo_preto |= destino;
    }
    // Realiza o movimento da torre
    else if(peca == "r"){
      // Caso a torre seja movida, vai desativar o roque do lado movido
      if((origem & informacoes_xadrez.casa_inicial_torre_direita_preto) != 0n){
        partida_virtual.status_roque_direita_preto = false;
      }
      else if((origem & informacoes_xadrez.casa_inicial_torre_esquerda_preto) != 0n){
        partida_virtual.status_roque_esquerda_preto = false;
      }

      partida_virtual.bitboard_torre_preto ^= origem;
      partida_virtual.bitboard_torre_preto |= destino;
    }
    // Realiza o movimento da dama
    else if(peca == "q"){
      partida_virtual.bitboard_rainha_preto ^= origem;
      partida_virtual.bitboard_rainha_preto |= destino;
    }
    // Realiza o movimento do rei
    else if(peca == "k"){
      // Caso o rei seja movido, vai desativar o roque
      partida_virtual.status_roque_direita_preto = false;
      partida_virtual.status_roque_esquerda_preto = false;
      
      // Realizando movimento
      partida_virtual.bitboard_rei_preto ^= origem;
      partida_virtual.bitboard_rei_preto |= destino;
    }
  }
  
  // Atualiza todos os bitboards restantes
  atualizarTabuleiro();
  return;
}

export function efetuar_captura(origem, destino, peca){
  // Brancas jogam
  if(partida.jogando == "w"){
    //  Atualizando o bitboard das pretas (capturando a peça)
    partida_virtual.bitboard_piao_preto ^= (partida_virtual.bitboard_piao_preto & destino);
    partida_virtual.bitboard_cavalo_preto ^= (partida_virtual.bitboard_cavalo_preto & destino);
    partida_virtual.bitboard_bispo_preto ^= (partida_virtual.bitboard_bispo_preto & destino);
    partida_virtual.bitboard_torre_preto ^= (partida_virtual.bitboard_torre_preto & destino);
    partida_virtual.bitboard_rainha_preto ^= (partida_virtual.bitboard_rainha_preto & destino);
  }
  // Pretas jogam
  else{
    //  Atualizando o bitboard das brancas (capturando a peça)
    partida_virtual.bitboard_piao_branco ^= (partida_virtual.bitboard_piao_branco & destino);
    partida_virtual.bitboard_cavalo_branco ^= (partida_virtual.bitboard_cavalo_branco & destino);
    partida_virtual.bitboard_bispo_branco ^= (partida_virtual.bitboard_bispo_branco & destino);
    partida_virtual.bitboard_torre_branco ^= (partida_virtual.bitboard_torre_branco & destino);
    partida_virtual.bitboard_rainha_branco ^= (partida_virtual.bitboard_rainha_branco & destino);
  }

  efetuar_movimento(origem, destino, peca)
  return;
}

export function atualizarTabuleiro(){
  // Atualizando o bitboard de todas as peças brancas
  partida_virtual.bitboard_pecas_brancas = partida_virtual.bitboard_piao_branco | partida_virtual.bitboard_cavalo_branco | partida_virtual.bitboard_bispo_branco | partida_virtual.bitboard_torre_branco | partida_virtual.bitboard_rainha_branco | partida_virtual.bitboard_rei_branco;

  // Atualizando o bitboard de todas as peças pretas
  partida_virtual.bitboard_pecas_pretas = partida_virtual.bitboard_piao_preto | partida_virtual.bitboard_cavalo_preto | partida_virtual.bitboard_bispo_preto | partida_virtual.bitboard_torre_preto | partida_virtual.bitboard_rainha_preto | partida_virtual.bitboard_rei_preto;
  
  // Atualizando o bitboard com todas as casas ocupadas
  partida_virtual.bitboard_tabuleiro_completo = partida_virtual.bitboard_pecas_brancas | partida_virtual.bitboard_pecas_pretas;
}