const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

const size = 20;
const players = {};
let food = randomFood();

wss.on("connection", ws => {
  
  const id = Date.now();  // to store unique id for each player 
  console.log("Player connected:", id);

  players[id] = {
    snake: [{ x: 10, y: 10 }],
    dx: 0,
    dy: 0,
    score: 0
  };

  ws.send(JSON.stringify({type: "init",id}));

  ws.on("message", msg => {
    const data = JSON.parse(msg);
    if (data.type === "MOVE") {
      players[id].dx = data.dx;
      players[id].dy = data.dy;
    }
  });

  ws.on("close", () => {
    delete players[id];
  });
});

function updateGame() {
  for (const id in players) {
    const p = players[id];
    const head = p.snake[0];

    const newHead = {
      x: head.x + p.dx,
      y: head.y + p.dy
    };

    // wall collision
    if (
      newHead.x < 1 || newHead.x > size ||
      newHead.y < 1 || newHead.y > size
    ) {
      p.snake = [{ x: 10, y: 10 }];
      p.dx = p.dy = 0;
      p.score = 0;
      continue;
    }

    p.snake.unshift(newHead);

    // food
    if (newHead.x === food.x && newHead.y === food.y) {
      p.score++;
      food = randomFood();
    } else {
      p.snake.pop();
    }
  }
}

function broadcastGameState() {
  const state = JSON.stringify({
    type: "state",
    players,
    food
  });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(state);
    }
  });
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * size) + 1,
    y: Math.floor(Math.random() * size) + 1
  };
}

setInterval(() => {
  updateGame();
  broadcastGameState();
}, 200);
