const keypress = require('keypress');
const width = 20;
const height = 10;
let snake = [{ x: 5, y: 5 }];
let food = { x: 10, y: 5 };
let direction = 'right';
let score = 0;
let isGameOver = false;
let username = '';  // Add a variable to store the username
const gameName = 'Snake Game'; // Default game name

// Initialize Firestore
var db = firebase.firestore();

function draw() {
    console.clear();
    console.log('┌' + '─'.repeat(width) + '┐');
    for (let y = 0; y < height; y++) {
        let row = '';
        for (let x = 0; x < width; x++) {
            if (x === 0 || x === width - 1) {
                row += '│';
            } else if (x === food.x && y === food.y) {
                row += '●';
            } else if (snake.some(segment => segment.x === x && segment.y === y)) {
                row += '■';
            } else {
                row += ' ';
            }
        }
        console.log(row);
    }
    console.log('└' + '─'.repeat(width) + '┘');
    console.log(`Score: ${score}`);
    if (isGameOver) {
        console.log('Game over! Press Ctrl+C to exit.');
        saveGameResult(username, score, gameName);  // Save game result when the game is over
    }
}

function update() {
    if (isGameOver) return;

    const head = { ...snake[0] };
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    if (head.x < 1 || head.x >= width - 1 || head.y < 0 || head.y >= height || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        isGameOver = true;
        draw();
        process.stdin.pause();
        return;
    }

    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop();
    }

    snake.unshift(head);
    draw();
}

function generateFood() {
    food.x = Math.floor(Math.random() * (width - 2)) + 1;
    food.y = Math.floor(Math.random() * (height - 2));
}

function startGame() {
    draw();
    process.stdin.setRawMode(true);
    process.stdin.resume();
    keypress(process.stdin);
    process.stdin.on('keypress', (ch, key) => {
        if (key) {
            switch (key.name) {
                case 'up':
                    if (direction !== 'down') direction = 'up';
                    break;
                case 'down':
                    if (direction !== 'up') direction = 'down';
                    break;
                case 'left':
                    if (direction !== 'right') direction = 'left';
                    break;
                case 'right':
                    if (direction !== 'left') direction = 'right';
                    break;
                case 'q':
                    isGameOver = true;
                    draw();
                    process.stdin.pause();
                    break;
            }
        }
    });
    setInterval(update, 200);
}

// Save game result to Firestore
function saveGameResult(username, score, gameName) {
    db.collection("gameResults").add({
        username: username,
        score: score,
        gameName: gameName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
}

// Form submission handler to get username
document.getElementById('dataForm').addEventListener('submit', function(event) {
    event.preventDefault();
    username = document.getElementById('username').value;
    startGame();
});
