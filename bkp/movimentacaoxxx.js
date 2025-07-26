import { estado } from '../variaveis.js'
import { visualizadeiro } from '../visualizador.js';

export function mover(de, para, promocao){
  console.log("\n\n-- Iniciado a etapa de movimentação --\n\n");
  let peca = descobrirPeca(de);
  verificarMovimento(peca, de, para);
  estado.turno = !estado.turno;
}

function descobrirPeca(posicao){
  if(estado.turno == 1){
    if(estado.bitboard_piao_branco & posicao){
      console.log("A peça é piao")
      return estado.piao;
    }
    else if(estado.bitboard_cavalo_branco & posicao){
      console.log("A peça é cavalo")
      return estado.cavalo;
    }
    else if(estado.bitboard_bispo_branco & posicao){
      console.log("A peça é bispo")
      return estado.bispo;
    }
    else if(estado.bitboard_torre_branco & posicao){
      console.log("A peça é torre")
      return estado.torre;
    }
    else if(estado.bitboard_rainha_branco & posicao){
      console.log("A peça é rainha")
      return estado.rainha;
    }
    else if(estado.bitboard_rei_branco & posicao){
      console.log("A peça é rei")
      return estado.rei;
    }
    else{
      console.log("Movimento invalido - não existe peça onde foi solicitado o movimento");
      throw new Error()
    }
  }
  else{
    if(estado.bitboard_piao_preto& posicao){
      console.log("A peça é piao")
      return estado.piao;
    }
    else if(estado.bitboard_cavalo_preto & posicao){
      console.log("A peça é cavalo")
      return estado.cavalo;
    }
    else if(estado.bitboard_bispo_preto & posicao){
      console.log("A peça é bispo")
      return estado.bispo;
    }
    else if(estado.bitboard_torre_preto & posicao){
      console.log("A peça é torre")
      return estado.torre;
    }
    else if(estado.bitboard_rainha_preto & posicao){
      console.log("A peça é rainha")
      return estado.rainha;
    }
    else if(estado.bitboard_rei_preto & posicao){
      console.log("A peça é rei")
      return estado.rei;
    }
    else{
      console.log("Movimento invalido - não existe peça onde foi solicitado o movimento");
      throw new Error()
    }
  }
}

class EfetuarMovimento{
  
  static tabuleiro(){
    if(estado.turno == 1){
      // Atualizando o bitboard de todas as peças brancas
      estado.bitboard_brancas = estado.bitboard_piao_branco | estado.bitboard_cavalo_branco | estado.bitboard_bispo_branco | estado.bitboard_torre_branco | estado.bitboard_rainha_branco | estado.bitboard_rei_branco;
      console.log("Bitboard das brancas (um todo): \n" + visualizadeiro(estado.bitboard_brancas) + '\n');
    }
    else{
      // Atualizando o bitboard de todas as peças pretas
      estado.bitboard_pretas= estado.bitboard_piao_preto | estado.bitboard_cavalo_preto | estado.bitboard_bispo_preto | estado.bitboard_torre_preto | estado.bitboard_rainha_preto | estado.bitboard_rei_preto;
      console.log("Bitboard das brancas (um todo): \n" + visualizadeiro(estado.bitboard_pretas) + '\n');
    }
    
    // Atualizando o bitboard com o tabuleiro todo
    estado.bitboard_tabuleiro = estado.bitboard_brancas | estado.bitboard_pretas;
    console.log("Bitboard do tabuleiro (um todo): \n" + visualizadeiro(estado.bitboard_tabuleiro) + '\n');

  }

