import express from 'express';
import { resolve } from 'path';

import * as movimentacao from './movimentacao.js';
import * as traducao from './traducao.js';
import { visualizadeiro } from './visualizador.js';
import { estado } from './variaveis.js';

const app = express();

app.use(express.static(resolve('server', "public")));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(resolve('server', 'index.html'));
  return;
});

app.post('/mover', (req, res) => {
  try{
    const de = traducao.converter(req.body.de.toUpperCase());
    const para = traducao.converter(req.body.para.toUpperCase());

    console.log("\n-- Movimentação feita --\n");
    console.log("A peça vai de: \n" + visualizadeiro(de) + '\n');
    console.log("Para: \n" + visualizadeiro(para) + '\n');
    movimentacao.mover(BigInt(de), BigInt(para), 0b111);

    res.send(traducao.converterFEN());
  }
  catch(error){
    console.log("Jogo resetado");
    estado.bitboard_piao_branco = 0x000000000000FF00n,
    estado.bitboard_cavalo_branco = 0x0000000000000042n,
    estado.bitboard_bispo_branco = 0x0000000000000024n,
    estado.bitboard_torre_branco = 0x0000000000000081n,
    estado.bitboard_rainha_branco = 0x0000000000000010n,
    estado.bitboard_rei_branco = 0x0000000000000008n,
    
    // ------------------
    
    estado.bitboard_piao_preto = 0x00FF000000000000n,
    estado.bitboard_cavalo_preto = 0x4200000000000000n,
    estado.bitboard_bispo_preto = 0x2400000000000000n,
    estado.bitboard_torre_preto = 0x8100000000000000n,
    estado.bitboard_rainha_preto = 0x1000000000000000n,
    estado.bitboard_rei_preto = 0x0800000000000000n,
    
    estado.bitboard_tabuleiro = 0xFFFF00000000FFFFn,
    estado.bitboard_brancas = 0x000000000000FFFFn,
    estado.bitboard_pretas = 0xFFFF000000000000n,
    
    estado.turno = 1,
    estado.movimento_duplo_piao_branco = 0x000000000000FF00n,
    estado.movimento_duplo_piao_preto = 0x00FF000000000000n,
    estado.en_passant = false,
    res.send("invalido");
  }
  return;
});

app.listen(4001, () => {
  console.log("Rodando servidor");
});