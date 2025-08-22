// Arquivo responsável por realizar os calculos (possibilidades de movimento)
import { atualizarTabuleiro, descobrir_peca, efetuar_captura, efetuar_movimento, Piao, Rei } from "./movimentacao.js";
import { converter } from "./traducao.js";
import { partida, partida_virtual, informacoes_xadrez, sincronizar_simulado_com_estado } from './variaveis.js'
import { visualizadeiro } from './visualizador.js';

// Função para calcular todos possíveis movimentos e capturas do cavalo
function calcular_ataque_e_movimento_pecas_saltitantes(jogando, origem, deslocamento, operador, calculando_casas_atacadas = false){
  let pecas_aliada = (jogando == "w") ? partida_virtual.bitboard_de_todas_pecas_brancas : partida_virtual.bitboard_de_todas_pecas_pretas;
  let pecas_inimiga = (jogando == "w") ? partida_virtual.bitboard_de_todas_pecas_pretas : partida_virtual.bitboard_de_todas_pecas_brancas;
  
  let movimentos = [];
  let capturas = [];

  for(let cont = 0; cont < deslocamento.length; cont ++){
    const destino = ((operador == "<<") ? origem << deslocamento[cont] : origem >> deslocamento[cont]);
    
    // Verificando se a peça passou do limite do tabuleiro
    if(destino == 0n || destino > 9223372036854775808n){
      continue;
    }
    // Verificando se foi feito um wrap de coluna (canto esquerdo para o canto direito)
    else if(((origem & informacoes_xadrez.bitboard_casas_coluna_canto_esquerdo) !== 0n) && (destino & informacoes_xadrez.bitboard_casas_coluna_canto_direito) !== 0n){
      continue;
    }
    // Verificando se foi feito um wrap de coluna (canto direito para o canto esquerdo)
    else if(((origem & informacoes_xadrez.bitboard_casas_coluna_canto_direito) !== 0n) && (destino & informacoes_xadrez.bitboard_casas_coluna_canto_esquerdo) !== 0n){
      continue;
    }
    // Verificiando se a casa está ocupada por um inimigo
    else if((destino & pecas_inimiga) !== 0n){
      if(calculando_casas_atacadas == false){
        efetuar_captura(origem, destino, "n");
        Calcular.calcular_casas_atacadas();
        if(Calcular.verificar_rei_atacado(partida.jogando) == false){
          capturas.push(destino);
        }
        sincronizar_simulado_com_estado();
      }
      else{
        capturas.push(destino);
      }
      continue;
    }
    // Verificando se a casa está ocupada por um aliado
    else if((destino & pecas_aliada) !== 0n){
      continue;
    }

    if(calculando_casas_atacadas == false){
        efetuar_movimento(origem, destino, "n");
        Calcular.calcular_casas_atacadas();
        if(Calcular.verificar_rei_atacado(partida.jogando) == false){
          movimentos.push(destino);
        }
        sincronizar_simulado_com_estado();
      }
      else{
        movimentos.push(destino);
      }
      continue;

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

function verificar_roque_peca_rei_esquerda(jogando){
  let tabuleiro_todo = (partida_virtual.bitboard_de_todas_pecas_brancas | partida_virtual.bitboard_de_todas_pecas_pretas);
  let casas_atacadas_inimigo = (jogando == "w") ? partida_virtual.casas_atacadas_pelas_pretas : partida_virtual.casas_atacadas_pelas_brancas;
  let casas_que_nao_podem_estar_sendo_atacadas_pelo_inimigo_esquerda = (jogando == "w") ? informacoes_xadrez.casas_que_nao_podem_estar_sendo_atacadas_para_fazer_o_roque_esquerda_branco : informacoes_xadrez.casas_que_nao_podem_estar_sendo_atacadas_para_fazer_o_roque_esquerda_preto;
  let bitboard_torres = (jogando == "w") ? partida_virtual.bitboard_torre_branco : partida_virtual.bitboard_torre_preto;
  let status_rei_em_ataque = (jogando == "w") ? partida_virtual.rei_branco_em_ataque : partida_virtual.rei_preto_em_ataque;

  let casas_livre_para_o_roque_esquerda = (jogando == "w") ? informacoes_xadrez.casas_que_deve_estar_vazio_para_fazer_o_roque_esquerda_branco : informacoes_xadrez.casas_que_deve_estar_vazio_para_fazer_o_roque_esquerda_preto;
  let status_roque_esquerda = (jogando == "w") ? partida.status_roque_esquerda_branco : partida.status_roque_esquerda_preto;
  let casas_roque_rei_esquerda = (jogando == "w") ? informacoes_xadrez.casa_onde_o_rei_vai_ficar_no_roque_esquerda_branco : informacoes_xadrez.casa_onde_o_rei_vai_ficar_no_roque_esquerda_preto;
  let casa_onde_a_torre_deve_estar_para_fazer_o_roque_esquerda = (jogando == "w") ? informacoes_xadrez.casa_onde_a_torre_deve_estar_para_fazer_roque_esquerda_branco : informacoes_xadrez.casa_onde_a_torre_deve_estar_para_fazer_roque_esquerda_preto;

  let roque_esquerda = [];

  let algum_erro_encontrado_no_roque_esquerdo = false;

  // Verificando se o rei está em xeque
  if(status_rei_em_ataque == true){
    return { roque_esquerda: [] }
  }
  
  // Verificando o status do roque
  if(status_roque_esquerda == false){
    algum_erro_encontrado_no_roque_esquerdo = true;
  }
  // Verificando se existe alguma peça (alida ou inimiga) entre o rei e a torre
  else if((casas_livre_para_o_roque_esquerda & tabuleiro_todo) != 0n){
    algum_erro_encontrado_no_roque_esquerdo = true;
  }
  // Verificando se a torre está na casa inicial corretamente
  else if((bitboard_torres & casa_onde_a_torre_deve_estar_para_fazer_o_roque_esquerda) == 0n){
    algum_erro_encontrado_no_roque_esquerdo = true;
  }
  // Verificando se as casas essenciais estão sendo atacadas por algum inimigo
  else if((casas_atacadas_inimigo & casas_que_nao_podem_estar_sendo_atacadas_pelo_inimigo_esquerda) !== 0n){
    algum_erro_encontrado_no_roque_esquerdo = true;
  }

  // Verifica se é possível fazer roque na esquerda
  if(algum_erro_encontrado_no_roque_esquerdo == false){
    roque_esquerda.push(casas_roque_rei_esquerda);
  }

  if(roque_esquerda.length > 0){
    const movimentos_possiveis = {
      roque_esquerda: roque_esquerda,
    }

    return movimentos_possiveis;
  }
  else{
    return { roque_esquerda: [] }
  }
}

function verificar_roque_peca_rei_direita(jogando){

  let tabuleiro_todo = (partida_virtual.bitboard_de_todas_pecas_brancas | partida_virtual.bitboard_de_todas_pecas_pretas);
  let casas_atacadas_inimigo = (jogando == "w") ? partida_virtual.casas_atacadas_pelas_pretas : partida_virtual.casas_atacadas_pelas_brancas;
  let bitboard_torres = (jogando == "w") ? partida_virtual.bitboard_torre_branco : partida_virtual.bitboard_torre_preto;
  let status_rei_em_ataque = (jogando == "w") ? partida_virtual.rei_branco_em_ataque : partida_virtual.rei_preto_em_ataque;

  let casas_livre_para_o_roque_direita = (jogando == "w") ? informacoes_xadrez.casas_que_deve_estar_vazio_para_fazer_o_roque_direita_branco : informacoes_xadrez.casas_que_deve_estar_vazio_para_fazer_o_roque_direita_preto;
  let status_roque_direita = (jogando == "w") ? partida.status_roque_direita_branco : partida.status_roque_direita_preto;
  let casas_roque_rei_direita = (jogando == "w") ? informacoes_xadrez.casa_onde_o_rei_vai_ficar_no_roque_direita_branco : informacoes_xadrez.casa_onde_o_rei_vai_ficar_no_roque_direita_preto;
  let casa_onde_a_torre_deve_estar_para_fazer_o_roque_direita = (jogando == "w") ? informacoes_xadrez.casa_onde_a_torre_deve_estar_para_fazer_roque_direita_branco : informacoes_xadrez.casa_onde_a_torre_deve_estar_para_fazer_roque_direita_preto;

  let roque_direita = [];

  let algum_erro_encontrado_no_roque_direito = false;

  // Verificando se o rei está em xeque
  if(status_rei_em_ataque == true){
    return { roque_direita: [] }
  }

  // Verificando o status do roque
  if(status_roque_direita == false){
    algum_erro_encontrado_no_roque_direito = true;
  }
  // Verificando se existe alguma peça (alida ou inimiga) entre o rei e a torre
  else if((casas_livre_para_o_roque_direita & tabuleiro_todo) != 0n){
    algum_erro_encontrado_no_roque_direito = true;
  }
  // Verificando se a torre está na casa inicial corretamente
  else if((bitboard_torres & casa_onde_a_torre_deve_estar_para_fazer_o_roque_direita) == 0n){
    algum_erro_encontrado_no_roque_direito = true;
  }
  // Verificando se as casas essenciais estão sendo atacadas por algum inimigo. OBS: Está sendo usado "casas_livre_para...", porque é as mesmas casas.
  else if((casas_atacadas_inimigo & casas_livre_para_o_roque_direita) !== 0n){
    algum_erro_encontrado_no_roque_direito = true;
  }

  // Verifica se é possível fazer roque
  if(algum_erro_encontrado_no_roque_direito == false){
    roque_direita.push(casas_roque_rei_direita);
  }

  if(roque_direita.length > 0){
    const movimentos_possiveis = {
      roque_direita: roque_direita,
    }

    return movimentos_possiveis;
  }
  else{
    return { roque_direita: [] }
  }
}

function calcular_ataque_e_movimento_peca_rei(jogando, origem, deslocamento, operador, borda, calculando_casas_atacadas = false){
  let pecas_aliada = (jogando == "w") ? partida_virtual.bitboard_de_todas_pecas_brancas : partida_virtual.bitboard_de_todas_pecas_pretas;
  let pecas_inimiga = (jogando == "w") ? partida_virtual.bitboard_de_todas_pecas_pretas : partida_virtual.bitboard_de_todas_pecas_brancas;
  let casas_atacadas = (jogando == "w") ? partida_virtual.casas_atacadas_pelas_pretas : partida_virtual.casas_atacadas_pelas_brancas;

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
      if(calculando_casas_atacadas == false){
        efetuar_captura(origem, destino, "k");
        Calcular.calcular_casas_atacadas();
        if(Calcular.verificar_rei_atacado(partida.jogando) == false){
          capturas.push(destino);
        }
        sincronizar_simulado_com_estado();
      }
      else{
        capturas.push(destino);
      }
    }
    // Verificiando se a casa está ocupada por um inimigo
    else if(((destino & pecas_inimiga) !== 0n)){
      if(calculando_casas_atacadas == false){
        efetuar_captura(origem, destino, "k");
        Calcular.calcular_casas_atacadas();
        if(Calcular.verificar_rei_atacado(partida.jogando) == false){
          capturas.push(destino);
        }
        sincronizar_simulado_com_estado();
      }
      else{
        capturas.push(destino);
      }
      break;
    }
    // Verificando se a casa está ocupada por um aliado e se não está na borda
    else if(((destino & pecas_aliada) !== 0n)){
      break;
    }
    // Verificando se a peça está na borda
    else if((destino & borda) !== 0n){
      if(calculando_casas_atacadas == false){
        efetuar_movimento(origem, destino, "k");
        Calcular.calcular_casas_atacadas();
        if(Calcular.verificar_rei_atacado(partida.jogando) == false){
          movimentos.push(destino);
        }
        sincronizar_simulado_com_estado();
      }
      else{
        movimentos.push(destino);
      }

      break;
    }

    if(calculando_casas_atacadas == false){
      efetuar_movimento(origem, destino, "k");
      Calcular.calcular_casas_atacadas();
      if(Calcular.verificar_rei_atacado(partida.jogando) == false){
        movimentos.push(destino);
      }
      sincronizar_simulado_com_estado();
    }
    else{
      movimentos.push(destino);
    }
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
function calcular_ataque_e_movimento_pecas_piao(jogando, origem, deslocamento, operador, isMovimentoPiao, borda, calculando_casas_atacadas = false){
  let pecas_aliada = (jogando == "w") ? partida_virtual.bitboard_de_todas_pecas_brancas : partida_virtual.bitboard_de_todas_pecas_pretas;
  let pecas_inimiga = (jogando == "w") ? partida_virtual.bitboard_de_todas_pecas_pretas : partida_virtual.bitboard_de_todas_pecas_brancas;
  let bitboard_en_passant_inimigo = (jogando == "w") ? partida_virtual.en_passant_pretas : partida_virtual.en_passant_brancas;
  let movimento_duplo = (jogando == "w") ? informacoes_xadrez.movimento_duplo_piao_branco : informacoes_xadrez.movimento_duplo_piao_preto;

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
    else if((deslocamento[cont] == informacoes_xadrez.movimento_piao[1]) && ((origem & movimento_duplo) == 0n)){
      break;
    }
    // Verificiando se a casa está ocupada por um inimigo
    else if((destino & pecas_inimiga) !== 0n){
      if(calculando_casas_atacadas == false){
        efetuar_captura(origem, destino, "p");
        Calcular.calcular_casas_atacadas();
        if(Calcular.verificar_rei_atacado(partida.jogando) == false){
          capturas.push(destino);
        }
        sincronizar_simulado_com_estado()
      }
      else{
        capturas.push(destino);
      }
      break;
    }
    // Verificando se um en passant é válido (se for um pião)
    else if(isMovimentoPiao == false && (destino & bitboard_en_passant_inimigo) !== 0n){
      if(calculando_casas_atacadas == false){
        Piao.efetuar_en_passant(origem, destino);
        Calcular.calcular_casas_atacadas();
        if(Calcular.verificar_rei_atacado(partida.jogando) == false){
          en_passant.push(destino);
        }
        sincronizar_simulado_com_estado()
      }
      else{
        en_passant.push(destino);
      }
      break;
    }
    // Verificando se a casa está ocupada por um aliado
    else if((destino & pecas_aliada) !== 0n){
      break;
    }

    if(isMovimentoPiao == true && calculando_casas_atacadas == false){
      efetuar_movimento(origem, destino, "p");
      Calcular.calcular_casas_atacadas();
      if(Calcular.verificar_rei_atacado(partida.jogando) == false){
        movimentos.push(destino);
      }
      sincronizar_simulado_com_estado();
    }
    else if(calculando_casas_atacadas == true){
      movimentos.push(destino);
    }
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
function calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, deslocamento, operador, borda, peca = null, calculando_casas_atacadas = false){
  let pecas_aliada = (jogando == "w") ? partida_virtual.bitboard_de_todas_pecas_brancas : partida_virtual.bitboard_de_todas_pecas_pretas;
  let pecas_inimiga = (jogando == "w") ? partida_virtual.bitboard_de_todas_pecas_pretas : partida_virtual.bitboard_de_todas_pecas_brancas;

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
      if(calculando_casas_atacadas == false){
        efetuar_captura(origem, destino, peca);
        Calcular.calcular_casas_atacadas();
        if(Calcular.verificar_rei_atacado(partida.jogando) == false){
          capturas.push(destino);
        }
        sincronizar_simulado_com_estado();
      }
      else{
        capturas.push(destino);
      }

      break;
    }
    // Verificiando se a casa está ocupada por um inimigo
    else if(((destino & pecas_inimiga) !== 0n)){
      if(calculando_casas_atacadas == false){
        efetuar_captura(origem, destino, peca);
        Calcular.calcular_casas_atacadas();
        if(Calcular.verificar_rei_atacado(partida.jogando) == false){
          capturas.push(destino);
        }
        sincronizar_simulado_com_estado();
      }
      else{
        capturas.push(destino);
      }

      break;
    }
    // Verificando se a casa está ocupada por um aliado e se não está na borda
    else if(((destino & pecas_aliada) !== 0n)){
      break;
    }
    // Verificando se a peça está na borda
    else if((destino & borda) !== 0n){
      if(calculando_casas_atacadas == false){
        efetuar_movimento(origem, destino, peca);
        Calcular.calcular_casas_atacadas();
        if(Calcular.verificar_rei_atacado(partida.jogando) == false){
          movimentos.push(destino);
        }
        sincronizar_simulado_com_estado();
      }
      else{
        movimentos.push(destino);
      }

      break;
    }
    
    if(calculando_casas_atacadas == false){
      efetuar_movimento(origem, destino, peca);
      Calcular.calcular_casas_atacadas();
      if(Calcular.verificar_rei_atacado(partida.jogando) == false){
        movimentos.push(destino);
      }
      sincronizar_simulado_com_estado();
    }
    else{
      movimentos.push(destino);
    }
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
  static ataque_e_movimento_piao(jogando, origem, simplificar_retorno = false, calculando_casas_atacadas = false){
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
      retorno = calcular_ataque_e_movimento_pecas_piao(jogando, origem, informacoes_xadrez.movimento_captura_piao_esquerda, "<<", false, (informacoes_xadrez.bitboard_casas_coluna_A | informacoes_xadrez.bitboard_casas_linha_8), calculando_casas_atacadas);
      lances = retorno;

      retorno = calcular_ataque_e_movimento_pecas_piao(jogando, origem, informacoes_xadrez.movimento_captura_piao_direita, "<<", false, (informacoes_xadrez.bitboard_casas_coluna_H | informacoes_xadrez.bitboard_casas_linha_8), calculando_casas_atacadas);
      lances = {
        todos: [...lances.todos, ...retorno.todos],
        movimentos: [...lances.movimentos, ...retorno.movimentos],
        capturas: [...lances.capturas, ...retorno.capturas],
        en_passant: [...lances.en_passant, ...retorno.en_passant]
      }

      retorno = calcular_ataque_e_movimento_pecas_piao(jogando, origem, informacoes_xadrez.movimento_piao, "<<", true, (informacoes_xadrez.bitboard_casas_linha_8), calculando_casas_atacadas);
      lances = {
        todos: [...lances.todos, ...retorno.todos],
        movimentos: [...lances.movimentos, ...retorno.movimentos],
        capturas: [...lances.capturas, ...retorno.capturas],
        en_passant: [...lances.en_passant, ...retorno.en_passant]
      }
    }
    // Pretas jogam
    else{
      retorno = calcular_ataque_e_movimento_pecas_piao(jogando, origem, informacoes_xadrez.movimento_captura_piao_esquerda, ">>", false, (informacoes_xadrez.bitboard_casas_coluna_H | informacoes_xadrez.bitboard_casas_linha_1), calculando_casas_atacadas);
      lances = retorno;

      retorno = calcular_ataque_e_movimento_pecas_piao(jogando, origem, informacoes_xadrez.movimento_captura_piao_direita, ">>", false, (informacoes_xadrez.bitboard_casas_coluna_A | informacoes_xadrez.bitboard_casas_linha_1), calculando_casas_atacadas);
      lances = {
        todos: [...lances.todos, ...retorno.todos],
        movimentos: [...lances.movimentos, ...retorno.movimentos],
        capturas: [...lances.capturas, ...retorno.capturas],
        en_passant: [...lances.en_passant, ...retorno.en_passant]
      }

      retorno = calcular_ataque_e_movimento_pecas_piao(jogando, origem, informacoes_xadrez.movimento_piao, ">>", true, (informacoes_xadrez.bitboard_casas_linha_1), calculando_casas_atacadas);
      lances = {
        todos: [...lances.todos, ...retorno.todos],
        movimentos: [...lances.movimentos, ...retorno.movimentos],
        capturas: [...lances.capturas, ...retorno.capturas],
        en_passant: [...lances.en_passant, ...retorno.en_passant]
      }
    }

    if(calculando_casas_atacadas == true){
      return lances.capturas.concat(lances.en_passant)
    }
    else if(simplificar_retorno == true){
      return lances.todos;
    }
    else{
      return lances;
    }
  }

  static ataque_e_movimento_cavalo(jogando, origem, simplificar_retorno = false, calculando_casas_atacadas = false){
    let retorno = {
      todos: [],
      movimentos: [],
      capturas: [],
    };
    let lances;
    
    // Calculando todos os possiveis lances
    
    retorno = calcular_ataque_e_movimento_pecas_saltitantes(jogando, origem, informacoes_xadrez.movimento_cavalo_esquerda, "<<", calculando_casas_atacadas),
    lances = retorno;
    
    retorno = calcular_ataque_e_movimento_pecas_saltitantes(jogando, origem, informacoes_xadrez.movimento_cavalo_direita, "<<", calculando_casas_atacadas),
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    }
    
    retorno = calcular_ataque_e_movimento_pecas_saltitantes(jogando, origem, informacoes_xadrez.movimento_cavalo_esquerda, ">>", calculando_casas_atacadas);
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
      
    }
    
    retorno = calcular_ataque_e_movimento_pecas_saltitantes(jogando, origem, informacoes_xadrez.movimento_cavalo_direita, ">>", calculando_casas_atacadas),
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

  static ataque_e_movimento_bispo(jogando, origem, simplificar_retorno = false, calculando_casas_atacadas = false){
    let retorno = {
      todos: [],
      movimentos: [],
      capturas: [],
    };
    let lances;

    // Calculando todos os possiveis lances

    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, informacoes_xadrez.movimento_bispo_esquerda, "<<", (informacoes_xadrez.bitboard_casas_coluna_A | informacoes_xadrez.bitboard_casas_linha_8), "b", calculando_casas_atacadas),
    lances = retorno;

    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, informacoes_xadrez.movimento_bispo_esquerda, ">>", (informacoes_xadrez.bitboard_casas_coluna_H | informacoes_xadrez.bitboard_casas_linha_1), "b", calculando_casas_atacadas),
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, informacoes_xadrez.movimento_bispo_direita, "<<", (informacoes_xadrez.bitboard_casas_coluna_H | informacoes_xadrez.bitboard_casas_linha_8), "b", calculando_casas_atacadas),
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, informacoes_xadrez.movimento_bispo_direita, ">>", (informacoes_xadrez.bitboard_casas_coluna_A | informacoes_xadrez.bitboard_casas_linha_1), "b", calculando_casas_atacadas),
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

  static ataque_e_movimento_torre(jogando, origem, simplificar_retorno = false, calculando_casas_atacadas = false){
    let retorno = {
      todos: [],
      movimentos: [],
      capturas: [],
    };
    let lances;

    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, informacoes_xadrez.movimento_torre_frente, "<<", informacoes_xadrez.bitboard_casas_linha_8, "r", calculando_casas_atacadas);
    lances = retorno;

    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, informacoes_xadrez.movimento_torre_frente, ">>", informacoes_xadrez.bitboard_casas_linha_1, "r", calculando_casas_atacadas);
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, informacoes_xadrez.movimento_torre_direita, "<<", informacoes_xadrez.bitboard_casas_coluna_H, "r", calculando_casas_atacadas);
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, informacoes_xadrez.movimento_torre_direita, ">>", informacoes_xadrez.bitboard_casas_coluna_A, "r", calculando_casas_atacadas);
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

  static ataque_e_movimento_rainha(jogando, origem, simplificar_retorno = false, calculando_casas_atacadas = false){
    let retorno = {
      todos: [],
      movimentos: [],
      capturas: [],
    };
    let lances;

    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, informacoes_xadrez.movimento_torre_frente, "<<", informacoes_xadrez.bitboard_casas_linha_8, "q", calculando_casas_atacadas),
    lances = retorno;

    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, informacoes_xadrez.movimento_torre_frente, ">>", informacoes_xadrez.bitboard_casas_linha_1, "q", calculando_casas_atacadas),
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, informacoes_xadrez.movimento_torre_direita, "<<", informacoes_xadrez.bitboard_casas_coluna_H, "q", calculando_casas_atacadas),
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, informacoes_xadrez.movimento_torre_direita, ">>", informacoes_xadrez.bitboard_casas_coluna_A, "q", calculando_casas_atacadas),
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };


    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, informacoes_xadrez.movimento_bispo_esquerda, "<<", (informacoes_xadrez.bitboard_casas_coluna_A | informacoes_xadrez.bitboard_casas_linha_8), "q", calculando_casas_atacadas),
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, informacoes_xadrez.movimento_bispo_esquerda, ">>", (informacoes_xadrez.bitboard_casas_coluna_H | informacoes_xadrez.bitboard_casas_linha_1), "q", calculando_casas_atacadas),
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, informacoes_xadrez.movimento_bispo_direita, "<<", (informacoes_xadrez.bitboard_casas_coluna_H | informacoes_xadrez.bitboard_casas_linha_8), "q", calculando_casas_atacadas),
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = calcular_ataque_e_movimento_pecas_deslizantes(jogando, origem, informacoes_xadrez.movimento_bispo_direita, ">>", (informacoes_xadrez.bitboard_casas_coluna_A | informacoes_xadrez.bitboard_casas_linha_1), "q", calculando_casas_atacadas),
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

  static ataque_e_movimento_rei(jogando, origem, simplificar_retorno = false, calculando_casas_atacadas = false){
    let retorno;
    let lances = {
      todos: [],
      movimentos: [],
      capturas: [],
      roque_esquerda: [],
      roque_direita: [],
    };

    
    retorno = calcular_ataque_e_movimento_peca_rei(jogando, origem, informacoes_xadrez.movimento_rei_frente, "<<", (informacoes_xadrez.bitboard_casas_linha_8), calculando_casas_atacadas);
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };
    
    retorno = calcular_ataque_e_movimento_peca_rei(jogando, origem, informacoes_xadrez.movimento_rei_frente_esquerda, "<<", (informacoes_xadrez.bitboard_casas_coluna_A | informacoes_xadrez.bitboard_casas_linha_8), calculando_casas_atacadas);
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };
    
    retorno = calcular_ataque_e_movimento_peca_rei(jogando, origem, informacoes_xadrez.movimento_rei_frente_direita, "<<", (informacoes_xadrez.bitboard_casas_coluna_H | informacoes_xadrez.bitboard_casas_linha_8), calculando_casas_atacadas);
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };
    
    retorno = calcular_ataque_e_movimento_peca_rei(jogando, origem, informacoes_xadrez.movimento_rei_direita, "<<", (informacoes_xadrez.bitboard_casas_coluna_H), calculando_casas_atacadas);
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = calcular_ataque_e_movimento_peca_rei(jogando, origem, informacoes_xadrez.movimento_rei_frente, ">>", (informacoes_xadrez.bitboard_casas_linha_1), calculando_casas_atacadas);
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = calcular_ataque_e_movimento_peca_rei(jogando, origem, informacoes_xadrez.movimento_rei_frente_esquerda, ">>", (informacoes_xadrez.bitboard_casas_coluna_H | informacoes_xadrez.bitboard_casas_linha_1), calculando_casas_atacadas);
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = calcular_ataque_e_movimento_peca_rei(jogando, origem, informacoes_xadrez.movimento_rei_frente_direita, ">>", (informacoes_xadrez.bitboard_casas_coluna_A | informacoes_xadrez.bitboard_casas_linha_1), calculando_casas_atacadas);
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = calcular_ataque_e_movimento_peca_rei(jogando, origem, informacoes_xadrez.movimento_rei_direita, ">>", (informacoes_xadrez.bitboard_casas_coluna_A), calculando_casas_atacadas);
    lances = {
      todos: [...lances.todos, ...retorno.todos],
      movimentos: [...lances.movimentos, ...retorno.movimentos],
      capturas: [...lances.capturas, ...retorno.capturas],
    };

    retorno = verificar_roque_peca_rei_esquerda(jogando);
    lances = {
      todos: [...lances.todos, ...retorno.roque_esquerda],
      movimentos: [...lances.movimentos],
      capturas: [...lances.capturas],
      roque_esquerda: [...retorno.roque_esquerda],
    };

    retorno = verificar_roque_peca_rei_direita(jogando);
    lances = {
      todos: [...lances.todos, ...retorno.roque_direita],
      movimentos: [...lances.movimentos],
      capturas: [...lances.capturas],
      roque_esquerda: [...lances.roque_esquerda],
      roque_direita: [...retorno.roque_direita],
    };

    if(simplificar_retorno == true){
      return lances.todos;
    }
    else{
      return lances;
    }
  }

  static calcular_todos_possiveis_movimento(jogando){
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
      if((origem & partida_virtual.bitboard_piao_branco) !== 0n && jogando == "w"){
        movimentos_possiveis_piao_brancas = movimentos_possiveis_piao_brancas.concat({origem: origem, destino: Calcular.ataque_e_movimento_piao("w", origem, false)});
      }
      else if((origem & partida_virtual.bitboard_cavalo_branco) !== 0n && jogando == "w"){
        movimentos_possiveis_cavalo_brancas = movimentos_possiveis_cavalo_brancas.concat({origem: origem, destino: Calcular.ataque_e_movimento_cavalo("w", origem, false)});
      }
      else if((origem & partida_virtual.bitboard_bispo_branco) !== 0n && jogando == "w"){
        movimentos_possiveis_bispo_brancas = movimentos_possiveis_bispo_brancas.concat({origem: origem, destino: Calcular.ataque_e_movimento_bispo("w", origem, false)});
      }
      else if((origem & partida_virtual.bitboard_torre_branco) !== 0n && jogando == "w"){
        movimentos_possiveis_torre_brancas = movimentos_possiveis_torre_brancas.concat({origem: origem, destino: Calcular.ataque_e_movimento_torre("w", origem, false)});
      }
      else if((origem & partida_virtual.bitboard_rainha_branco) !== 0n && jogando == "w"){
        movimentos_possiveis_rainha_brancas = movimentos_possiveis_rainha_brancas.concat({origem: origem, destino: Calcular.ataque_e_movimento_rainha("w", origem, false)});
      }
      else if((origem & partida_virtual.bitboard_rei_branco) !== 0n && jogando == "w"){
        movimentos_possiveis_rei_brancas = movimentos_possiveis_rei_brancas.concat({origem: origem, destino: Calcular.ataque_e_movimento_rei("w", origem, false)});
      }

      else if((origem & partida_virtual.bitboard_piao_preto) !== 0n && jogando == "b"){
        movimentos_possiveis_piao_pretas = movimentos_possiveis_piao_pretas.concat({origem: origem, destino: Calcular.ataque_e_movimento_piao("b", origem, false)});
      }
      else if((origem & partida_virtual.bitboard_cavalo_preto) !== 0n && jogando == "b"){
        movimentos_possiveis_cavalo_pretas = movimentos_possiveis_cavalo_pretas.concat({origem: origem, destino: Calcular.ataque_e_movimento_cavalo("b", origem, false)});
      }
      else if((origem & partida_virtual.bitboard_bispo_preto) !== 0n && jogando == "b"){
        movimentos_possiveis_bispo_pretas = movimentos_possiveis_bispo_pretas.concat({origem: origem, destino: Calcular.ataque_e_movimento_bispo("b", origem, false)});
      }
      else if((origem & partida_virtual.bitboard_torre_preto) !== 0n && jogando == "b"){
        movimentos_possiveis_torre_pretas = movimentos_possiveis_torre_pretas.concat({origem: origem, destino: Calcular.ataque_e_movimento_torre("b", origem, false)});
      }
      else if((origem & partida_virtual.bitboard_rainha_preto) !== 0n && jogando == "b"){
        movimentos_possiveis_rainha_pretas = movimentos_possiveis_rainha_pretas.concat({origem: origem, destino: Calcular.ataque_e_movimento_rainha("b", origem, false)});
      }
      else if((origem & partida_virtual.bitboard_rei_preto) !== 0n && jogando == "b"){
        movimentos_possiveis_rei_pretas = movimentos_possiveis_rei_pretas.concat({origem: origem, destino: Calcular.ataque_e_movimento_rei("b", origem, false)});
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
    let casas_atacada_piao_brancas = [];
    let casas_atacada_cavalo_brancas = [];
    let casas_atacada_bispo_brancas = [];
    let casas_atacada_torre_brancas = [];
    let casas_atacada_rainha_brancas = [];
    let casas_atacada_rei_brancas = [];
    let casas_atacada_brancas = [];

    let casas_atacada_piao_pretas = [];
    let casas_atacada_cavalo_pretas = [];
    let casas_atacada_bispo_pretas = [];
    let casas_atacada_torre_pretas = [];
    let casas_atacada_rainha_pretas = [];
    let casas_atacada_rei_pretas = [];
    let casas_atacada_pretas = [];
    
    for(let cont = 0; cont < 64; cont++){
      let origem = BigInt(2 ** cont);

      // Verificando se é um pião das brancas
      if((origem & partida_virtual.bitboard_piao_branco) !== 0n){
        casas_atacada_piao_brancas = casas_atacada_piao_brancas.concat(Calcular.ataque_e_movimento_piao("w", origem, true, true));
      }
      else if((origem & partida_virtual.bitboard_cavalo_branco) !== 0n){
        casas_atacada_cavalo_brancas = casas_atacada_cavalo_brancas.concat(Calcular.ataque_e_movimento_cavalo("w", origem, true, true));
      }
      else if((origem & partida_virtual.bitboard_bispo_branco) !== 0n){
        casas_atacada_bispo_brancas = casas_atacada_bispo_brancas.concat(Calcular.ataque_e_movimento_bispo("w", origem, true, true));
      }
      else if((origem & partida_virtual.bitboard_torre_branco) !== 0n){
        casas_atacada_torre_brancas = casas_atacada_torre_brancas.concat(Calcular.ataque_e_movimento_torre("w", origem, true, true));
      }
      else if((origem & partida_virtual.bitboard_rainha_branco) !== 0n){
        casas_atacada_rainha_brancas = casas_atacada_rainha_brancas.concat(Calcular.ataque_e_movimento_rainha("w", origem, true, true));
      }
      else if((origem & partida_virtual.bitboard_rei_branco) !== 0n){
        casas_atacada_rei_brancas = casas_atacada_rei_brancas.concat(Calcular.ataque_e_movimento_rei("w", origem, true, true));
      }
      
      else if((origem & partida_virtual.bitboard_piao_preto) !== 0n){
        casas_atacada_piao_pretas = casas_atacada_piao_pretas.concat(Calcular.ataque_e_movimento_piao("b", origem, true, true));
      }
      else if((origem & partida_virtual.bitboard_cavalo_preto) !== 0n){
        casas_atacada_cavalo_pretas = casas_atacada_cavalo_pretas.concat(Calcular.ataque_e_movimento_cavalo("b", origem, true, true));
      }
      else if((origem & partida_virtual.bitboard_bispo_preto) !== 0n){
        casas_atacada_bispo_pretas = casas_atacada_bispo_pretas.concat(Calcular.ataque_e_movimento_bispo("b", origem, true, true));
      }
      else if((origem & partida_virtual.bitboard_torre_preto) !== 0n){
        casas_atacada_torre_pretas = casas_atacada_torre_pretas.concat(Calcular.ataque_e_movimento_torre("b", origem, true, true));
      }
      else if((origem & partida_virtual.bitboard_rainha_preto) !== 0n){
        casas_atacada_rainha_pretas = casas_atacada_rainha_pretas.concat(Calcular.ataque_e_movimento_rainha("b", origem, true, true));
      }
      else if((origem & partida_virtual.bitboard_rei_preto) !== 0n){
        casas_atacada_rei_pretas = casas_atacada_rei_pretas.concat(Calcular.ataque_e_movimento_rei("b", origem, true, true));
      }
    }

    casas_atacada_brancas = [...casas_atacada_piao_brancas, ...casas_atacada_cavalo_brancas, ...casas_atacada_bispo_brancas, ... casas_atacada_torre_brancas, ... casas_atacada_rainha_brancas, ... casas_atacada_rei_brancas];
    casas_atacada_pretas = [...casas_atacada_piao_pretas, ...casas_atacada_cavalo_pretas, ...casas_atacada_bispo_pretas, ... casas_atacada_torre_pretas, ... casas_atacada_rainha_pretas, ... casas_atacada_rei_pretas];

    // Limpando a contagem anterior
    partida_virtual.casas_atacadas_pelas_brancas = 0n;
    partida_virtual.casas_atacadas_pelas_pretas = 0n

    if(salvar_no_estado == true){
      casas_atacada_brancas.map((movimento) => {
        partida_virtual.casas_atacadas_pelas_brancas |= movimento;
      });
      casas_atacada_pretas.map((movimento) => {
        partida_virtual.casas_atacadas_pelas_pretas |= movimento;
      });

    }
    
    return { casas_atacada_brancas, casas_atacada_pretas };
  }

  static verificar_rei_atacado(jogando){

    // Brancas jogam
    if(jogando == "w"){
      if((partida_virtual.bitboard_rei_branco & partida_virtual.casas_atacadas_pelas_pretas) !== 0n){
        partida_virtual.rei_branco_em_ataque = true;
        return true;
      }
      else{
        partida_virtual.rei_branco_em_ataque = false;
        return false;
      }
    }
    
    // Pretas jogam
    else{
      if((partida_virtual.bitboard_rei_preto & partida_virtual.casas_atacadas_pelas_brancas) !== 0n){
        partida_virtual.rei_preto_em_ataque = true;
        return true;
      }
      else{
        partida_virtual.rei_preto_em_ataque = false;
        return false;
      }
    }
  }

  static calcular_defesa_rei(jogando, movimentos_possiveis){
    const todos_possiveis_movimentos_defesa_rei = [];

    // Brancas jogam
    if(jogando == "w"){

      // Verificando cada possível jogada para defender o rei
      movimentos_possiveis.brancas.map((movimento) => {
        const peca = descobrir_peca(movimento.origem);

        // const movimentos_filtrados = filtrar_apenas_movimentos_validos_peca_especifica(movimento.origem, movimento.destino, peca);

        if(movimentos_filtrados.length > 0){
          todos_possiveis_movimentos_defesa_rei.push(movimentos_filtrados);
        }
      });
    }
    // Pretas jogam
    else{
      /// Verificando cada possível jogada para defender o rei
      movimentos_possiveis.pretas.map((movimento) => {
        const peca = descobrir_peca(movimento.origem);

        // const movimentos_filtrados = filtrar_apenas_movimentos_validos_peca_especifica(movimento.origem, movimento.destino, peca);

        if(movimentos_filtrados.length > 0){
          todos_possiveis_movimentos_defesa_rei.push(movimentos_filtrados);
        }
      });
    }

    return todos_possiveis_movimentos_defesa_rei;
  }
}

