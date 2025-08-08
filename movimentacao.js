import { Calcular } from './calcular.js';
import { desconverter } from './traducao.js';
import { estado } from './variaveis.js'
import { visualizadeiro } from './visualizador.js';

// Função orquestradora e que fica exporta (única).
export function mover(de, para, promocao){
  console.log("-- Iniciado a etapa de movimentação --");

  // Zerando os en passant caso tenha
  if(estado.jogando == "p" && estado.en_passant_pretas !== 0n){
    console.log("Foi zerado o en passant das pretas");
    estado.en_passant_pretas = 0n;
  }
  else if(estado.jogando == "w" && estado.en_passant_brancas !== 0n){
    console.log("Foi zerado o en passant das brancas");
    estado.en_passant_brancas = 0n;
  }

  // Calcular.calcular_casas_atacadas();
  // let retorno_verificacao_rei_atacado = Calcular.verificar_rei_atacado(estado.jogando);
  
  // if(retorno_verificacao_rei_atacado == true){
  //   const todos_movimentos_possiveis = Calcular.calcular_todos_possiveis_movimento(estado.jogando);
  //   const todos_movimentos_defem_o_rei = Calcular.calcular_defesa_rei(estado.jogando, todos_movimentos_possiveis);
  //   console.log("Movimentos possíveis para defender o rei")
  //   console.log((todos_movimentos_defem_o_rei));
  // }

  // Dentro da função já chama a classe para fazer a verificação e realizar o movimento.
  descobrirPeca(de, para, promocao);

  estado.jogando = (estado.jogando == "w") ? "p" : "w";

  if(estado.jogando == "w"){
    console.log("Brancas jogam");
  }
  else{
    console.log("Pretas jogam");
  }

  Calcular.calcular_casas_atacadas();
  retorno_verificacao_rei_atacado = Calcular.verificar_rei_atacado(estado.jogando);
  console.log(`O rei está atacado? ${retorno_verificacao_rei_atacado}`);
}

