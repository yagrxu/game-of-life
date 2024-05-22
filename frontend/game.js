
function render(){

    const gameCanvas = document.getElementById("gameCanvas");
    const statusCanvas = document.getElementById("statusCanvas");
    
    if (gameData.gameStatus == GameStatus.WELCOME) {
        renderWelcome(gameCanvas, statusCanvas, runGame);
    }
    else if(gameData.gameStatus == GameStatus.PLAYING){
        // Draw the button
        drawMap(gameCanvas, gameData.mapData);


        let radioOptions = [
            { label: capitalizeFirstLetter(SELECTED_TILE_TYPE.VILLAGE), selected: true },
            { label: capitalizeFirstLetter(SELECTED_TILE_TYPE.CANNON), selected: false }
        ];
        drawRadioButtonGroup(statusCanvas, 30, 30, radioOptions, true);
        drawButton(statusCanvas, 250, 35, 170, 30, "Finish My Round", switchPlayer);
    }
    else if(gameData.gameStatus == GameStatus.GAME_OVER){
        renderGameOver(gameCanvas);
    }
}

function handleCanvasClick(event, players) {
    const rect = event.target.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const clickedCol = Math.floor(mouseX / GameConstants.cellSize);
    const clickedRow = Math.floor(mouseY / GameConstants.cellSize);

    console.log("clicked:", clickedRow, clickedCol)

    // Check if the current player has enough points and the clicked cell is dead
    if (gameData.mapData[clickedRow][clickedCol] === 0 && gameData.selectedType == SELECTED_TILE_TYPE.VILLAGE && gameData.currentPlayer.points > 0) {
        gameData.mapData[clickedRow][clickedCol] = {'id': gameData.currentPlayer.id, 'type': gameData.selectedType, 'icon': gameData.currentPlayer[gameData.selectedType]}
        gameData.currentPlayer.playerCacheMap[clickedRow][clickedCol] = {'id': gameData.currentPlayer.id, 'type': gameData.selectedType}
        gameData.currentPlayer.points--;
    }
    else if (gameData.mapData[clickedRow][clickedCol] === 0 && gameData.selectedType == SELECTED_TILE_TYPE.CANNON && gameData.currentPlayer.points > 1) {
        gameData.mapData[clickedRow][clickedCol] = {'id': gameData.currentPlayer.id, 'type': gameData.selectedType, 'icon': gameData.currentPlayer[gameData.selectedType]}
        gameData.currentPlayer.playerCacheMap[clickedRow][clickedCol] = {'id': gameData.currentPlayer.id, 'type': gameData.selectedType}
        gameData.currentPlayer.points -= 2;
    }
    else if (gameData.mapData[clickedRow][clickedCol] !== 0 && gameData.currentPlayer.playerCacheMap[clickedRow][clickedCol] !== 0){
        if(gameData.mapData[clickedRow][clickedCol].type === SELECTED_TILE_TYPE.CANNON) {
            gameData.currentPlayer.points += 2;
        }
        else if(gameData.mapData[clickedRow][clickedCol].type === SELECTED_TILE_TYPE.VILLAGE) {
            gameData.currentPlayer.points += 1;
        }
        gameData.mapData[clickedRow][clickedCol] = 0;
        gameData.currentPlayer.playerCacheMap[clickedRow][clickedCol] = 0;
        
    }
    // Update the display
    drawMap(event.target, gameData.mapData);
}

function initializeGrid(canvas, players) {
    canvas.addEventListener("click", (event) => {
        handleCanvasClick(event, players);
    });
}

function switchPlayer() {
    for(var i = 0; i < gameData.players.length; i++) {
        if(gameData.players[i].status == 'running') {
            gameData.currentPlayer = gameData.players[i];
            return true;
        }
    }
    return false;
}

function updateNewMapData(data) {
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            if (data[i][j] != 0) {
                data[i][j].type = SELECTED_TILE_TYPE.VILLAGE;
                data[i][j].icon = gameData.playerById[data[i][j].id][SELECTED_TILE_TYPE.VILLAGE]
            }
        }
    }
}

function newRound(data) {
    for(var i = 0; i < gameData.players.length; i++) {
        gameData.players[i].newRound();
    }
    updateNewMapData(data);
    gameData.mapData = data;
    drawMap(gameCanvas, gameData.mapData);
}

function update(){
    let playersData = [];
    for (var i = 0; i < gameData.players.length; i++) {
        playersData.push(gameData.players[i].toData());
    }
    updateData({
        initial: gameData.initial,
        action_id: 1,
        data: {
            'players': playersData
        },
    }, 'update', function(err, data){
        console.log(err);
        console.log(data);
        if (data.game_over === true) {
            gameData.initial = false;
            newRound(data.map);
            gameData.gameStatus = GameStatus.GAME_OVER;
            render();
        }
        else if(data.next_round === true) {
            gameData.initial = false;
            newRound(data.map);
        }
    })
}

function next() {
    update();
    drawMap(gameCanvas, gameData.mapData);
}

function runGame(playerNumber) {
    initPlayers(playerNumber)
    render();
    initializeGrid(gameCanvas, gameData.players);
    next();
    setInterval(() => {
        if(gameData.gameStatus != GameStatus.GAME_OVER){
            next();
        }
    }, 5000);
}


function initPlayers(playerNumber) {
    for(var i = 0; i < playerNumber; i++) {
        let player = new Player();
        let v = new Image();
        v.src = './images/village0' + (i+1) + '.png';
        const c = new Image();
        c.src = './images/cannon0' + (i+1) + '.png';
        player.init('' + i, 10, 5, PlayerColor[i], PlayerName[i], v, c);
        gameData.playerById['' + i] = player;
        gameData.players.push(player);
    }
    gameData.currentPlayer = gameData.players[0];
}


render();
