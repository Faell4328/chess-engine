export const estado = {
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
  
  // ------------------
  
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
  
  // 11111111 11111111 00000000 00000000 00000000 00000000 11111111 11111111
  bitboard_tabuleiro: 0xFFFF00000000FFFFn,
  // 00000000 00000000 00000000 00000000 00000000 00000000 11111111 11111111
  bitboard_brancas: 0x000000000000FFFFn,
  // 11111111 11111111 00000000 00000000 00000000 00000000 00000000 00000000
  bitboard_pretas: 0xFFFF000000000000n,

  // bitboard para as casas do canto
  
  // 11000011 11000011 11000011 11000011 11000011 11000011 11000011 11000011
  bitboard_casas_coluna_canto: 0xC3C3C3C3C3C3C3C3n,
  // 00000001 00000001 00000001 00000001 00000001 00000001 00000001 00000001
  bitboard_casas_coluna_A: 0x101010101010101n,
  // 00000010 00000010 00000010 00000010 00000010 00000010 00000010 00000010
  bitboard_casas_coluna_B: 0x202020202020202n,
  // 01000000 01000000 01000000 01000000 01000000 01000000 01000000 01000000
  bitboard_casas_coluna_G: 0x4040404040404040n,
  // 10000000 10000000 10000000 10000000 10000000 10000000 10000000 10000000
  bitboard_casas_coluna_H: 0x8080808080808080n,

  // 11111111 11111111 00000000 00000000 00000000 00000000 11111111 11111111
  bitboard_casas_linha_canto: 0xC3C3C3C3C3C3C3C3n,
  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 11111111 
  bitboard_casas_linha_1: 0x00000000000000FFn,
  // 00000000 00000000 00000000 00000000 00000000 00000000 11111111 00000000
  bitboard_casas_linha_2: 0x000000000000FF00n,
  // 00000000 11111111 00000000 00000000 00000000 00000000 00000000 00000000
  bitboard_casas_linha_7: 0x00FF000000000000n,
  // 11111111 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  bitboard_casas_linha_8: 0xFF00000000000000n,

  // Pré-calculo - TEM NÚMERO NEGATIVO TAMBÉM NO CAVALO E BISPO (os mesmos)
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
  movimento_rei_frente_direita: [7n],
  movimento_rei_frente_esquerda: [9n],
  movimento_rei_direita: [1n],

  // FAZER
  rei_preto_em_ataque: false,
  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  casas_atacadas_pelas_pretas: 0n,

  rei_branco_em_ataque: false,
  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  casas_atacadas_pelas_brancas: 0n,
  
  // 0 é pretas e 1 é brancas
  turno: 1,
  numero_lances_brancas: 0,
  numero_lances_pretas: 0,
  
  movimento_duplo_piao_branco: 0x000000000000FF00n,
  movimento_duplo_piao_preto: 0x00FF000000000000n,

  en_passant_brancas: 0n,
  en_passant_pretas: 0n,
  
  roque_esquerda_branco: true,
  roque_direita_branco: true,

  roque_esquerda_preto: true,
  roque_direita_preto: true,
  
  // bitboard informando a posição de cada peça no roque (roque é um movimento de rei)

  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 01000000
  casa_rei_roque_direita_branco: 0x0000000000000040n,
  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00100000
  casa_torre_roque_direita_branco: 0x0000000000000020n,
  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000100
  casa_rei_roque_esquerda_branco: 0x0000000000000004n,
  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00001000
  casa_torre_roque_esquerda_branco: 0x0000000000000008n,

  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 01100000
  casas_roque_direita_branco: 0x0000000000000060n,
  // 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00001110
  casas_roque_esquerda_branco: 0x000000000000000En,

  
  // 01000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  casa_rei_roque_direita_preto: 0x4000000000000000n,
  // 00100000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  casa_torre_roque_direita_preto: 0x2000000000000000n,
  // 00000100 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  casa_rei_roque_esquerda_preto: 0x0400000000000000n,
  // 00001000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  casa_torre_roque_esquerda_preto: 0x0800000000000000n,
  
  // 00001110 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  casas_roque_esquerda_preto: 0x0E00000000000000n,
  // 01100000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
  casas_roque_direita_preto: 0x6000000000000000n,

  piao: 0b1,
  cavalo: 0b10,
  bispo: 0b11,
  torre: 0b100,
  dama: 0b101,
  rei: 0b111
}

export function zerar(){
  estado.bitboard_piao_branco = 0x000000000000FF00n;
  estado.bitboard_cavalo_branco = 0x0000000000000042n;
  estado.bitboard_bispo_branco = 0x0000000000000024n;
  estado.bitboard_torre_branco = 0x0000000000000081n;
  estado.bitboard_rainha_branco = 0x0000000000000008n;
  estado.bitboard_rei_branco = 0x0000000000000010n;
  
  estado.bitboard_piao_preto = 0x00FF000000000000n;
  estado.bitboard_cavalo_preto = 0x4200000000000000n;
  estado.bitboard_bispo_preto = 0x2400000000000000n;
  estado.bitboard_torre_preto = 0x8100000000000000n;
  estado.bitboard_rainha_preto = 0x0800000000000000n;
  estado.bitboard_rei_preto = 0x1000000000000000n;
  
  estado.bitboard_tabuleiro = 0xFFFF00000000FFFFn;
  estado.bitboard_brancas = 0x000000000000FFFFn;
  estado.bitboard_pretas = 0xFFFF000000000000n;

  estado.casas_atacadas_pelas_pretas = 0n;
  estado.casas_atacadas_pelas_brancas = 0n;
  
  estado.turno = 1;
  estado.numero_lances_brancas = 0;
  estado.numero_lances_pretas = 0;
  
  estado.movimento_duplo_piao_branco = 0x000000000000FF00n;
  estado.movimento_duplo_piao_preto = 0x00FF000000000000n;

  estado.en_passant_brancas = 0n;
  estado.en_passant_pretas = 0n;
  
  estado.roque_esquerda_branco = true;
  estado.roque_direita_branco = true;

  estado.roque_esquerda_preto = true;
  estado.roque_direita_preto = true;
  
  estado.casa_rei_roque_direita_branco = 0x0000000000000040n;
  estado.casa_torre_roque_direita_branco = 0x0000000000000020n;
  estado.casa_rei_roque_esquerda_branco = 0x0000000000000004n;
  estado.casa_torre_roque_esquerda_branco = 0x0000000000000008n;

  estado.casas_roque_direita_branco = 0x0000000000000060n;
  estado.casas_roque_esquerda_branco = 0x000000000000000En;

  estado.casas_roque_direita_preto = 0x0E00000000000000n;
  estado.casas_roque_esquerda_preto = 0x6000000000000000n;

  estado.casa_rei_roque_direita_preto = 0x4000000000000000n;
  estado.casa_torre_roque_direita_preto = 0x2000000000000000n;
  estado.casa_rei_roque_esquerda_preto = 0x0400000000000000n;
  estado.casa_torre_roque_esquerda_preto = 0x0800000000000000n;
}