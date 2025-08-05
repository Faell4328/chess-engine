import { calcularPossibilidadeMovimento } from "./movimentacao.js";
import { estado } from "./variaveis.js";
import { visualizadeiro } from "./visualizador.js";

let casas_ataque_brancas = 0n;
let casas_ataque_pretas = 0n;

export function calcularCasasAtacadas(){

  casas_ataque_brancas = 0n;
  casas_ataque_pretas = 0n;
  estado.casas_atacadas_pelas_brancas = 0n;
  estado.casas_atacadas_pelas_pretas = 0n;

  for(let cont = 0; cont < 64; cont ++ ){

    let de = BigInt(2 ** cont);
    
    if(estado.bitboard_piao_branco & de){
      console.log("Piao brancas");

      let ataques = [
        ...calcularPossibilidadeMovimento(de, estado.movimento_captura_piao_esquerda, "<<", false, (estado.bitboard_casas_coluna_A | estado.bitboard_casas_linha_8), true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_captura_piao_direita, "<<", false, (estado.bitboard_casas_coluna_H | estado.bitboard_casas_linha_8), true),
      ]

      ataques.map((ataque) => {
        casas_ataque_brancas |= ataque;
      })
    }
    else if(estado.bitboard_cavalo_branco & de){
      console.log("Cavalo brancas");

      let ataques = [];

      for(let cont = 0; cont < estado.movimento_cavalo.length; cont++){
        ataques.push(de << estado.movimento_cavalo[cont]);
      }

      // Calculando todos os lances para baixo (sem filtro)
      for(let cont = 0; cont < estado.movimento_cavalo.length; cont++){
        ataques.push(de >> estado.movimento_cavalo[cont]);
      }

      // Retirando os movimentos inválidos
      ataques = ataques.filter((movimento) => {
        if(movimento & estado.bitboard_brancas){
          return false;
        }
        else if((((de & estado.bitboard_casas_coluna_A) !== 0n) || (de & estado.bitboard_casas_coluna_B) !== 0n) && ((movimento & ( estado.bitboard_casas_coluna_G | estado.bitboard_casas_coluna_H )) !== 0n)){
          return false;
        }
        else if((((de & estado.bitboard_casas_coluna_G) !== 0n) || (de & estado.bitboard_casas_coluna_H) !== 0n) && ((movimento & ( estado.bitboard_casas_coluna_A | estado.bitboard_casas_coluna_B )) !== 0n)){
          return false;
        }
        else if((((de & estado.bitboard_casas_linha_1) !== 0n) || (de & estado.bitboard_casas_linha_2) !== 0n) && ((movimento & ( estado.bitboard_casas_linha_7 | estado.bitboard_casas_linha_8 )) !== 0n)){
          return false;
        }
        else if((((de & estado.bitboard_casas_linha_7) !== 0n) || (de & estado.bitboard_casas_linha_8) !== 0n) && ((movimento & ( estado.bitboard_casas_linha_1 | estado.bitboard_casas_linha_2 )) !== 0n)){
          return false;
        }
        else if(movimento == 0n){
          return false;
        }  
        else if(movimento > 18446744073709551615n){
          return false;
        }
        else{
          return true
        }
      });
      
      ataques.map((ataque) => {
        casas_ataque_brancas |= ataque;
      })
    }
    else if(estado.bitboard_bispo_branco & de){
      console.log("Bispo brancas");

      let ataques = []; 

      ataques = [
        ...calcularPossibilidadeMovimento(de, estado.movimento_bispo_direita, "<<", false, (estado.bitboard_casas_coluna_H | estado.bitboard_casas_linha_8), true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_bispo_direita, ">>", false, (estado.bitboard_casas_coluna_A | estado.bitboard_casas_linha_1), true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_bispo_esquerda, "<<", false, (estado.bitboard_casas_coluna_A | estado.bitboard_casas_linha_8), true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_bispo_esquerda, ">>", false, (estado.bitboard_casas_coluna_H | estado.bitboard_casas_linha_1), true)
      ];

      ataques = ataques.filter((lances) => {
        return lances !== 0n;
      });

      ataques.map((ataque) => {
        casas_ataque_brancas |= ataque;
      });
    }
    else if(estado.bitboard_torre_branco & de){
      console.log("Torre brancas");

      let ataques= [];    

      ataques = [
        ...calcularPossibilidadeMovimento(de, estado.movimento_torre_frente, "<<", false, estado.bitboard_casas_linha_8, true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_torre_frente, ">>", false, estado.bitboard_casas_linha_1, true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_torre_direita, "<<", false, estado.bitboard_casas_coluna_H, true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_torre_direita, ">>", false, estado.bitboard_casas_coluna_A, true),
      ]

      ataques = ataques.filter((lances) => {
        return lances !== 0n;
      })

      ataques.map((ataque) => {
        casas_ataque_brancas |= ataque;
      });
    }
    else if(estado.bitboard_rainha_branco & de){
      console.log("Rainha brancas");

      let ataques= [];    

      ataques = [
        ...calcularPossibilidadeMovimento(de, estado.movimento_torre_frente, "<<", false, estado.bitboard_casas_linha_8, true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_torre_frente, ">>", false, estado.bitboard_casas_linha_1, true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_torre_direita, "<<", false, estado.bitboard_casas_coluna_H, true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_torre_direita, ">>", false, estado.bitboard_casas_coluna_A, true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_bispo_direita, "<<", false, (estado.bitboard_casas_coluna_H | estado.bitboard_casas_linha_8), true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_bispo_direita, ">>", false, (estado.bitboard_casas_coluna_A | estado.bitboard_casas_linha_1), true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_bispo_esquerda, "<<", false, (estado.bitboard_casas_coluna_A | estado.bitboard_casas_linha_8), true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_bispo_esquerda, ">>", false, (estado.bitboard_casas_coluna_H | estado.bitboard_casas_linha_1), true)
      ]

      ataques = ataques.filter((lances) => {
        return lances !== 0n;
      });

      ataques.map((ataque) => {
        casas_ataque_brancas |= ataque;
      });
    }
    else if(estado.bitboard_rei_branco & de){
      console.log("Rei brancas");

      let ataques= [];    

      ataques = [
        ...calcularPossibilidadeMovimento(de, estado.movimento_rei_frente, "<<", false, (estado.bitboard_casas_linha_8), true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_rei_frente_esquerda, "<<", false, (estado.bitboard_casas_coluna_A | estado.bitboard_casas_linha_8), true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_rei_frente_direita, "<<", false, (estado.bitboard_casas_coluna_H | estado.bitboard_casas_linha_8), true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_rei_direita, "<<", false, (estado.bitboard_casas_coluna_H), true),

        ...calcularPossibilidadeMovimento(de, estado.movimento_rei_frente, ">>", false, (estado.bitboard_casas_linha_1)),
        ...calcularPossibilidadeMovimento(de, estado.movimento_rei_frente_esquerda, ">>", false, (estado.bitboard_casas_coluna_H | estado.bitboard_casas_linha_1), true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_rei_frente_direita, ">>", false, (estado.bitboard_casas_coluna_A | estado.bitboard_casas_linha_1), true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_rei_direita, ">>", false, (estado.bitboard_casas_coluna_A), true),
      ];

      ataques = ataques.filter((lances) => {
        return lances !== 0n;
      });

      ataques.map((ataque) => {
        casas_ataque_brancas |= ataque;
      });

    }


    else if(estado.bitboard_piao_preto & de){
      console.log("Piao pretas");
      let ataques = [
        ...calcularPossibilidadeMovimento(de, estado.movimento_captura_piao_esquerda, ">>", false, (estado.bitboard_casas_coluna_H | estado.bitboard_casas_linha_1)),
        ...calcularPossibilidadeMovimento(de, estado.movimento_captura_piao_direita, ">>", false, (estado.bitboard_casas_coluna_A | estado.bitboard_casas_linha_1)),
      ]

      ataques.map((ataque) => {
        casas_ataque_pretas |= ataque;
      })
    }
    else if(estado.bitboard_cavalo_preto & de){
      console.log("Cavalo pretas");

      let ataques = [];

      for(let cont = 0; cont < estado.movimento_cavalo.length; cont++){
        ataques.push(de << estado.movimento_cavalo[cont]);
      }

      // Calculando todos os lances para baixo (sem filtro)
      for(let cont = 0; cont < estado.movimento_cavalo.length; cont++){
        ataques.push(de >> estado.movimento_cavalo[cont]);
      }

      // Retirando os movimentos inválidos
      ataques = ataques.filter((movimento) => {

        if(movimento & estado.bitboard_pretas){
          return false;
        }
        else if((((de & estado.bitboard_casas_coluna_A) !== 0n) || (de & estado.bitboard_casas_coluna_B) !== 0n) && ((movimento & ( estado.bitboard_casas_coluna_G | estado.bitboard_casas_coluna_H )) !== 0n)){
          return false;
        }
        else if((((de & estado.bitboard_casas_coluna_G) !== 0n) || (de & estado.bitboard_casas_coluna_H) !== 0n) && ((movimento & ( estado.bitboard_casas_coluna_A | estado.bitboard_casas_coluna_B )) !== 0n)){
          return false;
        }
        else if((((de & estado.bitboard_casas_linha_1) !== 0n) || (de & estado.bitboard_casas_linha_2) !== 0n) && ((movimento & ( estado.bitboard_casas_linha_7 | estado.bitboard_casas_linha_8 )) !== 0n)){
          return false;
        }
        else if((((de & estado.bitboard_casas_linha_7) !== 0n) || (de & estado.bitboard_casas_linha_8) !== 0n) && ((movimento & ( estado.bitboard_casas_linha_1 | estado.bitboard_casas_linha_2 )) !== 0n)){
          return false;
        }
        else if(movimento == 0n){
          return false;
        }
        else if(movimento > 18446744073709551615n){
          return false;
        }
        else{
          return true;
        }
      });
      
      ataques.map((ataque) => {
        console.log((ataque))
        casas_ataque_pretas |= ataque;
      })

    }
    else if(estado.bitboard_bispo_preto & de){
      console.log("Bispo pretas");

      let ataques = []; 

      ataques = [
        ...calcularPossibilidadeMovimento(de, estado.movimento_bispo_direita, "<<", false, (estado.bitboard_casas_coluna_H | estado.bitboard_casas_linha_8), true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_bispo_direita, ">>", false, (estado.bitboard_casas_coluna_A | estado.bitboard_casas_linha_1), true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_bispo_esquerda, "<<", false, (estado.bitboard_casas_coluna_A | estado.bitboard_casas_linha_8), true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_bispo_esquerda, ">>", false, (estado.bitboard_casas_coluna_H | estado.bitboard_casas_linha_1), true)
      ];

      ataques = ataques.filter((lances) => {
        return lances !== 0n;
      });

      ataques.map((ataque) => {
        casas_ataque_pretas |= ataque;
      });
    }
    else if(estado.bitboard_torre_preto & de){
      console.log("Torre pretas");

      let ataques= [];    

      ataques = [
        ...calcularPossibilidadeMovimento(de, estado.movimento_torre_frente, "<<", false, estado.bitboard_casas_linha_8, true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_torre_frente, ">>", false, estado.bitboard_casas_linha_1, true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_torre_direita, "<<", false, estado.bitboard_casas_coluna_H, true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_torre_direita, ">>", false, estado.bitboard_casas_coluna_A, true),
      ]

      ataques = ataques.filter((lances) => {
        return lances !== 0n;
      })

      ataques.map((ataque) => {
        casas_ataque_pretas |= ataque;
      });
    }
    else if(estado.bitboard_rainha_preto & de){
      console.log("Rainha pretas");

      let ataques= [];    

      ataques = [
        ...calcularPossibilidadeMovimento(de, estado.movimento_torre_frente, "<<", false, estado.bitboard_casas_linha_8, true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_torre_frente, ">>", false, estado.bitboard_casas_linha_1, true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_torre_direita, "<<", false, estado.bitboard_casas_coluna_H, true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_torre_direita, ">>", false, estado.bitboard_casas_coluna_A, true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_bispo_direita, "<<", false, (estado.bitboard_casas_coluna_H | estado.bitboard_casas_linha_8), true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_bispo_direita, ">>", false, (estado.bitboard_casas_coluna_A | estado.bitboard_casas_linha_1), true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_bispo_esquerda, "<<", false, (estado.bitboard_casas_coluna_A | estado.bitboard_casas_linha_8), true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_bispo_esquerda, ">>", false, (estado.bitboard_casas_coluna_H | estado.bitboard_casas_linha_1), true)
      ]

      ataques = ataques.filter((lances) => {
        return lances !== 0n;
      });

      ataques.map((ataque) => {
        casas_ataque_pretas |= ataque;
      });
    }
    else if(estado.bitboard_rei_preto & de){
      console.log("Rei pretas");

      let ataques= [];    

      ataques = [
        ...calcularPossibilidadeMovimento(de, estado.movimento_rei_frente, "<<", false, (estado.bitboard_casas_linha_8), true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_rei_frente_esquerda, "<<", false, (estado.bitboard_casas_coluna_A | estado.bitboard_casas_linha_8), true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_rei_frente_direita, "<<", false, (estado.bitboard_casas_coluna_H | estado.bitboard_casas_linha_8), true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_rei_direita, "<<", false, (estado.bitboard_casas_coluna_H), true),

        ...calcularPossibilidadeMovimento(de, estado.movimento_rei_frente, ">>", false, (estado.bitboard_casas_linha_1)),
        ...calcularPossibilidadeMovimento(de, estado.movimento_rei_frente_esquerda, ">>", false, (estado.bitboard_casas_coluna_H | estado.bitboard_casas_linha_1), true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_rei_frente_direita, ">>", false, (estado.bitboard_casas_coluna_A | estado.bitboard_casas_linha_1), true),
        ...calcularPossibilidadeMovimento(de, estado.movimento_rei_direita, ">>", false, (estado.bitboard_casas_coluna_A), true),
      ];

      ataques = ataques.filter((lances) => {
        return lances !== 0n;
      });

      ataques.map((ataque) => {
        casas_ataque_pretas |= ataque;
      });
    }
    else{
      console.log("vazia")
    }
  }

  estado.casas_atacadas_pelas_brancas = casas_ataque_brancas;
  estado.casas_atacadas_pelas_pretas = casas_ataque_pretas;
  console.log("Casas atacadas pelas brancas: \n" + visualizadeiro(casas_ataque_brancas));
  console.log("Casas atacadas pelas pretas: \n" + visualizadeiro(casas_ataque_pretas));
}

calcularCasasAtacadas()