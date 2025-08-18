import { Calcular } from './calcular.js';
import { desconverter } from './traducao.js';
import { partida, partida_virtual, informacoes_xadrez, sincronizar_estado_com_simulado, sincronizar_simulado_com_estado } from './variaveis.js'
import { visualizadeiro } from './visualizador.js';

// Função orquestradora e que fica exporta (única).
export function mover(origem, destino, promocao){

  // Zerando os en passant caso tenha
  if(partida.jogando == "b" && partida.en_passant_pretas !== 0n){
    partida.en_passant_pretas = 0n;
  }
  else if(partida.jogando == "w" && partida.en_passant_brancas !== 0n){
    partida.en_passant_brancas = 0n;
  }

  sincronizar_simulado_com_estado();

  // Verificando se o rei está atacado
  if(partida.jogando == "w"){
    Calcular.verificar_rei_atacado("w");
    if(partida_virtual.rei_branco_em_ataque == true){
      const todos_possiveis_movimentos = Calcular.calcular_todos_possiveis_movimento();
      const todos_possiveis_movimentos_defesa_rei = Calcular.calcular_defesa_rei("w", todos_possiveis_movimentos);

      if(todos_possiveis_movimentos_defesa_rei.length == 0){
        console.log("Xeque mate");
        process.exit(0);
      }
    }
  }
  else{
    Calcular.verificar_rei_atacado("b");
    if(partida_virtual.rei_preto_em_ataque == true){
      const todos_possiveis_movimentos = Calcular.calcular_todos_possiveis_movimento();
      const todos_possiveis_movimentos_defesa_rei = Calcular.calcular_defesa_rei("b", todos_possiveis_movimentos);

      if(todos_possiveis_movimentos_defesa_rei.length == 0){
        console.log("Xeque mate");
        process.exit(0);
      }
    }
  }

  // Desobre a peça e já realiza o movimento
  descobrirPeca(origem, destino, promocao);

  // Verificando se o movimento realizado coloquei o rei em xeque
  (partida.jogando == "w") ? Calcular.verificar_rei_atacado("w") : Calcular.verificar_rei_atacado("b");

  // Verificando se o movimento coloca o rei em xeque (brancas)
  if(partida.jogando == "w" && (partida_virtual.rei_branco_em_ataque == true)){
    console.log("Xeque mate");
    process.exit(0);
  }
  // Verificando se o movimento coloca o rei em xeque (pretas)
  else if(partida.jogando == "b" && (partida_virtual.rei_preto_em_ataque == true)){
    console.log("Xeque mate");
    process.exit(0);
  }

  // Efetivando o movimento (OBS: o rei não está em xeque)
  sincronizar_estado_com_simulado();

  // Caso seja as pretas jogando implementa +1 no contador de lances da partida
  partida.jogando == "b" && partida.numero_lances_completo++;

  // Verificando se a casa atacada é da torre e se o status de roque é true (evitando que o bitboard de roque fique desatualizado, caso a torre seja capturada)
  if(partida.jogando == "w"){
    if((destino == informacoes_xadrez.casa_onde_a_torre_deve_estar_para_fazer_roque_esquerda_preto) && partida.status_roque_esquerda_preto == true){
      partida.status_roque_esquerda_preto = false;
    }
    else if((destino == informacoes_xadrez.casa_onde_a_torre_deve_estar_para_fazer_roque_direita_preto) && partida.status_roque_direita_preto == true){
      partida.status_roque_direita_preto = false;
    }
  }
  else{
    if((destino == informacoes_xadrez.casa_onde_a_torre_deve_estar_para_fazer_roque_esquerda_branco) && partida.status_roque_esquerda_branco == true){
      partida.status_roque_esquerda_branco = false;
    }
    else if((destino == informacoes_xadrez.casa_onde_a_torre_deve_estar_para_fazer_roque_direita_branco) && partida.status_roque_direita_branco == true){
      partida.status_roque_direita_branco = false;
    }
  }

  partida.jogando = (partida.jogando == "w") ? "b" : "w";

  // Brancas jogam
  if(partida.jogando == "w"){
    Calcular.verificar_rei_atacado("w");
    if(partida_virtual.rei_branco_em_ataque == true){
      const todos_possiveis_movimentos = Calcular.calcular_todos_possiveis_movimento();
      const todos_possiveis_movimentos_defesa_rei = Calcular.calcular_defesa_rei("w", todos_possiveis_movimentos);

      if(todos_possiveis_movimentos_defesa_rei.length == 0){
        console.log("Xeque mate");
        process.exit(0);
      }
    }
  }
  // Pretas jogam
  else{
    Calcular.verificar_rei_atacado("b");
    if(partida_virtual.rei_preto_em_ataque == true){
      const todos_possiveis_movimentos = Calcular.calcular_todos_possiveis_movimento();
      const todos_possiveis_movimentos_defesa_rei = Calcular.calcular_defesa_rei("b", todos_possiveis_movimentos);

      if(todos_possiveis_movimentos_defesa_rei.length == 0){
        console.log("Xeque mate");
        process.exit(0);
      }
    }
  }
}

