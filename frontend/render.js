function drawButton(canvas, x, y, width, height, text, switchPlayer) {
    const context = canvas.getContext("2d");
    // Button background
    context.fillStyle = "#4CAF50"; // Green color
    context.fillRect(x, y, width, height);

    // Button border
    context.strokeStyle = "#45a049"; // Darker green color
    context.strokeRect(x, y, width, height);

    // Button text
    context.fillStyle = "#ffffff"; // White color
    context.font = "20px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, x + width / 2, y + height / 2);

    canvas.addEventListener("click", function (event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // Check if the click is within the button area
        if (mouseX >= x && mouseX <= x + width && mouseY >= y && mouseY <= y + height) {
            gameData.currentPlayer.status = "waiting";
            if (switchPlayer() == false) {
                console.log("can not switch player");
                // GameStatus.WAITING_FOR_SERVER_UPDATE
            }
        }
    });
}

function drawRadioButtonGroup(canvas, x, y, options, isCreation) {
    const context = canvas.getContext("2d");
    const buttonSize = 20; // Size of the radio buttons
    const spacing = 30; // Spacing between radio buttons and labels

    options.forEach((option, index) => {
        const buttonX = x;
        const buttonY = y + index * spacing;

        // Draw radio button circle
        context.beginPath();
        context.arc(buttonX, buttonY, buttonSize / 2, 0, Math.PI * 2);
        context.stroke();

        // If the option is selected, fill the circle
        if (option.selected) {
            context.fillStyle = "#000000";
        } else {
            context.fillStyle = "#ffffff";
        }
        context.fill();

        // Draw label
        if (isCreation) {
            context.fillStyle = "#000000"; // White color
            context.font = "16px Arial";
            context.textAlign = "left";
            context.textBaseline = "right";
            context.fillText(option.label, buttonX + buttonSize, buttonY + 5);
        }

        // Store button bounds for click detection
        option.bounds = { x: buttonX - buttonSize / 2, y: buttonY - buttonSize / 2, width: buttonSize, height: buttonSize };
    });
    if (isCreation) {
        canvas.addEventListener("click", function (event) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            // Check if the click is within the bounds of any radio button
            options.forEach((option) => {
                if (
                    mouseX >= option.bounds.x &&
                    mouseX <= option.bounds.x + option.bounds.width &&
                    mouseY >= option.bounds.y &&
                    mouseY <= option.bounds.y + option.bounds.height
                ) {
                    // Update selected state of radio buttons
                    options.forEach((opt) => {
                        opt.selected = opt === option;
                        if (opt.selected) {
                            gameData.selectedType = lowerFirstLetter(opt.label);
                        }
                    });
                    // Redraw radio button group
                    drawRadioButtonGroup(canvas, x, y, options, false);
                }
            });
        });
    }
}

function drawMap(canvas, mapData) {
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < GameConstants.height; row++) {
        for (let col = 0; col < GameConstants.width; col++) {
            data = mapData[row][col];
            if (data != 0) {
                context.drawImage(data.icon, col * GameConstants.cellSize, row * GameConstants.cellSize);
            }
        }
    }

    context.fillStyle = gameData.currentPlayer.playerColor;
    context.font = "16px Arial";
    context.textAlign = "left";
    context.fillText(`${gameData.currentPlayer.name}'s Points: ${gameData.currentPlayer.points}`, 10, canvas.height - 10);
}

function drawGrassTile(x, y) {
    ctx.fillStyle = "#8bc34a"; // Light green color
    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

    // Add some variation to the grass tiles
    ctx.fillStyle = "#689f38"; // Darker green color
    for (let i = 0; i < 5; i++) {
        const offsetX = Math.floor(Math.random() * tileSize);
        const offsetY = Math.floor(Math.random() * tileSize);
        ctx.fillRect(x * tileSize + offsetX, y * tileSize + offsetY, 2, 2);
    }
    const tileSize = 36;
    const tilesX = mapWidth / tileSize;
    const tilesY = mapHeight / tileSize;

    // Floor color
    const floorColor = "#D3D3D3";

    // Draw the floor
    ctx.fillStyle = floorColor;
    ctx.fillRect(0, 0, mapWidth, mapHeight);

    // Draw lines between tiles
    ctx.strokeStyle = "black";
    ctx.beginPath();

    // Horizontal lines
    for (let y = 0; y <= tilesY; y++) {
        ctx.moveTo(0, y * tileSize);
        ctx.lineTo(mapWidth, y * tileSize);
    }

    // Vertical lines
    for (let x = 0; x <= tilesX; x++) {
        ctx.moveTo(x * tileSize, 0);
        ctx.lineTo(x * tileSize, mapHeight);
    }

    ctx.stroke();
}

