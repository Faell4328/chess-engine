import { converter, converterFEN, desconverter } from './traducao.js';
import { estado } from './variaveis.js'
import { visualizadeiro } from './visualizador.js';

/**
 * 1° Identificar a peça e também verifica se foi movido a peça da cor certo, correspondente ao turno.
 * 2° Chamar a classe da peça.
 * 2.1° Verificações (ex: pião, verificar se é um movimento válido, movimento duplo, captura e etc).
 * 2.2° Efeturar o movimento, caso passe na verificação.
 * 3° Atualizar tabuleiro.
 */


function calcularPossibilidadeMovimento (de, deslocamento, operador, isPiao, borda) {
  let movimentos_possiveis = [];
  let peca_aliada = null;
  let peca_inimiga = null;

  if(estado.turno == 1){
    peca_aliada = estado.bitboard_brancas;
    peca_inimiga = estado.bitboard_pretas;
  }
  else{
    peca_aliada = estado.bitboard_pretas;
    peca_inimiga = estado.bitboard_brancas;
  }

  if(de & borda){
    console.log("A peça está na borda e não é possível fazer o movimento");
    return [];
  }

  console.log("Calculando possibilidades")

  for(let cont = 0; cont < deslocamento.length; cont ++){
    const destino = ((operador == "<<") ? de << deslocamento[cont] : de >> deslocamento[cont]);

    // Verificando se a casa está ocupada por um aliado
    if((destino & peca_aliada) !== 0n){
      console.log("Casa ocupada por alidado\n");
      break;
    }
    // Verificando se a peça estara no canto
    else if((destino & borda) !== 0n){
      console.log("A peça está no canto\n");
      movimentos_possiveis.push(destino);
      break;
    }
    // Verificiando se a casa está ocupada por um inimigo
    else if((destino & peca_inimiga) !== 0n){
      console.log("Casa ocupada por inimigo\n");
      if(isPiao == false){
        movimentos_possiveis.push(destino);
      }
      break;
    }
    
    movimentos_possiveis.push(destino);
  }

  return movimentos_possiveis;
}


// Função orquestradora e que fica exporta (única).
export function mover(de, para, promocao){
  console.log("-- Iniciado a etapa de movimentação --");

  // Zerando os en passant caso tenha
  if(estado.turno == 0 && estado.en_passant_pretas !== 0n){
    console.log("Foi zerado o en passant das pretas");
    estado.en_passant_pretas = 0n;
  }
  else if(estado.turno == 1 && estado.en_passant_brancas !== 0n){
    console.log("Foi zerado o en passant das brancas");
    estado.en_passant_brancas = 0n;
  }

  // Dentro da função já chama a classe para fazer a verificação e realizar o movimento.
  descobrirPeca(de, para, promocao);

  estado.turno = !estado.turno;

  if(estado.turno == 1){
    console.log("Brancas jogam");
  }
  else{
    console.log("Pretas jogam");
  }
}

function descobrirPeca(de, para, promocao){
  console.log("\n\n-- Iniciado a etapa de verificação: peça movida --\n\n");

  // Brancas jogam
  if(estado.turno == 1){
    if(estado.bitboard_piao_branco & de){
      console.log("A peça é piao brancas");
      // Retorna os possiveis movimentos e já verifica se é um lance válido
      const movimento_captura = Piao.verificarCaptura(de, para);
      if(movimento_captura == 0){
        Piao.calcularCasas(de, para)
      }
      Piao.efetuarMovimento(de, para, movimento_captura);
      return;
    }
    else if(estado.bitboard_cavalo_branco & de){
      console.log("A peça é cavalo brancas");
      // Retorna os possiveis movimentos e já verifica se é um lance válido
      Cavalo.calcularCasas(de, para)
      const movimento_captura = Cavalo.verificarCaptura(de, para);
      Cavalo.efetuarMovimento(de, para, movimento_captura);
      return;
    }
    else if(estado.bitboard_bispo_branco & de){
      console.log("A peça é bispo brancas");
      // Retorna os possiveis movimentos e já verifica se é um lance válido
      Bispo.calcularCasas(de, para)
      const movimento_captura = Bispo.verificarCaptura(de, para);
      Bispo.efetuarMovimento(de, para, movimento_captura);
      return;
    }
    else if(estado.bitboard_torre_branco & de){
      console.log("A peça é torre brancas");
      // Retorna os possiveis movimentos e já verifica se é um lance válido
      Torre.calcularCasas(de, para)
      const movimento_captura = Torre.verificarCaptura(de, para);
      Torre.efetuarMovimento(de, para, movimento_captura);
      return;
    }
    else if(estado.bitboard_rainha_branco & de){
      console.log("A peça é rainha brancas");
      Dama.calcularCasas(de, para)
      const movimento_captura = Dama.verificarCaptura(de, para);
      Dama.efetuarMovimento(de, para, movimento_captura);
      return;
    }
    else if(estado.bitboard_rei_branco & de){
      console.log("A peça é rei brancas");
      Rei.calcularCasas(de, para)
      const movimento_captura = Rei.verificarCaptura(de, para);
      Rei.efetuarMovimento(de, para, movimento_captura);
      return;
    }
    else{
      console.log("Movimento invalido - tentou mover a peça adversária (vez das brancas e não pretas)");
      throw new Error();
    }
  }

  // Pretas jogam
  else{
    if(estado.bitboard_piao_preto & de){
      console.log("A peça é piao pretas");
      // Retorna os possiveis movimentos e já verifica se é um lance válido
      const movimento_captura = Piao.verificarCaptura(de, para);
      if(movimento_captura == 0){
        Piao.calcularCasas(de, para)
      }
      Piao.efetuarMovimento(de, para, movimento_captura);
      return;
    }
    else if(estado.bitboard_cavalo_preto & de){
      console.log("A peça é cavalo pretas");
      // Retorna os possiveis movimentos e já verifica se é um lance válido
      Cavalo.calcularCasas(de, para)
      const movimento_captura = Cavalo.verificarCaptura(de, para);
      Cavalo.efetuarMovimento(de, para, movimento_captura);
      return;
    }
    else if(estado.bitboard_bispo_preto & de){
      console.log("A peça é bispo pretas");
      // Retorna os possiveis movimentos e já verifica se é um lance válido
      Bispo.calcularCasas(de, para)
      const movimento_captura = Bispo.verificarCaptura(de, para);
      Bispo.efetuarMovimento(de, para, movimento_captura);
      return;
    }
    else if(estado.bitboard_torre_preto & de){
      console.log("A peça é torre pretas");
      // Retorna os possiveis movimentos e já verifica se é um lance válido
      Torre.calcularCasas(de, para)
      const movimento_captura = Torre.verificarCaptura(de, para);
      Torre.efetuarMovimento(de, para, movimento_captura);
      return;
    }
    else if(estado.bitboard_rainha_preto & de){
      console.log("A peça é rainha pretas");
      Dama.calcularCasas(de, para)
      const movimento_captura = Dama.verificarCaptura(de, para);
      Dama.efetuarMovimento(de, para, movimento_captura);
      return;
    }
    else if(estado.bitboard_rei_preto & de){
      console.log("A peça é rei pretas");
      Rei.calcularCasas(de, para)
      const movimento_captura = Rei.verificarCaptura(de, para);
      Rei.efetuarMovimento(de, para, movimento_captura);
      return;
    }
    else{
      console.log("Movimento invalido - tentou mover a peça adversária (vez das pretas e não brancas)");
      throw new Error();
    }
  }
}

