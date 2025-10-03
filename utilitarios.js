function verificar_promocao(){
  let fen = board.fen().split(" ")[0];
  fen = fen.split("/");

  if(fen[0].indexOf("P") != -1 || fen[7].indexOf("p") != -1){
    promocao = prompt("Você pode promover!\n\"q\" para rainha\n\"r\" para torre\n\"b\" para bispo \n\"n\" para cavalo\nO default é rainha") || "q";
    return promocao.toLowerCase();
  }

  return null;
}

function iniciar_som(arquivo){
  document.getElementById("audio").pause();
  document.getElementById("audio").load();
  document.getElementById("audio").src = `som/${arquivo}.mp3`;
  document.getElementById("audio").play();
}