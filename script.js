const maxLevel = 10;
const basePoints = 100;
const incrementPerLevel = 50;
const adminPassword = "admin123"; // Simple password for demonstration
let players = [];

// Admin Login Functionality
document.getElementById("admin-login-btn").addEventListener("click", function() {
    const passwordInput = document.getElementById("admin-password").value;
    const errorElement = document.getElementById("login-error");

    if (passwordInput === adminPassword) {
        document.getElementById("admin-controls").style.display = "block";
        document.getElementById("admin-section").style.display = "none";
        errorElement.innerText = "";
    } else {
        errorElement.innerText = "Incorrect password!";
    }
});

// Add Player Functionality
document.getElementById("add-player-btn").addEventListener("click", function() {
    const playerName = document.getElementById("player-name-input").value;

    if (playerName !== "") {
        addPlayer(playerName);
        document.getElementById("player-name-input").value = ""; // Clear input
    }
});

// Update Points Functionality
document.getElementById("update-points-btn").addEventListener("click", function() {
    const playerName = document.getElementById("player-select").value;
    const pointsInput = document.getElementById("points-input").value;
    const pointsToAdd = parseInt(pointsInput) || 0;

    if (playerName && pointsToAdd > 0) {
        const player = players.find(p => p.name === playerName);
        if (player) {
            incrementPoints(player, pointsToAdd);
            document.getElementById("points-input").value = ''; // Clear input
        }
    }
});

// Add Player
function addPlayer(name) {
    const player = {
        name: name,
        level: 1,
        points: 0,
        color: getRandomColor() // Assign a random color
    };
    players.push(player);
    updatePlayerSelect();
    renderPlayer(player);
}

// Get Random Color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Update Player Select Dropdown
function updatePlayerSelect() {
    const playerSelect = document.getElementById("player-select");
    playerSelect.innerHTML = '<option value="" disabled selected>Select Player</option>'; // Reset options

    players.forEach(player => {
        const option = document.createElement("option");
        option.value = player.name;
        option.textContent = player.name;
        playerSelect.appendChild(option);
    });
}

// Get Points Required for Level
function getPointsForLevel(level) {
    return basePoints + (level - 1) * incrementPerLevel;
}

// Render Player UI
function renderPlayer(player) {
    const playerContainer = document.getElementById("player-container");

    // Create player card
    const container = document.createElement("div");
    container.classList.add("container");

    const title = document.createElement("h1");
    title.textContent = `Level Progression - ${player.name}`;
    container.appendChild(title);

    const progressContainer = document.createElement("div");
    progressContainer.classList.add("progress-container");
    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    progressBar.id = `progress-bar-${player.name}`;
    progressBar.style.backgroundColor = player.color; // Set player-specific color
    progressContainer.appendChild(progressBar);
    container.appendChild(progressContainer);

    const levelInfo = document.createElement("div");
    levelInfo.classList.add("level-info");
    levelInfo.innerHTML = `
        <p>Level: <span id="level-${player.name}">${player.level}</span>/10</p>
        <p>Points: <span id="points-${player.name}">${player.points}</span>/<span id="points-required-${player.name}">${getPointsForLevel(player.level)}</span></p>
    `;
    container.appendChild(levelInfo);

    // Add points section (shown to admin only)
    const adminControls = document.createElement("div");
    adminControls.classList.add("admin-controls");

    const input = document.createElement("input");
    input.type = "number";
    input.placeholder = `Enter points for ${player.name}`;
    input.id = `points-input-${player.name}`;
    adminControls.appendChild(input);

    const button = document.createElement("button");
    button.textContent = `Add Points for ${player.name}`;
    button.addEventListener("click", function() {
        const pointsInput = document.getElementById(`points-input-${player.name}`).value;
        const pointsToAdd = parseInt(pointsInput) || 0;
        incrementPoints(player, pointsToAdd);
        document.getElementById(`points-input-${player.name}`).value = ''; // Clear input
    });
    adminControls.appendChild(button);

    container.appendChild(adminControls);
    playerContainer.appendChild(container);

    updateProgress(player);
}

// Update Player Progress
function incrementPoints(player, amount) {
    const pointsForCurrentLevel = getPointsForLevel(player.level);
    player.points += amount;

    while (player.points >= pointsForCurrentLevel && player.level < maxLevel) {
        player.points -= pointsForCurrentLevel;
        player.level++;
    }

    updateProgress(player);
}

// Update UI after Points Change
function updateProgress(player) {
    const progressBar = document.getElementById(`progress-bar-${player.name}`);
    const levelText = document.getElementById(`level-${player.name}`);
    const pointsText = document.getElementById(`points-${player.name}`);
    const pointsRequiredText = document.getElementById(`points-required-${player.name}`);

    const pointsRequired = getPointsForLevel(player.level);
    const progressPercent = (player.points / pointsRequired) * 100;

    progressBar.style.width = `${progressPercent}%`;
    levelText.innerText = player.level;
    pointsText.innerText = player.points;
    pointsRequiredText.innerText = pointsRequired;

    // Update background color
    updateBackgroundColor();
}

// Update Background Color Based on Progress
function updateBackgroundColor() {
    const progressPercent = players.reduce((sum, player) => {
        return sum + (player.points / getPointsForLevel(player.level)) * 100;
    }, 0) / players.length;

    const color = `hsl(${Math.min(120, progressPercent * 1.2)}, 70%, 90%)`;
    document.body.style.backgroundColor = color;
}
