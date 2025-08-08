// Arquivo responsável por realizar os calculos (possibilidades de movimento)
import { converter } from "./traducao.js";
import { estado } from "./variaveis.js";
import { visualizadeiro } from './visualizador.js';

// Função para calcular todos possíveis movimentos e capturas do cavalo
function calcular_ataque_e_movimento_pecas_saltitantes(jogando, origem, deslocamento, operador){
  let pecas_aliada = (jogando == "w") ? estado.bitboard_brancas : estado.bitboard_pretas;
  let pecas_inimiga = (jogando == "w") ? estado.bitboard_pretas : estado.bitboard_brancas;
  
  let movimentos = [];
  let capturas = [];

  for(let cont = 0; cont < deslocamento.length; cont ++){
    const destino = ((operador == "<<") ? origem << deslocamento[cont] : origem >> deslocamento[cont]);
    
    // Verificando se a peça passou do limite do tabuleiro
    if(destino == 0n || destino > 9223372036854775808n){
      continue;
    }
    // Verificando se foi feito um wrap de coluna (canto esquerdo para o canto direito)
    else if(((origem & estado.bitboard_casas_coluna_canto_esquerdo) !== 0n) && (destino & estado.bitboard_casas_coluna_canto_direito) !== 0n){
      continue;
    }
    // Verificando se foi feito um wrap de coluna (canto direito para o canto esquerdo)
    else if(((origem & estado.bitboard_casas_coluna_canto_direito) !== 0n) && (destino & estado.bitboard_casas_coluna_canto_esquerdo) !== 0n){
      continue;
    }
    // verificiando se a casa está ocupada por um inimigo
    else if((destino & pecas_inimiga) !== 0n){
      capturas.push(destino);
      continue;
    }
    // Verificando se a casa está ocupada por um aliado
    else if((destino & pecas_aliada) !== 0n){
      continue;
    }
    
    movimentos.push(destino);
  }

  if(movimentos.length > 0 || capturas.length > 0){
    const movimentos_possiveis = {
      todos: [...movimentos, ...capturas],
      movimentos: movimentos,
      capturas: capturas,
    }

    return movimentos_possiveis;
  }
  else{
    return { todos: [], movimentos: [], capturas: [] }
  }

}

function verificar_roque_peca_rei(jogando){
  let pecas_aliada = (jogando == "w") ? estado.bitboard_brancas : estado.bitboard_pretas;
  let casas_atacadas_inimigo = (jogando == "w") ? estado.casas_atacadas_pelas_pretas : estado.casas_atacadas_pelas_brancas;

  let casas_livre_para_o_roque_esquerda = (jogando == "w") ? estado.casas_que_deve_estar_vazio_para_fazer_o_roque_esquerda_branco : estado.casas_que_deve_estar_vazio_para_fazer_o_roque_esquerda_preto;
  let casas_livre_para_o_roque_direita = (jogando == "w") ? estado.casas_que_deve_estar_vazio_para_fazer_o_roque_direita_branco : estado.casas_que_deve_estar_vazio_para_fazer_o_roque_direita_preto;
  let status_roque_esquerda = (jogando == "w") ? estado.status_roque_esquerda_branco : estado.status_roque_esquerda_preto;
  let status_roque_direita = (jogando == "w") ? estado.status_roque_direita_branco : estado.status_roque_direita_preto;
  let casas_roque_rei_esquerda = (jogando == "w") ? estado.casa_onde_o_rei_vai_ficar_no_roque_esquerda_branco : estado.casa_onde_o_rei_vai_ficar_no_roque_esquerda_preto;
  let casas_roque_rei_direita = (jogando == "w") ? estado.casa_onde_o_rei_vai_ficar_no_roque_direita_branco : estado.casa_onde_o_rei_vai_ficar_no_roque_direita_preto;

  let roque_esquerda = [];
  let roque_direita = [];

  // Verifica se é possível fazer roque na esquerda
  if(((casas_livre_para_o_roque_esquerda & pecas_aliada) == 0n) && (status_roque_esquerda) && ((casas_atacadas_inimigo & casas_livre_para_o_roque_esquerda) == 0n)){
    roque_esquerda.push(casas_roque_rei_esquerda);
  }
  // Verifica se é possível fazer roque na direita
  if(((casas_livre_para_o_roque_direita & pecas_aliada) == 0n) && (status_roque_direita) && ((casas_atacadas_inimigo & casas_livre_para_o_roque_direita) == 0n)){
    roque_direita.push(casas_roque_rei_direita);
  }

  if(roque_esquerda.length > 0 || roque_direita.length > 0){
    const movimentos_possiveis = {
      todos: [...roque_esquerda, ...roque_direita],
      roque_esquerda: roque_esquerda,
      roque_direita: roque_direita,
    }

    return movimentos_possiveis;
  }
  else{
    return { todos: [], roque_esquerda: [], roque_direita: [] }
  }
}

