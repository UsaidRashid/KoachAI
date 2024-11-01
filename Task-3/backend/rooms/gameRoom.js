const { Room } = require("colyseus");

class GameRoom extends Room {
  onCreate(options) {
    this.maxClients = options.maxClients || 4;
    console.log("attemting create");
    this.setState({ players: {}, shapes: {} });

    this.onMessage("extrude", (client, shapeData) => {
      console.log("attemting extrude");
      const shapeId = `shape_${Date.now()}`;
      this.state.shapes[shapeId] = shapeData;
      this.broadcast("extrude", {
        id: shapeId,
        type: shapeData.type,
        position: shapeData.position,
      });
    });

    this.onMessage("move", (client, movementData) => {
      console.log("attemting move");
      const { direction, position } = movementData;
      const shapeId = Object.keys(this.state.shapes).find(
        (id) =>
          this.state.shapes[id].position.x === position.x &&
          this.state.shapes[id].position.z === position.z
      );
      if (shapeId) {
        this.state.shapes[shapeId].position = position;
        this.broadcast("move", { id: shapeId, position });
      }
    });
  }

  onJoin(client) {
    console.log("attemting join");
    if (this.clients.length > this.maxClients) {
      // Reject the client if the room is full
      console.log("max hogya");
      client.close();
      return;
    }
    this.state.players[client.sessionId] = { id: client.sessionId };
    console.log(`${client.sessionId} joined.`);
  }

  onLeave(client) {
    console.log("attemting leave");
    delete this.state.players[client.sessionId];
    console.log(`${client.sessionId} left.`);
  }

  onDispose() {
    console.log("Room disposed");
  }
}

module.exports = { GameRoom };
