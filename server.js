import express from 'express';
import { resolve } from 'path';

import * as movimentacao from './movimentacao.js';
import * as traducao from './traducao.js';
import { visualizadeiro } from './visualizador.js';
import { sincronizar_estado_com_simulado, zerar } from './variaveis.js';
import { implementar, inicio } from './escritor.js';

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

    implementar("\n-- Movimento realizado feita --\n");
    implementar("A peça vai de: \n" + visualizadeiro(origem) + '\n');
    implementar("destino: \n" + visualizadeiro(destino) + '\n');
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
    else if(error.message == "FEN incompleto"){
      response = {
        status: "FEN incompleto",
      }
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