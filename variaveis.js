export const informacoes_xadrez = {

  /** LIMITES DO TABULEIRO: COLUNA */

  // 00000011 00000011 00000011 00000011 00000011 00000011 00000011 00000011
  casas_coluna_A_e_B: 217020518514230019n,

  // 11000000 11000000 11000000 11000000 11000000 11000000 11000000 11000000
  casas_coluna_G_e_H: 13889313184910721216n,

  // 00000001 00000001 00000001 00000001 00000001 00000001 00000001 00000001
  casas_coluna_A: 72340172838076673n,

  // 10000000 10000000 10000000 10000000 10000000 10000000 10000000 10000000
  casas_coluna_H: 9259542123273814144n,

  /** LIMITES DO TABULEIRO: LINHA */

  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 11111111 
  casas_linha_1: 255n,

  // 11111111 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  casas_linha_8: 18374686479671623680n,

  /** PRÉ-MOVIMENTO DAS PEÇAS */

  movimento_piao: [8n, 16n],
  captura_piao_esquerda: [7n],
  captura_piao_direita: [9n],

  movimento_cavalo_direita: [10n, 17n],
  movimento_cavalo_esquerda: [6n, 15n],

  movimento_bispo_esquerda: [7n, 14n, 21n, 28n, 35n, 42n, 49n],
  movimento_bispo_direita: [9n, 18n, 27n, 36n, 45n, 54n, 63n],
  
  movimento_torre_direita: [1n, 2n, 3n, 4n, 5n, 6n, 7n],
  movimento_torre_frente: [8n, 16n, 24n, 32n, 40n, 48n, 56n],

  movimento_rei_frente: [8n],
  movimento_rei_frente_direita: [9n],
  movimento_rei_frente_esquerda: [7n],
  movimento_rei_direita: [1n],

  /** CASAS INICIAS DO PIÃO */

  casas_iniciais_piao_branco: 65280n,
  casas_iniciais_piao_preto: 71776119061217280n,

  /** INFORMAÇÕES DAS CASAS NO ROQUE */
  
  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000001
  casa_inicial_torre_esquerda_branca: 1n,
  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 10000000
  casa_inicial_torre_direita_branca: 128n,

  // 00000001 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  casa_inicial_torre_esquerda_preto: 72057594037927936n,
  // 10000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  casa_inicial_torre_direita_preto: 9223372036854775808n,

  // CASAS DE DESTINO DO REI E TORRE (brancas)

  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000100
  casa_destino_rei_roque_esquerda_branco: 4n,
  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00001000
  casa_destino_torre_roque_esquerda_branco: 8n,

  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 01000000
  casa_destino_rei_roque_direita_branco: 64n,
  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00100000
  casa_destino_torre_roque_direita_branco: 32n,

  // CASAS DE DESTINO DO REI E TORRE (pretas)

  // 00000100 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  casa_destino_rei_roque_esquerda_preto: 288230376151711744n,
  // 00001000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  casa_destino_torre_roque_esquerda_preto: 576460752303423488n,
  // 01000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  casa_destino_rei_roque_direita_preto: 4611686018427387904n,
  // 00100000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  casa_destino_torre_roque_direita_preto: 2305843009213693952n,

  // CASAS QUE DEVEM ESTAR VAZIAS NO ROQUE (sem peça aliada ou inimiga)

  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00001110
  casas_vazias_roque_esquerda_branco: 14n,
  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 01100000
  casas_vazias_roque_direita_branco: 96n,
  
  // 00001110 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  casas_vazias_roque_esquerda_preto: 1008806316530991104n,
  // 01100000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  casas_vazias_roque_direita_preto: 6917529027641081856n,

  // CASAS QUE NÃO PODEM ESTAR ATACADAS NO ROQUE

  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00001100
  casas_nao_atacadas_roque_esquerda_branco: 12n,
  
  // 00001100 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  casas_nao_atacadas_roque_esquerda_preto: 864691128455135232n,

  /** INFORMAÇÕES DAS PEÇAS */

  piao: "p",
  cavalo: "n",
  bispo: "b",
  torre: "r",
  dama: "q",
  rei: "k"
}