function calcular_ataque_movimento_e_roque_peca_rei(jogando, origem, deslocamento, operador, borda){
  let pecas_aliada = (jogando == "w") ? estado.bitboard_brancas : estado.bitboard_pretas;
  let pecas_inimiga = (jogando == "w") ? estado.bitboard_pretas : estado.bitboard_brancas;
  let casas_atacadas = (jogando == "w") ? estado.casas_atacadas_pelas_pretas : estado.casas_atacadas_pelas_pretas;

  let movimentos = [];
  let capturas = [];

  // Não deixa a peça fazer um wrap de coluna
  if((origem & borda) !== 0n){
    return { todos: [], movimentos: [], capturas: [] }
  }

  for(let cont = 0; cont < deslocamento.length; cont ++){
    const destino = ((operador == "<<") ? origem << deslocamento[cont] : origem >> deslocamento[cont]);
    
    // Peça passou do limite
    if(destino == 0n || destino > 9223372036854775808n){
      break;
    }
    // Verifica se a casa está atacada por alguma peça inimiga
    else if((destino & casas_atacadas) !== 0n){
      break;
    }
    // Verificiando se a casa está ocupada por um inimigo e se não está na borda
    else if(((destino & pecas_inimiga) !== 0n) && (destino & borda) !== 0n){
      capturas.push(destino);
      break;
    }
    // Verificiando se a casa está ocupada por um inimigo
    else if(((destino & pecas_inimiga) !== 0n)){
      capturas.push(destino);
      break;
    }
    // Verificando se a casa está ocupada por um aliado e se não está na borda
    else if(((destino & pecas_aliada) !== 0n)){
      break;
    }
    // Verificando se a peça está na borda
    else if((destino & borda) !== 0n){
      movimentos.push(destino);
      break;
    }

    movimentos.push(destino);
  }

  if(movimentos.length > 0 || capturas.length > 0){
    const movimentos_possiveis = {
      todos: [...movimentos, ...capturas],
      movimentos: movimentos,
      capturas: capturas,
    }

    return movimentos_possiveis;
  }
  else{
    return { todos: [], movimentos: [], capturas: [] }
  }
}

// Função para calcular todos possíveis movimentos e capturas do pião
function calcular_ataque_e_movimento_pecas_piao(jogando, origem, deslocamento, operador, isMovimentoPiao, borda, retornar_casas_atacadas){
  let pecas_aliada = (jogando == "w") ? estado.bitboard_brancas : estado.bitboard_pretas;
  let pecas_inimiga = (jogando == "w") ? estado.bitboard_pretas : estado.bitboard_brancas;
  let bitboard_en_passant_inimigo = (jogando == "w") ? estado.en_passant_pretas : estado.en_passant_brancas;
  let movimento_duplo = (jogando == "w") ? estado.movimento_duplo_piao_branco : estado.movimento_duplo_piao_preto;

  let movimentos = [];
  let capturas = [];
  let en_passant = [];

  // Não deixa a peça fazer um wrap de coluna
  if((origem & borda) !== 0n){
    return { todos: [], movimentos: [], capturas: [], en_passant: [] }
  }

  for(let cont = 0; cont < deslocamento.length; cont ++){
    const destino = ((operador == "<<") ? origem << deslocamento[cont] : origem >> deslocamento[cont]);

    // Peça passou do limite
    if(destino == 0n || destino > 9223372036854775808n){
      break;
    }
    // Verificando se é permitido fazer um movimento duplo
    else if((deslocamento[cont] == estado.movimento_piao[1]) && ((origem & movimento_duplo) == 0n)){
      break;
    }
    // Verificiando se a casa está ocupada por um inimigo
    else if((destino & pecas_inimiga) !== 0n){
      (isMovimentoPiao == false) && capturas.push(destino);
      break;
    }
    // Verificando se um en passant é válido (se for um pião)
    else if(isMovimentoPiao == false && (destino & bitboard_en_passant_inimigo) !== 0n){
      console.log("en passant adicionado")
      en_passant.push(destino);
      break;
    }
    // Verificando se a casa está ocupada por um aliado
    else if((destino & pecas_aliada) !== 0n){
      break;
    }
    
    // Verificando se está sendo movido ou pião ou atacando, e também se está calculando as casas atacadas/defendidas
    (isMovimentoPiao == true || retornar_casas_atacadas == true) && movimentos.push(destino);
  }

  if(movimentos.length > 0 || capturas.length > 0 || en_passant.length > 0){

    const movimentos_possiveis = {
      todos: [...movimentos, ...capturas, ...en_passant],
      movimentos: movimentos,
      capturas: capturas,
      en_passant: en_passant,
    }

    return movimentos_possiveis;
  }
  else{
    return { todos: [], movimentos: [], capturas: [], en_passant: [] }
  }

}

