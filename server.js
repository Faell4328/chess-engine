import express from 'express';
import { resolve } from 'path';

import * as movimentacao from './movimentacao.js';
import * as traducao from './traducao.js';
import { visualizadeiro } from './visualizador.js';
import { sincronizar_estado_com_simulado, zerar } from './variaveis.js';

const app = express();

app.use(express.static(resolve('server', "public")));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(resolve('server', 'index.html'));
  return;
});

app.post('/mover', (req, res) => {

  try{
    const origem = traducao.converter(req.body.origem.toUpperCase());
    const destino = traducao.converter(req.body.destino.toUpperCase());

    movimentacao.mover(BigInt(origem), BigInt(destino), 0b111);

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

    response = {
      status: error.message,
      fen: traducao.converterFEN(),
    }

    res.json(response);
    return;
  }
});

app.post('/fen', (req, res) => {

  try{
    const fen = req.body.fen;

    traducao.desconverterFEN(fen);
    sincronizar_estado_com_simulado();

    const response = {
      status: "ok",
      fen: traducao.converterFEN()
    }

    res.json(response);
    return;
  }
  catch(error){
    console.log(error);
    console.log(error.message);

    res.end();
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
  inicio()
  console.log("Rodando servidor");
});