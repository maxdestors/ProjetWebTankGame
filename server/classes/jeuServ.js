/**
 * Created by Romain on 18/02/2015.
 */

var Jeu = function()
{
	var canvas, ctx, w, h;

	var isGameRunning;

	var mousePos;
	var userName;
	var allPlayers = {};

	// missiles
	var allMissiles = new Array();

	// sounds
	var soundMiss, soundNewPlayer;

	// fps
	var frameCount = 0;
	var lastTime;
	var fpsContainer;
	var fps;

	//deltatime
	var prevTime;
	var deltaTime;

	/**
	 *  INITIALISATION
	 */
	var init = function (arrayName)
	{
		for (var name in arrayName) {
			allPlayers[name] = new Player();
			allPlayers[name].init(name, arrayName[name], true)
		}
		start();
	};

	var start = function ()
	{
		isGameRunning = true;
		prevTime = new Date().getTime();
		mainLoop();
	};

	var stop = function ()
	{
		for (var name in allPlayers) {
			delete allPlayers[name];
		}
		
		isGameRunning = false;
		console.log('game stopped');
	};

	/**
	 * ANIMATION MAINLOOP
	 */
	function mainLoop(time)
	{
		manageDeltaTime(time);
		
		//clearCanvas();

		moveAllMissiles();

		moveAllPlayers();
		//requestAnimationFrame(mainLoop);
		if (isGameRunning) {
			setTimeout(mainLoop, 50);
		}
	}


	function sendNewMove (newMove, state) {
		socket.emit('sendNewMove', newMove, state);
	}

	var newMove = function (name, newMovement, state) {
		return allPlayers[name].newMove(newMovement, state);
	};


	/**
	 * ajout d'un nouveau missile
	 * 
	 */
	function addNewMissile (newMissile) {
		var miss = new Missile();
		miss.updateMissile(newMissile);
		allMissiles.push(miss);
		//soundMiss.play();                                                   // TODO new missile sound
	}


	/**
	 * MAJ du tableau des joueurs (connexion et deconnexion)
	 * @param listOfPlayers
	 */
	function updatePlayers (listOfPlayers) {
		allPlayers = listOfPlayers;
		console.log("allPlayers" + allPlayers);
	}




	/**
	 * Bouge tous les joueurs
	 */
	function moveAllPlayers() {
		for (var name in allPlayers) {
			allPlayers[name].moveTank(deltaTime/1000);
		}
	}

	/**
	 * Bouge tous les missiles et supprime
	 */
	function moveAllMissiles() {
		for (var i = allMissiles.length - 1; i >= 0; i--) {
			if (!allMissiles[i].move(deltaTime/1000)) {
				allMissiles.splice(i, 1);
			}
		};
	}


	function manageDeltaTime() {
		var newTime = new Date().getTime();
		deltaTime = newTime - prevTime;
		prevTime = newTime;
	}

	// methodes publiques
	return {
		init: init,
		start: start,
		stop: stop,
		newMove: newMove,
		updatePlayers: updatePlayers,
		// updatePlayerTank: updatePlayerTank,
		addNewMissile: addNewMissile
	};
};