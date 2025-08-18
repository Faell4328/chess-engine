import { Calcular } from './calcular.js';
import { implementar } from './escritor.js';
import { desconverter } from './traducao.js';
import { estado, simulado, sincronizar_estado_com_simulado, sincronizar_simulado_com_estado } from './variaveis.js'
import { visualizadeiro } from './visualizador.js';

// Função orquestradora e que fica exporta (única).
export function mover(origem, destino, promocao){

  implementar("-- Iniciado a etapa de movimentação --");

  // Zerando os en passant caso tenha
  if(estado.jogando == "b" && estado.en_passant_pretas !== 0n){
    implementar("Foi zerado o en passant das pretas");
    estado.en_passant_pretas = 0n;
  }
  else if(estado.jogando == "w" && estado.en_passant_brancas !== 0n){
    implementar("Foi zerado o en passant das brancas");
    estado.en_passant_brancas = 0n;
  }

  sincronizar_simulado_com_estado();

  if(estado.jogando == "w"){
    Calcular.verificar_rei_atacado("w");
    if(simulado.rei_branco_em_ataque == true){
      const todos_possiveis_movimentos = Calcular.calcular_todos_possiveis_movimento();
      const todos_possiveis_movimentos_defesa_rei = Calcular.calcular_defesa_rei("w", todos_possiveis_movimentos);

      if(todos_possiveis_movimentos_defesa_rei.length == 0){
        implementar("Xeque mate");
        throw new Error("Xeque Mate");
      }
      else{
        implementar("Rei das brancas em xeque");
      }
    }
  }
  else{
    Calcular.verificar_rei_atacado("b");
    if(simulado.rei_preto_em_ataque == true){
      const todos_possiveis_movimentos = Calcular.calcular_todos_possiveis_movimento();
      const todos_possiveis_movimentos_defesa_rei = Calcular.calcular_defesa_rei("b", todos_possiveis_movimentos);

      if(todos_possiveis_movimentos_defesa_rei.length == 0){
        implementar("Xeque mate");
        throw new Error("Xeque Mate");
      }
      else{
        implementar("Rei das pretas em xeque");
      }
    }
  }

  // Verificando se o rei está em xeque. Caso o rei esteja em

  // Dentro da função já chama a classe para fazer a verificação e realizar o movimento.
  descobrirPeca(origem, destino, promocao);

  Calcular.verificar_rei_atacado("w");
  Calcular.verificar_rei_atacado("b");

  (estado.jogando == "w") ? Calcular.verificar_rei_atacado("w") : Calcular.verificar_rei_atacado("b");

  // Verificando se o movimento coloca o rei em xeque (brancas)
  if(estado.jogando == "w" && (simulado.rei_branco_em_ataque == true)){
    implementar("O rei está em xeque");
    throw new Error("xeque");
  }
  // Verificando se o movimento coloca o rei em xeque (pretas)
  else if(estado.jogando == "b" && (simulado.rei_preto_em_ataque == true)){
    implementar("O rei está em xeque");
    throw new Error("xeque");
  }

  // Efetivando os movimentos
  sincronizar_estado_com_simulado();
  estado.jogando == "b" && estado.numero_lances_completo++;

  // Verificando se a casa atacada é da torre e se o status de roque é true (evitando que o bitboard de roque fique desatualizado, caso a torre seja capturada)
  if(estado.jogando == "w"){
    if((destino == estado.casa_onde_a_torre_deve_estar_para_fazer_roque_esquerda_preto) && estado.status_roque_esquerda_preto == true){
      estado.status_roque_esquerda_preto = false;
    }
    else if((destino == estado.casa_onde_a_torre_deve_estar_para_fazer_roque_direita_preto) && estado.status_roque_direita_preto == true){
      estado.status_roque_direita_preto = false;
    }
  }
  else{
    if((destino == estado.casa_onde_a_torre_deve_estar_para_fazer_roque_esquerda_branco) && estado.status_roque_esquerda_branco == true){
      estado.status_roque_esquerda_branco = false;
    }
    else if((destino == estado.casa_onde_a_torre_deve_estar_para_fazer_roque_direita_branco) && estado.status_roque_direita_branco == true){
      estado.status_roque_direita_branco = false;
    }
  }

  estado.jogando = (estado.jogando == "w") ? "b" : "w";

  if(estado.jogando == "w"){
    implementar("Brancas jogam");
  }
  else{
    implementar("Pretas jogam");
  }

  // Brancas jogam
  if(estado.jogando == "w"){
    Calcular.verificar_rei_atacado("w");
    if(simulado.rei_branco_em_ataque == true){
      const todos_possiveis_movimentos = Calcular.calcular_todos_possiveis_movimento();
      const todos_possiveis_movimentos_defesa_rei = Calcular.calcular_defesa_rei("w", todos_possiveis_movimentos);

      if(todos_possiveis_movimentos_defesa_rei.length == 0){
        implementar("Xeque mate");
        throw new Error("Xeque Mate");
      }
      else{
        implementar("Rei das brancas em xeque");
      }
    }
  }
  // Pretas jogam
  else{
    Calcular.verificar_rei_atacado("b");
    if(simulado.rei_preto_em_ataque == true){
      const todos_possiveis_movimentos = Calcular.calcular_todos_possiveis_movimento();
      const todos_possiveis_movimentos_defesa_rei = Calcular.calcular_defesa_rei("b", todos_possiveis_movimentos);

      if(todos_possiveis_movimentos_defesa_rei.length == 0){
        implementar("Xeque mate");
        throw new Error("Xeque Mate");
      }
      else{
        implementar("Rei das pretas em xeque");
      }
    }
  }
}

