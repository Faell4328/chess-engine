import express from 'express';
import { resolve } from 'path';

import { mover } from './movimentacao.js';
import { converter, converterFEN, desconverterFEN } from './traducao.js';
import { sincronizar_partida_real_com_partida_simulada, sincronizar_partida_simulada_com_partida_real, zerar } from './variaveis.js';
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
    let promocao = req.body.promocao;

    // if(promocao != null){

    //   promocao = promocao.toLowerCase();
      
    //   if(promocao != "q" && promocao != "r" && promocao != "b" && promocao != "n"){
    //     promocao = "q";
    //   }
    // }

    mover(BigInt(origem), BigInt(destino), promocao);

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
    
    if(error.message == "Xeque mate" || error.message == "Empate por afogamento"){
      process.exit(0);
    }

    return;
  }
});

app.post('/fen', (req, res) => {

  try{
    const fen = req.body.fen;

    desconverterFEN(fen);
    sincronizar_partida_simulada_com_partida_real();
    
    Calcular.casas_atacadas();
    Calcular.se_rei_atacado("w");
    Calcular.se_rei_atacado("b");
    sincronizar_partida_real_com_partida_simulada()

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