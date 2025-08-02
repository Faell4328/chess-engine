import express from 'express';
import { resolve } from 'path';

import * as movimentacao from './movimentacao.js';
import * as traducao from './traducao.js';
import { visualizadeiro } from './visualizador.js';
import { estado, zerar } from './variaveis.js';

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
    zerar();
    res.send("invalido");
  }
  return;
});

app.listen(4000 , () => {
  console.log("Rodando servidor");
});