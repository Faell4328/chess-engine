import { partida, partida_virtual } from './variaveis.js'
import { visualizadeiro } from './visualizador.js';

// Recebe a coordenada normal e converte para binário.
export function converter(valor){
  let potencia = 0;
  let binario = 0n;
  potencia = Number((valor[1])-1) * 8;

  
  if(Number(valor[0].toLowerCase() - "a".charCodeAt(0)) > 7){
    throw new Error("Movimento inválido");
  }
  else if(Number(valor[1])  > 8){
    throw new Error("Movimento inválido");
  }
  
  potencia += (valor[0].toLowerCase().charCodeAt(0) - "a".charCodeAt(0));
  binario = BigInt(2**potencia);

  return binario;
}

// Recebe o binário e converte para coordenada normal
export function desconverter(valor){
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

  let letra = String.fromCharCode(Number("a".charCodeAt(0)) + colunas);
  let numero = Number(linhas + 1);

  return letra + numero;
}

// Gera o FEN com base nos bitboards e outra variáveis de controle do jogo
export function converterFEN(){

  let fen = "";
  let casas_vazias = 0;
  let potencia = 0n;

  for(let cont1 = 0; cont1 < 8; cont1++){
    for(let cont2 = 0; cont2 < 8; cont2++){
      potencia = (potencia == 0n ) ? 1n : (potencia * 2n);
      
      // Verificando se na casa tem peça
      if((partida.bitboard_de_todas_as_pecas_do_tabuleiro & potencia) !== 0n){

        // Verificando se tem alguma casa vazia
        if(casas_vazias != 0){
          fen += casas_vazias;
          casas_vazias = 0;
        }

        //Verificando se é uma peça preta
        if(partida.bitboard_de_todas_pecas_pretas & potencia){

          if(partida.bitboard_piao_preto & potencia){
            fen += "p";
          }
          else if(partida.bitboard_cavalo_preto & potencia){
            fen += "n";
          }
          else if(partida.bitboard_bispo_preto & potencia){
            fen += "b";
          }
          else if(partida.bitboard_torre_preto & potencia){
            fen += "r";
          }
          else if(partida.bitboard_rainha_preto & potencia){
            fen += "q";
          }
          else if(partida.bitboard_rei_preto & potencia){
            fen += "k";
          }
        }
        // Peça branca
        else{
          if(partida.bitboard_piao_branco & potencia){
            fen += "P";
          }
          else if(partida.bitboard_cavalo_branco & potencia){
            fen += "N";
          }
          else if(partida.bitboard_bispo_branco & potencia){
            fen += "B";
          }
          else if(partida.bitboard_torre_branco & potencia){
            fen += "R";
          }
          else if(partida.bitboard_rainha_branco & potencia){
            fen += "Q";
          }
          else if(partida.bitboard_rei_branco & potencia){
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
  
  // FEN com todas as peças no tabuleiro
  fen = fen.split("/").reverse().join("/");

  // FEN com quem está jogando
  fen += ` ${partida.jogando}`;

  // FEN com os roques
  let roques = (partida.status_roque_direita_branco == true) ? "K" : "";
  roques += (partida.status_roque_esquerda_branco == true) ? "Q" : "";
  roques += (partida.status_roque_direita_preto == true) ? "k" : "";
  roques += (partida.status_roque_esquerda_preto == true) ? "q" : "";
  fen += (roques == "") ? " -" : ` ${roques}`;

  // FEN com en passant
  if((partida.en_passant_brancas | partida.en_passant_pretas) !== 0n){
    fen += ` ${desconverter(partida.en_passant_pretas | partida.en_passant_brancas)}`;
  }
  else {
    fen += " -";
  }

  // FEN com regra dos 50 lances (ainda não implementado)
  fen += " 0";

  // FEN com regra dos 50 lances (ainda não implementado)
  fen += ` ${partida.numero_lances_completo}`

  return fen;
}

// Gera os bitboards com base no FEN (já salvando no simulado)
export function desconverterFEN(fen){

  let fen_separado_completo = fen.split(" ");
  const fen_pecas = fen_separado_completo[0].split("/").reverse();

  // Verificando se o FEN está incompleto
  if(fen_separado_completo.length < 6){
    throw new Error("FEN incompleto");
  }
  
  const fen_jogando = fen_separado_completo[1];
  const fen_roque = fen_separado_completo[2];
  const fen_en_passant = fen_separado_completo[3];
  const fen_meio_move = fen_separado_completo[4];
  const fen_numero_movimento = fen_separado_completo[5];

  let casas_vazias = 0;
  let potencia = 0n;
  let cont = 0;

  // Bitboard das peças
  partida_virtual.bitboard_piao_branco = 0n;
  partida_virtual.bitboard_piao_preto = 0n;
  partida_virtual.bitboard_bispo_branco = 0n;
  partida_virtual.bitboard_bispo_preto = 0n;
  partida_virtual.bitboard_cavalo_branco = 0n;
  partida_virtual.bitboard_cavalo_preto = 0n;
  partida_virtual.bitboard_torre_branco = 0n;
  partida_virtual.bitboard_torre_preto = 0n;
  partida_virtual.bitboard_rainha_branco = 0n;
  partida_virtual.bitboard_rainha_preto = 0n;
  partida_virtual.bitboard_rei_branco = 0n;
  partida_virtual.bitboard_rei_preto = 0n;

  // Bitboard de quem joga 
  partida_virtual.jogando = fen_jogando;
  partida_virtual.numero_lances_completo = fen_numero_movimento;

  // Bitboard do enpassant
  partida_virtual.en_passant_brancas = (fen_jogando == "b" && fen_en_passant != "-") ? converter(fen_en_passant) : 0n;
  partida_virtual.en_passant_pretas = (fen_jogando == "w" && fen_en_passant != "-") ? converter(fen_en_passant) : 0n;

  partida_virtual.status_roque_esquerda_branco = (fen_roque.indexOf("K") != -1) ? true : false;
  partida_virtual.status_roque_direita_branco = (fen_roque.indexOf("Q") != -1) ?  true : false;
  partida_virtual.status_roque_esquerda_preto = (fen_roque.indexOf("k") != -1) ?  true : false;
  partida_virtual.status_roque_direita_preto = (fen_roque.indexOf("q") != -1) ? true : false;

  for(let cont1 = 0; cont1 < 8; cont1++){
    const linha_atual = fen_pecas[cont1].split("");
    let casas_vazias = 0;

    for(let cont2 = 0; cont2 < linha_atual.length; cont2++){
      let potencia = (cont1 == 0) ? (cont1 + (cont2 + casas_vazias)) : (cont1 * 8 + (cont2 + casas_vazias));
      let valor = BigInt(2 ** potencia);

      switch(linha_atual[cont2]){
        case "p":
          partida_virtual.bitboard_piao_preto |= valor;
          break;
        case "n":
          partida_virtual.bitboard_cavalo_preto |= valor;
          break;
        case "b":
          partida_virtual.bitboard_bispo_preto |= valor;
          break;
        case "r":
          partida_virtual.bitboard_torre_preto |= valor;
          break;
        case "q":
          partida_virtual.bitboard_rainha_preto |= valor;
          break;
        case "k":
          partida_virtual.bitboard_rei_preto |= valor;
          break;

        case "P":
          partida_virtual.bitboard_piao_branco |= valor;
          break;
        case "N":
          partida_virtual.bitboard_cavalo_branco |= valor;
          break;
        case "B":
          partida_virtual.bitboard_bispo_branco |= valor;
          break;
        case "R":
          partida_virtual.bitboard_torre_branco |= valor;
          break;
        case "Q":
          partida_virtual.bitboard_rainha_branco |= valor;
          break;
        case "K":
          partida_virtual.bitboard_rei_branco |= valor;
          break;
          
        default:
          casas_vazias += Number(linha_atual[cont2]) - 1;
          break;
      }
      
    }
  }
  partida_virtual.bitboard_de_todas_pecas_pretas = partida_virtual.bitboard_piao_preto | partida_virtual.bitboard_cavalo_preto | partida_virtual.bitboard_bispo_preto | partida_virtual.bitboard_torre_preto | partida_virtual.bitboard_rainha_preto | partida_virtual.bitboard_rei_preto;
  partida_virtual.bitboard_de_todas_pecas_brancas = partida_virtual.bitboard_piao_branco | partida_virtual.bitboard_cavalo_branco | partida_virtual.bitboard_bispo_branco | partida_virtual.bitboard_torre_branco | partida_virtual.bitboard_rainha_branco | partida_virtual.bitboard_rei_branco;
  partida_virtual.bitboard_de_todas_as_pecas_do_tabuleiro = partida_virtual.bitboard_de_todas_pecas_pretas | partida_virtual.bitboard_de_todas_pecas_brancas;

  return;  
}