import { estado } from './variaveis.js'
import { visualizadeiro } from './visualizador.js';

// Recebe a coordenada normal e converte para binário.
export function converter(valor){
  console.log("\n-- Está convertendo de coordenadas para binário --\n");
  let potencia = 0;
  let binario = 0n;
  potencia = Number((valor[1])-1) * 8;

  
  if(Number(valor[0].charCodeAt(0) - "A".charCodeAt(0)) > 7){
    console.log("Jogada invalida");
    throw new Error()
  }
  else if(Number(valor[1])  > 8){
    console.log("Jogada invalida");
    throw new Error()
  }
  
  potencia += (valor[0].charCodeAt(0) - "A".charCodeAt(0));
  console.log("A é pontência é: 2^" + potencia);
  binario = 2**potencia;

  return binario;
}

// Recebe o binário e converte para coordenada normal
export function desconverter(valor){
  console.log("\n-- Está convertendo de binário para coordenadas --\n");
  console.log("Valor é: "+valor);

  console.log("O log é " + (valor.toString(2).length - 1))
  let log2 = (valor.toString(2).length -1);
  let linhas = 0;
  let colunas = 0;
  while(true){
    if(log2 > 8){
      log2 -= 8;
      linhas++; 
    }
    else{
      colunas = log2;
      break;
    }
  }

  console.log(linhas)
  console.log(colunas)

  let letra = String.fromCharCode(Number("A".charCodeAt(0)) + colunas);
  let numero = Number(linhas + 1);

  return letra + numero;
}

// Gera o FEN com base nos bitboards e outra variáveis de controle do jogo
export function converterFEN(){

  console.log("Pião");
  console.log(visualizadeiro(estado.bitboard_piao_preto));
  console.log("Cavalo");
  console.log(visualizadeiro(estado.bitboard_cavalo_preto));
  console.log("Bispo");
  console.log(visualizadeiro(estado.bitboard_bispo_preto));
  console.log("Torre");
  console.log(visualizadeiro(estado.bitboard_torre_preto));
  console.log("Rainha");
  console.log(visualizadeiro(estado.bitboard_rainha_preto));
  console.log("Rei");
  console.log(visualizadeiro(estado.bitboard_rei_preto));
  console.log("Todas pretas");
  console.log(visualizadeiro(estado.bitboard_pretas));

  console.log("\n-- Gerando FEN --\n");

  let fen = "";
  let casas_vazias = 0;
  let potencia = 0n;

  for(let cont1 = 0; cont1 < 8; cont1++){
    for(let cont2 = 0; cont2 < 8; cont2++){
      potencia = (potencia == 0n ) ? 1n : (potencia * 2n);
      
      // Verificando se na casa tem peça
      if((estado.bitboard_tabuleiro & potencia) !== 0n){

        // Verificando se tem alguma casa vazia
        if(casas_vazias != 0){
          fen += casas_vazias;
          casas_vazias = 0;
        }

        //Verificando se é uma peça preta
        if(estado.bitboard_pretas & potencia){

          if(estado.bitboard_piao_preto & potencia){
            fen += "p";
          }
          else if(estado.bitboard_cavalo_preto & potencia){
            fen += "n";
          }
          else if(estado.bitboard_bispo_preto & potencia){
            fen += "b";
          }
          else if(estado.bitboard_torre_preto & potencia){
            fen += "r";
          }
          else if(estado.bitboard_rainha_preto & potencia){
            fen += "q";
          }
          else if(estado.bitboard_rei_preto & potencia){
            fen += "k";
          }
        }
        // Peça branca
        else{
          if(estado.bitboard_piao_branco & potencia){
            fen += "P";
          }
          else if(estado.bitboard_cavalo_branco & potencia){
            fen += "N";
          }
          else if(estado.bitboard_bispo_branco & potencia){
            fen += "B";
          }
          else if(estado.bitboard_torre_branco & potencia){
            fen += "R";
          }
          else if(estado.bitboard_rainha_branco & potencia){
            fen += "Q";
          }
          else if(estado.bitboard_rei_branco & potencia){
            fen += "K";
          }
        }
      }
      // Casa vazia
      else{
        casas_vazias++;
      }
    }

    if(casas_vazias != 0){
      fen += casas_vazias;
      casas_vazias = 0;
    }

    // Adicionando o "/"
    if(cont1 < 7){
      fen += "/";
      casas_vazias = 0;
    }
  }
  
  fen = fen.split("/").reverse().join("/");

  console.log(fen);
  return fen;
}