// Função para calcular todos possíveis movimentos e capturas das peças: Bispo, Torre, Dama e Rei
function calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, deslocamento, operador, borda){
  let pecas_aliada = (jogando == "w") ? estado.bitboard_brancas : estado.bitboard_pretas;
  let pecas_inimiga = (jogando == "w") ? estado.bitboard_pretas : estado.bitboard_brancas;

  let movimentos = [];
  let capturas = [];

  // Não deixa a peça fazer um wrap de coluna
  if((origem & borda) !== 0n){
    return { todos: [], movimentos: [], capturas: [] }
  }

  for(let cont = 0; cont < deslocamento.length; cont ++){
    const destino = ((operador == "<<") ? origem << deslocamento[cont] : origem >> deslocamento[cont]);
    
    // Peça passou do limite
    if(destino == 0n || destino > 9223372036854775808n){
      break;
    }
    // Verificiando se a casa está ocupada por um inimigo e se não está na borda
    else if(((destino & pecas_inimiga) !== 0n) && (destino & borda) !== 0n){
      capturas.push(destino);
      break;
    }
    // Verificiando se a casa está ocupada por um inimigo
    else if(((destino & pecas_inimiga) !== 0n)){
      capturas.push(destino);
      break;
    }
    // Verificando se a casa está ocupada por um aliado e se não está na borda
    else if(((destino & pecas_aliada) !== 0n)){
      break;
    }
    // Verificando se a peça está na borda
    else if((destino & borda) !== 0n){
      movimentos.push(destino);
      break;
    }
    
    movimentos.push(destino);
  }

  if(movimentos.length > 0 || capturas.length > 0){
    const movimentos_possiveis = {
      todos: [...movimentos, ...capturas],
      movimentos: movimentos,
      capturas: capturas,
    }

    return movimentos_possiveis;
  }
  else{
    return { todos: [], movimentos: [], capturas: [] }
  }
}

