

let score = document.querySelector(".s");
let board = document.querySelector(".board");
const socket = new WebSocket("ws://localhost:8080");

let gameState = null;

let playerId = null;

console.log("Connecting to server...");
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "init"){
       playerId = data.id;
       return;
    }

    if (data.type === "state"){
     gameState = data;             // on message is usd to recieve message from the server 
    drawSnake();
    }
    
};


function drawSnake() {

  if (!gameState) return;
  
  board.innerHTML = "";

    // draw food
  const foodDiv = document.createElement("div");
  foodDiv.style.gridRowStart = gameState.food.y;
  foodDiv.style.gridColumnStart = gameState.food.x;
  foodDiv.className = ("food");
  board.appendChild(foodDiv);

  // draw snake

  for(let id in gameState.players){
    const player = gameState.players[id];
      player.snake.forEach(part => {
    const div = document.createElement("div");
    div.style.gridRowStart = part.y;
    div.style.gridColumnStart = part.x;
    div.className = ("snake");
    board.appendChild(div);
    
  });
   if (id == playerId){
    score.innerText = player.score;
   }

  }



}




  let dx = 0;
  let dy = 0;

document.addEventListener("keydown", e => {


  if (e.key === "ArrowUp" && dy === 0) {
    dx = 0;
    dy = -1;
  }
  if (e.key === "ArrowDown" && dy === 0) {
    dx = 0;
    dy = 1;
  }
  if (e.key === "ArrowLeft" && dx === 0) {
    dx = -1;
    dy = 0;
  }
  if (e.key === "ArrowRight" && dx === 0) {
    dx = 1;
    dy = 0;
  }

  socket.send(JSON.stringify({type:"MOVE",dx,dy}));

});





document.addEventListener("DOMContentLoaded", () => {
    const scoreElement = document.querySelector(".score");
    const event = document.querySelector(".board");
    if (scoreElement){
        // Add the 'show' class to trigger the animation
        scoreElement.classList.add("show");
        
    }
    if (event){
        event.classList.add("show1");
    }
});




