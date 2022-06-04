"use strict";


const socket = io(window.location.origin.replace("http", "ws"));
let loaded = false, gameOptions;
window.onload = _ => {
	loaded = true;
	window.menu = new Menu(socket);
	if (!window.chrome)
		displayToast("This website is best viewed in a chromium based browser");
	if (gameOptions)
		startGame(gameOptions);
};

socket.on("ready", version => {
	const refreshNow = localStorage.version && localStorage.version != version;
	localStorage.version = version;
	if (refreshNow) {
		console.warn("browser cache outdated, refreshing");
		window.location.reload(true);
	}
	socket.emit("uuid", localStorage.uuid);
});
socket.on("uuid-new", uuid => {
	localStorage.uuid = uuid;
	loadMatchMaking();
});
socket.on("uuid-ok", _ => {
	loadMatchMaking();
});

function loadMatchMaking() {
	if (!loaded)
		return setTimeout(loadMatchMaking, 20);
	window.menu.connectedOnline();
}
socket.on("disconnect", _ => {
	window.menu.disconnectedOnline();
});

socket.on("game-launch", (options, me) => {
	options.isOnline = true;
	startGame(options, me);
});
function startGame(options, me) {
	if (!loaded)
		return gameOptions = options || {};
	if (window.game)
		window.game.destroy();
	window.menu.el.setAttribute("hidden", "");
	if (options.isOnline && window.location.pathname != "/" + options.shortCode)
		window.history.pushState(options.shortCode, "", "/" + options.shortCode);
	window.game = new ClientGame(document.body, options, options.isOnline && socket, me);
}

window.onpopstate = e => location.reload(); // TODO: proper way, this will do for now tho

socket.on("generic-error", error => {
	console.error(error);
	alert(error);
});

gameOptions = {
  public: false,
  time: {start:[-1,-1]},
  players: [{name: "you", side: 0}, {name: "you", side: 1}],
};
function v2c(v){
  return [v.l,v.t,v.x,v.y]
}
function c2v(c){
  return new Vec4(c[2],c[3],c[0],c[1]);
}


function mkMoves (mss){
  let result = []
  for(let ms of mss){
    let r=[]
    for (let m of ms) r.push({from:c2v(m[0]), to:c2v(m[1])})
    result.push(r)
  }
  return result
}

gameOptions.moves = mkMoves([
  [[[0,0,6,4],[0,0,5,4]]],
[[[0,1,0,6],[0,1,2,5]]],
[[[0,2,7,5],[0,2,3,1]]],
[[[0,3,1,4],[0,3,2,4]]],
[[[0,4,6,2],[0,4,5,2]]],
[[[0,5,2,5],[0,5,4,4]]],
[[[0,6,7,3],[0,6,5,1]]],
[[[0,7,0,3],[0,7,2,5]]],
[[[0,8,5,1],[0,0,1,5]]],
[[[1,1,0,4],[1,1,1,5]]],
[[[1,2,7,6],[1,2,5,5]]],
[[[1,3,1,4],[1,3,2,4]]],
[[[1,4,5,5],[1,2,3,5]]],
[[[1,5,0,3],[1,5,4,7]]],
[[[1,6,6,4],[1,6,5,4]]],
[[[0,9,2,5],[0,1,6,5]]],
/*
  [[[0,0,6,2],[0,0,5,2]]],
  [[[0,1,1,3],[0,1,3,3]]],
  [[[0,2,7,3],[0,2,5,1]]],
  [[[0,3,3,3],[0,3,4,3]]],
  [[[0,4,7,6],[0,4,5,7]]],
  [[[0,5,0,6],[0,5,2,7]]],
  [[[0,6,5,7],[0,6,7,6]]],
  [[[0,7,2,7],[0,7,0,6]]],
  [[[0,8,7,6],[0,8,5,7]]],
  [[[0,9,0,6],[0,9,2,7]]],
  [[[0,10,5,7],[0,10,7,6]]],
  [[[0,11,0,3],[0,11,2,3]]],*/
])