class Piao{
  
  static verificarCaptura(de, para){
    console.log("-- Iniciando a etapa de verificação de captura --");
    
    // Calculando os lances
    let movimentos_possiveis_piao_captura= [];
    
    if(estado.turno == 1){
      movimentos_possiveis_piao_captura= [
        ...calcularPossibilidadeMovimento(de, estado.movimento_captura_piao_esquerda, "<<", false, (estado.bitboard_casas_coluna_A | estado.bitboard_casas_linha_8)),
        ...calcularPossibilidadeMovimento(de, estado.movimento_captura_piao_direita, "<<", false, (estado.bitboard_casas_coluna_H | estado.bitboard_casas_linha_8)),
      ]
    }
    else{
      movimentos_possiveis_piao_captura= [
        ...calcularPossibilidadeMovimento(de, estado.movimento_captura_piao_esquerda, ">>", false, (estado.bitboard_casas_coluna_H | estado.bitboard_casas_linha_1)),
        ...calcularPossibilidadeMovimento(de, estado.movimento_captura_piao_direita, ">>", false, (estado.bitboard_casas_coluna_A | estado.bitboard_casas_linha_1)),
      ]
    }
    
    // Filtrando os lances nulos e os lances errados
    if(estado.turno == 1){
      movimentos_possiveis_piao_captura = movimentos_possiveis_piao_captura.filter((lance) => {
        return (lance !== 0n) && ((lance & estado.bitboard_pretas) || (lance & estado.en_passant_pretas));
      })
    }
    else{
      movimentos_possiveis_piao_captura = movimentos_possiveis_piao_captura.filter((lance) => {
        return (lance !== 0n) && ((lance & estado.bitboard_brancas) || (lance & estado.en_passant_brancas));
      })
    }
    
    console.log("movimentos possíveis:");
    // console.log(movimentos_possiveis_piao_captura);
    movimentos_possiveis_piao_captura.map((lance) => {
      console.log(visualizadeiro(lance));
    })
    
    console.log("verificando se existe alguma captura (normal ou en passant)");
    
    // Brancas jogam
    if(estado.turno == 1){
      if(movimentos_possiveis_piao_captura.indexOf(para) == -1){
        console.log("Não foi efetuado captura");
        return 0;
      }
      else if((para & estado.bitboard_pretas) !== 0n){
        console.log("Captura normal identificada");
        return 1;
      }
      else if((para & estado.en_passant_pretas) !== 0n){
        console.log("Captura en passant identificada");
        return 2;
      }
    }
    
    // Pretas jogam
    else{
      if(movimentos_possiveis_piao_captura.indexOf(para) == -1){
        console.log("Não foi efetuado captura");
        return 0;
      }
      else if((para & estado.bitboard_brancas) !== 0n){
        console.log("Captura normal identificada");
        return 1;
      }
      else if((para & estado.en_passant_brancas) !== 0n){
        console.log("Captura en passant identificada");
        return 2;
      }
    }
  }

