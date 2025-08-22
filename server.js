import express from 'express';
import { resolve } from 'path';

import { mover } from './movimentacao.js';
import { converter, converterFEN, desconverterFEN } from './traducao.js';
import { sincronizar_estado_com_simulado, sincronizar_simulado_com_estado, zerar } from './variaveis.js';
import { Calcular } from './calcular.js';

const app = express();

app.use(express.static(resolve('server', "public")));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(resolve('server', 'index.html'));
  return;
});

app.post('/mover', (req, res) => {

  try{
    const origem = converter(req.body.origem.toUpperCase());
    const destino = converter(req.body.destino.toUpperCase());

    mover(BigInt(origem), BigInt(destino));

    const response = {
      status: "ok",
      fen: converterFEN()
    }

    res.json(response);
    return;
  }
  catch(error){
    console.log(error);
    console.log(error.message);

    let response

    response = {
      status: error.message,
      fen: converterFEN(),
    }

    
    res.json(response);
    
    if(error.message == "Xeque mate"){
      process.exit(0);
    }

    return;
  }
});

app.post('/fen', (req, res) => {

  try{
    const fen = req.body.fen;

    desconverterFEN(fen);
    sincronizar_simulado_com_estado();
    Calcular.calcular_casas_atacadas();
    Calcular.verificar_rei_atacado("w");
    Calcular.verificar_rei_atacado("b");

    const response = {
      status: "ok",
      fen: converterFEN()
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
  console.log("Rodando servidor");
});