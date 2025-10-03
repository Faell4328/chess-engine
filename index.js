let fim_do_jogo = false;

let origem = null;
let destino = null;
let promocao = null;

// Será chamado quando a peça for solta
function onDrop (source, target) {
  origem = null;
  destino = null;
  promocao = null;

  origem = source.toLowerCase();
  destino = target.toLowerCase();
}

// Será chamado quando a peça já encaixou na nova casa (termino da animação)
function onSnapEnd(){

  // Verifica se o peão está na casa de promoção.
  promocao = verificar_promocao();

  let status = null;

  try{

    if(fim_do_jogo == true){
      alert("Jogo finalizado, inicie uma nova partida");
      board.position(converterFEN());
      return;
    }

    origem = converter(origem.toUpperCase());
    destino = converter(destino.toUpperCase());

    mover(BigInt(origem), BigInt(destino), promocao);

    status = "ok";
  }
  catch(error){
    if(error.message == "Xeque mate" || error.message == "Empate por afogamento" || error.message == "Empate por repetição"){
      fim_do_jogo = true;
    }

    status = error.message;
  }

  if(status == "ok"){
    if(promocao == null){
      iniciar_som("movendo");
    }
    else{
      iniciar_som("promocao");
    }
    console.log(converterFEN());
  }
  else if(status == "Captura"){
    iniciar_som("captura");
    console.log(status);
  }
  else if(status == "Xeque mate"){
    iniciar_som("xeque mate");
    alert(status);
  }
  else if(status == "Empate por afogamento" || status == "Empate por repetição"){
    iniciar_som("empate");
    alert(status);
  }
  else if(status == "Xeque"){
    iniciar_som("xeque");
    console.log(status);
  }
  else{
    console.log(status);
  }
  
  board.position(converterFEN());
  return;
}

function fen_personalizado(){
  let campo_input_fen_personalizado = document.getElementById("fen");

  // Verificando se o FEN está vazio
  if(campo_input_fen_personalizado.value == ""){
    alert("O FEN está vazio");
    return;
  }

  try{
    desconverterFEN(campo_input_fen_personalizado.value);
    sincronizar_partida_simulada_com_partida_real();

    Calcular.casas_atacadas();
    Calcular.se_rei_atacado("w");
    Calcular.se_rei_atacado("b");
    sincronizar_partida_real_com_partida_simulada();

    partida_real.fen_jogados.push(campo_input_fen_personalizado.value.split(" ").splice(0, 4).join(" "));

    fim_do_jogo = false;
  }
  catch(error){
    console.warn(error.message);
    return;
  }

  board.position(campo_input_fen_personalizado.value);
  campo_input_fen_personalizado.value = ""
  return;
};

function resetar_partida(){
  fim_do_jogo = false;

  board.start();
  zerar();
  console.clear();

  return;
}

// Cria uma constante que recebe a instância do Chessboard.
const board = Chessboard("tabuleiro", {
  position: "start",
  draggable: true,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
});