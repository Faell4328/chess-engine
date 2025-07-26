// Recebe a coordenada normal e converte para binário.
export function converter(valor){
  console.log("\n-- Está convertendo de coordenadas para binário --\n");
  let potencia = 0;
  let binario = 0n;
  potencia = Number((valor[1])-1) * 8;

  
  if(Number(valor[0].charCodeAt(0) - "A".charCodeAt(0)) > 7){
    console.log("Jogada invalida");
    throw new Error()
  }
  else if(Number(valor[1])  > 8){
    console.log("Jogada invalida");
    throw new Error()
  }
  
  potencia += (valor[0].charCodeAt(0) - "A".charCodeAt(0));
  console.log("A é pontência é: 2^" + potencia);
  binario = 2**potencia;

  return binario;
}

// Recebe o binário e converte para coordenada normal
export function desconverter(valor){
  console.log("\n-- Está convertendo de binário para coordenadas --\n");
  let letra = String.fromCharCode((Math.floor((valor.toString(2).length) / 8)) + Number("A".charCodeAt(0)));
  let numero = Number((valor.toString(2).length) % 8);

  return letra + numero;
}