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
	var init = function ()
	{
		isGameRunning = true;
		prevTime = new Date().getTime();
		mainLoop();
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


	/**
	 * MAJ des positions de chaque tank
	 * 
	 */
	function updatePlayerTank (name, tank) {			  // SERT A client.JS
		if (userName === name) {
			console.log('name');
		}
		allPlayers[name].tank.updateTank(tank);
	}

	/**
	 * ajout d'un nouveau missile
	 * 
	 */
	function addNewMissile (newMissile) {
		var miss = new Missile();
		miss.updateMissile(newMissile);
		allMissiles.push(miss);
		soundMiss.play();                                                   // TODO new missile sound
	}


	/**
	 * MAJ du tableau des joueurs (connexion et deconnexion)
	 * @param listOfPlayers
	 */
	function updatePlayers (listOfPlayers) {
		allPlayers = listOfPlayers;
		console.log("allPlayers" + allPlayers);
		/*for (var name in allPlayers) {
			if(allPlayers[name].tank === null) {
				allPlayers[name].tank = new Tank();
				allPlayers[name].tank.init(100, 100, 0, 'black');            // TODO couleur à virer
			}
		}*/
	}




	/**
	 * bouge le tank du joueur
	 * @param tank
	 */
	function moveTank(userTank) {
		userTank.tank.move(deltaTime/1000);
	}

	/**
	 * Bouge tous les joueurs
	 */
	function moveAllPlayers() {
		for (var name in allPlayers) {
			moveTank(allPlayers[name]);
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
		updatePlayers: updatePlayers,
		soundPlayer: soundPlayer,
		updatePlayerTank: updatePlayerTank,
		addNewMissile: addNewMissile
	};
};