function descobrirPeca(origem, destino){
  console.log("\n\n-- Iniciado a etapa de verificação: peça movida --\n\n");

  // Brancas jogam
  if(estado.jogando == "w"){
    if(estado.bitboard_piao_branco & origem){
      console.log("A peça movida é piao brancas");

      const movimentos_possiveis = Calcular.ataque_e_movimento_piao("w", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        console.log("Você fez um movimento inválido de pião");
        throw new Error();
      }

      // Entra se foi feito um en passant
      if((movimentos_possiveis.en_passant.length > 0) && movimentos_possiveis.en_passant.includes(destino)){
        Piao.efetuar_en_passant(origem, destino);
        console.log("Foi feito um en passant");
      }
      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Piao.efetuar_captura(origem, destino);
        console.log("Foi feito captura");
      }
      // Entra se foi feito um movimento
      else{
        // Verificando se foi feito um movimento duplo. Se for feito vai atualizar o bitboard de en passant.
        if((origem << estado.movimento_piao[1]) == destino){
          estado.en_passant_brancas = origem << estado.movimento_piao[0];
        }

        Piao.efetuar_movimento(origem, destino);
        console.log("Foi feito movimento");
      }

      return;
    }
    else if(estado.bitboard_cavalo_branco & origem){
      console.log("A peça movida é cavalo brancas");

      const movimentos_possiveis = Calcular.ataque_e_movimento_cavalo("w", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        console.log("Você fez um movimento inválido de cavalo");
        throw new Error();
      }

      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Cavalo.efetuar_captura(origem, destino);
        console.log("Foi feito captura");
      }
      // Entra se foi feito um movimento
      else{
        Cavalo.efetuar_movimento(origem, destino);
        console.log("Foi feito movimento");
      }

      return;
    }
    else if(estado.bitboard_bispo_branco & origem){
      console.log("A peça movida é bispo brancas");

      const movimentos_possiveis = Calcular.ataque_e_movimento_bispo("w", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        console.log("Você fez um movimento inválido de bispo");
        throw new Error();
      }

      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Bispo.efetuar_captura(origem, destino);
        console.log("Foi feito captura");
      }
      // Entra se foi feito um movimento
      else{
        Bispo.efetuar_movimento(origem, destino);
        console.log("Foi feito movimento");
      }

      return;
    }
    else if(estado.bitboard_torre_branco & origem){
      console.log("A peça movida é torre brancas");
      
      const movimentos_possiveis = Calcular.ataque_e_movimento_torre("w", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        console.log("Você fez um movimento inválido de torre");
        throw new Error();
      }

      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Torre.efetuar_captura(origem, destino);
        console.log("Foi feito captura");
      }
      // Entra se foi feito um movimento
      else{
        Torre.efetuar_movimento(origem, destino);
        console.log("Foi feito movimento");
      }

      return;
    }
    else if(estado.bitboard_rainha_branco & origem){
      console.log("A peça movida é rainha brancas");
      
      const movimentos_possiveis = Calcular.ataque_e_movimento_rainha("w", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        console.log("Você fez um movimento inválido de dama");
        throw new Error();
      }

      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Dama.efetuar_captura(origem, destino);
        console.log("Foi feito captura");
      }
      // Entra se foi feito um movimento
      else{
        Dama.efetuar_movimento(origem, destino);
        console.log("Foi feito movimento");
      }

      return;
    }
    else if(estado.bitboard_rei_branco & origem){
      console.log("A peça movida é rei brancas");

      const movimentos_possiveis = Calcular.ataque_e_movimento_rei("w", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        console.log("Você fez um movimento inválido de rei");
        throw new Error();
      }
      // Entra se foi feito um roque para direita
      else if((movimentos_possiveis.roque_esquerda.length > 0) && movimentos_possiveis.roque_esquerda.includes(destino)){
        Rei.efetuar_roque_esquerda(origem, destino);
        console.log("Foi feito roque para esquerda");
      }
      // Entra se foi feito uma captura
      else if((movimentos_possiveis.roque_direita.length > 0) && movimentos_possiveis.roque_direita.includes(destino)){
        Rei.efetuar_roque_direita(origem, destino);
        console.log("Foi feito roque para direita");
      }
      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Rei.efetuar_captura(origem, destino);
        console.log("Foi feito captura");
      }
      // Entra se foi feito um movimento
      else{
        Rei.efetuar_movimento(origem, destino);
        console.log("Foi feito movimento");
      }

      return;
    }
    else{
      console.log("Movimento invalido - tentou mover a peça adversária (vez das brancas e não pretas)");
      throw new Error();
    }
  }

  // Pretas jogam
  else{
    if(estado.bitboard_piao_preto & origem){
      console.log("A peça movida é piao pretas");

      const movimentos_possiveis = Calcular.ataque_e_movimento_piao("b", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        console.log("Você fez um movimento inválido de pião");
        throw new Error();
      }

      // Entra se foi feito um en passant
      if((movimentos_possiveis.en_passant.length > 0) && movimentos_possiveis.en_passant.includes(destino)){
        Piao.efetuar_en_passant(origem, destino);
        console.log("Foi feito um en passant");
      }
      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Piao.efetuar_captura(origem, destino);
        console.log("Foi feito captura");
      }
      // Entra se foi feito um movimento
      else{
        // Verificando se foi feito um movimento duplo. Se for feito vai atualizar o bitboard de en passant.
        if((origem >> estado.movimento_piao[1]) == destino){
          estado.en_passant_pretas = origem >> estado.movimento_piao[0];
        }

        Piao.efetuar_movimento(origem, destino);
        console.log("Foi feito movimento");
      }

      return;
    }
    else if(estado.bitboard_cavalo_preto & origem){
      console.log("A peça movida é cavalo pretas");

      const movimentos_possiveis = Calcular.ataque_e_movimento_cavalo("b", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        console.log("Você fez um movimento inválido de cavalo");
        throw new Error();
      }

      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Cavalo.efetuar_captura(origem, destino);
        console.log("Foi feito captura");
      }
      // Entra se foi feito um movimento
      else{
        Cavalo.efetuar_movimento(origem, destino);
        console.log("Foi feito movimento");
      }

      return;
    }
    else if(estado.bitboard_bispo_preto & origem){
      console.log("A peça movida é bispo pretas");

      const movimentos_possiveis = Calcular.ataque_e_movimento_bispo("b", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        console.log("Você fez um movimento inválido de bispo");
        throw new Error();
      }

      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Bispo.efetuar_captura(origem, destino);
        console.log("Foi feito captura");
      }
      // Entra se foi feito um movimento
      else{
        Bispo.efetuar_movimento(origem, destino);
        console.log("Foi feito movimento");
      }

      return;
    }
    else if(estado.bitboard_torre_preto & origem){
      console.log("A peça movida é torre pretas");
      
      const movimentos_possiveis = Calcular.ataque_e_movimento_torre("b", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        console.log("Você fez um movimento inválido de torre");
        throw new Error();
      }

      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Torre.efetuar_captura(origem, destino);
        console.log("Foi feito captura");
      }
      // Entra se foi feito um movimento
      else{
        Torre.efetuar_movimento(origem, destino);
        console.log("Foi feito movimento");
      }

      return;
    }
    else if(estado.bitboard_rainha_preto & origem){
      console.log("A peça movida é rainha pretas");
      
      const movimentos_possiveis = Calcular.ataque_e_movimento_rainha("b", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        console.log("Você fez um movimento inválido de dama");
        throw new Error();
      }

      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Dama.efetuar_captura(origem, destino);
        console.log("Foi feito captura");
      }
      // Entra se foi feito um movimento
      else{
        Dama.efetuar_movimento(origem, destino);
        console.log("Foi feito movimento");
      }

      return;
    }
    else if(estado.bitboard_rei_preto & origem){
      console.log("A peça movida é rei pretas");

     const movimentos_possiveis = Calcular.ataque_e_movimento_rei("b", origem);

      // Verificando se o lance feito é um lance inválido
      if(movimentos_possiveis.todos.includes(destino) == false){
        console.log("Você fez um movimento inválido de rei");
        throw new Error();
      }
      // Entra se foi feito um roque para direita
      else if((movimentos_possiveis.roque_esquerda.length > 0) && movimentos_possiveis.roque_esquerda.includes(destino)){
        Rei.efetuar_roque_esquerda(origem, destino);
        console.log("Foi feito roque para esquerda");
      }
      // Entra se foi feito uma captura
      else if((movimentos_possiveis.roque_direita.length > 0) && movimentos_possiveis.roque_direita.includes(destino)){
        Rei.efetuar_roque_direita(origem, destino);
        console.log("Foi feito roque para direita");
      }
      // Entra se foi feito uma captura
      else if((movimentos_possiveis.capturas.length > 0) && movimentos_possiveis.capturas.includes(destino)){
        Rei.efetuar_captura(origem, destino);
        console.log("Foi feito captura");
      }
      // Entra se foi feito um movimento
      else{
        Rei.efetuar_movimento(origem, destino);
        console.log("Foi feito movimento");
      }

      return;
    }
    else{
      console.log("Movimento invalido - tentou mover a peça adversária (vez das pretas e não brancas)");
      throw new Error();
    }
  }
}

