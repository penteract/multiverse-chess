"use strict";


// When this project was still in active development, the idea here was that this had be run only on the clients since it can sometimes be very expensive.
// It would be ran in a background worker task, as to not lag the interface.
// If the client were to tamper with this file and disable it, at best it could cause the client to not report a checkmate, but since there are no legal moves the only option would be for said client to time out.
// Not sure if this idea is solid enough for real world. It can always be ran on the server too just in case, probably best to do this with a timelimit.

self.importScripts("/js/gamePieces.js?" + self.location.search
                  ,"/js/game.js?" + self.location.search
                  ,"/js/hcuboid.js?" + self.location.search
                  ,"./hcuboid-interface.js"+self.location.search )

class WorkerPlayer extends Player {
	startClock(skipGraceAmount, skipAmount) { }
	stopClock() { }
}
class WorkerGame extends Game {
	instantiatePlayer(side) {
		return new WorkerPlayer(this, side);
	}
	startMateSearch() {
		this.findChecks();
		const gen = this.searchMate();
		const loop = _ => {
			const stopTime = performance.now() + 100;
      let n = 0;
      let k = 0;
      let known = [];
			do {
        n+=1
				const r = gen.next();
        //console.log("iter",r)
        if(r.value){
          k+=1
          known.push(r.value)
        }
				if (k>=1000 || r.done)
					return postMessage(known);
			} while (/*(performance.now() < stopTime) &&*/ n<2000000);
			//this.searchTimeout = setTimeout(loop, 0);
      console.log("timeout",k)
		};
		loop();
	}
	stopMateSearch() {
		clearTimeout(this.searchTimeout);
	}
	*searchMate() {
    for(let c of search(this)){
      if(!c) yield c
      else{
        yield c
        if(false){
        let s = "["
        for(let pt in c){
          s+="[["+c[pt].start+"],["+c[pt].end+"]],"
        }
        yield (s+"]")
        }
      }
    }
    //yield "no escape found"
	};
}

onmessage = function(options) {
	const game = new WorkerGame(options.data, [true, true]);
	game.startMateSearch();

	onmessage = function(move) {
		game.stopMateSearch();
		if (move.data != "stop") {
			game.executeMove("submit", move.data);
			game.startMateSearch();
		}
	}
}