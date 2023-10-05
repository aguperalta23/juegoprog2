console.log('client.js ejecutando');
const socket = io();


let roomUniqueId = null;
let player1 = false;

function createGame() {
   // console.log('prob')
   player1 = true;
    socket.emit('createGame');
}

function joinGame(){
    roomUniqueId = document.getElementById('roomUniqueId').value;
    socket.emit('joinGame', {roomUniqueId: roomUniqueId});
}

socket.on("newGame", (data) =>{
    roomUniqueId = data.roomUniqueId;
    document.getElementById('initial').style.display = 'none';
    document.getElementById('gamePlay').style.display = 'block';
    let copyButton = document.createElement('button');
    copyButton.style.display = 'block';
    copyButton.innerText = 'Codigo Copiado';
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(roomUniqueId).then(function() {
                        console.log('Async: copiado del código exitoso');
        }, function(err) {
            console.error('Async: No se pudo copiar texto: ', err);
        });
    });
    document.getElementById('waitingArea').innerHTML = `Esperando oponente, por favor comparte el código ${roomUniqueId} para unirte`;
    document.getElementById('waitingArea').appendChild(copyButton);
});

socket.on("playersConnected", () => {
    document.getElementById('initial').style.display = 'none';
    document.getElementById('waitingArea').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';
});

socket.on("p1Choice",(data) => {
    if(!player1){
        createOpponentChoiceButton(data);
    }
});
socket.on("p2Choice",(data) => {
    if(player1){
        createOpponentChoiceButton(data);
    }
});
function sendChoice(rpsValue){
    const choiceEvent= player1 ? "p1Choice" : "p2Choice";
    socket.emit(choiceEvent,{
        rpsValue: rpsValue,
        roomUniqueId: roomUniqueId
    });
    let playerChoiceButton = document.createElement('button');
    playerChoiceButton.style.display= 'block';
    playerChoiceButton.innerHTML= rpsValue;
    document.getElementById('player1Choice').innerHTML = "";
    document.getElementById('player1Choice').appendChild(playerChoiceButton);
}

socket.on("resultado", (data)=>{
    let winnerText = '';
    if(data.winner != "e"){
        if(data.winner == 'p1' && player1){
            winnerText = 'Ganaste';
        } else if(data.winner == 'p1'){
            winnerText = 'Perdiste';
        }else if(data.winner == 'p2' && !player1){
            winnerText = 'Ganaste';
        } else if(data.winner == 'p2'){
            winnerText = 'Perdiste';
        }
    } else {
        winnerText = 'Empate!'
    }
    document.getElementById('opponentState').style.display = 'none';
    document.getElementById('opponentButton').style.display = 'block';
    document.getElementById('winnerArea').innerHTML = winnerText;
});

function createOpponentChoiceButton(data){
    document.getElementById('opponentState').innerHTML = "Tu oponente ya eligió...";
    let opponentButton = document.createElement('button');
    opponentButton.id = 'opponentButton';
    opponentButton.style.display= 'none';
    opponentButton.innerText = data.rpsValue;
    document.getElementById('player2Choice').appendChild(opponentButton);
}