class Piao{
  static efetuar_en_passant(origem, destino){
    // Brancas jogam
    if(estado.jogando == "w"){
      estado.bitboard_piao_preto ^= (estado.en_passant_pretas >> estado.movimento_piao[0]) 
      estado.en_passant_pretas = 0n;
    }
    // Pretas jogam
    else{
      estado.bitboard_piao_branco ^= (estado.en_passant_brancas << estado.movimento_piao[0]) 
      estado.en_passant_brancas = 0n;
    }

    this.efetuar_movimento(origem, destino);
    return;
  }
  static efetuar_captura(origem, destino){
    // Brancas jogam
    if(estado.jogando == "w"){
      //  Atualizando o bitboard das pretas (capturando a peça)
      estado.bitboard_piao_preto ^= (estado.bitboard_piao_preto & destino);
      estado.bitboard_cavalo_preto ^= (estado.bitboard_cavalo_preto & destino);
      estado.bitboard_bispo_preto ^= (estado.bitboard_bispo_preto & destino);
      estado.bitboard_torre_preto ^= (estado.bitboard_torre_preto & destino);
      estado.bitboard_rainha_preto ^= (estado.bitboard_rainha_preto & destino);
    }
    // Pretas jogam
    else{
      estado.bitboard_piao_branco ^= (estado.bitboard_piao_branco & destino);
      estado.bitboard_cavalo_branco ^= (estado.bitboard_cavalo_branco & destino);
      estado.bitboard_bispo_branco ^= (estado.bitboard_bispo_branco & destino);
      estado.bitboard_torre_branco ^= (estado.bitboard_torre_branco & destino);
      estado.bitboard_rainha_branco ^= (estado.bitboard_rainha_branco & destino);
    }

    this.efetuar_movimento(origem, destino);
    return;
  }
  