export class Calcular{
  static ataque_e_movimento_piao(jogando, origem, simplificar_retorno = false, retornar_casas_atacadas = false){
    let lances = {
      todos: [],
      movimentos: [],
      capturas: [],
      en_passant: [],
    };
    let retorno;

    // Calculando todos os possiveis lances

    // Brancas jogam
    if(jogando == "w"){
      retorno = calcular_ataque_e_movimento_pecas_piao(jogando, origem, estado.movimento_captura_piao_esquerda, "<<", false, (estado.bitboard_casas_coluna_A | estado.bitboard_casas_linha_8), retornar_casas_atacadas);
      lances = retorno;

      retorno = calcular_ataque_e_movimento_pecas_piao(jogando, origem, estado.movimento_captura_piao_direita, "<<", false, (estado.bitboard_casas_coluna_H | estado.bitboard_casas_linha_8), retornar_casas_atacadas);
      lances = {
        todos: [...lances.todos, ...retorno.todos],
        movimentos: [...lances.movimentos, ...retorno.movimentos],
        capturas: [...lances.capturas, ...retorno.capturas],
        en_passant: [...lances.en_passant, ...retorno.en_passant]
      }

      retorno = calcular_ataque_e_movimento_pecas_piao(jogando, origem, estado.movimento_piao, "<<", true, (estado.bitboard_casas_linha_8));
      lances = {
        todos: [...lances.todos, ...retorno.todos],
        movimentos: [...lances.movimentos, ...retorno.movimentos],
        capturas: [...lances.capturas, ...retorno.capturas],
        en_passant: [...lances.en_passant, ...retorno.en_passant]
      }
    }
    // Pretas jogam
    else{
      retorno = calcular_ataque_e_movimento_pecas_piao(jogando, origem, estado.movimento_captura_piao_esquerda, ">>", false, (estado.bitboard_casas_coluna_H | estado.bitboard_casas_linha_1), retornar_casas_atacadas);
      lances = retorno;

      retorno = calcular_ataque_e_movimento_pecas_piao(jogando, origem, estado.movimento_captura_piao_direita, ">>", false, (estado.bitboard_casas_coluna_A | estado.bitboard_casas_linha_1), retornar_casas_atacadas);
      lances = {
        todos: [...lances.todos, ...retorno.todos],
        movimentos: [...lances.movimentos, ...retorno.movimentos],
        capturas: [...lances.capturas, ...retorno.capturas],
        en_passant: [...lances.en_passant, ...retorno.en_passant]
      }

      retorno = calcular_ataque_e_movimento_pecas_piao(jogando, origem, estado.movimento_piao, ">>", true, (estado.bitboard_casas_linha_1));
      lances = {
        todos: [...lances.todos, ...retorno.todos],
        movimentos: [...lances.movimentos, ...retorno.movimentos],
        capturas: [...lances.capturas, ...retorno.capturas],
        en_passant: [...lances.en_passant, ...retorno.en_passant]
      }
    }

    if(simplificar_retorno == true){
      return lances.todos;
    }
    else{
      return lances;
    }
  }

  static ataque_e_movimento_cavalo(jogando, origem, simplificar_retorno = false){
    let retorno = {
      todos: [],
      movimentos: [],
      capturas: [],
    };
    let lances;
    
    // Calculando todos os possiveis lances
    
    retorno = calcular_ataque_e_movimento_pecas_saltitantes(jogando, origem, estado.movimento_cavalo_esquerda, "<<"),
    lances = retorno;
    
    retorno = calcular_ataque_e_movimento_pecas_saltitantes(jogando, origem, estado.movimento_cavalo_direita, "<<"),
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    }
    
