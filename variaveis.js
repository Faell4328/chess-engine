export const informacoes_xadrez = {

  /** LIMITES DO TABULEIRO: COLUNA */

  // 00000011 00000011 00000011 00000011 00000011 00000011 00000011 00000011
  bitboard_casas_coluna_canto_esquerdo: 0x0303030303030303n,

  // 11000000 11000000 11000000 11000000 11000000 11000000 11000000 11000000
  bitboard_casas_coluna_canto_direito: 0xC0C0C0C0C0C0C0C0n,

  // 00000001 00000001 00000001 00000001 00000001 00000001 00000001 00000001
  bitboard_casas_coluna_A: 0x101010101010101n,

  // 00000010 00000010 00000010 00000010 00000010 00000010 00000010 00000010
  bitboard_casas_coluna_B: 0x202020202020202n,

  // 01000000 01000000 01000000 01000000 01000000 01000000 01000000 01000000
  bitboard_casas_coluna_G: 0x4040404040404040n,

  // 10000000 10000000 10000000 10000000 10000000 10000000 10000000 10000000
  bitboard_casas_coluna_H: 0x8080808080808080n,

  /** LIMITES DO TABULEIRO: LINHA */
 
  bitboard_casas_linha_canto: 0xC3C3C3C3C3C3C3C3n,

  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 11111111 
  bitboard_casas_linha_1: 0x00000000000000FFn,

  // 00000000 00000000 00000000 00000000 00000000 00000000 11111111 00000000
  bitboard_casas_linha_2: 0x000000000000FF00n,

  // 00000000 11111111 00000000 00000000 00000000 00000000 00000000 00000000
  bitboard_casas_linha_7: 0x00FF000000000000n,

  // 11111111 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  bitboard_casas_linha_8: 0xFF00000000000000n,

  /** PRÉ-MOVIMENTO DAS PEÇAS */

  movimento_piao: [8n, 16n],
  movimento_captura_piao_esquerda: [7n],
  movimento_captura_piao_direita: [9n],
  movimento_cavalo_direita: [10n, 17n],
  movimento_cavalo_esquerda: [6n, 15n],
  movimento_cavalo: [6n, 10n, 15n, 17n],
  movimento_bispo_esquerda: [7n, 14n, 21n, 28n, 35n, 42n, 49n],
  movimento_bispo_direita: [9n, 18n, 27n, 36n, 45n, 54n, 63n],
  movimento_torre_direita: [1n, 2n, 3n, 4n, 5n, 6n, 7n],
  movimento_torre_frente: [8n, 16n, 24n, 32n, 40n, 48n, 56n],
  movimento_rei_frente: [8n],
  movimento_rei_frente_direita: [9n],
  movimento_rei_frente_esquerda: [7n],
  movimento_rei_direita: [1n],

  /** CASAS INICIAS DO PIÃO */

  movimento_duplo_piao_branco: 0x000000000000FF00n,
  movimento_duplo_piao_preto: 0x00FF000000000000n,

  /** INFORMAÇÕES DAS CASAS NO ROQUE */
  
  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000001
  casa_onde_a_torre_deve_estar_para_fazer_roque_esquerda_branco: 0x0000000000000001n,
  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 10000000
  casa_onde_a_torre_deve_estar_para_fazer_roque_direita_branco: 0x0000000000000080n,

  // 00000001 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  casa_onde_a_torre_deve_estar_para_fazer_roque_esquerda_preto: 0x0100000000000000n,
  // 10000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  casa_onde_a_torre_deve_estar_para_fazer_roque_direita_preto: 0x8000000000000000n,

  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000100
  casa_onde_o_rei_vai_ficar_no_roque_esquerda_branco: 0x0000000000000004n,
  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00001000
  casa_onde_a_torre_vai_ficar_no_roque_esquerda_branco: 0x0000000000000008n,

  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 01000000
  casa_onde_o_rei_vai_ficar_no_roque_direita_branco: 0x0000000000000040n,
  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00100000
  casa_onde_a_torre_vai_ficar_no_roque_direita_branco: 0x0000000000000020n,

  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00001110
  casas_que_deve_estar_vazio_para_fazer_o_roque_esquerda_branco: 0x000000000000000En,
  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 01100000
  casas_que_deve_estar_vazio_para_fazer_o_roque_direita_branco: 0x0000000000000060n,

  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00001100
  casas_que_nao_podem_estar_sendo_atacadas_para_fazer_o_roque_esquerda_branco: 0x000000000000000Cn,

  // 00000100 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  casa_onde_o_rei_vai_ficar_no_roque_esquerda_preto: 0x0400000000000000n,
  // 00001000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  casa_onde_a_torre_vai_ficar_no_roque_esquerda_preto: 0x0800000000000000n,
  // 01000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  casa_onde_o_rei_vai_ficar_no_roque_direita_preto: 0x4000000000000000n,
  // 00100000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  casa_onde_a_torre_vai_ficar_no_roque_direita_preto: 0x2000000000000000n,
  
  // 01100000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  casas_que_deve_estar_vazio_para_fazer_o_roque_direita_preto: 0x6000000000000000n,
  // 00001110 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  casas_que_deve_estar_vazio_para_fazer_o_roque_esquerda_preto: 0x0E00000000000000n,

  // 00001110 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  casas_que_nao_podem_estar_sendo_atacadas_para_fazer_o_roque_esquerda_preto: 0x0C00000000000000n,

  /** INFORMAÇÕES DAS PEÇAS */

  piao: "p",
  cavalo: "n",
  bispo: "b",
  torre: "r",
  dama: "q",
  rei: "k"
}