export function descobrirPeca(origem, destino){
  implementar("\n\n-- Iniciado a etapa de verificação: peça movida --\n\n");

  // Brancas jogam
  if(estado.jogando == "w"){
    if(estado.bitboard_piao_branco & origem){
      implementar("A peça movida é piao brancas");

      const movimentos_possiveis = Calcular.ataque_e_movimento_piao("w", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        implementar("Você fez um movimento inválido de pião");
        throw new Error("Movimento inválido");
      }

      // Entra se foi feito um en passant
      if((movimentos_possiveis.en_passant.length > 0) && movimentos_possiveis.en_passant.includes(destino)){
        Piao.efetuar_en_passant(origem, destino);
        implementar("Foi feito um en passant");
      }
      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Piao.efetuar_captura(origem, destino);
        implementar("Foi feito captura");
      }
      // Entra se foi feito um movimento
      else{
        // Verificando se foi feito um movimento duplo e se tem inimigo ao lado. Se for feito vai atualizar o bitboard de en passant.
        if(((origem << estado.movimento_piao[1]) == destino) && (((destino << 1n) | (destino >> 1n)) & simulado.bitboard_piao_preto) != 0n){
          simulado.en_passant_brancas = origem << estado.movimento_piao[0];
        }

        Piao.efetuar_movimento(origem, destino);
        implementar("Foi feito movimento");
      }

      return;
    }
    else if(estado.bitboard_cavalo_branco & origem){
      implementar("A peça movida é cavalo brancas");

      const movimentos_possiveis = Calcular.ataque_e_movimento_cavalo("w", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        implementar("Você fez um movimento inválido de cavalo");
        throw new Error("Movimento inválido");
      }

      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Cavalo.efetuar_captura(origem, destino);
        implementar("Foi feito captura");
      }
      // Entra se foi feito um movimento
      else{
        Cavalo.efetuar_movimento(origem, destino);
        implementar("Foi feito movimento");
      }

      return;
    }
    else if(estado.bitboard_bispo_branco & origem){
      implementar("A peça movida é bispo brancas");

      const movimentos_possiveis = Calcular.ataque_e_movimento_bispo("w", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        implementar("Você fez um movimento inválido de bispo");
        throw new Error("Movimento inválido");
      }

      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Bispo.efetuar_captura(origem, destino);
        implementar("Foi feito captura");
      }
      // Entra se foi feito um movimento
      else{
        Bispo.efetuar_movimento(origem, destino);
        implementar("Foi feito movimento");
      }

      return;
    }
    else if(estado.bitboard_torre_branco & origem){
      implementar("A peça movida é torre brancas");
      
      const movimentos_possiveis = Calcular.ataque_e_movimento_torre("w", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        implementar("Você fez um movimento inválido de torre");
        throw new Error("Movimento inválido");
      }

      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Torre.efetuar_captura(origem, destino);
        implementar("Foi feito captura");
      }
      // Entra se foi feito um movimento
      else{
        Torre.efetuar_movimento(origem, destino);
        implementar("Foi feito movimento");
      }

      return;
    }
    else if(estado.bitboard_rainha_branco & origem){
      implementar("A peça movida é rainha brancas");
      
      const movimentos_possiveis = Calcular.ataque_e_movimento_rainha("w", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        implementar("Você fez um movimento inválido de dama");
        throw new Error("Movimento inválido");
      }

      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Dama.efetuar_captura(origem, destino);
        implementar("Foi feito captura");
      }
      // Entra se foi feito um movimento
      else{
        Dama.efetuar_movimento(origem, destino);
        implementar("Foi feito movimento");
      }

      return;
    }
    else if(estado.bitboard_rei_branco & origem){
      implementar("A peça movida é rei brancas");

      const movimentos_possiveis = Calcular.ataque_e_movimento_rei("w", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        implementar("Você fez um movimento inválido de rei");
        throw new Error("Movimento inválido");
      }
      // Entra se foi feito um roque para direita
      else if((movimentos_possiveis.roque_esquerda.length > 0) && movimentos_possiveis.roque_esquerda.includes(destino)){
        Rei.efetuar_roque_esquerda(origem, destino);
        implementar("Foi feito roque para esquerda");
      }
      // Entra se foi feito uma captura
      else if((movimentos_possiveis.roque_direita.length > 0) && movimentos_possiveis.roque_direita.includes(destino)){
        Rei.efetuar_roque_direita(origem, destino);
        implementar("Foi feito roque para direita");
      }
      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Rei.efetuar_captura(origem, destino);
        implementar("Foi feito captura");
      }
      // Entra se foi feito um movimento
      else{
        Rei.efetuar_movimento(origem, destino);
        implementar("Foi feito movimento");
      }

      return;
    }
    else{
      implementar("Movimento invalido - tentou mover a peça adversária (vez das brancas e não pretas)");
      throw new Error("Movimento inválido");
    }
  }

  // Pretas jogam
  else{
    if(estado.bitboard_piao_preto & origem){
      implementar("A peça movida é piao pretas");

      const movimentos_possiveis = Calcular.ataque_e_movimento_piao("b", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        implementar("Você fez um movimento inválido de pião");
        throw new Error("Movimento inválido");
      }

      // Entra se foi feito um en passant
      if((movimentos_possiveis.en_passant.length > 0) && movimentos_possiveis.en_passant.includes(destino)){
        Piao.efetuar_en_passant(origem, destino);
        implementar("Foi feito um en passant");
      }
      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Piao.efetuar_captura(origem, destino);
        implementar("Foi feito captura");
      }
      // Entra se foi feito um movimento
      else{
        // Verificando se foi feito um movimento duplo e se tem inimigo ao lado. Se for feito vai atualizar o bitboard de en passant.
        if(((origem >> estado.movimento_piao[1]) == destino) && ((((destino << 1n) | (destino >> 1n)) & simulado.bitboard_piao_branco) != 0n)){
          simulado.en_passant_pretas = origem >> estado.movimento_piao[0];
          implementar("Foi adicionado en passant")
        }
        else{
          implementar("Não foi feito en passant")
        }

        Piao.efetuar_movimento(origem, destino);
        implementar("Foi feito movimento");
      }

      return;
    }
    else if(estado.bitboard_cavalo_preto & origem){
      implementar("A peça movida é cavalo pretas");

      const movimentos_possiveis = Calcular.ataque_e_movimento_cavalo("b", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        implementar("Você fez um movimento inválido de cavalo");
        throw new Error("Movimento inválido");
      }

      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Cavalo.efetuar_captura(origem, destino);
        implementar("Foi feito captura");
      }
      // Entra se foi feito um movimento
      else{
        Cavalo.efetuar_movimento(origem, destino);
        implementar("Foi feito movimento");
      }

      return;
    }
    else if(estado.bitboard_bispo_preto & origem){
      implementar("A peça movida é bispo pretas");

      const movimentos_possiveis = Calcular.ataque_e_movimento_bispo("b", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        implementar("Você fez um movimento inválido de bispo");
        throw new Error("Movimento inválido");
      }

      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Bispo.efetuar_captura(origem, destino);
        implementar("Foi feito captura");
      }
      // Entra se foi feito um movimento
      else{
        Bispo.efetuar_movimento(origem, destino);
        implementar("Foi feito movimento");
      }

      return;
    }
    else if(estado.bitboard_torre_preto & origem){
      implementar("A peça movida é torre pretas");
      
      const movimentos_possiveis = Calcular.ataque_e_movimento_torre("b", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        implementar("Você fez um movimento inválido de torre");
        throw new Error("Movimento inválido");
      }

      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Torre.efetuar_captura(origem, destino);
        implementar("Foi feito captura");
      }
      // Entra se foi feito um movimento
      else{
        Torre.efetuar_movimento(origem, destino);
        implementar("Foi feito movimento");
      }

      return;
    }
    else if(estado.bitboard_rainha_preto & origem){
      implementar("A peça movida é rainha pretas");
      
      const movimentos_possiveis = Calcular.ataque_e_movimento_rainha("b", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        implementar("Você fez um movimento inválido de dama");
        throw new Error("Movimento inválido");
      }

      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Dama.efetuar_captura(origem, destino);
        implementar("Foi feito captura");
      }
      // Entra se foi feito um movimento
      else{
        Dama.efetuar_movimento(origem, destino);
        implementar("Foi feito movimento");
      }

      return;
    }
    else if(estado.bitboard_rei_preto & origem){
      implementar("A peça movida é rei pretas");

     const movimentos_possiveis = Calcular.ataque_e_movimento_rei("b", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        implementar("Você fez um movimento inválido de rei");
        throw new Error("Movimento inválido");
      }
      // Entra se foi feito um roque para direita
      else if((movimentos_possiveis.roque_esquerda.length > 0) && movimentos_possiveis.roque_esquerda.includes(destino)){
        Rei.efetuar_roque_esquerda(origem, destino);
        implementar("Foi feito roque para esquerda");
      }
      // Entra se foi feito uma captura
      else if((movimentos_possiveis.roque_direita.length > 0) && movimentos_possiveis.roque_direita.includes(destino)){
        Rei.efetuar_roque_direita(origem, destino);
        implementar("Foi feito roque para direita");
      }
      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Rei.efetuar_captura(origem, destino);
        implementar("Foi feito captura");
      }
      // Entra se foi feito um movimento
      else{
        Rei.efetuar_movimento(origem, destino);
        implementar("Foi feito movimento");
      }

      return;
    }
    else{
      implementar("Movimento invalido - tentou mover a peça adversária (vez das pretas e não brancas)");
      throw new Error("Movimento inválido");
    }
  }
}