  static piao(de, para, movimento_duplo, capitura){
      if(movimento_duplo){
        if(estado.turno == 1){
          // Atualizando o bitboard que movimento duplo de pião das brancas
          estado.movimento_duplo_piao_branco = estado.movimento_duplo_piao_branco ^ de;
          console.log("O bitboard do controlado de movimento duplo está em: \n" + visualizadeiro(estado.movimento_duplo_piao_branco) + '\n');
        }
        else{
          // Atualizando o bitboard que movimento duplo de pião das pretas
          estado.movimento_duplo_piao_preto= estado.movimento_duplo_piao_preto ^ de;
          console.log("O bitboard do controlado de movimento duplo está em: \n" + visualizadeiro(estado.movimento_duplo_piao_preto) + '\n');
        }
      }
      else if(capitura){
        if(estado.turno == 1){
          //  Atualizando o bitboard das pretas (capturando a peça)
          estado.bitboard_piao_preto ^= (estado.bitboard_piao_preto & para);
          estado.bitboard_cavalo_preto ^= (estado.bitboard_cavalo_preto & para);
          estado.bitboard_bispo_preto ^= (estado.bitboard_bispo_preto & para);
          estado.bitboard_torre_preto ^= (estado.bitboard_torre_preto & para);
          estado.bitboard_rainha_preto ^= (estado.bitboard_rainha_preto & para);
        }
        else{
          //  Atualizando o bitboard das brancas (capturando a peça)
          estado.bitboard_piao_branco ^= (estado.bitboard_piao_branco & para);
          estado.bitboard_cavalo_branco ^= (estado.bitboard_cavalo_branco & para);
          estado.bitboard_bispo_branco ^= (estado.bitboard_bispo_branco & para);
          estado.bitboard_torre_branco ^= (estado.bitboard_torre_branco & para);
          estado.bitboard_rainha_branco ^= (estado.bitboard_rainha_branco & para);
        }
      }
      else{
        if(estado.turno == 1){
          const movimento_esperado = de << 8n;
          if(para !== movimento_esperado){
            console.log("Movimento inválido - não foi feito nenhum movimento esperado");
            throw new Error()
          }

          // Verifica se precisa atualizar o bitboard de movimento duplo de piao
          if(estado.movimento_duplo_piao_branco & de){
            // Atualizando o bitboard que movimento duplo de piao
            estado.movimento_duplo_piao_branco = estado.movimento_duplo_piao_branco ^ de;
            console.log("O bitboard do controlado de movimento duplo está em: \n" + visualizadeiro(estado.movimento_duplo_piao_branco) + '\n');
          }
          else{
            console.log("O bitboard do controlado de movimento duplo não foi atualizado");
          }
        }
        else{
          const movimento_esperado = de >> 8n;
          if(para !== movimento_esperado){
            console.log("Movimento inválido - não foi feito nenhum movimento esperado");
            throw new Error()
          }

          // verifica se precisa atualizar o bitboard de movimento duplo de piao
          if(estado.movimento_duplo_piao_preto & de){
            // Atualizando o bitboard que movimento duplo de piao
            estado.movimento_duplo_piao_preto = estado.movimento_duplo_piao_preto ^ de;
            console.log("O bitboard do controlado de movimento duplo está em: \n" + visualizadeiro(estado.movimento_duplo_piao_preto) + '\n');
          }
          else{
            console.log("O bitboard do controlado de movimento duplo não foi atualizado");
          }
        }
      }

      if(estado.turno == 1){
        // Realizando movimento
        const movimentacao = de | para;
        estado.bitboard_piao_branco ^= movimentacao;
        console.log("Bitboard do piao: \n" + visualizadeiro(estado.bitboard_piao_branco) + '\n');
      }
      else{
        // Realizando movimento
        const movimentacao = de | para;
        estado.bitboard_piao_preto ^= movimentacao;
        console.log("Bitboard do piao: \n" + visualizadeiro(estado.bitboard_piao_preto) + '\n');
      }

      this.tabuleiro();
  }
}

function verificarMovimentoDuploPiao(de, para){
  if(estado.turno == 1){
    // Verificando se foi feito um movimento duplo de pião
    if(((de << 16n) === para)){
      console.log("Foi feito um movimento duplo de pião");

      // Verificando se foi feito um movimento duplo válido
      if((estado.movimento_duplo_piao_branco & de) != 0n && (estado.bitboard_pretas & para) == 0n){
        return true;
      }
      else{
        console.log("Movimento duplo inválido");
        throw new Error()
      }
    }
    else{
      console.log("Não foi feito um movimento duplo de pião");
      return false;
    }
  }
  else{
    // Verificando se foi feito um movimento duplo de pião
    if(((de >> 16n) === para)){
      console.log("Foi feito um movimento duplo de pião");

      // Verificando se foi feito um movimento duplo válido
      if((estado.movimento_duplo_piao_preto & de) != 0n && (estado.bitboard_brancas & para) == 0n){
        return true;
      }
      else{
        console.log("Movimento duplo inválido");
        throw new Error()
      }
    }
    else{
      console.log("Não foi feito um movimento duplo de pião");
      return false;
    }
  }
}