  static calcularCasas(de, para){
    console.log("-- Iniciando a etapa de calculos de movimento --");

    // Calculando os lances
    let movimentos_possiveis_piao= [];

    if(estado.turno == 1){
      movimentos_possiveis_piao= [
        ...calcularPossibilidadeMovimento(de, estado.movimento_piao, "<<", true, (estado.bitboard_casas_linha_8)),
      ]
    }
    else{
      movimentos_possiveis_piao= [
        ...calcularPossibilidadeMovimento(de, estado.movimento_piao, ">>", true, (estado.bitboard_casas_linha_1)),
      ]
    }

    movimentos_possiveis_piao = movimentos_possiveis_piao.filter((lances) => {
      return lances !== 0n;
    })

    console.log("movimentos possíveis:");
    //console.log(movimentos_possiveis_piao)
    movimentos_possiveis_piao.map((lance) => {
      console.log(visualizadeiro(lance));
    })

    // Brancas jogam
    if(estado.turno == 1){

      if(movimentos_possiveis_piao.indexOf(para) == -1){
        console.log("Foi feito um movimento inválido com o pião");
        throw new Error();
      }
      else{
        console.log("Movimento de pião válido");

        // Verificando se foi feito um movimento duplo de pião, se for feito será possível fazer o en passant
        if(movimentos_possiveis_piao.length == 2 && (para & movimentos_possiveis_piao[1]) !== 0n){
          estado.en_passant_brancas= movimentos_possiveis_piao[0];
          console.log("Foi feito um movimento duplo");
          console.log(visualizadeiro(estado.en_passant_brancas));
        }
      }
    }

    // Pretas jogam
    else{

      if(movimentos_possiveis_piao.indexOf(para) == -1){
        console.log("Foi feito um movimento inválido com o pião");
        throw new Error();
      }
      else{
        console.log("Movimento de pião válido");

        // Verificando se foi feito um movimento duplo de pião, se for feito será possível fazer o en passant
        if(movimentos_possiveis_piao.length == 2 && (para & movimentos_possiveis_piao[1]) !== 0n){
          estado.en_passant_pretas= movimentos_possiveis_piao[0];
          console.log("Foi feito um movimento duplo");
          console.log(visualizadeiro(estado.en_passant_pretas));
        }
      }
    }
  }
  