export function descobrirPeca(origem, destino){
  // Brancas jogam
  if(partida.jogando == "w"){
    if(partida.bitboard_piao_branco & origem){
      const movimentos_possiveis = Calcular.ataque_e_movimento_piao("w", origem);

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
        Piao.efetuar_captura(origem, destino);
      }
      // Entra se foi feito um movimento
      else{
        // Verificando se foi feito um movimento duplo e se tem inimigo ao lado. Se for feito vai atualizar o bitboard de en passant.
        if(((origem << informacoes_xadrez.movimento_piao[1]) == destino) && (((destino << 1n) | (destino >> 1n)) & partida_virtual.bitboard_piao_preto) != 0n){
          partida_virtual.en_passant_brancas = origem << informacoes_xadrez.movimento_piao[0];
        }

        Piao.efetuar_movimento(origem, destino);
      }

      return;
    }
    else if(partida.bitboard_cavalo_branco & origem){
      const movimentos_possiveis = Calcular.ataque_e_movimento_cavalo("w", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        throw new Error("Movimento inválido");
      }

      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Cavalo.efetuar_captura(origem, destino);
      }
      // Entra se foi feito um movimento
      else{
        Cavalo.efetuar_movimento(origem, destino);
      }

      return;
    }
    else if(partida.bitboard_bispo_branco & origem){
      const movimentos_possiveis = Calcular.ataque_e_movimento_bispo("w", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        throw new Error("Movimento inválido");
      }

      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Bispo.efetuar_captura(origem, destino);
      }
      // Entra se foi feito um movimento
      else{
        Bispo.efetuar_movimento(origem, destino);
      }

      return;
    }
    else if(partida.bitboard_torre_branco & origem){
      
      const movimentos_possiveis = Calcular.ataque_e_movimento_torre("w", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        throw new Error("Movimento inválido");
      }

      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Torre.efetuar_captura(origem, destino);
      }
      // Entra se foi feito um movimento
      else{
        Torre.efetuar_movimento(origem, destino);
      }

      return;
    }
    else if(partida.bitboard_rainha_branco & origem){
      
      const movimentos_possiveis = Calcular.ataque_e_movimento_rainha("w", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        throw new Error("Movimento inválido");
      }

      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Dama.efetuar_captura(origem, destino);
      }
      // Entra se foi feito um movimento
      else{
        Dama.efetuar_movimento(origem, destino);
      }

      return;
    }
    else if(partida.bitboard_rei_branco & origem){

      const movimentos_possiveis = Calcular.ataque_e_movimento_rei("w", origem);

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
        Rei.efetuar_captura(origem, destino);
      }
      // Entra se foi feito um movimento
      else{
        Rei.efetuar_movimento(origem, destino);
      }

      return;
    }
    else{
      throw new Error("Movimento inválido");
    }
  }

  // Pretas jogam
  else{
    if(partida.bitboard_piao_preto & origem){

      const movimentos_possiveis = Calcular.ataque_e_movimento_piao("b", origem);

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
        Piao.efetuar_captura(origem, destino);
      }
      // Entra se foi feito um movimento
      else{
        // Verificando se foi feito um movimento duplo e se tem inimigo ao lado. Se for feito vai atualizar o bitboard de en passant.
        if(((origem >> informacoes_xadrez.movimento_piao[1]) == destino) && ((((destino << 1n) | (destino >> 1n)) & partida_virtual.bitboard_piao_branco) != 0n)){
          partida_virtual.en_passant_pretas = origem >> informacoes_xadrez.movimento_piao[0];
        }
        else{
        }

        Piao.efetuar_movimento(origem, destino);
      }

      return;
    }
    else if(partida.bitboard_cavalo_preto & origem){

      const movimentos_possiveis = Calcular.ataque_e_movimento_cavalo("b", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        throw new Error("Movimento inválido");
      }

      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Cavalo.efetuar_captura(origem, destino);
      }
      // Entra se foi feito um movimento
      else{
        Cavalo.efetuar_movimento(origem, destino);
      }

      return;
    }
    else if(partida.bitboard_bispo_preto & origem){

      const movimentos_possiveis = Calcular.ataque_e_movimento_bispo("b", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        throw new Error("Movimento inválido");
      }

      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Bispo.efetuar_captura(origem, destino);
      }
      // Entra se foi feito um movimento
      else{
        Bispo.efetuar_movimento(origem, destino);
      }

      return;
    }
    else if(partida.bitboard_torre_preto & origem){
      
      const movimentos_possiveis = Calcular.ataque_e_movimento_torre("b", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        throw new Error("Movimento inválido");
      }

      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Torre.efetuar_captura(origem, destino);
      }
      // Entra se foi feito um movimento
      else{
        Torre.efetuar_movimento(origem, destino);
      }

      return;
    }
    else if(partida.bitboard_rainha_preto & origem){
      
      const movimentos_possiveis = Calcular.ataque_e_movimento_rainha("b", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        throw new Error("Movimento inválido");
      }

      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Dama.efetuar_captura(origem, destino);
      }
      // Entra se foi feito um movimento
      else{
        Dama.efetuar_movimento(origem, destino);
      }

      return;
    }
    else if(partida.bitboard_rei_preto & origem){

     const movimentos_possiveis = Calcular.ataque_e_movimento_rei("b", origem);

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
        Rei.efetuar_captura(origem, destino);
      }
      // Entra se foi feito um movimento
      else{
        Rei.efetuar_movimento(origem, destino);
      }

      return;
    }
    else{
      throw new Error("Movimento inválido");
    }
  }
}