function randomDrawPlayerPoint(player, height, width, handleConflict) {
    for (let i = 0; i < player.initPoints; i++) {
        const randomRow = Math.floor(Math.random() * height);
        const randomCol = Math.floor(Math.random() * width);

        if (player.grid[randomRow][randomCol] === 0) {
            player.grid[randomRow][randomCol] = 1;
            handleConflict(player, randomRow, randomCol);
        }
    }
}
//module.exports = drawButton;

function renderWelcome(canvas, buttonCanvas, startCallback) {
    // const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext("2d");
    // const buttonCanvas = document.getElementById('buttonCanvas');
    const buttonCtx = buttonCanvas.getContext("2d");

    let gameStatus = GameStatus.WELCOME;

    function drawWelcomeScreen() {
        // Draw the welcome message
        ctx.font = "48px Arial";
        ctx.fillStyle = "#333";
        ctx.textAlign = "center";
        ctx.fillText("Welcome to the Game of Life", canvas.width / 2, 100);

        // Draw the input field
        ctx.font = "24px Arial";
        ctx.fillText("Enter the number of players (less than 4):", canvas.width / 2, 200);

        const inputWidth = 200;
        const inputHeight = 40;
        const inputX = (canvas.width - inputWidth) / 2;
        const inputY = 250;

        ctx.strokeStyle = "#333";
        ctx.strokeRect(inputX, inputY, inputWidth, inputHeight);
    }

    function drawStartButton() {
        // Draw the "Start Game" button
        const buttonWidth = 200;
        const buttonHeight = 50;
        const buttonX = (buttonCanvas.width - buttonWidth) / 2;
        const buttonY = (buttonCanvas.height - buttonHeight) / 2;

        buttonCtx.fillStyle = "#333";
        buttonCtx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

        buttonCtx.font = "24px Arial";
        buttonCtx.fillStyle = "#fff";
        buttonCtx.textAlign = "center";
        buttonCtx.fillText("Start Game", buttonCanvas.width / 2, buttonY + buttonHeight / 2 + 8);
    }

    drawWelcomeScreen();
    drawStartButton();

    // Add event listener for input
    const input = document.createElement("input");
    input.type = "number";
    input.style.position = "absolute";
    input.style.left = `${(canvas.width - 200) / 2 + canvas.offsetLeft}px`;
    input.style.top = `${250 + canvas.offsetTop}px`;
    input.style.width = "200px";
    input.style.height = "40px";
    input.style.fontSize = "24px";
    input.style.textAlign = "center";
    document.body.appendChild(input);

    let inputEventListener = input.addEventListener("input", () => {
        const numPlayers = parseInt(input.value, 10);
        if (isNaN(numPlayers) || numPlayers < 1 || numPlayers >= 4) {
            input.style.borderColor = "red";
        } else {
            input.style.borderColor = "green";
            // You can add your game logic here based on the number of players
            console.log(`Number of players: ${numPlayers}`);
        }
    });

    // Add event listener for button click
    let buttonEventListener = buttonCanvas.addEventListener("click", (e) => {
        const rect = buttonCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if the click was inside the button
        if (
            x >= (buttonCanvas.width - 200) / 2 &&
            x <= (buttonCanvas.width - 200) / 2 + 200 &&
            y >= (buttonCanvas.height - 50) / 2 &&
            y <= (buttonCanvas.height - 50) / 2 + 50
        ) {
            // Check if the number of players is valid
            const numPlayers = parseInt(input.value, 10);
            if (numPlayers > 1 && numPlayers <= 4) {
                // Start the game with the specified number of players
                console.log(`Starting game with ${numPlayers} players`);
                gameData.gameStatus = GameStatus.PLAYING;
                console.log(`Game status: ${gameStatus}`);

                // Clear the canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                buttonCtx.clearRect(0, 0, buttonCanvas.width, buttonCanvas.height);
                document.body.removeChild(input);
                buttonCanvas.removeEventListener("click", buttonEventListener);
                canvas.removeEventListener("input", inputEventListener);
                // Add your game logic here
                startCallback(numPlayers);
            } else {
                alert("Please enter a valid number of players (between 2 and 4)");
            }
        }
    });
}

function renderGameOver(canvas) {
    const ctx = canvas.getContext("2d");
    // Draw a half-transparent layer
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Set the fill color to semi-transparent black
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the entire canvas with the semi-transparent color

    // Draw the "Game Over" text
    ctx.font = "48px Arial";
    ctx.fillStyle = "#FFFFFF"; // Set the text color to white
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2); // Draw the text at the center of the canvas
}