class Piao{
  static efetuar_en_passant(origem, destino){
    // Brancas jogam
    if(estado.jogando == "w"){
      simulado.bitboard_piao_preto ^= (simulado.en_passant_pretas >> estado.movimento_piao[0]) 
      simulado.en_passant_pretas = 0n;
    }
    // Pretas jogam
    else{
      simulado.bitboard_piao_branco ^= (simulado.en_passant_brancas << estado.movimento_piao[0]) 
      simulado.en_passant_brancas = 0n;
    }

    this.efetuar_movimento(origem, destino);
    return;
  }
  static efetuar_captura(origem, destino){
    // Brancas jogam
    if(estado.jogando == "w"){
      //  Atualizando o bitboard das pretas (capturando a peça)
      simulado.bitboard_piao_preto ^= (simulado.bitboard_piao_preto & destino);
      simulado.bitboard_cavalo_preto ^= (simulado.bitboard_cavalo_preto & destino);
      simulado.bitboard_bispo_preto ^= (simulado.bitboard_bispo_preto & destino);
      simulado.bitboard_torre_preto ^= (simulado.bitboard_torre_preto & destino);
      simulado.bitboard_rainha_preto ^= (simulado.bitboard_rainha_preto & destino);
    }
    // Pretas jogam
    else{
      simulado.bitboard_piao_branco ^= (simulado.bitboard_piao_branco & destino);
      simulado.bitboard_cavalo_branco ^= (simulado.bitboard_cavalo_branco & destino);
      simulado.bitboard_bispo_branco ^= (simulado.bitboard_bispo_branco & destino);
      simulado.bitboard_torre_branco ^= (simulado.bitboard_torre_branco & destino);
      simulado.bitboard_rainha_branco ^= (simulado.bitboard_rainha_branco & destino);
    }

    this.efetuar_movimento(origem, destino);
    return;
  }
  