class Piao{
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

    this.efetuar_movimento(origem, destino);
    return;
  }
  static efetuar_captura(origem, destino){
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
      partida_virtual.bitboard_piao_branco ^= (partida_virtual.bitboard_piao_branco & destino);
      partida_virtual.bitboard_cavalo_branco ^= (partida_virtual.bitboard_cavalo_branco & destino);
      partida_virtual.bitboard_bispo_branco ^= (partida_virtual.bitboard_bispo_branco & destino);
      partida_virtual.bitboard_torre_branco ^= (partida_virtual.bitboard_torre_branco & destino);
      partida_virtual.bitboard_rainha_branco ^= (partida_virtual.bitboard_rainha_branco & destino);
    }

    this.efetuar_movimento(origem, destino);
    return;
  }
  
  static efetuar_movimento(origem, destino){
    // Brancas jogam
    if(partida.jogando == "w"){
      // Realizando movimento
      const movimentacao = origem | destino;
      partida_virtual.bitboard_piao_branco ^= movimentacao;

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{
      // Realizando movimento
      const movimentacao = origem | destino;
      partida_virtual.bitboard_piao_preto ^= movimentacao;

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }
  }

}

class Cavalo{
  static efetuar_captura(origem, destino){
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
      //  Atualizando o bitboard das pretas (capturando a peça)
      partida_virtual.bitboard_piao_branco ^= (partida_virtual.bitboard_piao_branco & destino);
      partida_virtual.bitboard_cavalo_branco ^= (partida_virtual.bitboard_cavalo_branco & destino);
      partida_virtual.bitboard_bispo_branco ^= (partida_virtual.bitboard_bispo_branco & destino);
      partida_virtual.bitboard_torre_branco ^= (partida_virtual.bitboard_torre_branco & destino);
      partida_virtual.bitboard_rainha_branco ^= (partida_virtual.bitboard_rainha_branco & destino);
    }

    this.efetuar_movimento(origem, destino);
    return;
  }

  static efetuar_movimento(origem, destino){
    // Brancas jogam
    if(partida.jogando == "w"){

      // Realizando movimento
      const movimentacao = origem | destino;
      partida_virtual.bitboard_cavalo_branco ^= movimentacao;

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{

      // Realizando movimento
      const movimentacao = origem | destino;
      partida_virtual.bitboard_cavalo_preto^= movimentacao;

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }

  }
}

class Bispo{
  static efetuar_captura(origem, destino){
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
      //  Atualizando o bitboard das pretas (capturando a peça)
      partida_virtual.bitboard_piao_branco ^= (partida_virtual.bitboard_piao_branco & destino);
      partida_virtual.bitboard_cavalo_branco ^= (partida_virtual.bitboard_cavalo_branco & destino);
      partida_virtual.bitboard_bispo_branco ^= (partida_virtual.bitboard_bispo_branco & destino);
      partida_virtual.bitboard_torre_branco ^= (partida_virtual.bitboard_torre_branco & destino);
      partida_virtual.bitboard_rainha_branco ^= (partida_virtual.bitboard_rainha_branco & destino);
    }

