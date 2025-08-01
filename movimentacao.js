import { converter, desconverter } from './traducao.js';
import { estado } from './variaveis.js'
import { visualizadeiro } from './visualizador.js';

/**
 * 1° Identificar a peça e também verifica se foi movido a peça da cor certo, correspondente ao turno.
 * 2° Chamar a classe da peça.
 * 2.1° Verificações (ex: pião, verificar se é um movimento válido, movimento duplo, captura e etc).
 * 2.2° Efeturar o movimento, caso passe na verificação.
 * 3° Atualizar tabuleiro.
 */

// Função orquestradora e que fica exporta (única).
export function mover(de, para, promocao){
  console.log("-- Iniciado a etapa de movimentação --");

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
      const movimento_duplo = Piao.verificarMovimentoDuplo(de, para);
      const movimento_captura = Piao.verificarCaptura(de, para);
      Piao.efetuarMovimento(de, para, movimento_duplo, movimento_captura);
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
      const possiveis_movimentos = Bispo.calcularCasas(de, para)
      const movimento_captura = Bispo.verificarCaptura(de, para);
      Bispo.efetuarMovimento(de, para, movimento_captura);
      return;
    }
    else if(estado.bitboard_torre_branco & de){
      console.log("A peça é torre brancas");
      // Retorna os possiveis movimentos e já verifica se é um lance válido
      const possiveis_movimentos = Torre.calcularCasas(de, para)
      const movimento_captura = Torre.verificarCaptura(de, para);
      Torre.efetuarMovimento(de, para, movimento_captura);
      return;
    }
    else if(estado.bitboard_rainha_branco & de){
      console.log("A peça é rainha brancas");
      return;
    }
    else if(estado.bitboard_rei_branco & de){
      console.log("A peça é rei brancas");
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
      const movimento_duplo = Piao.verificarMovimentoDuplo(de, para);
      const movimento_captura = Piao.verificarCaptura(de, para);
      Piao.efetuarMovimento(de, para, movimento_duplo, movimento_captura);
      return;
    }
    else if(estado.bitboard_cavalo_preto & de){
      console.log("A peça é cavalo pretas");
      // Retorna os possiveis movimentos e já verifica se é um lance válido
      const possiveis_movimentos = Cavalo.calcularCasas(de, para)
      const movimento_captura = Cavalo.verificarCaptura(de, para);
      Cavalo.efetuarMovimento(de, para, movimento_captura);
      return;
    }
    else if(estado.bitboard_bispo_preto & de){
      console.log("A peça é bispo pretas");
      // Retorna os possiveis movimentos e já verifica se é um lance válido
      const possiveis_movimentos = Bispo.calcularCasas(de, para)
      const movimento_captura = Bispo.verificarCaptura(de, para);
      Bispo.efetuarMovimento(de, para, movimento_captura);
      return;
    }
    else if(estado.bitboard_torre_preto & de){
      console.log("A peça é torre pretas");
      // Retorna os possiveis movimentos e já verifica se é um lance válido
      const possiveis_movimentos = Torre.calcularCasas(de, para)
      const movimento_captura = Torre.verificarCaptura(de, para);
      Torre.efetuarMovimento(de, para, movimento_captura);
      return;
    }
    else if(estado.bitboard_rainha_preto & de){
      console.log("A peça é rainha pretas");
      return;
    }
    else if(estado.bitboard_rei_preto & de){
      console.log("A peça é rei pretas");
      return;
    }
    else{
      console.log("Movimento invalido - tentou mover a peça adversária (vez das pretas e não brancas)");
      throw new Error();
    }
  }
}