export const partida = {

  /** PEÇAS BRANÇAS */

  // 00000000 00000000 00000000 00000000 00000000 00000000 11111111 00000000
  bitboard_piao_branco: 0x000000000000FF00n,
  
  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 01000010
  bitboard_cavalo_branco: 0x0000000000000042n,
  
  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00100100 
  bitboard_bispo_branco: 0x0000000000000024n,
  
  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 10000001 
  bitboard_torre_branco: 0x0000000000000081n,
  
  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00001000 
  bitboard_rainha_branco: 0x0000000000000008n,
  
  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00010000 
  bitboard_rei_branco: 0x0000000000000010n,
  
  // 00000000 00000000 00000000 00000000 00000000 00000000 11111111 11111111
  bitboard_de_todas_pecas_brancas: 0x000000000000FFFFn,
  
  /** PEÇAS PRETAS */
  
  // 00000000 11111111 00000000 00000000 00000000 00000000 00000000 00000000
  bitboard_piao_preto: 0x00FF000000000000n,
  
  // 01000010 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  bitboard_cavalo_preto: 0x4200000000000000n,

  // 00100100 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  bitboard_bispo_preto: 0x2400000000000000n,

  // 10000001 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  bitboard_torre_preto: 0x8100000000000000n,

  // 00001000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  bitboard_rainha_preto: 0x0800000000000000n,

  // 00010000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  bitboard_rei_preto: 0x1000000000000000n,

  // 11111111 11111111 00000000 00000000 00000000 00000000 00000000 00000000
  bitboard_de_todas_pecas_pretas: 0xFFFF000000000000n,
  
  /** INFORMAÇÕES DO TABULEIRO E PARTIDA */

  // 11111111 11111111 00000000 00000000 00000000 00000000 11111111 11111111
  bitboard_de_todas_as_pecas_do_tabuleiro: 0xFFFF00000000FFFFn,

  // Status se o rei está atacado
  rei_preto_em_ataque: false,
  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  casas_atacadas_pelas_pretas: 0n,

  // Status se o rei está atacado
  rei_branco_em_ataque: false,
  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  casas_atacadas_pelas_brancas: 0n,
  
  // w é brancas e p é pretas
  jogando: "w",
  // Número de lances jogados na partida
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

export const partida_virtual = {

  /** PEÇAS BRANCAS */

  bitboard_piao_branco: 0x000000000000FF00n,
  bitboard_cavalo_branco: 0x0000000000000042n,
  bitboard_bispo_branco: 0x0000000000000024n,
  bitboard_torre_branco: 0x0000000000000081n,
  bitboard_rainha_branco: 0x0000000000000008n,
  bitboard_rei_branco: 0x0000000000000010n,
  
  /** PEÇAS PRETAS */
  
  bitboard_piao_preto: 0x00FF000000000000n,
  bitboard_cavalo_preto: 0x4200000000000000n,
  bitboard_bispo_preto: 0x2400000000000000n,
  bitboard_torre_preto: 0x8100000000000000n,
  bitboard_rainha_preto: 0x0800000000000000n,
  bitboard_rei_preto: 0x1000000000000000n,
  
  /** PARTIDA */

  bitboard_de_todas_as_pecas_do_tabuleiro: 0xFFFF00000000FFFFn,
  bitboard_de_todas_pecas_brancas: 0x000000000000FFFFn,
  bitboard_de_todas_pecas_pretas: 0xFFFF000000000000n,

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
  partida.bitboard_piao_branco = 0x000000000000FF00n;
  partida.bitboard_cavalo_branco = 0x0000000000000042n;
  partida.bitboard_bispo_branco = 0x0000000000000024n;
  partida.bitboard_torre_branco = 0x0000000000000081n;
  partida.bitboard_rainha_branco = 0x0000000000000008n;
  partida.bitboard_rei_branco = 0x0000000000000010n;
  
  partida.bitboard_piao_preto = 0x00FF000000000000n;
  partida.bitboard_cavalo_preto = 0x4200000000000000n;
  partida.bitboard_bispo_preto = 0x2400000000000000n;
  partida.bitboard_torre_preto = 0x8100000000000000n;
  partida.bitboard_rainha_preto = 0x0800000000000000n;
  partida.bitboard_rei_preto = 0x1000000000000000n;
  
  partida.bitboard_de_todas_pecas_brancas = 0x000000000000FFFFn;
  partida.bitboard_de_todas_pecas_pretas = 0xFFFF000000000000n;
  partida.bitboard_de_todas_as_pecas_do_tabuleiro = 0xFFFF00000000FFFFn;

  partida.rei_preto_em_ataque = false;
  partida.casas_atacadas_pelas_pretas = 0n;

  partida.rei_branco_em_ataque = false;
  partida.casas_atacadas_pelas_brancas = 0n;
  
  partida.jogando = "w";
  partida.numero_lances_completo = 1;
  
  partida.en_passant_brancas = 0n;
  partida.en_passant_pretas = 0n;
  
  partida.status_roque_esquerda_branco = true;
  partida.status_roque_direita_branco = true;

  partida.status_roque_esquerda_preto = true;
  partida.status_roque_direita_preto = true;
}

// Passar o valor de estado para simulado
export function sincronizar_simulado_com_estado(){
  partida_virtual.bitboard_piao_branco = partida.bitboard_piao_branco;
  partida_virtual.bitboard_cavalo_branco = partida.bitboard_cavalo_branco;
  partida_virtual.bitboard_bispo_branco = partida.bitboard_bispo_branco;
  partida_virtual.bitboard_torre_branco = partida.bitboard_torre_branco;
  partida_virtual.bitboard_rainha_branco = partida.bitboard_rainha_branco;
  partida_virtual.bitboard_rei_branco = partida.bitboard_rei_branco;

  partida_virtual.bitboard_piao_preto = partida.bitboard_piao_preto;
  partida_virtual.bitboard_cavalo_preto = partida.bitboard_cavalo_preto;
  partida_virtual.bitboard_bispo_preto = partida.bitboard_bispo_preto;
  partida_virtual.bitboard_torre_preto = partida.bitboard_torre_preto;
  partida_virtual.bitboard_rainha_preto = partida.bitboard_rainha_preto;
  partida_virtual.bitboard_rei_preto = partida.bitboard_rei_preto;

  partida_virtual.bitboard_de_todas_as_pecas_do_tabuleiro = partida.bitboard_de_todas_as_pecas_do_tabuleiro;
  partida_virtual.bitboard_de_todas_pecas_brancas = partida.bitboard_de_todas_pecas_brancas;
  partida_virtual.bitboard_de_todas_pecas_pretas = partida.bitboard_de_todas_pecas_pretas;

  partida_virtual.rei_preto_em_ataque = partida.rei_preto_em_ataque;
  partida_virtual.casas_atacadas_pelas_pretas = partida.casas_atacadas_pelas_pretas;

  partida_virtual.rei_branco_em_ataque = partida.rei_branco_em_ataque;
  partida_virtual.casas_atacadas_pelas_brancas = partida.casas_atacadas_pelas_brancas;
  partida_virtual.jogando = partida.jogando,
  partida_virtual.numero_lances_completo = partida.numero_lances_completo,

  partida_virtual.en_passant_brancas = partida.en_passant_brancas;
  partida_virtual.en_passant_pretas = partida.en_passant_pretas;

  partida_virtual.status_roque_esquerda_branco = partida.status_roque_esquerda_branco;
  partida_virtual.status_roque_direita_branco = partida.status_roque_direita_branco;

  partida_virtual.status_roque_esquerda_preto = partida.status_roque_esquerda_preto;
  partida_virtual.status_roque_direita_preto = partida.status_roque_direita_preto;
}

// Passar o valor de simulado para estado
export function sincronizar_estado_com_simulado(){
  partida.bitboard_piao_branco = partida_virtual.bitboard_piao_branco;
  partida.bitboard_cavalo_branco = partida_virtual.bitboard_cavalo_branco;
  partida.bitboard_bispo_branco = partida_virtual.bitboard_bispo_branco;
  partida.bitboard_torre_branco = partida_virtual.bitboard_torre_branco;
  partida.bitboard_rainha_branco = partida_virtual.bitboard_rainha_branco;
  partida.bitboard_rei_branco = partida_virtual.bitboard_rei_branco;

  partida.bitboard_piao_preto = partida_virtual.bitboard_piao_preto;
  partida.bitboard_cavalo_preto = partida_virtual.bitboard_cavalo_preto;
  partida.bitboard_bispo_preto = partida_virtual.bitboard_bispo_preto;
  partida.bitboard_torre_preto = partida_virtual.bitboard_torre_preto;
  partida.bitboard_rainha_preto = partida_virtual.bitboard_rainha_preto;
  partida.bitboard_rei_preto = partida_virtual.bitboard_rei_preto;

  partida.bitboard_de_todas_as_pecas_do_tabuleiro = partida_virtual.bitboard_de_todas_as_pecas_do_tabuleiro;
  partida.bitboard_de_todas_pecas_brancas = partida_virtual.bitboard_de_todas_pecas_brancas;
  partida.bitboard_de_todas_pecas_pretas = partida_virtual.bitboard_de_todas_pecas_pretas;

  partida.rei_preto_em_ataque = partida_virtual.rei_preto_em_ataque;
  partida.casas_atacadas_pelas_pretas = partida_virtual.casas_atacadas_pelas_pretas;

  partida.rei_branco_em_ataque = partida_virtual.rei_branco_em_ataque;
  partida.casas_atacadas_pelas_brancas = partida_virtual.casas_atacadas_pelas_brancas;

  partida.jogando = partida_virtual.jogando,
  partida.numero_lances_completo = partida_virtual.numero_lances_completo,

  partida.en_passant_brancas = partida_virtual.en_passant_brancas;
  partida.en_passant_pretas = partida_virtual.en_passant_pretas;

  partida.status_roque_esquerda_branco = partida_virtual.status_roque_esquerda_branco;
  partida.status_roque_direita_branco = partida_virtual.status_roque_direita_branco;

  partida.status_roque_esquerda_preto = partida_virtual.status_roque_esquerda_preto;
  partida.status_roque_direita_preto = partida_virtual.status_roque_direita_preto;
}