    this.efetuar_movimento(origem, destino);
    return;
  }

  static efetuar_movimento(origem, destino){
    // Brancas jogam
    if(partida.jogando == "w"){
      // Realizando movimento
      const movimentacao = origem | destino;
      partida_virtual.bitboard_bispo_branco ^= movimentacao;

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{
      // Realizando movimento
      const movimentacao = origem | destino;
      partida_virtual.bitboard_bispo_preto ^= movimentacao;

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }
  }
}

class Torre{
  static efetuar_captura(origem, destino){
    // Brancas jogam
    if(partida.jogando == "w"){
      // Atualizando o bitboard das pretas (capturando a peça)
      partida_virtual.bitboard_piao_preto ^= (partida_virtual.bitboard_piao_preto & destino);
      partida_virtual.bitboard_cavalo_preto ^= (partida_virtual.bitboard_cavalo_preto & destino);
      partida_virtual.bitboard_bispo_preto ^= (partida_virtual.bitboard_bispo_preto & destino);
      partida_virtual.bitboard_torre_preto ^= (partida_virtual.bitboard_torre_preto & destino);
      partida_virtual.bitboard_rainha_preto ^= (partida_virtual.bitboard_rainha_preto & destino);
    }

    // Pretas jogam
    else{
      //  Atualizando o bitboard das pretas (capturando a peça)
      partida_virtual.bitboard_piao_branco ^= (partida_virtual.bitboard_piao_branco & destino);
      partida_virtual.bitboard_cavalo_branco ^= (partida_virtual.bitboard_cavalo_branco & destino);
      partida_virtual.bitboard_bispo_branco ^= (partida_virtual.bitboard_bispo_branco & destino);
      partida_virtual.bitboard_torre_branco ^= (partida_virtual.bitboard_torre_branco & destino);
      partida_virtual.bitboard_rainha_branco ^= (partida_virtual.bitboard_rainha_branco & destino);
    }

    this.efetuar_movimento(origem, destino);
    return;
  }
  
  static efetuar_movimento(origem, destino){
    // Brancas jogam
    if(partida.jogando == "w"){

      // Caso a torre seja movida, vai desativar o roque do lado movido
      if((origem & informacoes_xadrez.casa_onde_a_torre_deve_estar_para_fazer_roque_direita_branco) != 0n){
        partida_virtual.status_roque_direita_branco = false;
      }
      else if((origem & informacoes_xadrez.casa_onde_a_torre_deve_estar_para_fazer_roque_esquerda_branco) != 0n){
        partida_virtual.status_roque_esquerda_branco = false;
      }

      // Realizando movimento
      const movimentacao = origem | destino;
      partida_virtual.bitboard_torre_branco ^= movimentacao;

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{

      // Caso a torre seja movida, vai desativar o roque do lado movido
      if((origem & informacoes_xadrez.casa_onde_a_torre_deve_estar_para_fazer_roque_direita_preto) != 0n){
        partida.status_roque_direita_preto = false;
      }
      else if((origem & informacoes_xadrez.casa_onde_a_torre_deve_estar_para_fazer_roque_esquerda_preto) != 0n){
        partida.status_roque_esquerda_preto = false;
      }

      // Realizando movimento
      const movimentacao = origem | destino;
      partida_virtual.bitboard_torre_preto ^= movimentacao;

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }
  }

}

class Dama{
  static efetuar_captura(origem, destino){
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
      //  Atualizando o bitboard das pretas (capturando a peça)
      partida_virtual.bitboard_piao_branco ^= (partida_virtual.bitboard_piao_branco & destino);
      partida_virtual.bitboard_cavalo_branco ^= (partida_virtual.bitboard_cavalo_branco & destino);
      partida_virtual.bitboard_bispo_branco ^= (partida_virtual.bitboard_bispo_branco & destino);
      partida_virtual.bitboard_torre_branco ^= (partida_virtual.bitboard_torre_branco & destino);
      partida_virtual.bitboard_rainha_branco ^= (partida_virtual.bitboard_rainha_branco & destino);
    }

    this.efetuar_movimento(origem, destino);
    return;
  }