function verificarCapitura(peca, de, para){
  if(estado.turno == 1){
    // piao
    if(peca == 0b1){
      let captura1 = 0n;
      let captura2 = 0n;
      captura1 = (de << 7n);
      captura2 = (de << 9n);
      console.log("-- Status captura --")
      console.log(visualizadeiro(captura1));
      console.log(visualizadeiro(captura2))
      if(captura1 & estado.bitboard_pretas || captura2 & estado.bitboard_pretas){
        if(para == captura1 || para == captura2){
          return true;
        }
        else{
          return false;
        }
      }
      else{
        return false;
      }
    }
    // cavalo
    else if(peca == 0b10){
    }
    // bispo
    else if(peca == 0b11){
    }
    // torre
    else if(peca == 0b110){
    }
    // rainha
    else if(peca == 0b111){
    }
    // rei
    else{
    }
  }
  else{
    // piao
    if(peca == 0b1){
      let captura1 = 0n;
      let captura2 = 0n;
      captura1 = (de >> 7n);
      captura2 = (de >> 9n);
      console.log("-- Status captura --")
      console.log(visualizadeiro(captura1));
      console.log(visualizadeiro(captura2))
      if(captura1 & estado.bitboard_brancas || captura2 & estado.bitboard_brancas){
        if(para == captura1 || para == captura2){
          return true;
        }
        else{
          return false;
        }
      }
      else{
        return false;
      }
    }
    // cavalo
    else if(peca == 0b10){
    }
    // bispo
    else if(peca == 0b11){
    }
    // torre
    else if(peca == 0b110){
    }
    // rainha
    else if(peca == 0b111){
    }
    // rei
    else{
    }

  }
}

function verificarMovimento(peca, de, para){
  if(estado.turno == 1){
    // Verificar se a casa da frente está ocupada

    if((de << 8n == para || de << 16n == para) && (((estado.bitboard_brancas & para) != 0n) || ((estado.bitboard_pretas & para) != 0n))){
      console.log("Movimento inválido - a casa de destino está ocupada");
      throw new Error()
    }

    // piao
    if(peca == 0b1){
      
      // Vai verificar se é um movimento duplo e se é valido
      const movimento_duplo = verificarMovimentoDuploPiao(de, para);
      const capitura = verificarCapitura(peca, de, para);

      // Realizar movimento
      EfetuarMovimento.piao(de, para, movimento_duplo, capitura);
    }
    // cavalo
    else if(peca == 0b10){
    }
    // bispo
    else if(peca == 0b11){
    }
    // torre
    else if(peca == 0b110){
    }
    // rainha
    else if(peca == 0b111){
    }
    // rei
    else{
    }
  }
  else{
    // Verificar se a casa está ocupada por alguma outra peça da mesma cor.
    if((de << 8n == para || de << 16n == para) && (((estado.bitboard_pretas & para) != 0n) || ((estado.bitboard_brancas & para) != 0n))){
      console.log("Movimento inválido - a casa de destino está ocupada");
      throw new Error()
    }

    // piao
    if(peca == 0b1){
      
      // Vai verificar se é um movimento duplo e se é valido
      const movimento_duplo = verificarMovimentoDuploPiao(de, para);
      const capitura = verificarCapitura(peca, de, para);

      // Realizar movimento
      EfetuarMovimento.piao(de, para, movimento_duplo, capitura);
    }
    // cavalo
    else if(peca == 0b10){
    }
    // bispo
    else if(peca == 0b11){
    }
    // torre
    else if(peca == 0b110){
    }
    // rainha
    else if(peca == 0b111){
    }
    // rei
    else{
    }
  }
}