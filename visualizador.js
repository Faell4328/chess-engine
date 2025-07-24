export function visualizadeiro(bitboard){
  const rows = bitboard.toString(2).padStart(64, "0").match(new RegExp('.{1,' + 8 + '}', 'g'));
  let tabuleiro = "";

  for(var cont = 0; cont < 8; cont ++){
    tabuleiro += rows[cont].split("").reverse().join("") + "\n";
  }
  
  return tabuleiro;
}