  static efetuarMovimento(de, para, movimento_captura){
    // Brancas jogam
    if(estado.turno == 1){
      // Verifica se foi feito um movimento de captura (Normal)
      if(movimento_captura == 1){
        //  Atualizando o bitboard das pretas (capturando a peça)
        estado.bitboard_piao_preto ^= (estado.bitboard_piao_preto & para);
        estado.bitboard_cavalo_preto ^= (estado.bitboard_cavalo_preto & para);
        estado.bitboard_bispo_preto ^= (estado.bitboard_bispo_preto & para);
        estado.bitboard_torre_preto ^= (estado.bitboard_torre_preto & para);
        estado.bitboard_rainha_preto ^= (estado.bitboard_rainha_preto & para);
      }
      // Verifica se foi feito um movimento de captura (en passant)
      else if(movimento_captura == 2){
        estado.bitboard_piao_preto ^= (estado.en_passant_pretas >> estado.movimento_piao[0]) 
        estado.en_passant_pretas= 0n;
      }

      // Realizando movimento
      const movimentacao = de | para;
      estado.bitboard_piao_branco ^= movimentacao;
      console.log("Bitboard do pião: \n" + visualizadeiro(estado.bitboard_piao_branco) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{
      // Verifica se foi feito um movimento de captura (Normal)
      if(movimento_captura == 1){
        //  Atualizando o bitboard das pretas (capturando a peça)
        estado.bitboard_piao_branco ^= (estado.bitboard_piao_branco & para);
        estado.bitboard_cavalo_branco ^= (estado.bitboard_cavalo_branco & para);
        estado.bitboard_bispo_branco ^= (estado.bitboard_bispo_branco & para);
        estado.bitboard_torre_branco ^= (estado.bitboard_torre_branco & para);
        estado.bitboard_rainha_branco ^= (estado.bitboard_rainha_branco & para);
      }
      // Verifica se foi feito um movimento de captura (en passant)
      else if(movimento_captura == 2){
        estado.bitboard_piao_branco^= (estado.en_passant_brancas >> estado.movimento_piao[0]) 
        estado.en_passant_brancas= 0n;
      }

      // Realizando movimento
      const movimentacao = de | para;
      estado.bitboard_piao_preto ^= movimentacao;
      console.log("Bitboard do pião: \n" + visualizadeiro(estado.bitboard_piao_preto) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }
  }

}

class Cavalo{
  static calcularCasas(de, para){
    console.log("-- Iniciando a etapa de calculos de movimento --");

    // Calculando os lances
    let movimentos_possiveis_cavalo = [];

    // Calculando todos os lances para cima (sem filtro)
    for(let cont = 0; cont < estado.movimento_cavalo.length; cont++){
      movimentos_possiveis_cavalo.push(de << estado.movimento_cavalo[cont]);
    }

    // Calculando todos os lances para baixo (sem filtro)
    for(let cont = 0; cont < estado.movimento_cavalo.length; cont++){
      movimentos_possiveis_cavalo.push(de >> estado.movimento_cavalo[cont]);
    }

    console.log("movimentos não filtrado");
    console.log(movimentos_possiveis_cavalo);

    // Brancas jogam
    if(estado.turno == 1){

      // Retirando os movimentos inválidos
      movimentos_possiveis_cavalo = movimentos_possiveis_cavalo.filter((movimento) => {

        // Verificando se tem alguma peça aliada no caminho
        if(movimento & estado.bitboard_brancas){
          return false;
        }

        // Verificando se o cavalo pulou da colunha A ou B para G ou H
        else if((((de & estado.bitboard_casas_coluna_A) !== 0n) || (de & estado.bitboard_casas_coluna_B) !== 0n) && ((movimento & ( estado.bitboard_casas_coluna_G | estado.bitboard_casas_coluna_H )) !== 0n)){
          return false;
        }
        // Verificando se o cavalo pulou da colunha G ou H para A ou B
        else if((((de & estado.bitboard_casas_coluna_G) !== 0n) || (de & estado.bitboard_casas_coluna_H) !== 0n) && ((movimento & ( estado.bitboard_casas_coluna_A | estado.bitboard_casas_coluna_B )) !== 0n)){
          return false;
        }

        // Verificando se o cavalo pulou da linha 1 ou 2 para 7 ou 8
        else if((((de & estado.bitboard_casas_linha_1) !== 0n) || (de & estado.bitboard_casas_linha_2) !== 0n) && ((movimento & ( estado.bitboard_casas_linha_7 | estado.bitboard_casas_linha_8 )) !== 0n)){
          return false;
        }
        // Verificando se o cavalo pulou da linha 7 ou 8 para 1 ou 2
        else if((((de & estado.bitboard_casas_linha_7) !== 0n) || (de & estado.bitboard_casas_linha_8) !== 0n) && ((movimento & ( estado.bitboard_casas_linha_1 | estado.bitboard_casas_linha_2 )) !== 0n)){
          return false;
        }
        else if(movimento == 0n){
          return false;
        }

        return true;
      });

      console.log("movimentos já filtrado");
      console.log(movimentos_possiveis_cavalo);

      if(movimentos_possiveis_cavalo.indexOf(para) == -1){
        console.log("Foi feito um movimento inválido com o cavalo");

        movimentos_possiveis_cavalo.map((movimento) => {
          console.log(visualizadeiro(movimento));
        })

        throw new Error();
      }
      else if((para & estado.bitboard_brancas) != 0n){
        console.log("Foi feito um movimento inválido com o cavalo - já tem uma peça da mesma cor na casa de destino");
        throw new Error();
      }
      else{
        console.log("O cavalo foi movido para: " + desconverter(para) + ", um movimento válido");
        return;
      }
    }

    // Pretas jogam
    else{

      // Retirando os movimentos inválidos
      movimentos_possiveis_cavalo = movimentos_possiveis_cavalo.filter((movimento) => {

        // Verificando se tem alguma peça aliada no caminho
        if(movimento & estado.bitboard_pretas){
          return false;
        }

        // Verificando se o cavalo pulou da colunha A ou B para G ou H
        else if((((de & estado.bitboard_casas_coluna_A) !== 0n) || (de & estado.bitboard_casas_coluna_B) !== 0n) && ((movimento & ( estado.bitboard_casas_coluna_G | estado.bitboard_casas_coluna_H )) !== 0n)){
          return false;
        }
        // Verificando se o cavalo pulou da colunha G ou H para A ou B
        else if((((de & estado.bitboard_casas_coluna_G) !== 0n) || (de & estado.bitboard_casas_coluna_H) !== 0n) && ((movimento & ( estado.bitboard_casas_coluna_A | estado.bitboard_casas_coluna_B )) !== 0n)){
          return false;
        }

        // Verificando se o cavalo pulou da linha 1 ou 2 para 7 ou 8
        else if((((de & estado.bitboard_casas_linha_1) !== 0n) || (de & estado.bitboard_casas_linha_2) !== 0n) && ((movimento & ( estado.bitboard_casas_linha_7 | estado.bitboard_casas_linha_8 )) !== 0n)){
          return false;
        }
        // Verificando se o cavalo pulou da linha 7 ou 8 para 1 ou 2
        else if((((de & estado.bitboard_casas_linha_7) !== 0n) || (de & estado.bitboard_casas_linha_8) !== 0n) && ((movimento & ( estado.bitboard_casas_linha_1 | estado.bitboard_casas_linha_2 )) !== 0n)){
          return false;
        }
        else if(movimento == 0n){
          return false;
        }

        return true;
      });

      console.log("movimentos já filtrado");
      console.log(movimentos_possiveis_cavalo);

      if(movimentos_possiveis_cavalo.indexOf(para) == -1){
        console.log("Foi feito um movimento inválido com o cavalo");

        movimentos_possiveis_cavalo.map((movimento) => {
          console.log(visualizadeiro(movimento));
        })

        throw new Error();
      }
      else if((para & estado.bitboard_pretas) != 0n){
        console.log("Foi feito um movimento inválido com o cavalo - já tem uma peça da mesma cor na casa de destino");
        throw new Error();
      }
      else{
        console.log("O cavalo foi movido para: " + desconverter(para) + ", um movimento válido");
        return;
      }
    }
  }

  static verificarCaptura(de, para){
    console.log("-- Iniciando a etapa de verificação de captura --");

    // Brancas jogam
    if(estado.turno == 1){
      console.log("Bitboard Pretas");
      console.log(visualizadeiro(estado.bitboard_pretas));
      if(para & estado.bitboard_pretas){
        console.log("Foi retornado true para captura");
        return true;
      }
      else{
        console.log("Foi retornado false para captura");
        return false;
      }
    }

    // Pretas jogam
    else{
      console.log("Bitboard Pretas");
      console.log(visualizadeiro(estado.bitboard_brancas));
      if(para & estado.bitboard_brancas){
        console.log("Foi retornado true para captura");
        return true;
      }
      else{
        console.log("Foi retornado false para captura");
        return false;
      }
    }
  }

  static efetuarMovimento(de, para, movimento_captura){
    // Brancas jogam
    if(estado.turno == 1){
      // Verifica se foi feito um movimento de captura
      if(movimento_captura){
        //  Atualizando o bitboard das pretas (capturando a peça)
        estado.bitboard_piao_preto ^= (estado.bitboard_piao_preto & para);
        estado.bitboard_cavalo_preto ^= (estado.bitboard_cavalo_preto & para);
        estado.bitboard_bispo_preto ^= (estado.bitboard_bispo_preto & para);
        estado.bitboard_torre_preto ^= (estado.bitboard_torre_preto & para);
        estado.bitboard_rainha_preto ^= (estado.bitboard_rainha_preto & para);
      }

      // Realizando movimento
      const movimentacao = de | para;
      estado.bitboard_cavalo_branco ^= movimentacao;
      console.log("Bitboard do cavalo: \n" + visualizadeiro(estado.bitboard_cavalo_branco) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{
      // Verifica se foi feito um movimento de captura
      if(movimento_captura){
        //  Atualizando o bitboard das pretas (capturando a peça)
        estado.bitboard_piao_branco ^= (estado.bitboard_piao_branco & para);
        estado.bitboard_cavalo_branco ^= (estado.bitboard_cavalo_branco & para);
        estado.bitboard_bispo_branco ^= (estado.bitboard_bispo_branco & para);
        estado.bitboard_torre_branco ^= (estado.bitboard_torre_branco & para);
        estado.bitboard_rainha_branco ^= (estado.bitboard_rainha_branco & para);
      }

      // Realizando movimento
      const movimentacao = de | para;
      estado.bitboard_cavalo_preto^= movimentacao;
      console.log("Bitboard do cavalo: \n" + visualizadeiro(estado.bitboard_cavalo_preto) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }

  }
}

class Bispo{
  static calcularCasas(de, para){
    console.log("-- Iniciando a etapa de calculos de movimento --");

    // Calculando os lances
    let movimentos_possiveis_bispo = []; 

    movimentos_possiveis_bispo = [
      ...calcularPossibilidadeMovimento(de, estado.movimento_bispo_direita, "<<", false, (estado.bitboard_casas_coluna_H | estado.bitboard_casas_linha_8)),
      ...calcularPossibilidadeMovimento(de, estado.movimento_bispo_direita, ">>", false, (estado.bitboard_casas_coluna_A | estado.bitboard_casas_linha_1)),
      ...calcularPossibilidadeMovimento(de, estado.movimento_bispo_esquerda, "<<", false, (estado.bitboard_casas_coluna_A | estado.bitboard_casas_linha_8)),
      ...calcularPossibilidadeMovimento(de, estado.movimento_bispo_esquerda, ">>", false, (estado.bitboard_casas_coluna_H | estado.bitboard_casas_linha_1))
    ]

    movimentos_possiveis_bispo = movimentos_possiveis_bispo.filter((lances) => {
      return lances !== 0n;
    })

    console.log("movimentos possíveis:");
    console.log(movimentos_possiveis_bispo)
    // movimentos_possiveis_bispo.map((lance) => {
    //   console.log(visualizadeiro(lance));
    // })

    // Brancas jogam
    if(estado.turno == 1){

      if(movimentos_possiveis_bispo.indexOf(para) == -1){
        console.log("Foi feito um movimento inválido com o bispo");
        throw new Error();
      }
      else{
        console.log("Movimento de bispo válido")
      }
    }

    // Pretas jogam
    else{

      if(movimentos_possiveis_bispo.indexOf(para) == -1){
        console.log("Foi feito um movimento inválido com o bispo");
        throw new Error();
      }
      else{
        console.log("Movimento de bispo válido")
      }
    }
  }

  static verificarCaptura(de, para){
    console.log("-- Iniciando a etapa de verificação de captura --");

    // Brancas jogam
    if(estado.turno == 1){
      console.log("Bitboard Pretas");
      console.log(visualizadeiro(estado.bitboard_pretas));
      if(para & estado.bitboard_pretas){
        console.log("Foi retornado true para captura");
        return true;
      }
      else{
        console.log("Foi retornado false para captura");
        return false;
      }
    }

    // Pretas jogam
    else{
      console.log("Bitboard Pretas");
      console.log(visualizadeiro(estado.bitboard_brancas));
      if(para & estado.bitboard_brancas){
        console.log("Foi retornado true para captura");
        return true;
      }
      else{
        console.log("Foi retornado false para captura");
        return false;
      }
    }
  }

  static efetuarMovimento(de, para, movimento_captura){
    // Brancas jogam
    if(estado.turno == 1){
      // Verifica se foi feito um movimento de captura
      if(movimento_captura){
        //  Atualizando o bitboard das pretas (capturando a peça)
        estado.bitboard_piao_preto ^= (estado.bitboard_piao_preto & para);
        estado.bitboard_cavalo_preto ^= (estado.bitboard_cavalo_preto & para);
        estado.bitboard_bispo_preto ^= (estado.bitboard_bispo_preto & para);
        estado.bitboard_torre_preto ^= (estado.bitboard_torre_preto & para);
        estado.bitboard_rainha_preto ^= (estado.bitboard_rainha_preto & para);
      }

      // Realizando movimento
      const movimentacao = de | para;
      estado.bitboard_bispo_branco ^= movimentacao;
      console.log("Bitboard do bispo: \n" + visualizadeiro(estado.bitboard_bispo_branco) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{
      // Verifica se foi feito um movimento de captura
      if(movimento_captura){
        //  Atualizando o bitboard das pretas (capturando a peça)
        estado.bitboard_piao_branco ^= (estado.bitboard_piao_branco & para);
        estado.bitboard_cavalo_branco ^= (estado.bitboard_cavalo_branco & para);
        estado.bitboard_bispo_branco ^= (estado.bitboard_bispo_branco & para);
        estado.bitboard_torre_branco ^= (estado.bitboard_torre_branco & para);
        estado.bitboard_rainha_branco ^= (estado.bitboard_rainha_branco & para);
      }

      // Realizando movimento
      const movimentacao = de | para;
      estado.bitboard_bispo_preto ^= movimentacao;
      console.log("Bitboard do bispo: \n" + visualizadeiro(estado.bitboard_bispo_preto) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }
  }
}

class Torre{
  static calcularCasas(de, para){
    console.log("-- Iniciando a etapa de calculos de movimento --");

    // Calculando os lances
    let movimentos_possiveis_torre= [];    

    movimentos_possiveis_torre = [
      ...calcularPossibilidadeMovimento(de, estado.movimento_torre_frente, "<<", false, estado.bitboard_casas_linha_8),
      ...calcularPossibilidadeMovimento(de, estado.movimento_torre_frente, ">>", false, estado.bitboard_casas_linha_1),
      ...calcularPossibilidadeMovimento(de, estado.movimento_torre_direita, "<<", false, estado.bitboard_casas_coluna_H),
      ...calcularPossibilidadeMovimento(de, estado.movimento_torre_direita, ">>", false, estado.bitboard_casas_coluna_A),
    ]

    movimentos_possiveis_torre = movimentos_possiveis_torre.filter((lances) => {
      return lances !== 0n;
    })

    console.log("movimentos possíveis:");
    console.log(movimentos_possiveis_torre);
    // movimentos_possiveis_torre.map((lance) => {
    //   console.log(visualizadeiro(lance));
    // })

    // Brancas jogam
    if(estado.turno == 1){

      if(movimentos_possiveis_torre.indexOf(para) == -1){
        console.log("Foi feito um movimento inválido com o torre");
        throw new Error();
      }
      else{
        console.log("Movimento de torre válido")
      }
    }

    // Pretas jogam
    else{

      if(movimentos_possiveis_torre.indexOf(para) == -1){
        console.log("Foi feito um movimento inválido com o torre");
        throw new Error();
      }
      else{
        console.log("Movimento de torre válido")
      }
    }
  }

  static verificarCaptura(de, para){
    console.log("-- Iniciando a etapa de verificação de captura --");

    // Brancas jogam
    if(estado.turno == 1){
      console.log("Bitboard Pretas");
      console.log(visualizadeiro(estado.bitboard_pretas));
      if(para & estado.bitboard_pretas){
        console.log("Foi retornado true para captura");
        return true;
      }
      else{
        console.log("Foi retornado false para captura");
        return false;
      }
    }

    // Pretas jogam
    else{
      console.log("Bitboard Pretas");
      console.log(visualizadeiro(estado.bitboard_brancas));
      if(para & estado.bitboard_brancas){
        console.log("Foi retornado true para captura");
        return true;
      }
      else{
        console.log("Foi retornado false para captura");
        return false;
      }
    }
  }

  static efetuarMovimento(de, para, movimento_captura){
    // Brancas jogam
    if(estado.turno == 1){
      // Verifica se foi feito um movimento de captura
      if(movimento_captura){
        //  Atualizando o bitboard das pretas (capturando a peça)
        estado.bitboard_piao_preto ^= (estado.bitboard_piao_preto & para);
        estado.bitboard_cavalo_preto ^= (estado.bitboard_cavalo_preto & para);
        estado.bitboard_bispo_preto ^= (estado.bitboard_bispo_preto & para);
        estado.bitboard_torre_preto ^= (estado.bitboard_torre_preto & para);
        estado.bitboard_rainha_preto ^= (estado.bitboard_rainha_preto & para);
      }

      // Realizando movimento
      const movimentacao = de | para;
      estado.bitboard_torre_branco ^= movimentacao;
      console.log("Bitboard da torre: \n" + visualizadeiro(estado.bitboard_torre_branco) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{
      // Verifica se foi feito um movimento de captura
      if(movimento_captura){
        //  Atualizando o bitboard das pretas (capturando a peça)
        estado.bitboard_piao_branco ^= (estado.bitboard_piao_branco & para);
        estado.bitboard_cavalo_branco ^= (estado.bitboard_cavalo_branco & para);
        estado.bitboard_bispo_branco ^= (estado.bitboard_bispo_branco & para);
        estado.bitboard_torre_branco ^= (estado.bitboard_torre_branco & para);
        estado.bitboard_rainha_branco ^= (estado.bitboard_rainha_branco & para);
      }

      // Realizando movimento
      const movimentacao = de | para;
      estado.bitboard_torre_preto ^= movimentacao;
      console.log("Bitboard da torre: \n" + visualizadeiro(estado.bitboard_torre_preto) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }
  }

}

class Dama{
  static calcularCasas(de, para){
    console.log("-- Iniciando a etapa de calculos de movimento --");

    // Calculando os lances
    let movimentos_possiveis_dama= [];    

    movimentos_possiveis_dama = [
      ...calcularPossibilidadeMovimento(de, estado.movimento_torre_frente, "<<", false, estado.bitboard_casas_linha_8),
      ...calcularPossibilidadeMovimento(de, estado.movimento_torre_frente, ">>", false, estado.bitboard_casas_linha_1),
      ...calcularPossibilidadeMovimento(de, estado.movimento_torre_direita, "<<", false, estado.bitboard_casas_coluna_H),
      ...calcularPossibilidadeMovimento(de, estado.movimento_torre_direita, ">>", false, estado.bitboard_casas_coluna_A),
      ...calcularPossibilidadeMovimento(de, estado.movimento_bispo_direita, "<<", false, (estado.bitboard_casas_coluna_H | estado.bitboard_casas_linha_8)),
      ...calcularPossibilidadeMovimento(de, estado.movimento_bispo_direita, ">>", false, (estado.bitboard_casas_coluna_A | estado.bitboard_casas_linha_1)),
      ...calcularPossibilidadeMovimento(de, estado.movimento_bispo_esquerda, "<<", false, (estado.bitboard_casas_coluna_A | estado.bitboard_casas_linha_8)),
      ...calcularPossibilidadeMovimento(de, estado.movimento_bispo_esquerda, ">>", false, (estado.bitboard_casas_coluna_H | estado.bitboard_casas_linha_1))
    ]

    movimentos_possiveis_dama = movimentos_possiveis_dama.filter((lances) => {
      return lances !== 0n;
    })

    console.log("movimentos possíveis:");
    console.log(movimentos_possiveis_dama);
    // movimentos_possiveis_torre.map((lance) => {
    //   console.log(visualizadeiro(lance));
    // })

    // Brancas jogam
    if(estado.turno == 1){

      if(movimentos_possiveis_dama.indexOf(para) == -1){
        console.log("Foi feito um movimento inválido com a dama");
        throw new Error();
      }
      else{
        console.log("Movimento de dama válido")
      }
    }

    // Pretas jogam
    else{

      if(movimentos_possiveis_dama.indexOf(para) == -1){
        console.log("Foi feito um movimento inválido com a dama");
        throw new Error();
      }
      else{
        console.log("Movimento de dama válido")
      }
    }
  }

  static verificarCaptura(de, para){
    console.log("-- Iniciando a etapa de verificação de captura --");

    // Brancas jogam
    if(estado.turno == 1){
      console.log("Bitboard Pretas");
      console.log(visualizadeiro(estado.bitboard_pretas));
      if(para & estado.bitboard_pretas){
        console.log("Foi retornado true para captura");
        return true;
      }
      else{
        console.log("Foi retornado false para captura");
        return false;
      }
    }

    // Pretas jogam
    else{
      console.log("Bitboard Pretas");
      console.log(visualizadeiro(estado.bitboard_brancas));
      if(para & estado.bitboard_brancas){
        console.log("Foi retornado true para captura");
        return true;
      }
      else{
        console.log("Foi retornado false para captura");
        return false;
      }
    }
  }

  static efetuarMovimento(de, para, movimento_captura){
    // Brancas jogam
    if(estado.turno == 1){
      // Verifica se foi feito um movimento de captura
      if(movimento_captura){
        //  Atualizando o bitboard das pretas (capturando a peça)
        estado.bitboard_piao_preto ^= (estado.bitboard_piao_preto & para);
        estado.bitboard_cavalo_preto ^= (estado.bitboard_cavalo_preto & para);
        estado.bitboard_bispo_preto ^= (estado.bitboard_bispo_preto & para);
        estado.bitboard_torre_preto ^= (estado.bitboard_torre_preto & para);
        estado.bitboard_rainha_preto ^= (estado.bitboard_rainha_preto & para);
      }

      // Realizando movimento
      const movimentacao = de | para;
      estado.bitboard_rainha_branco ^= movimentacao;
      console.log("Bitboard da dama: \n" + visualizadeiro(estado.bitboard_rainha_branco) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{
      // Verifica se foi feito um movimento de captura
      if(movimento_captura){
        //  Atualizando o bitboard das pretas (capturando a peça)
        estado.bitboard_piao_branco ^= (estado.bitboard_piao_branco & para);
        estado.bitboard_cavalo_branco ^= (estado.bitboard_cavalo_branco & para);
        estado.bitboard_bispo_branco ^= (estado.bitboard_bispo_branco & para);
        estado.bitboard_torre_branco ^= (estado.bitboard_torre_branco & para);
        estado.bitboard_rainha_branco ^= (estado.bitboard_rainha_branco & para);
      }

      // Realizando movimento
      const movimentacao = de | para;
      estado.bitboard_rainha_preto ^= movimentacao;
      console.log("Bitboard da dama: \n" + visualizadeiro(estado.bitboard_rainha_branco) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }
  }
}

class Rei{
  static calcularCasas(de, para){
    console.log("-- Iniciando a etapa de calculos de movimento --");

    // Calculando os lances
    let movimentos_possiveis_rei= [];    

    movimentos_possiveis_rei = [
      ...calcularPossibilidadeMovimento(de, estado.movimento_rei_frente, "<<", false, (estado.bitboard_casas_linha_8)),
      ...calcularPossibilidadeMovimento(de, estado.movimento_rei_esquerda, "<<", false, (estado.bitboard_casas_coluna_A)),
      ...calcularPossibilidadeMovimento(de, estado.movimento_rei_direita, "<<", false, (estado.bitboard_casas_coluna_H)),
      ...calcularPossibilidadeMovimento(de, estado.movimento_rei_frente, ">>", false, (estado.bitboard_casas_linha_1)),
      ...calcularPossibilidadeMovimento(de, estado.movimento_rei_esquerda, ">>", false, (estado.bitboard_casas_coluna_H)),
      ...calcularPossibilidadeMovimento(de, estado.movimento_rei_direita, ">>", false, (estado.bitboard_casas_coluna_A))
]

    movimentos_possiveis_rei = movimentos_possiveis_rei.filter((lances) => {
      return lances !== 0n;
    })

    console.log("movimentos possíveis:");
    console.log(movimentos_possiveis_rei);
    // movimentos_possiveis_torre.map((lance) => {
    //   console.log(visualizadeiro(lance));
    // })

    // Brancas jogam
    if(estado.turno == 1){

      if(movimentos_possiveis_rei.indexOf(para) == -1){
        console.log("Foi feito um movimento inválido com a dama");
        throw new Error();
      }
      else{
        console.log("Movimento de dama válido")
      }
    }

    // Pretas jogam
    else{

      if(movimentos_possiveis_rei.indexOf(para) == -1){
        console.log("Foi feito um movimento inválido com a dama");
        throw new Error();
      }
      else{
        console.log("Movimento de dama válido")
      }
    }
  }

  static verificarCaptura(de, para){
    console.log("-- Iniciando a etapa de verificação de captura --");

    // Brancas jogam
    if(estado.turno == 1){
      console.log("Bitboard Pretas");
      console.log(visualizadeiro(estado.bitboard_pretas));
      if(para & estado.bitboard_pretas){
        console.log("Foi retornado true para captura");
        return true;
      }
      else{
        console.log("Foi retornado false para captura");
        return false;
      }
    }

    // Pretas jogam
    else{
      console.log("Bitboard Pretas");
      console.log(visualizadeiro(estado.bitboard_brancas));
      if(para & estado.bitboard_brancas){
        console.log("Foi retornado true para captura");
        return true;
      }
      else{
        console.log("Foi retornado false para captura");
        return false;
      }
    }
  }

  static efetuarMovimento(de, para, movimento_captura){
    // Brancas jogam
    if(estado.turno == 1){
      // Verifica se foi feito um movimento de captura
      if(movimento_captura){
        //  Atualizando o bitboard das pretas (capturando a peça)
        estado.bitboard_piao_preto ^= (estado.bitboard_piao_preto & para);
        estado.bitboard_cavalo_preto ^= (estado.bitboard_cavalo_preto & para);
        estado.bitboard_bispo_preto ^= (estado.bitboard_bispo_preto & para);
        estado.bitboard_torre_preto ^= (estado.bitboard_torre_preto & para);
        estado.bitboard_rainha_preto ^= (estado.bitboard_rainha_preto & para);
      }

      // Realizando movimento
      const movimentacao = de | para;
      estado.bitboard_rei_branco ^= movimentacao;
      console.log("Bitboard da dama: \n" + visualizadeiro(estado.bitboard_rei_branco) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{
      // Verifica se foi feito um movimento de captura
      if(movimento_captura){
        //  Atualizando o bitboard das pretas (capturando a peça)
        estado.bitboard_piao_branco ^= (estado.bitboard_piao_branco & para);
        estado.bitboard_cavalo_branco ^= (estado.bitboard_cavalo_branco & para);
        estado.bitboard_bispo_branco ^= (estado.bitboard_bispo_branco & para);
        estado.bitboard_torre_branco ^= (estado.bitboard_torre_branco & para);
        estado.bitboard_rainha_branco ^= (estado.bitboard_rainha_branco & para);
      }

      // Realizando movimento
      const movimentacao = de | para;
      estado.bitboard_rei_preto ^= movimentacao;
      console.log("Bitboard da dama: \n" + visualizadeiro(estado.bitboard_rei_preto) + '\n');

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