class Piao{
  static verificarMovimentoDuplo(de, para){
    console.log("-- Iniciando a etapa de verificação de movimento duplo --");
    // Brancas jogam
    if(estado.turno == 1){
      // Verificando se foi feito um movimento duplo de pião
      if(((de << estado.movimento_piao[1]) === para)){
        console.log("Foi feito um movimento duplo de pião");

        // Verificando se foi feito um movimento duplo válido (se a peça já não foi movida e se não tem peça inimiga a frente, bloqueando o caminho)
        if((estado.movimento_duplo_piao_branco & de) != 0n && (estado.bitboard_pretas & para) == 0n){
          console.log("Foi retornado true para movimento duplo de pião")
          return true;
        }
        else{
          console.log("Movimento duplo inválido - o movimento duplo foi feito por uma peça que já foi mexida ou movida para uma casa á ocupada por uma peça inimiga");
          throw new Error()
        }
      }
      else{
        console.log("Não foi feito um movimento duplo de pião");
        return false;
      }
    }

    // Pretas jogam
    else{
      // Verificando se foi feito um movimento duplo de pião
      if(((de >> 16n) === para)){
        console.log("Foi feito um movimento duplo de pião");

        // Verificando se foi feito um movimento duplo válido (se a peça já não foi movida e se não tem peça inimiga a frente, bloqueando o caminho)
        if((estado.movimento_duplo_piao_preto & de) != 0n && (estado.bitboard_brancas & para) == 0n){
          return true;
        }
        else{
          console.log("Movimento duplo inválido - o movimento duplo foi feito por uma peça que já foi mexida ou movida para uma casa á ocupada por uma peça inimiga");
          throw new Error()
        }
      }
      else{
        console.log("Não foi feito um movimento duplo de pião");
        return false;
      }
    }
  }

  static verificarCaptura(de, para){
    console.log("-- Iniciando a etapa de verificação de captura --");
    // Brancas jogam
    if(estado.turno == 1){
      let captura1 = 0n;
      let captura2 = 0n;
      captura1 = (de << estado.movimento_captura_piao[0]);
      captura2 = (de << estado.movimento_captura_piao[1]);
      console.log("-- Casas de captura --")
      console.log("Captura 1");
      console.log(visualizadeiro(captura1));
      console.log("Captura 2");
      console.log(visualizadeiro(captura2));
      console.log("Bitboard Pretas");
      console.log(visualizadeiro(estado.bitboard_pretas));
      if(captura1 & estado.bitboard_pretas || captura2 & estado.bitboard_pretas){
        if(para == captura1 || para == captura2){
          console.log("Foi retornado true para captura");
          return true;
        }
        else{
          console.log("Foi retornado false para captura #2");
          return false;
        }
      }
      else{
        console.log("Foi retornado false para captura #1");
        return false;
      }
    }

    // Pretas jogam
    else{
      let captura1 = 0n;
      let captura2 = 0n;
      captura1 = (de >> estado.movimento_captura_piao[0]);
      captura2 = (de >> estado.movimento_captura_piao[1]);
      console.log("-- Status captura --")
      console.log("Captura 1");
      console.log(visualizadeiro(captura1));
      console.log("Captura 2");
      console.log(visualizadeiro(captura2));
      console.log("Bitboard Brancas");
      console.log(visualizadeiro(estado.bitboard_brancas));
      if(captura1 & estado.bitboard_brancas || captura2 & estado.bitboard_brancas){
        if(para == captura1 || para == captura2){
          console.log("Foi retornado true para captura");
          return true;
        }
        else{
          console.log("Foi retornado false para captura #2");
          return false;
        }
      }
      else{
          console.log("Foi retornado false para captura #1");
        return false;
      }
    }
  }

