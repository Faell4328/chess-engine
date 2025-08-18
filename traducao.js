import { implementar } from './escritor.js';
import { estado, simulado, sincronizar_estado_com_simulado } from './variaveis.js'
import { visualizadeiro } from './visualizador.js';

// Recebe a coordenada normal e converte para binário.
export function converter(valor){
  implementar("\n-- Está convertendo de coordenadas para binário --\n");
  let potencia = 0;
  let binario = 0n;
  potencia = Number((valor[1])-1) * 8;

  
  if(Number(valor[0].toLowerCase() - "a".charCodeAt(0)) > 7){
    implementar("Jogada invalida");
    throw new Error("Movimento inválido");
  }
  else if(Number(valor[1])  > 8){
    implementar("Jogada invalida");
    throw new Error("Movimento inválido");
  }
  
  potencia += (valor[0].toLowerCase().charCodeAt(0) - "a".charCodeAt(0));
  implementar("A é pontência é: 2^" + potencia);
  binario = BigInt(2**potencia);

  return binario;
}

// Recebe o binário e converte para coordenada normal
export function desconverter(valor){
  implementar("\n-- Está convertendo de binário para coordenadas --\n");
  implementar("Valor é: "+valor);

  implementar("O log é " + (valor.toString(2).length - 1))
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

  implementar(linhas)
  implementar(colunas)

  let letra = String.fromCharCode(Number("a".charCodeAt(0)) + colunas);
  let numero = Number(linhas + 1);

  return letra + numero;
}

// Gera o FEN com base nos bitboards e outra variáveis de controle do jogo
export function converterFEN(){

  implementar("\n-- Gerando FEN --\n");

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
  
  // FEN com todas as peças no tabuleiro
  fen = fen.split("/").reverse().join("/");

  // FEN com quem está jogando
  fen += ` ${estado.jogando}`;

  // FEN com os roques
  let roques = (estado.status_roque_direita_branco == true) ? "K" : "";
  roques += (estado.status_roque_esquerda_branco == true) ? "Q" : "";
  roques += (estado.status_roque_direita_preto == true) ? "k" : "";
  roques += (estado.status_roque_esquerda_preto == true) ? "q" : "";
  fen += (roques == "") ? " -" : ` ${roques}`;

  // FEN com en passant
  if((estado.en_passant_brancas | estado.en_passant_pretas) !== 0n){
    fen += ` ${desconverter(estado.en_passant_pretas | estado.en_passant_brancas)}`;
  }
  else {
    fen += " -";
  }

  // FEN com regra dos 50 lances (ainda não implementado)
  fen += " 0";

  // FEN com regra dos 50 lances (ainda não implementado)
  fen += ` ${estado.numero_lances_completo}`

  implementar(fen + "\n\n\n\n------------------------------------------\n\n\n\n");
  return fen;
}

