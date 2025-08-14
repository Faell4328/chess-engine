import fs from "fs";

// Essa função deve ser chamada ao iniciar a partida
export function inicio(){
    fs.open("lances.txt", "w", (error, arquivo) => {
        if(error){
            console.log("Erro ao abrir o arquivo de log");
            process.exit(0);
        }
    });
}

// Essa função deve ser chamada para escrever os lances realizados na partida
export function implementar(texto){
    fs.open("lances.txt", "a", (error, arquivo) => {
        if(error ){
            console.log("Erro ao abrir o arquivo de log");
            process.exit(0);
        }

        fs.write(arquivo, texto, (error) => {
            if(error){
                console.log("Erro ao salvar log");
                process.exit(0);
            }
        })
    });
}