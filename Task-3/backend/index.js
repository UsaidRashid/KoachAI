const { Server } = require("colyseus");
const { WebSocketTransport } = require("@colyseus/ws-transport");
const express = require("express");
const http = require("http");
const cors = require("cors");
const { monitor } = require("@colyseus/monitor");

const PORT = 5000;
const app = express();
const server = http.createServer(app);

const transport = new WebSocketTransport({
  pingInterval: 30000,
  pingMaxRetries: 5,
});

const gameServer = new Server({
  transport,
  server,
});

const corsOptions = {
  origin: "http://localhost:4200/",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use("/colyseus", monitor());

const { GameRoom } = require("./rooms/gameRoom");
gameServer.define("game_room", GameRoom);

gameServer.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
