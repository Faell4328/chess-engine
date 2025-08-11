import express from 'express';
import { resolve } from 'path';

import * as movimentacao from './movimentacao.js';
import * as traducao from './traducao.js';
import { visualizadeiro } from './visualizador.js';
import { zerar } from './variaveis.js';

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

    const response = {
      status: "ok",
      fen: traducao.converterFEN()
    }

    res.json(response);
    return;
  }
  catch(error){

    let response

    console.log(error);
    console.log(error.message);

    if(error.message == "Inválido"){
      response = {
        status: "invalido",
        fen: traducao.converterFEN()
      }
    }
    else if(error.message == "Xeque Mate"){
      response = {
        status: "xeque mate"
      }
    }
    else if(error.message == "xeque"){
      response = {
        status: "xeque",
        fen: traducao.converterFEN()
      }
    }

    res.json(response);
    return;
  }
});

app.get("/resetar", (req, res) => {
  console.log("Jogo resetado");
  zerar();
  res.end();
  return;
})

app.listen(4000 , () => {
  console.log("Rodando servidor");
});