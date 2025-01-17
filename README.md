# multiverse chess

This is the source code behind [multiversechess.com](https://multiversechess.com/). ~~Heroku~~ Fly.io is used as free hosting. Feel free to join the [multiverse chess discord](https://discord.gg/UgVKykY)!


note: If I were to start over, I would select WebGL (or js+canvas) for rendering. However, I wanted to see how far DOM could be pushed.

The game logic is ran by both the client and the server, for this reason the decision was made to use nodejs for backend.  
The client visualisation and animations are layered ontop of the game logic classes.

### What's what

* **public/js/game.js** and **public/js/gamePieces.js**: This is the core logic of the game. It validates all the moves and keeps track of the game state. Used by both the client and the server.
* **public/js/client.js** and **public/js/clientPieces.js**: These files layer the animations by hooking into inherited methods from the core game logic above. Used in the client.
* **public/js/main.js** and **public/js/menu.js**: These are the main files for the client, they control the user workflow and the main menu.
* **index.js**, **socket.js** and **discordBridge.js**: These are the main files for the server, they manage all the games and notify the discord bridge when new games are created.

### Credit

Thanks a ton to [penteract](https://github.com/penteract) for his [hypercuboid checkmate search algorithm](https://github.com/penteract/hcuboid-ts).