  static efetuar_movimento(origem, destino){
    // Brancas jogam
    if(partida.jogando == "w"){

      // Realizando movimento
      const movimentacao = origem | destino;
      partida_virtual.bitboard_rainha_branco ^= movimentacao;

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{

      // Realizando movimento
      const movimentacao = origem | destino;
      partida_virtual.bitboard_rainha_preto ^= movimentacao;

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }
  }
}

class Rei{
  static efetuar_roque_esquerda(){
    // Brancas jogam
    if(partida.jogando == "w"){
      partida_virtual.bitboard_torre_branco = ((partida.bitboard_torre_branco ^ 0x0000000000000001n) | informacoes_xadrez.casa_onde_a_torre_vai_ficar_no_roque_esquerda_branco);
      partida_virtual.bitboard_rei_branco = informacoes_xadrez.casa_onde_o_rei_vai_ficar_no_roque_esquerda_branco;
      partida_virtual.status_roque_esquerda_branco = false;
      partida_virtual.status_roque_direita_branco = false;
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{
      partida_virtual.bitboard_torre_preto= ((partida.bitboard_torre_preto ^ 0x0100000000000000n) | informacoes_xadrez.casa_onde_a_torre_vai_ficar_no_roque_esquerda_preto);
      partida_virtual.bitboard_rei_preto = informacoes_xadrez.casa_onde_o_rei_vai_ficar_no_roque_esquerda_preto;
      partida_virtual.status_roque_esquerda_preto = false;
      partida_virtual.status_roque_direita_preto = false;
      atualizarTabuleiro();
      return;
    }
    
  }

  static efetuar_roque_direita(){
    // Brancas jogam
    if(partida.jogando == "w"){
      partida_virtual.bitboard_torre_branco = ((partida.bitboard_torre_branco ^ 0x0000000000000080n) | informacoes_xadrez.casa_onde_a_torre_vai_ficar_no_roque_direita_branco);
      partida_virtual.bitboard_rei_branco = informacoes_xadrez.casa_onde_o_rei_vai_ficar_no_roque_direita_branco;
      partida_virtual.status_roque_esquerda_branco = false;
      partida_virtual.status_roque_direita_branco = false;
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{
      partida_virtual.bitboard_torre_preto = ((partida.bitboard_torre_preto ^ 0x8000000000000000n) | informacoes_xadrez.casa_onde_a_torre_vai_ficar_no_roque_direita_preto);
      partida_virtual.bitboard_rei_preto = informacoes_xadrez.casa_onde_o_rei_vai_ficar_no_roque_direita_preto;
      partida_virtual.status_roque_esquerda_preto = false;
      partida_virtual.status_roque_direita_preto = false;
      atualizarTabuleiro();
      return;
    }
  }

  static efetuar_captura(origem, destino){
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
      //  Atualizando o bitboard das pretas (capturando a peça)
      partida_virtual.bitboard_piao_branco ^= (partida_virtual.bitboard_piao_branco & destino);
      partida_virtual.bitboard_cavalo_branco ^= (partida_virtual.bitboard_cavalo_branco & destino);
      partida_virtual.bitboard_bispo_branco ^= (partida_virtual.bitboard_bispo_branco & destino);
      partida_virtual.bitboard_torre_branco ^= (partida_virtual.bitboard_torre_branco & destino);
      partida_virtual.bitboard_rainha_branco ^= (partida_virtual.bitboard_rainha_branco & destino);
    }

    this.efetuar_movimento(origem, destino);
    return;
  }

  static efetuar_movimento(origem, destino){
    // Brancas jogam
    if(partida.jogando == "w"){

      partida_virtual.status_roque_direita_branco = false;
      partida_virtual.status_roque_esquerda_branco = false;

      // Realizando movimento
      const movimentacao = origem | destino;
      partida_virtual.bitboard_rei_branco ^= movimentacao;

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{

      partida_virtual.status_roque_direita_preto = false;
      partida_virtual.status_roque_esquerda_preto = false;
        
      // Realizando movimento
      const movimentacao = origem | destino;
      partida_virtual.bitboard_rei_preto ^= movimentacao;

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }
  }
}

function atualizarTabuleiro(){
  // Atualizando o bitboard de todas as peças brancas
  partida_virtual.bitboard_de_todas_pecas_brancas = partida_virtual.bitboard_piao_branco | partida_virtual.bitboard_cavalo_branco | partida_virtual.bitboard_bispo_branco | partida_virtual.bitboard_torre_branco | partida_virtual.bitboard_rainha_branco | partida_virtual.bitboard_rei_branco;

  // Atualizando o bitboard de todas as peças pretas
  partida_virtual.bitboard_de_todas_pecas_pretas = partida_virtual.bitboard_piao_preto | partida_virtual.bitboard_cavalo_preto | partida_virtual.bitboard_bispo_preto | partida_virtual.bitboard_torre_preto | partida_virtual.bitboard_rainha_preto | partida_virtual.bitboard_rei_preto;
  
  // Atualizando o bitboard com todas as casas ocupadas
  partida_virtual.bitboard_de_todas_as_pecas_do_tabuleiro = partida_virtual.bitboard_de_todas_pecas_brancas | partida_virtual.bitboard_de_todas_pecas_pretas;
}