  static efetuar_movimento(origem, destino){
    // Brancas jogam
    if(estado.jogando == "w"){
      // Realizando movimento
      const movimentacao = origem | destino;
      estado.bitboard_piao_branco ^= movimentacao;
      console.log("Bitboard do pião: \n" + visualizadeiro(estado.bitboard_piao_branco) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{
      // Realizando movimento
      const movimentacao = origem | destino;
      estado.bitboard_piao_preto ^= movimentacao;
      console.log("Bitboard do pião: \n" + visualizadeiro(estado.bitboard_piao_preto) + '\n');

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
      estado.bitboard_piao_preto ^= (estado.bitboard_piao_preto & destino);
      estado.bitboard_cavalo_preto ^= (estado.bitboard_cavalo_preto & destino);
      estado.bitboard_bispo_preto ^= (estado.bitboard_bispo_preto & destino);
      estado.bitboard_torre_preto ^= (estado.bitboard_torre_preto & destino);
      estado.bitboard_rainha_preto ^= (estado.bitboard_rainha_preto & destino);
    }

    // Pretas jogam
    else{
      //  Atualizando o bitboard das pretas (capturando a peça)
      estado.bitboard_piao_branco ^= (estado.bitboard_piao_branco & destino);
      estado.bitboard_cavalo_branco ^= (estado.bitboard_cavalo_branco & destino);
      estado.bitboard_bispo_branco ^= (estado.bitboard_bispo_branco & destino);
      estado.bitboard_torre_branco ^= (estado.bitboard_torre_branco & destino);
      estado.bitboard_rainha_branco ^= (estado.bitboard_rainha_branco & destino);
    }

    this.efetuar_movimento(origem, destino);
    return;
  }

  static efetuar_movimento(origem, destino){
    // Brancas jogam
    if(estado.jogando == "w"){

      // Realizando movimento
      const movimentacao = origem | destino;
      estado.bitboard_cavalo_branco ^= movimentacao;
      console.log("Bitboard do cavalo: \n" + visualizadeiro(estado.bitboard_cavalo_branco) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{

      // Realizando movimento
      const movimentacao = origem | destino;
      estado.bitboard_cavalo_preto^= movimentacao;
      console.log("Bitboard do cavalo: \n" + visualizadeiro(estado.bitboard_cavalo_preto) + '\n');

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
      estado.bitboard_piao_preto ^= (estado.bitboard_piao_preto & destino);
      estado.bitboard_cavalo_preto ^= (estado.bitboard_cavalo_preto & destino);
      estado.bitboard_bispo_preto ^= (estado.bitboard_bispo_preto & destino);
      estado.bitboard_torre_preto ^= (estado.bitboard_torre_preto & destino);
      estado.bitboard_rainha_preto ^= (estado.bitboard_rainha_preto & destino);
    }

    // Pretas jogam
    else{
      //  Atualizando o bitboard das pretas (capturando a peça)
      estado.bitboard_piao_branco ^= (estado.bitboard_piao_branco & destino);
      estado.bitboard_cavalo_branco ^= (estado.bitboard_cavalo_branco & destino);
      estado.bitboard_bispo_branco ^= (estado.bitboard_bispo_branco & destino);
      estado.bitboard_torre_branco ^= (estado.bitboard_torre_branco & destino);
      estado.bitboard_rainha_branco ^= (estado.bitboard_rainha_branco & destino);
    }

    this.efetuar_movimento(origem, destino);
    return;
  }

  static efetuar_movimento(origem, destino){
    // Brancas jogam
    if(estado.jogando == "w"){
      // Realizando movimento
      const movimentacao = origem | destino;
      estado.bitboard_bispo_branco ^= movimentacao;
      console.log("Bitboard do bispo: \n" + visualizadeiro(estado.bitboard_bispo_branco) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{
      // Realizando movimento
      const movimentacao = origem | destino;
      estado.bitboard_bispo_preto ^= movimentacao;
      console.log("Bitboard do bispo: \n" + visualizadeiro(estado.bitboard_bispo_preto) + '\n');

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
      estado.bitboard_piao_preto ^= (estado.bitboard_piao_preto & destino);
      estado.bitboard_cavalo_preto ^= (estado.bitboard_cavalo_preto & destino);
      estado.bitboard_bispo_preto ^= (estado.bitboard_bispo_preto & destino);
      estado.bitboard_torre_preto ^= (estado.bitboard_torre_preto & destino);
      estado.bitboard_rainha_preto ^= (estado.bitboard_rainha_preto & destino);
    }

    // Pretas jogam
    else{
      //  Atualizando o bitboard das pretas (capturando a peça)
      estado.bitboard_piao_branco ^= (estado.bitboard_piao_branco & destino);
      estado.bitboard_cavalo_branco ^= (estado.bitboard_cavalo_branco & destino);
      estado.bitboard_bispo_branco ^= (estado.bitboard_bispo_branco & destino);
      estado.bitboard_torre_branco ^= (estado.bitboard_torre_branco & destino);
      estado.bitboard_rainha_branco ^= (estado.bitboard_rainha_branco & destino);
    }

    this.efetuar_movimento(origem, destino);
    return;
  }
  
  static efetuar_movimento(origem, destino){
    // Brancas jogam
    if(estado.jogando == "w"){

      // Caso a torre seja movida, vai desativar o roque do lado movido
      if((origem & estado.casa_torre_direita_branco) != 0n){
        estado.status_roque_direita_branco = false;
      }
      else if((origem & estado.casa_torre_esquerda_branco) != 0n){
        estado.status_roque_esquerda_branco = false;
      }

      // Realizando movimento
      const movimentacao = origem | destino;
      estado.bitboard_torre_branco ^= movimentacao;
      console.log("Bitboard da torre: \n" + visualizadeiro(estado.bitboard_torre_branco) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{

      // Caso a torre seja movida, vai desativar o roque do lado movido
      if((origem & estado.casa_torre_direita_preto) != 0n){
        estado.status_roque_direita_preto = false;
      }
      else if((origem & estado.casa_torre_esquerda_preto) != 0n){
        estado.status_roque_esquerda_preto = false;
      }

      // Realizando movimento
      const movimentacao = origem | destino;
      estado.bitboard_torre_preto ^= movimentacao;
      console.log("Bitboard da torre: \n" + visualizadeiro(estado.bitboard_torre_preto) + '\n');

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
      estado.bitboard_piao_preto ^= (estado.bitboard_piao_preto & destino);
      estado.bitboard_cavalo_preto ^= (estado.bitboard_cavalo_preto & destino);
      estado.bitboard_bispo_preto ^= (estado.bitboard_bispo_preto & destino);
      estado.bitboard_torre_preto ^= (estado.bitboard_torre_preto & destino);
      estado.bitboard_rainha_preto ^= (estado.bitboard_rainha_preto & destino);
    }

    // Pretas jogam
    else{
      //  Atualizando o bitboard das pretas (capturando a peça)
      estado.bitboard_piao_branco ^= (estado.bitboard_piao_branco & destino);
      estado.bitboard_cavalo_branco ^= (estado.bitboard_cavalo_branco & destino);
      estado.bitboard_bispo_branco ^= (estado.bitboard_bispo_branco & destino);
      estado.bitboard_torre_branco ^= (estado.bitboard_torre_branco & destino);
      estado.bitboard_rainha_branco ^= (estado.bitboard_rainha_branco & destino);
    }

    this.efetuar_movimento(origem, destino);
    return;
  }

  static efetuar_movimento(origem, destino){
    // Brancas jogam
    if(estado.jogando == "w"){

      // Realizando movimento
      const movimentacao = origem | destino;
      estado.bitboard_rainha_branco ^= movimentacao;
      console.log("Bitboard da dama: \n" + visualizadeiro(estado.bitboard_rainha_branco) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{

      // Realizando movimento
      const movimentacao = origem | destino;
      estado.bitboard_rainha_preto ^= movimentacao;
      console.log("Bitboard da dama: \n" + visualizadeiro(estado.bitboard_rainha_branco) + '\n');

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
      estado.bitboard_torre_branco = ((estado.bitboard_torre_branco ^ 0x0000000000000001n) | estado.casa_onde_a_torre_vai_ficar_no_roque_esquerda_branco);
      estado.bitboard_rei_branco = estado.casa_onde_o_rei_vai_ficar_no_roque_esquerda_branco;
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{
      estado.bitboard_torre_preto= ((estado.bitboard_torre_preto ^ 0x0100000000000000n) | estado.casa_onde_a_torre_vai_ficar_no_roque_esquerda_preto);
      estado.bitboard_rei_preto = estado.casa_onde_o_rei_vai_ficar_no_roque_esquerda_preto;
      atualizarTabuleiro();
      return;
    }
  }

  static efetuar_roque_direita(){
    // Brancas jogam
    if(estado.jogando == "w"){
      estado.bitboard_torre_branco = ((estado.bitboard_torre_branco ^ 0x0000000000000080n) | estado.casa_onde_a_torre_vai_ficar_no_roque_direita_branco);
      estado.bitboard_rei_branco = estado.casa_onde_o_rei_vai_ficar_no_roque_direita_branco;
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{
      estado.bitboard_torre_preto = ((estado.bitboard_torre_preto ^ 0x8000000000000000n) | estado.casa_onde_a_torre_vai_ficar_no_roque_direita_preto);
      estado.bitboard_rei_preto = estado.casa_onde_o_rei_vai_ficar_no_roque_direita_preto;
      atualizarTabuleiro();
      return;
    }
  }

  static efetuar_captura(origem, destino){
    // Brancas jogam
    if(estado.jogando == "w"){
      //  Atualizando o bitboard das pretas (capturando a peça)
      estado.bitboard_piao_preto ^= (estado.bitboard_piao_preto & destino);
      estado.bitboard_cavalo_preto ^= (estado.bitboard_cavalo_preto & destino);
      estado.bitboard_bispo_preto ^= (estado.bitboard_bispo_preto & destino);
      estado.bitboard_torre_preto ^= (estado.bitboard_torre_preto & destino);
      estado.bitboard_rainha_preto ^= (estado.bitboard_rainha_preto & destino);
    }
    // Pretas jogam
    else{
      //  Atualizando o bitboard das pretas (capturando a peça)
      estado.bitboard_piao_branco ^= (estado.bitboard_piao_branco & destino);
      estado.bitboard_cavalo_branco ^= (estado.bitboard_cavalo_branco & destino);
      estado.bitboard_bispo_branco ^= (estado.bitboard_bispo_branco & destino);
      estado.bitboard_torre_branco ^= (estado.bitboard_torre_branco & destino);
      estado.bitboard_rainha_branco ^= (estado.bitboard_rainha_branco & destino);
    }

    this.efetuar_movimento(origem, destino);
    return;
  }

  static efetuar_movimento(origem, destino){
    // Brancas jogam
    if(estado.jogando == "w"){

      estado.status_roque_direita_branco = false;
      estado.status_roque_esquerda_branco = false;

      // Realizando movimento
      const movimentacao = origem | destino;
      estado.bitboard_rei_branco ^= movimentacao;
      console.log("Bitboard do rei: \n" + visualizadeiro(estado.bitboard_rei_branco) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{

      estado.status_roque_direita_preto = false;
      estado.status_roque_esquerda_preto = false;
        
      // Realizando movimento
      const movimentacao = origem | destino;
      estado.bitboard_rei_preto ^= movimentacao;
      console.log("Bitboard do rei: \n" + visualizadeiro(estado.bitboard_rei_preto) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }
  }
}

function atualizarTabuleiro(){
  // Atualizando o bitboard de todas as peças brancas
  estado.bitboard_brancas = estado.bitboard_piao_branco | estado.bitboard_cavalo_branco | estado.bitboard_bispo_branco | estado.bitboard_torre_branco | estado.bitboard_rainha_branco | estado.bitboard_rei_branco;
  console.log("Bitboard das brancas (todas peças): \n" + visualizadeiro(estado.bitboard_brancas) + '\n');

  // Atualizando o bitboard de todas as peças pretas
  estado.bitboard_pretas = estado.bitboard_piao_preto | estado.bitboard_cavalo_preto | estado.bitboard_bispo_preto | estado.bitboard_torre_preto | estado.bitboard_rainha_preto | estado.bitboard_rei_preto;
  console.log("Bitboard das pretas (todas peças): \n" + visualizadeiro(estado.bitboard_pretas) + '\n');
  
  // Atualizando o bitboard com todas as casas ocupadas
  estado.bitboard_tabuleiro = estado.bitboard_brancas | estado.bitboard_pretas;
  console.log("Bitboard do tabuleiro (um todo): \n" + visualizadeiro(estado.bitboard_tabuleiro) + '\n');
}