  static efetuarMovimento(de, para, movimento_duplo, movimento_captura){
    // Brancas jogam
    if(estado.turno == 1){
      // Verifica se foi feito um movimento duplo
      if(movimento_duplo){
        // Atualizando o bitboard que movimento duplo de pião das brancas
        estado.movimento_duplo_piao_branco = estado.movimento_duplo_piao_branco ^ de;
        console.log("O bitboard do controlado de movimento duplo está em: \n" + visualizadeiro(estado.movimento_duplo_piao_branco) + '\n');
      }
      // Verifica se foi feito um movimento de captura
      else if(movimento_captura){
        //  Atualizando o bitboard das pretas (capturando a peça)
        estado.bitboard_piao_preto ^= (estado.bitboard_piao_preto & para);
        estado.bitboard_cavalo_preto ^= (estado.bitboard_cavalo_preto & para);
        estado.bitboard_bispo_preto ^= (estado.bitboard_bispo_preto & para);
        estado.bitboard_torre_preto ^= (estado.bitboard_torre_preto & para);
        estado.bitboard_rainha_preto ^= (estado.bitboard_rainha_preto & para);
      }
      // Se foi feito um movimento normal (andou uma casa)
      else{
        const movimento_esperado = de << estado.movimento_piao[0];
        if(para !== movimento_esperado){
          console.log("Movimento inválido - não foi feito nenhum movimento esperado");
          throw new Error()
        }

        // Verifica se precisa atualizar o bitboard de movimento duplo de piao (porque mesmo não fazendo movimento duplo, é necessário atualizar, de o pião saiu da cada inicial)
        if(estado.movimento_duplo_piao_branco & de){
          // Atualizando o bitboard que movimento duplo do piao
          estado.movimento_duplo_piao_branco = estado.movimento_duplo_piao_branco ^ de;
          console.log("O bitboard do controlado de movimento duplo está em: \n" + visualizadeiro(estado.movimento_duplo_piao_branco) + '\n');
        }
        else{
          console.log("O bitboard do controlado de movimento duplo não foi atualizado");
        }
      }

      // Realizando movimento
      const movimentacao = de | para;
      estado.bitboard_piao_branco ^= movimentacao;
      console.log("Bitboard do piao: \n" + visualizadeiro(estado.bitboard_piao_branco) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }

    // Pretas jogam
    else{
      // Verifica se foi feito um movimento duplo
      if(movimento_duplo){
        // Atualizando o bitboard que movimento duplo de pião das pretas
        estado.movimento_duplo_piao_preto = estado.movimento_duplo_piao_preto ^ de;
        console.log("O bitboard do controlado de movimento duplo está em: \n" + visualizadeiro(estado.movimento_duplo_piao_preto) + '\n');
      }
      // Verifica se foi feito um movimento de captura
      else if(movimento_captura){
        //  Atualizando o bitboard das brancas (capturando a peça)
        estado.bitboard_piao_branco ^= (estado.bitboard_piao_branco & para);
        estado.bitboard_cavalo_branco ^= (estado.bitboard_cavalo_branco & para);
        estado.bitboard_bispo_branco ^= (estado.bitboard_bispo_branco & para);
        estado.bitboard_torre_branco ^= (estado.bitboard_torre_branco & para);
        estado.bitboard_rainha_branco ^= (estado.bitboard_rainha_branco & para);
      }
      // Se foi feito um movimento normal (andou uma casa)
      else{
        const movimento_esperado = de >> estado.movimento_piao[0];
        if(para !== movimento_esperado){
          console.log("Movimento inválido - não foi feito nenhum movimento esperado");
          throw new Error()
        }

        // Verifica se precisa atualizar o bitboard de movimento duplo de piao (porque mesmo não fazendo movimento duplo, é necessário atualizar, de o pião saiu da cada inicial)
        if(estado.movimento_duplo_piao_preto & de){
          // Atualizando o bitboard que movimento duplo de piao
          estado.movimento_duplo_piao_preto = estado.movimento_duplo_piao_preto ^ de;
          console.log("O bitboard do controlado de movimento duplo está em: \n" + visualizadeiro(estado.movimento_duplo_piao_preto) + '\n');
        }
        else{
          console.log("O bitboard do controlado de movimento duplo não foi atualizado");
        }
      }


      // Realizando movimento
      const movimentacao = de | para;
      estado.bitboard_piao_preto ^= movimentacao;
      console.log("Bitboard do piao: \n" + visualizadeiro(estado.bitboard_piao_preto) + '\n');

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

    const calcularPossibilidadeMovimento = (de, deslocamento, operador, borda) => {
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
        console.log("O bispo está na borda e não é possível fazer o movimento");
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
        // Verificando se o bispo estara no canto
        else if((destino & borda) !== 0n){
          console.log("Bispo está no canto\n");
          movimentos_possiveis.push(destino);
          break;
        }
        // Verificiando se a casa está ocupada por um inimigo
        else if((destino & peca_inimiga) !== 0n){
          console.log("Casa ocupada por inimigo\n");
          movimentos_possiveis.push(destino);
          break;
        }
        
        movimentos_possiveis.push(destino);
      }

      return movimentos_possiveis;
    }
    

    movimentos_possiveis_bispo = [
      ...calcularPossibilidadeMovimento(de, estado.movimento_bispo_direita, "<<", (estado.bitboard_casas_coluna_H | estado.bitboard_casas_linha_8)),
      ...calcularPossibilidadeMovimento(de, estado.movimento_bispo_direita, ">>", (estado.bitboard_casas_coluna_A | estado.bitboard_casas_linha_1)),
      ...calcularPossibilidadeMovimento(de, estado.movimento_bispo_esquerda, "<<", (estado.bitboard_casas_coluna_A | estado.bitboard_casas_linha_8)),
      ...calcularPossibilidadeMovimento(de, estado.movimento_bispo_esquerda, ">>", (estado.bitboard_casas_coluna_H | estado.bitboard_casas_linha_1))
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

    const calcularPossibilidadeMovimento = (de, deslocamento, operador, borda) => {
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

      console.log("Peças aliadas:")
      console.log(visualizadeiro(peca_aliada));
      console.log("Peças inimigas:")
      console.log(visualizadeiro(peca_inimiga));

      if(de & borda){
        console.log("A torre está na borda e não é possível fazer o movimento");
        return [];
      }

      console.log("Calculando possibilidades");

      for(let cont = 0; cont < deslocamento.length; cont ++){
        const destino = ((operador == "<<") ? de << deslocamento[cont] : de >> deslocamento[cont]);

        // Verificando se a casa está ocupada por um aliado
        if((destino & peca_aliada) !== 0n){
          console.log("Casa ocupada por alidado\n");
          break;
        }
        // Verificando se a torre estara no canto
        else if((destino & borda) !== 0n){
          console.log("Torre está no canto\n");
          movimentos_possiveis.push(destino);
          break;
        }
        // Verificiando se a casa está ocupada por um inimigo
        else if((destino & peca_inimiga) !== 0n){
          console.log("Casa ocupada por inimigo\n");
          movimentos_possiveis.push(destino);
          break;
        }
        
        movimentos_possiveis.push(destino);
      }

      return movimentos_possiveis;
    }
    

    movimentos_possiveis_torre = [
      ...calcularPossibilidadeMovimento(de, estado.movimento_torre_frente, "<<", estado.bitboard_casas_linha_8),
      ...calcularPossibilidadeMovimento(de, estado.movimento_torre_frente, ">>", estado.bitboard_casas_linha_1),
      ...calcularPossibilidadeMovimento(de, estado.movimento_torre_direita, "<<", estado.bitboard_casas_coluna_H),
      ...calcularPossibilidadeMovimento(de, estado.movimento_torre_direita, ">>", estado.bitboard_casas_coluna_A),
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
      console.log("Bitboard do bispo: \n" + visualizadeiro(estado.bitboard_torre_branco) + '\n');

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
      console.log("Bitboard do bispo: \n" + visualizadeiro(estado.bitboard_torre_preto) + '\n');

      // Atualiza todos os bitboards restantes
      atualizarTabuleiro();
      return;
    }
  }

}

class Dama{
}

class Rei{
}

function atualizarTabuleiro(){
  // Brancas jogam
  if(estado.turno == 1){
    // Atualizando o bitboard de todas as peças brancas
    estado.bitboard_brancas = estado.bitboard_piao_branco | estado.bitboard_cavalo_branco | estado.bitboard_bispo_branco | estado.bitboard_torre_branco | estado.bitboard_rainha_branco | estado.bitboard_rei_branco;
    console.log("Bitboard das brancas (todas peças): \n" + visualizadeiro(estado.bitboard_brancas) + '\n');
  }

  // Pretas jogam
  else{
    // Atualizando o bitboard de todas as peças pretas
    estado.bitboard_pretas= estado.bitboard_piao_preto | estado.bitboard_cavalo_preto | estado.bitboard_bispo_preto | estado.bitboard_torre_preto | estado.bitboard_rainha_preto | estado.bitboard_rei_preto;
    console.log("Bitboard das pretas (todas peças): \n" + visualizadeiro(estado.bitboard_pretas) + '\n');
  }
  
  // Atualizando o bitboard com todas as casas ocupadas
  estado.bitboard_tabuleiro = estado.bitboard_brancas | estado.bitboard_pretas;
  console.log("Bitboard do tabuleiro (um todo): \n" + visualizadeiro(estado.bitboard_tabuleiro) + '\n');
}