export const partida_real = {

  /** PEÇAS BRANÇAS */

  // 00000000 00000000 00000000 00000000 00000000 00000000 11111111 00000000
  bitboard_piao_branco: 65280n,
  
  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 01000010
  bitboard_cavalo_branco: 66n,
  
  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00100100 
  bitboard_bispo_branco: 36n,
  
  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 10000001 
  bitboard_torre_branco: 129n,
  
  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00001000 
  bitboard_rainha_branco: 8n,
  
  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00010000 
  bitboard_rei_branco: 16n,
  
  // 00000000 00000000 00000000 00000000 00000000 00000000 11111111 11111111
  bitboard_pecas_brancas: 65535n,
  
  /** PEÇAS PRETAS */
  
  // 00000000 11111111 00000000 00000000 00000000 00000000 00000000 00000000
  bitboard_piao_preto: 71776119061217280n,
  
  // 01000010 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  bitboard_cavalo_preto: 4755801206503243776n,

  // 00100100 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  bitboard_bispo_preto: 2594073385365405696n,

  // 10000001 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  bitboard_torre_preto: 9295429630892703744n,

  // 00001000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  bitboard_rainha_preto: 576460752303423488n,

  // 00010000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  bitboard_rei_preto: 1152921504606846976n,

  // 11111111 11111111 00000000 00000000 00000000 00000000 00000000 00000000
  bitboard_pecas_pretas: 18446462598732840960n,
  
  /** INFORMAÇÕES DO TABULEIRO E PARTIDA */

  // 11111111 11111111 00000000 00000000 00000000 00000000 11111111 11111111
  bitboard_tabuleiro_completo: 18446462598732906495n,

  // Status se o rei está atacado
  rei_preto_em_ataque: false,
  // 00000000 00000000 11111111 00000000 00000000 00000000 00000000 00000000
  casas_atacadas_pelas_pretas: 280375465082880n,

  // Status se o rei está atacado
  rei_branco_em_ataque: false,
  // 00000000 00000000 00000000 00000000 00000000 11111111 00000000 00000000
  casas_atacadas_pelas_brancas: 16711680n,
  
  // "w" é brancas e "p" é pretas
  jogando: "w",
  // Número de lances jogados na partida_real
  numero_lances_completo: 1,
  
  // Status se tem en passant
  en_passant_brancas: 0n,
  // Status se tem en passant
  en_passant_pretas: 0n,
  
  // Status se é possível o roque
  status_roque_esquerda_branco: true,
  // Status se é possível o roque
  status_roque_direita_branco: true,

  // Status se é possível o roque
  status_roque_esquerda_preto: true,
  // Status se é possível o roque
  status_roque_direita_preto: true,
}

export const partida_simulada = {

  /** PEÇAS BRANCAS */

  bitboard_piao_branco: 65280n,
  bitboard_cavalo_branco: 66n,
  bitboard_bispo_branco: 36n,
  bitboard_torre_branco: 129n,
  bitboard_rainha_branco: 8n,
  bitboard_rei_branco: 16n,
  bitboard_pecas_brancas: 65535n,
  
  /** PEÇAS PRETAS */

  bitboard_piao_preto: 71776119061217280n,
  bitboard_cavalo_preto: 4755801206503243776n,
  bitboard_bispo_preto: 2594073385365405696n,
  bitboard_torre_preto: 9295429630892703744n,
  bitboard_rainha_preto: 576460752303423488n,
  bitboard_rei_preto: 1152921504606846976n,
  bitboard_pecas_pretas: 18446462598732840960n,
  
  /** INFORMAÇÕES DO TABULEIRO E PARTIDA */
  bitboard_tabuleiro_completo: 18446462598732906495n,

  jogando: "w",
  numero_lances_completo: 1,

  rei_preto_em_ataque: false,
  casas_atacadas_pelas_pretas: 0n,

  rei_branco_em_ataque: false,
  casas_atacadas_pelas_brancas: 0n,

  en_passant_brancas: 0n,
  en_passant_pretas: 0n,

  status_roque_esquerda_branco: true,
  status_roque_direita_branco: true,
  status_roque_esquerda_preto: true,
  status_roque_direita_preto: true,
}

export function zerar(){
  partida_real.bitboard_piao_branco = 65280n,
  partida_real.bitboard_cavalo_branco = 66n,
  partida_real.bitboard_bispo_branco = 36n,
  partida_real.bitboard_torre_branco = 129n,
  partida_real.bitboard_rainha_branco = 8n,
  partida_real.bitboard_rei_branco = 16n,
  partida_real.bitboard_pecas_brancas = 65535n,
  
  /** PEÇAS PRETAS */

  partida_real.bitboard_piao_preto = 71776119061217280n,
  partida_real.bitboard_cavalo_preto = 4755801206503243776n,
  partida_real.bitboard_bispo_preto = 2594073385365405696n,
  partida_real.bitboard_torre_preto = 9295429630892703744n,
  partida_real.bitboard_rainha_preto = 576460752303423488n,
  partida_real.bitboard_rei_preto = 1152921504606846976n,
  partida_real.bitboard_pecas_pretas = 18446462598732840960n,
  
  /** INFORMAÇÕES DO TABULEIRO E PARTIDA */
  partida_real.bitboard_tabuleiro_completo = 18446462598732906495n,

  partida_real.rei_preto_em_ataque = false;
  partida_real.casas_atacadas_pelas_pretas = 0n;

  partida_real.rei_branco_em_ataque = false;
  partida_real.casas_atacadas_pelas_brancas = 0n;
  
  partida_real.jogando = "w";
  partida_real.numero_lances_completo = 1;
  
  partida_real.en_passant_brancas = 0n;
  partida_real.en_passant_pretas = 0n;
  
  partida_real.status_roque_esquerda_branco = true;
  partida_real.status_roque_direita_branco = true;

  partida_real.status_roque_esquerda_preto = true;
  partida_real.status_roque_direita_preto = true;
}