    retorno = calcular_ataque_e_movimento_pecas_saltitantes(jogando, origem, estado.movimento_cavalo_esquerda, ">>");
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
      
    }
    
    retorno = calcular_ataque_e_movimento_pecas_saltitantes(jogando, origem, estado.movimento_cavalo_direita, ">>"),
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    if(simplificar_retorno == true){
      let todos = 0n;
      lances.todos.map((lance) => {
        todos |= lance;
      });
      
      return todos;
    }
    else{
      return lances;
    }
  }

  static ataque_e_movimento_bispo(jogando, origem, simplificar_retorno = false){
    let retorno = {
      todos: [],
      movimentos: [],
      capturas: [],
    };
    let lances;

    // Calculando todos os possiveis lances

    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, estado.movimento_bispo_esquerda, "<<", (estado.bitboard_casas_coluna_A | estado.bitboard_casas_linha_8)),
    lances = retorno;

    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, estado.movimento_bispo_esquerda, ">>", (estado.bitboard_casas_coluna_H | estado.bitboard_casas_linha_1)),
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, estado.movimento_bispo_direita, "<<", (estado.bitboard_casas_coluna_H | estado.bitboard_casas_linha_8)),
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, estado.movimento_bispo_direita, ">>", (estado.bitboard_casas_coluna_A | estado.bitboard_casas_linha_1)),
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    if(simplificar_retorno == true){
      return lances.todos;
    }
    else{
      return lances;
    }
  }

  static ataque_e_movimento_torre(jogando, origem, simplificar_retorno = false){
    let retorno = {
      todos: [],
      movimentos: [],
      capturas: [],
    };
    let lances;

    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, estado.movimento_torre_frente, "<<", estado.bitboard_casas_linha_8);
    lances = retorno;

    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, estado.movimento_torre_frente, ">>", estado.bitboard_casas_linha_1);
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, estado.movimento_torre_direita, "<<", estado.bitboard_casas_coluna_H);
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, estado.movimento_torre_direita, ">>", estado.bitboard_casas_coluna_A);
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    if(simplificar_retorno == true){
      return lances.todos;
    }
    else{
      return lances;
    }
  }

  static ataque_e_movimento_rainha(jogando, origem, simplificar_retorno = false){
    let retorno = {
      todos: [],
      movimentos: [],
      capturas: [],
    };
    let lances;

    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, estado.movimento_torre_frente, "<<", estado.bitboard_casas_linha_8),
    lances = retorno;

    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, estado.movimento_torre_frente, ">>", estado.bitboard_casas_linha_1),
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, estado.movimento_torre_direita, "<<", estado.bitboard_casas_coluna_H),
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, estado.movimento_torre_direita, ">>", estado.bitboard_casas_coluna_A),
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };


    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, estado.movimento_bispo_esquerda, "<<", (estado.bitboard_casas_coluna_A | estado.bitboard_casas_linha_8)),
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, estado.movimento_bispo_esquerda, ">>", (estado.bitboard_casas_coluna_H | estado.bitboard_casas_linha_1)),
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, estado.movimento_bispo_direita, "<<", (estado.bitboard_casas_coluna_H | estado.bitboard_casas_linha_8)),
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, estado.movimento_bispo_direita, ">>", (estado.bitboard_casas_coluna_A | estado.bitboard_casas_linha_1)),
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    if(simplificar_retorno == true){
      return lances.todos;
    }
    else{
      return lances;
    }
  }

  static ataque_e_movimento_rei(jogando, origem, simplificar_retorno = false){
    let retorno;
    let lances = {
      todos: [],
      movimentos: [],
      capturas: [],
      roque_esquerda: [],
      roque_direita: [],
    };;

    retorno = calcular_ataque_movimento_e_roque_peca_rei(jogando, origem, estado.movimento_rei_frente, "<<", (estado.bitboard_casas_linha_8));
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = calcular_ataque_movimento_e_roque_peca_rei(jogando, origem, estado.movimento_rei_frente_esquerda, "<<", (estado.bitboard_casas_coluna_A | estado.bitboard_casas_linha_8));
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = calcular_ataque_movimento_e_roque_peca_rei(jogando, origem, estado.movimento_rei_frente_direita, "<<", (estado.bitboard_casas_coluna_H | estado.bitboard_casas_linha_8));
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = calcular_ataque_movimento_e_roque_peca_rei(jogando, origem, estado.movimento_rei_direita, "<<", (estado.bitboard_casas_coluna_H));
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };


    retorno = calcular_ataque_movimento_e_roque_peca_rei(jogando, origem, estado.movimento_rei_frente, ">>", (estado.bitboard_casas_linha_1));
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = calcular_ataque_movimento_e_roque_peca_rei(jogando, origem, estado.movimento_rei_frente_esquerda, ">>", (estado.bitboard_casas_coluna_H | estado.bitboard_casas_linha_1));
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = calcular_ataque_movimento_e_roque_peca_rei(jogando, origem, estado.movimento_rei_frente_direita, ">>", (estado.bitboard_casas_coluna_A | estado.bitboard_casas_linha_1));
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = calcular_ataque_movimento_e_roque_peca_rei(jogando, origem, estado.movimento_rei_direita, ">>", (estado.bitboard_casas_coluna_A));
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = calcular_ataque_movimento_e_roque_peca_rei(jogando, origem, estado.movimento_rei_direita, ">>", 0n, true);
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = verificar_roque_peca_rei(jogando);
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos],
      capturas: [...lances.capturas],
      roque_esquerda: [...retorno.roque_esquerda],
      roque_direita: [...retorno.roque_direita],
    };


    if(simplificar_retorno == true){
      return lances.todos;
    }
    else{
      return lances;
    }
  }

  static calcular_todos_possiveis_movimento(){
    let movimentos_possiveis_piao_brancas = [];
    let movimentos_possiveis_cavalo_brancas = [];
    let movimentos_possiveis_bispo_brancas = [];
    let movimentos_possiveis_torre_brancas = [];
    let movimentos_possiveis_rainha_brancas = [];
    let movimentos_possiveis_rei_brancas = [];
    let movimentos_possiveis_brancas = [];

    let movimentos_possiveis_piao_pretas = [];
    let movimentos_possiveis_cavalo_pretas = [];
    let movimentos_possiveis_bispo_pretas = [];
    let movimentos_possiveis_torre_pretas = [];
    let movimentos_possiveis_rainha_pretas = [];
    let movimentos_possiveis_rei_pretas = [];
    let movimentos_possiveis_pretas = [];
    
    for(let cont = 0; cont < 64; cont++){
      let origem = BigInt(2 ** cont);

      // Verificando se é um pião das brancas
      if((origem & estado.bitboard_piao_branco) !== 0n){
        movimentos_possiveis_piao_brancas = movimentos_possiveis_piao_brancas.concat(Calcular.ataque_e_movimento_piao("w", origem, true));
      }
      else if((origem & estado.bitboard_cavalo_branco) !== 0n){
        movimentos_possiveis_cavalo_brancas = movimentos_possiveis_cavalo_brancas.concat(Calcular.ataque_e_movimento_cavalo("w", origem, true));
      }
      else if((origem & estado.bitboard_bispo_branco) !== 0n){
        movimentos_possiveis_bispo_brancas = movimentos_possiveis_bispo_brancas.concat(Calcular.ataque_e_movimento_bispo("w", origem, true));
      }
      else if((origem & estado.bitboard_torre_branco) !== 0n){
        movimentos_possiveis_torre_brancas = movimentos_possiveis_torre_brancas.concat(Calcular.ataque_e_movimento_torre("w", origem, true));
      }
      else if((origem & estado.bitboard_rainha_branco) !== 0n){
        movimentos_possiveis_rainha_brancas = movimentos_possiveis_rainha_brancas.concat(Calcular.ataque_e_movimento_rainha("w", origem, true));
      }
      else if((origem & estado.bitboard_rei_branco) !== 0n){
        movimentos_possiveis_rei_brancas = movimentos_possiveis_rei_brancas.concat(Calcular.ataque_e_movimento_rei("w", origem, true));
      }

      else if((origem & estado.bitboard_piao_preto) !== 0n){
        movimentos_possiveis_piao_pretas = movimentos_possiveis_piao_pretas.concat(Calcular.ataque_e_movimento_piao("p", origem, true));
      }
      else if((origem & estado.bitboard_cavalo_preto) !== 0n){
        movimentos_possiveis_cavalo_pretas = movimentos_possiveis_cavalo_pretas.concat(Calcular.ataque_e_movimento_cavalo("p", origem, true));
      }
      else if((origem & estado.bitboard_bispo_preto) !== 0n){
        movimentos_possiveis_bispo_pretas = movimentos_possiveis_bispo_pretas.concat(Calcular.ataque_e_movimento_bispo("p", origem, true));
      }
      else if((origem & estado.bitboard_torre_preto) !== 0n){
        movimentos_possiveis_torre_pretas = movimentos_possiveis_torre_pretas.concat(Calcular.ataque_e_movimento_torre("p", origem, true));
      }
      else if((origem & estado.bitboard_rainha_preto) !== 0n){
        movimentos_possiveis_rainha_pretas = movimentos_possiveis_rainha_pretas.concat(Calcular.ataque_e_movimento_rainha("p", origem, true));
      }
      else if((origem & estado.bitboard_rei_preto) !== 0n){
        movimentos_possiveis_rei_pretas = movimentos_possiveis_rei_pretas.concat(Calcular.ataque_e_movimento_rei("b", origem, true));
      }
    }

    movimentos_possiveis_brancas = [...movimentos_possiveis_piao_brancas, ...movimentos_possiveis_cavalo_brancas, ...movimentos_possiveis_bispo_brancas, ... movimentos_possiveis_torre_brancas, ... movimentos_possiveis_rainha_brancas, ... movimentos_possiveis_rei_brancas];
    movimentos_possiveis_pretas = [...movimentos_possiveis_piao_pretas, ...movimentos_possiveis_cavalo_pretas, ...movimentos_possiveis_bispo_pretas, ... movimentos_possiveis_torre_pretas, ... movimentos_possiveis_rainha_pretas, ... movimentos_possiveis_rei_pretas];

    const movimentos_possiveis = {
      piao_brancas: movimentos_possiveis_piao_brancas,
      piao_pretas: movimentos_possiveis_piao_pretas,

      cavalo_brancas: movimentos_possiveis_cavalo_brancas,
      cavalo_pretas: movimentos_possiveis_cavalo_pretas,

      bispo_brancas: movimentos_possiveis_bispo_brancas,
      bispo_pretas: movimentos_possiveis_bispo_pretas,

      torre_brancas: movimentos_possiveis_torre_brancas,
      torre_pretas: movimentos_possiveis_torre_pretas,

      rainha_brancas: movimentos_possiveis_rainha_brancas,
      rainha_pretas: movimentos_possiveis_rainha_pretas,

      rei_brancas: movimentos_possiveis_rei_brancas,
      rei_pretas: movimentos_possiveis_rei_pretas,

      brancas: movimentos_possiveis_brancas,
      pretas: movimentos_possiveis_pretas,
    };

    return movimentos_possiveis;
  }

  // Essa funçao é responsável por analisar todas as casas que estão sendo atacadas/defendidas pelas pretas e brancas.
  static calcular_casas_atacadas(salvar_no_estado = true){
    let movimentos_possiveis_piao_brancas = [];
    let movimentos_possiveis_cavalo_brancas = [];
    let movimentos_possiveis_bispo_brancas = [];
    let movimentos_possiveis_torre_brancas = [];
    let movimentos_possiveis_rainha_brancas = [];
    let movimentos_possiveis_rei_brancas = [];
    let movimentos_possiveis_brancas = [];

    let movimentos_possiveis_piao_pretas = [];
    let movimentos_possiveis_cavalo_pretas = [];
    let movimentos_possiveis_bispo_pretas = [];
    let movimentos_possiveis_torre_pretas = [];
    let movimentos_possiveis_rainha_pretas = [];
    let movimentos_possiveis_rei_pretas = [];
    let movimentos_possiveis_pretas = [];
    
    for(let cont = 0; cont < 64; cont++){
      let origem = BigInt(2 ** cont);

      // Verificando se é um pião das brancas
      if((origem & estado.bitboard_piao_branco) !== 0n){
        movimentos_possiveis_piao_brancas = movimentos_possiveis_piao_brancas.concat(Calcular.ataque_e_movimento_piao("w", origem, true, true));
      }
      else if((origem & estado.bitboard_cavalo_branco) !== 0n){
        movimentos_possiveis_cavalo_brancas = movimentos_possiveis_cavalo_brancas.concat(Calcular.ataque_e_movimento_cavalo("w", origem, true));
      }
      else if((origem & estado.bitboard_bispo_branco) !== 0n){
        movimentos_possiveis_bispo_brancas = movimentos_possiveis_bispo_brancas.concat(Calcular.ataque_e_movimento_bispo("w", origem, true));
      }
      else if((origem & estado.bitboard_torre_branco) !== 0n){
        movimentos_possiveis_torre_brancas = movimentos_possiveis_torre_brancas.concat(Calcular.ataque_e_movimento_torre("w", origem, true));
      }
      else if((origem & estado.bitboard_rainha_branco) !== 0n){
        movimentos_possiveis_rainha_brancas = movimentos_possiveis_rainha_brancas.concat(Calcular.ataque_e_movimento_rainha("w", origem, true));
      }
      else if((origem & estado.bitboard_rei_branco) !== 0n){
        movimentos_possiveis_rei_brancas = movimentos_possiveis_rei_brancas.concat(Calcular.ataque_e_movimento_rei("w", origem, true));
      }

      else if((origem & estado.bitboard_piao_preto) !== 0n){
        movimentos_possiveis_piao_pretas = movimentos_possiveis_piao_pretas.concat(Calcular.ataque_e_movimento_piao("p", origem, true, true));
      }
      else if((origem & estado.bitboard_cavalo_preto) !== 0n){
        movimentos_possiveis_cavalo_pretas = movimentos_possiveis_cavalo_pretas.concat(Calcular.ataque_e_movimento_cavalo("p", origem, true));
      }
      else if((origem & estado.bitboard_bispo_preto) !== 0n){
        movimentos_possiveis_bispo_pretas = movimentos_possiveis_bispo_pretas.concat(Calcular.ataque_e_movimento_bispo("p", origem, true));
      }
      else if((origem & estado.bitboard_torre_preto) !== 0n){
        movimentos_possiveis_torre_pretas = movimentos_possiveis_torre_pretas.concat(Calcular.ataque_e_movimento_torre("p", origem, true));
      }
      else if((origem & estado.bitboard_rainha_preto) !== 0n){
        movimentos_possiveis_rainha_pretas = movimentos_possiveis_rainha_pretas.concat(Calcular.ataque_e_movimento_rainha("p", origem, true));
      }
      else if((origem & estado.bitboard_rei_preto) !== 0n){
        movimentos_possiveis_rei_pretas = movimentos_possiveis_rei_pretas.concat(Calcular.ataque_e_movimento_rei("b", origem, true));
      }
    }

    movimentos_possiveis_brancas = [...movimentos_possiveis_piao_brancas, ...movimentos_possiveis_cavalo_brancas, ...movimentos_possiveis_bispo_brancas, ... movimentos_possiveis_torre_brancas, ... movimentos_possiveis_rainha_brancas, ... movimentos_possiveis_rei_brancas];
    movimentos_possiveis_pretas = [...movimentos_possiveis_piao_pretas, ...movimentos_possiveis_cavalo_pretas, ...movimentos_possiveis_bispo_pretas, ... movimentos_possiveis_torre_pretas, ... movimentos_possiveis_rainha_pretas, ... movimentos_possiveis_rei_pretas];

    // Limpando a contagem anterior
    estado.casas_atacadas_pelas_brancas = 0n;
    estado.casas_atacadas_pelas_pretas = 0n

    if(salvar_no_estado == true){
      movimentos_possiveis_brancas.map((movimento) => {
        estado.casas_atacadas_pelas_brancas |= movimento;
      });
      movimentos_possiveis_pretas.map((movimento) => {
        estado.casas_atacadas_pelas_pretas |= movimento;
      });

    console.log("Todos")
    console.log(visualizadeiro(estado.casas_atacadas_pelas_brancas));
    }

    console.log(visualizadeiro(estado.casas_atacadas_pelas_brancas));

    return { movimentos_possiveis_brancas, movimentos_possiveis_pretas };
  }

  static verificar_rei_atacado(jogando){
    // Brancas jogam
    if(jogando == "w"){
      if(estado.bitboard_rei_branco & estado.casas_atacadas_pelas_pretas){
        return true;
      }
      else{
        return false;
      }
    }

    // Pretas jogam
    else{
      if(estado.bitboard_rei_preto & estado.casas_atacadas_pelas_brancas){
        return true;
      }
      else{
        return false;
      }
    }
  }

  static calcular_defesa_rei(jogando, movimentos_possiveis){
    const movimentos_possiveis_defender_rei = [];
    // Backup dos valores originais
    const bitboard_piao_branco = estado.bitboard_piao_branco;
    const bitboard_cavalo_branco = estado.bitboard_cavalo_branco;
    const bitboard_bispo_branco = estado.bitboard_bispo_branco;
    const bitboard_torre_branco = estado.bitboard_torre_branco;
    const bitboard_rainha_branco = estado.bitboard_rainha_branco;
    const bitboard_rei_branco = estado.bitboard_rei_branco;
    const bitboard_piao_preto = estado.bitboard_piao_preto;
    const bitboard_cavalo_preto = estado.bitboard_cavalo_preto;
    const bitboard_bispo_preto = estado.bitboard_bispo_preto;
    const bitboard_torre_preto = estado.bitboard_torre_preto;
    const bitboard_rainha_preto = estado.bitboard_rainha_preto;
    const bitboard_rei_preto = estado.bitboard_rei_preto;
    const bitboard_tabuleiro = estado.bitboard_tabuleiro;
    const bitboard_brancas = estado.bitboard_brancas;
    const bitboard_pretas = estado.bitboard_pretas;
    
    // Brancas jogam
    if(jogando == "w"){
      
      // Verificando cada possível jogada para defender o rei
      movimentos_possiveis.brancas.map((movimento) => {
        if(this.verificar_se_o_movimento_defende_o_rei("w", bitboard_teste_todas_pecas_brancas, null)){
          console.log("Esse movimento defende o rei")
          movimentos_possiveis_defender_rei.push(movimento);
        }
      });

      if(movimentos_possiveis_defender_rei.length == 0){
        console.log("Cheque mate");
      }

    }
    // Pretas jogam
    else{
    }

    return movimentos_possiveis_defender_rei;
  }
}