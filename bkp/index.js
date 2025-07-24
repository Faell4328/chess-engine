import * as movimentacao from '../movimentacao.js';
import * as traducao from '../traducao.js';
import { estado } from '../variaveis.js';
import { visualizadeiro } from '../visualizador.js';

import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function perguntar() {
  const jogar = estado.turno == 1 ? "Brancas" : "Pretas"
  rl.question(`Digite a jogada (${jogar}): `, (jogada) => {
    if (jogada === "") {
      rl.close();
      return;
    }
    const de = traducao.converter(jogada.split(" ")[0]);
    const para = traducao.converter(jogada.split(" ")[1]);

    console.log("\n-- Movimentação feita --\n");
    console.log("A peça vai de: \n" + visualizadeiro(de) + '\n');
    console.log("Para: \n" + visualizadeiro(para) + '\n');
    movimentacao.mover(BigInt(de), BigInt(para), 0b111);

    perguntar();
  });
}

perguntar();