// Passar o valor de estado para simulado
export function sincronizar_partida_simulada_com_partida_real(){
  partida_simulada.bitboard_piao_branco = partida_real.bitboard_piao_branco;
  partida_simulada.bitboard_cavalo_branco = partida_real.bitboard_cavalo_branco;
  partida_simulada.bitboard_bispo_branco = partida_real.bitboard_bispo_branco;
  partida_simulada.bitboard_torre_branco = partida_real.bitboard_torre_branco;
  partida_simulada.bitboard_rainha_branco = partida_real.bitboard_rainha_branco;
  partida_simulada.bitboard_rei_branco = partida_real.bitboard_rei_branco;

  partida_simulada.bitboard_piao_preto = partida_real.bitboard_piao_preto;
  partida_simulada.bitboard_cavalo_preto = partida_real.bitboard_cavalo_preto;
  partida_simulada.bitboard_bispo_preto = partida_real.bitboard_bispo_preto;
  partida_simulada.bitboard_torre_preto = partida_real.bitboard_torre_preto;
  partida_simulada.bitboard_rainha_preto = partida_real.bitboard_rainha_preto;
  partida_simulada.bitboard_rei_preto = partida_real.bitboard_rei_preto;

  partida_simulada.bitboard_tabuleiro_completo = partida_real.bitboard_tabuleiro_completo;
  partida_simulada.bitboard_pecas_brancas = partida_real.bitboard_pecas_brancas;
  partida_simulada.bitboard_pecas_pretas = partida_real.bitboard_pecas_pretas;

  partida_simulada.rei_preto_em_ataque = partida_real.rei_preto_em_ataque;
  partida_simulada.casas_atacadas_pelas_pretas = partida_real.casas_atacadas_pelas_pretas;

  partida_simulada.rei_branco_em_ataque = partida_real.rei_branco_em_ataque;
  partida_simulada.casas_atacadas_pelas_brancas = partida_real.casas_atacadas_pelas_brancas;
  partida_simulada.jogando = partida_real.jogando,
  partida_simulada.numero_lances_completo = partida_real.numero_lances_completo,

  partida_simulada.en_passant_brancas = partida_real.en_passant_brancas;
  partida_simulada.en_passant_pretas = partida_real.en_passant_pretas;

  partida_simulada.status_roque_esquerda_branco = partida_real.status_roque_esquerda_branco;
  partida_simulada.status_roque_direita_branco = partida_real.status_roque_direita_branco;

  partida_simulada.status_roque_esquerda_preto = partida_real.status_roque_esquerda_preto;
  partida_simulada.status_roque_direita_preto = partida_real.status_roque_direita_preto;
}

// Passar o valor de simulado para estado
export function sincronizar_partida_real_com_partida_simulada(){
  partida_real.bitboard_piao_branco = partida_simulada.bitboard_piao_branco;
  partida_real.bitboard_cavalo_branco = partida_simulada.bitboard_cavalo_branco;
  partida_real.bitboard_bispo_branco = partida_simulada.bitboard_bispo_branco;
  partida_real.bitboard_torre_branco = partida_simulada.bitboard_torre_branco;
  partida_real.bitboard_rainha_branco = partida_simulada.bitboard_rainha_branco;
  partida_real.bitboard_rei_branco = partida_simulada.bitboard_rei_branco;

  partida_real.bitboard_piao_preto = partida_simulada.bitboard_piao_preto;
  partida_real.bitboard_cavalo_preto = partida_simulada.bitboard_cavalo_preto;
  partida_real.bitboard_bispo_preto = partida_simulada.bitboard_bispo_preto;
  partida_real.bitboard_torre_preto = partida_simulada.bitboard_torre_preto;
  partida_real.bitboard_rainha_preto = partida_simulada.bitboard_rainha_preto;
  partida_real.bitboard_rei_preto = partida_simulada.bitboard_rei_preto;

  partida_real.bitboard_tabuleiro_completo = partida_simulada.bitboard_tabuleiro_completo;
  partida_real.bitboard_pecas_brancas = partida_simulada.bitboard_pecas_brancas;
  partida_real.bitboard_pecas_pretas = partida_simulada.bitboard_pecas_pretas;

  partida_real.rei_preto_em_ataque = partida_simulada.rei_preto_em_ataque;
  partida_real.casas_atacadas_pelas_pretas = partida_simulada.casas_atacadas_pelas_pretas;

  partida_real.rei_branco_em_ataque = partida_simulada.rei_branco_em_ataque;
  partida_real.casas_atacadas_pelas_brancas = partida_simulada.casas_atacadas_pelas_brancas;

  partida_real.jogando = partida_simulada.jogando,
  partida_real.numero_lances_completo = partida_simulada.numero_lances_completo,

  partida_real.en_passant_brancas = partida_simulada.en_passant_brancas;
  partida_real.en_passant_pretas = partida_simulada.en_passant_pretas;

  partida_real.status_roque_esquerda_branco = partida_simulada.status_roque_esquerda_branco;
  partida_real.status_roque_direita_branco = partida_simulada.status_roque_direita_branco;

  partida_real.status_roque_esquerda_preto = partida_simulada.status_roque_esquerda_preto;
  partida_real.status_roque_direita_preto = partida_simulada.status_roque_direita_preto;
}