  static efetuar_movimento(origem, destino){
    // Brancas jogam
    if(estado.jogando == "w"){
      // Realizando movimento
      const movimentacao = origem | destino;
      simulado.bitboard_piao_branco ^= movimentacao;
      implementar("Bitboard do pião: \n" + visualizadeiro(simulado.bitboard_piao_branco) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{
      // Realizando movimento
      const movimentacao = origem | destino;
      simulado.bitboard_piao_preto ^= movimentacao;
      implementar("Bitboard do pião: \n" + visualizadeiro(simulado.bitboard_piao_preto) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }
  }

}

class Cavalo{
  static efetuar_captura(origem, destino){
    // Brancas jogam
    if(estado.jogando == "w"){
      //  Atualizando o bitboard das pretas (capturando a peça)
      simulado.bitboard_piao_preto ^= (simulado.bitboard_piao_preto & destino);
      simulado.bitboard_cavalo_preto ^= (simulado.bitboard_cavalo_preto & destino);
      simulado.bitboard_bispo_preto ^= (simulado.bitboard_bispo_preto & destino);
      simulado.bitboard_torre_preto ^= (simulado.bitboard_torre_preto & destino);
      simulado.bitboard_rainha_preto ^= (simulado.bitboard_rainha_preto & destino);
    }

    // Pretas jogam
    else{
      //  Atualizando o bitboard das pretas (capturando a peça)
      simulado.bitboard_piao_branco ^= (simulado.bitboard_piao_branco & destino);
      simulado.bitboard_cavalo_branco ^= (simulado.bitboard_cavalo_branco & destino);
      simulado.bitboard_bispo_branco ^= (simulado.bitboard_bispo_branco & destino);
      simulado.bitboard_torre_branco ^= (simulado.bitboard_torre_branco & destino);
      simulado.bitboard_rainha_branco ^= (simulado.bitboard_rainha_branco & destino);
    }

    this.efetuar_movimento(origem, destino);
    return;
  }

  static efetuar_movimento(origem, destino){
    // Brancas jogam
    if(estado.jogando == "w"){

      // Realizando movimento
      const movimentacao = origem | destino;
      simulado.bitboard_cavalo_branco ^= movimentacao;
      implementar("Bitboard do cavalo: \n" + visualizadeiro(simulado.bitboard_cavalo_branco) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{

      // Realizando movimento
      const movimentacao = origem | destino;
      simulado.bitboard_cavalo_preto^= movimentacao;
      implementar("Bitboard do cavalo: \n" + visualizadeiro(simulado.bitboard_cavalo_preto) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }

  }
}

class Bispo{
  static efetuar_captura(origem, destino){
    // Brancas jogam
    if(estado.jogando == "w"){
      //  Atualizando o bitboard das pretas (capturando a peça)
      simulado.bitboard_piao_preto ^= (simulado.bitboard_piao_preto & destino);
      simulado.bitboard_cavalo_preto ^= (simulado.bitboard_cavalo_preto & destino);
      simulado.bitboard_bispo_preto ^= (simulado.bitboard_bispo_preto & destino);
      simulado.bitboard_torre_preto ^= (simulado.bitboard_torre_preto & destino);
      simulado.bitboard_rainha_preto ^= (simulado.bitboard_rainha_preto & destino);
    }

    // Pretas jogam
    else{
      //  Atualizando o bitboard das pretas (capturando a peça)
      simulado.bitboard_piao_branco ^= (simulado.bitboard_piao_branco & destino);
      simulado.bitboard_cavalo_branco ^= (simulado.bitboard_cavalo_branco & destino);
      simulado.bitboard_bispo_branco ^= (simulado.bitboard_bispo_branco & destino);
      simulado.bitboard_torre_branco ^= (simulado.bitboard_torre_branco & destino);
      simulado.bitboard_rainha_branco ^= (simulado.bitboard_rainha_branco & destino);
    }

    this.efetuar_movimento(origem, destino);
    return;
  }

  static efetuar_movimento(origem, destino){
    // Brancas jogam
    if(estado.jogando == "w"){
      // Realizando movimento
      const movimentacao = origem | destino;
      simulado.bitboard_bispo_branco ^= movimentacao;
      implementar("Bitboard do bispo: \n" + visualizadeiro(simulado.bitboard_bispo_branco) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{
      // Realizando movimento
      const movimentacao = origem | destino;
      simulado.bitboard_bispo_preto ^= movimentacao;
      implementar("Bitboard do bispo: \n" + visualizadeiro(simulado.bitboard_bispo_preto) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }
  }
}

class Torre{
  static efetuar_captura(origem, destino){
    // Brancas jogam
    if(estado.jogando == "w"){
      // Atualizando o bitboard das pretas (capturando a peça)
      simulado.bitboard_piao_preto ^= (simulado.bitboard_piao_preto & destino);
      simulado.bitboard_cavalo_preto ^= (simulado.bitboard_cavalo_preto & destino);
      simulado.bitboard_bispo_preto ^= (simulado.bitboard_bispo_preto & destino);
      simulado.bitboard_torre_preto ^= (simulado.bitboard_torre_preto & destino);
      simulado.bitboard_rainha_preto ^= (simulado.bitboard_rainha_preto & destino);
    }

    // Pretas jogam
    else{
      //  Atualizando o bitboard das pretas (capturando a peça)
      simulado.bitboard_piao_branco ^= (simulado.bitboard_piao_branco & destino);
      simulado.bitboard_cavalo_branco ^= (simulado.bitboard_cavalo_branco & destino);
      simulado.bitboard_bispo_branco ^= (simulado.bitboard_bispo_branco & destino);
      simulado.bitboard_torre_branco ^= (simulado.bitboard_torre_branco & destino);
      simulado.bitboard_rainha_branco ^= (simulado.bitboard_rainha_branco & destino);
    }

    this.efetuar_movimento(origem, destino);
    return;
  }
  
  static efetuar_movimento(origem, destino){
    // Brancas jogam
    if(estado.jogando == "w"){

      // Caso a torre seja movida, vai desativar o roque do lado movido
      if((origem & estado.casa_onde_a_torre_deve_estar_para_fazer_roque_direita_branco) != 0n){
        simulado.status_roque_direita_branco = false;
      }
      else if((origem & estado.casa_onde_a_torre_deve_estar_para_fazer_roque_esquerda_branco) != 0n){
        simulado.status_roque_esquerda_branco = false;
      }

      // Realizando movimento
      const movimentacao = origem | destino;
      simulado.bitboard_torre_branco ^= movimentacao;
      implementar("Bitboard da torre: \n" + visualizadeiro(simulado.bitboard_torre_branco) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{

      // Caso a torre seja movida, vai desativar o roque do lado movido
      if((origem & estado.casa_onde_a_torre_deve_estar_para_fazer_roque_direita_preto) != 0n){
        estado.status_roque_direita_preto = false;
      }
      else if((origem & estado.casa_onde_a_torre_deve_estar_para_fazer_roque_esquerda_preto) != 0n){
        estado.status_roque_esquerda_preto = false;
      }

      // Realizando movimento
      const movimentacao = origem | destino;
      simulado.bitboard_torre_preto ^= movimentacao;
      implementar("Bitboard da torre: \n" + visualizadeiro(simulado.bitboard_torre_preto) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }
  }

}

class Dama{
  static efetuar_captura(origem, destino){
    // Brancas jogam
    if(estado.jogando == "w"){
      //  Atualizando o bitboard das pretas (capturando a peça)
      simulado.bitboard_piao_preto ^= (simulado.bitboard_piao_preto & destino);
      simulado.bitboard_cavalo_preto ^= (simulado.bitboard_cavalo_preto & destino);
      simulado.bitboard_bispo_preto ^= (simulado.bitboard_bispo_preto & destino);
      simulado.bitboard_torre_preto ^= (simulado.bitboard_torre_preto & destino);
      simulado.bitboard_rainha_preto ^= (simulado.bitboard_rainha_preto & destino);
    }

    // Pretas jogam
    else{
      //  Atualizando o bitboard das pretas (capturando a peça)
      simulado.bitboard_piao_branco ^= (simulado.bitboard_piao_branco & destino);
      simulado.bitboard_cavalo_branco ^= (simulado.bitboard_cavalo_branco & destino);
      simulado.bitboard_bispo_branco ^= (simulado.bitboard_bispo_branco & destino);
      simulado.bitboard_torre_branco ^= (simulado.bitboard_torre_branco & destino);
      simulado.bitboard_rainha_branco ^= (simulado.bitboard_rainha_branco & destino);
    }

    this.efetuar_movimento(origem, destino);
    return;
  }

  static efetuar_movimento(origem, destino){
    // Brancas jogam
    if(estado.jogando == "w"){

      // Realizando movimento
      const movimentacao = origem | destino;
      simulado.bitboard_rainha_branco ^= movimentacao;
      implementar("Bitboard da dama: \n" + visualizadeiro(simulado.bitboard_rainha_branco) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{

      // Realizando movimento
      const movimentacao = origem | destino;
      simulado.bitboard_rainha_preto ^= movimentacao;
      implementar("Bitboard da dama: \n" + visualizadeiro(simulado.bitboard_rainha_branco) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }
  }
}

class Rei{
  static efetuar_roque_esquerda(){
    // Brancas jogam
    if(estado.jogando == "w"){
      simulado.bitboard_torre_branco = ((estado.bitboard_torre_branco ^ 0x0000000000000001n) | estado.casa_onde_a_torre_vai_ficar_no_roque_esquerda_branco);
      simulado.bitboard_rei_branco = estado.casa_onde_o_rei_vai_ficar_no_roque_esquerda_branco;
      simulado.status_roque_esquerda_branco = false;
      simulado.status_roque_direita_branco = false;
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{
      simulado.bitboard_torre_preto= ((estado.bitboard_torre_preto ^ 0x0100000000000000n) | estado.casa_onde_a_torre_vai_ficar_no_roque_esquerda_preto);
      simulado.bitboard_rei_preto = estado.casa_onde_o_rei_vai_ficar_no_roque_esquerda_preto;
      simulado.status_roque_esquerda_preto = false;
      simulado.status_roque_direita_preto = false;
      atualizarTabuleiro();
      return;
    }
    
  }

  static efetuar_roque_direita(){
    // Brancas jogam
    if(estado.jogando == "w"){
      simulado.bitboard_torre_branco = ((estado.bitboard_torre_branco ^ 0x0000000000000080n) | estado.casa_onde_a_torre_vai_ficar_no_roque_direita_branco);
      simulado.bitboard_rei_branco = estado.casa_onde_o_rei_vai_ficar_no_roque_direita_branco;
      simulado.status_roque_esquerda_branco = false;
      simulado.status_roque_direita_branco = false;
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{
      simulado.bitboard_torre_preto = ((estado.bitboard_torre_preto ^ 0x8000000000000000n) | estado.casa_onde_a_torre_vai_ficar_no_roque_direita_preto);
      simulado.bitboard_rei_preto = estado.casa_onde_o_rei_vai_ficar_no_roque_direita_preto;
      simulado.status_roque_esquerda_preto = false;
      simulado.status_roque_direita_preto = false;
      atualizarTabuleiro();
      return;
    }
  }

  static efetuar_captura(origem, destino){
    // Brancas jogam
    if(estado.jogando == "w"){
      //  Atualizando o bitboard das pretas (capturando a peça)
      simulado.bitboard_piao_preto ^= (simulado.bitboard_piao_preto & destino);
      simulado.bitboard_cavalo_preto ^= (simulado.bitboard_cavalo_preto & destino);
      simulado.bitboard_bispo_preto ^= (simulado.bitboard_bispo_preto & destino);
      simulado.bitboard_torre_preto ^= (simulado.bitboard_torre_preto & destino);
      simulado.bitboard_rainha_preto ^= (simulado.bitboard_rainha_preto & destino);
    }
    // Pretas jogam
    else{
      //  Atualizando o bitboard das pretas (capturando a peça)
      simulado.bitboard_piao_branco ^= (simulado.bitboard_piao_branco & destino);
      simulado.bitboard_cavalo_branco ^= (simulado.bitboard_cavalo_branco & destino);
      simulado.bitboard_bispo_branco ^= (simulado.bitboard_bispo_branco & destino);
      simulado.bitboard_torre_branco ^= (simulado.bitboard_torre_branco & destino);
      simulado.bitboard_rainha_branco ^= (simulado.bitboard_rainha_branco & destino);
    }

    this.efetuar_movimento(origem, destino);
    return;
  }

  static efetuar_movimento(origem, destino){
    // Brancas jogam
    if(estado.jogando == "w"){

      simulado.status_roque_direita_branco = false;
      simulado.status_roque_esquerda_branco = false;

      // Realizando movimento
      const movimentacao = origem | destino;
      simulado.bitboard_rei_branco ^= movimentacao;
      implementar("Bitboard do rei: \n" + visualizadeiro(simulado.bitboard_rei_branco) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{

      simulado.status_roque_direita_preto = false;
      simulado.status_roque_esquerda_preto = false;
        
      // Realizando movimento
      const movimentacao = origem | destino;
      simulado.bitboard_rei_preto ^= movimentacao;
      implementar("Bitboard do rei: \n" + visualizadeiro(simulado.bitboard_rei_preto) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }
  }
}

function atualizarTabuleiro(){
  // Atualizando o bitboard de todas as peças brancas
  simulado.bitboard_brancas = simulado.bitboard_piao_branco | simulado.bitboard_cavalo_branco | simulado.bitboard_bispo_branco | simulado.bitboard_torre_branco | simulado.bitboard_rainha_branco | simulado.bitboard_rei_branco;
  implementar("Bitboard das brancas (todas peças): \n" + visualizadeiro(simulado.bitboard_brancas) + '\n');

  // Atualizando o bitboard de todas as peças pretas
  simulado.bitboard_pretas = simulado.bitboard_piao_preto | simulado.bitboard_cavalo_preto | simulado.bitboard_bispo_preto | simulado.bitboard_torre_preto | simulado.bitboard_rainha_preto | simulado.bitboard_rei_preto;
  implementar("Bitboard das pretas (todas peças): \n" + visualizadeiro(simulado.bitboard_pretas) + '\n');
  
  // Atualizando o bitboard com todas as casas ocupadas
  simulado.bitboard_tabuleiro = simulado.bitboard_brancas | simulado.bitboard_pretas;
  implementar("Bitboard do tabuleiro (um todo): \n" + visualizadeiro(simulado.bitboard_tabuleiro) + '\n');
}