// Gera os bitboards com base no FEN (já salvando no simulado)
export function desconverterFEN(fen){

  implementar("\n-- Gerando bitboard com base no FEN --\n");

  let fen_separado_completo = fen.split(" ");
  const fen_pecas = fen_separado_completo[0].split("/").reverse();

  // Verificando se o FEN está incompleto
  if(fen_separado_completo.length < 6){
    implementar("O FEN é menor que o esperado");
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
  simulado.bitboard_piao_branco = 0n;
  simulado.bitboard_piao_preto = 0n;
  simulado.bitboard_bispo_branco = 0n;
  simulado.bitboard_bispo_preto = 0n;
  simulado.bitboard_cavalo_branco = 0n;
  simulado.bitboard_cavalo_preto = 0n;
  simulado.bitboard_torre_branco = 0n;
  simulado.bitboard_torre_preto = 0n;
  simulado.bitboard_rainha_branco = 0n;
  simulado.bitboard_rainha_preto = 0n;
  simulado.bitboard_rei_branco = 0n;
  simulado.bitboard_rei_preto = 0n;

  // Bitboard de quem joga 
  simulado.jogando = fen_jogando;
  simulado.numero_lances_completo = fen_numero_movimento;

  // Bitboard do enpassant
  simulado.en_passant_brancas = (fen_jogando == "b" && fen_en_passant != "-") ? converter(fen_en_passant) : 0n;
  simulado.en_passant_pretas = (fen_jogando == "w" && fen_en_passant != "-") ? converter(fen_en_passant) : 0n;

  simulado.status_roque_esquerda_branco = (fen_roque.indexOf("K") != -1) ? true : false;
  simulado.status_roque_direita_branco = (fen_roque.indexOf("Q") != -1) ?  true : false;
  simulado.status_roque_esquerda_preto = (fen_roque.indexOf("k") != -1) ?  true : false;
  simulado.status_roque_direita_preto = (fen_roque.indexOf("q") != -1) ? true : false;

  implementar("Jogando")
  implementar(simulado.jogando);
  implementar("En passant brancas")
  implementar(simulado.en_passant_brancas);
  implementar("En passant pretas")
  implementar(simulado.en_passant_pretas);
  implementar("roque esquerda branco")
  implementar(simulado.status_roque_esquerda_branco);
  implementar("roque direita branco")
  implementar(simulado.status_roque_direita_branco);
  implementar("roque esquerda preta")
  implementar(simulado.status_roque_esquerda_preto);
  implementar("roque direita preta")
  implementar(simulado.status_roque_direita_preto);

  for(let cont1 = 0; cont1 < 8; cont1++){
    const linha_atual = fen_pecas[cont1].split("");
    let casas_vazias = 0;

    for(let cont2 = 0; cont2 < linha_atual.length; cont2++){
      let potencia = (cont1 == 0) ? (cont1 + (cont2 + casas_vazias)) : (cont1 * 8 + (cont2 + casas_vazias));
      let valor = BigInt(2 ** potencia);

      switch(linha_atual[cont2]){
        case "p":
          simulado.bitboard_piao_preto |= valor;
          break;
        case "n":
          simulado.bitboard_cavalo_preto |= valor;
          break;
        case "b":
          simulado.bitboard_bispo_preto |= valor;
          break;
        case "r":
          simulado.bitboard_torre_preto |= valor;
          break;
        case "q":
          simulado.bitboard_rainha_preto |= valor;
          break;
        case "k":
          simulado.bitboard_rei_preto |= valor;
          break;

        case "P":
          simulado.bitboard_piao_branco |= valor;
          break;
        case "N":
          simulado.bitboard_cavalo_branco |= valor;
          break;
        case "B":
          simulado.bitboard_bispo_branco |= valor;
          break;
        case "R":
          simulado.bitboard_torre_branco |= valor;
          break;
        case "Q":
          simulado.bitboard_rainha_branco |= valor;
          break;
        case "K":
          simulado.bitboard_rei_branco |= valor;
          break;
          
        default:
          casas_vazias += Number(linha_atual[cont2]) - 1;
          break;
      }
      
      //implementar(`cont1: ${cont1} - cont2: ${cont2} - potencia é ${potencia} - valor é ${valor}`);
    }
  }
  simulado.bitboard_pretas = simulado.bitboard_piao_preto | simulado.bitboard_cavalo_preto | simulado.bitboard_bispo_preto | simulado.bitboard_torre_preto | simulado.bitboard_rainha_preto | simulado.bitboard_rei_preto;
  simulado.bitboard_brancas = simulado.bitboard_piao_branco | simulado.bitboard_cavalo_branco | simulado.bitboard_bispo_branco | simulado.bitboard_torre_branco | simulado.bitboard_rainha_branco | simulado.bitboard_rei_branco;
  simulado.bitboard_tabuleiro = simulado.bitboard_pretas | simulado.bitboard_brancas;

  return;  
}