export function verificar_se_tem_promocao(jogando){
  // Brancas jogam
  if(jogando == "w"){
    // Entra caso tenha pião nas casas de promoção 
    if((informacoes_xadrez.bitboard_casas_linha_8 & partida_virtual.bitboard_piao_branco) != 0n){
      return true;
    }
    else{
      return false;
    }
  }
  // Pretas jogam
  else{
    // Entra caso tenha pião nas casas de promoção 
    if((informacoes_xadrez.bitboard_casas_linha_1 & partida_virtual.bitboard_piao_preto) != 0n){
      return true;
    }
    else{
      return false;
    }
  }
}

export function verificar_se_esta_em_xeque(jogando){
  // Brancas jogam
  if(jogando == "w"){
    Calcular.verificar_rei_atacado("w");
    if(partida_virtual.rei_branco_em_ataque == true){
      const todos_possiveis_movimentos = Calcular.calcular_todos_possiveis_movimento(jogando);
      // const todos_possiveis_movimentos_defesa_rei = Calcular.calcular_defesa_rei(jogando, todos_possiveis_movimentos);

      if(todos_possiveis_movimentos.length == 0){
        throw new Error("Xeque mate");
      }
      else{
        // Está em xeque
        return true;
      }
    }
    // Não está em xeque ou xeque mate
    return false;
  }
  // Pretas jogam
  else{
    Calcular.verificar_rei_atacado("b");
    if(partida_virtual.rei_preto_em_ataque == true){
      const todos_possiveis_movimentos = Calcular.calcular_todos_possiveis_movimento(jogando);
      // const todos_possiveis_movimentos_defesa_rei = Calcular.calcular_defesa_rei(jogando, todos_possiveis_movimentos);

      if(todos_possiveis_movimentos.length == 0){
        throw new Error("Xeque mate");
      }
      else{
        // Está em xeque
        return true;
      }
    }
    // Não está em xeque ou xeque mate
    return false;
  }
}