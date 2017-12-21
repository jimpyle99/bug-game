const SCALE = {
    x: 101,
    y: 83
};

const GRID = {
    xMin: 0,
    xMax: 4,
    yMin: 0,
    yMax: 5
};

const PLAYER_DIMENSIONS = {
    width: 55,
    offsetX: 23,
    offsetY: 23
};

const PLAYER_START = {
    x: 2,
    y: 5
};

const BUG_DIMENSIONS = {
    //width: SCALE.x,
    width: 92,
    offsetX: 3,
    offsetY: 25
};

const CHAR_LIST = ['images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'];

// Speeds are in blocks per second
const BUG_MIN_SPEED = 1;
const BUG_MAX_SPEED = 3;

// Draw collision boxes
DRAW_DEBUG = false;

const Entity = function (x, y, dimensions) {
    this.x = x;
    this.y = y;
    this.dimensions = dimensions;
};

// creates a new game
const resetGame = function() {
    //clears the canvas or board
    window.other.shift();
    // creates new player
    player = new Player();
    // places the selector in the starting position
    window.selector.x = 0;
    window.selector.y = 7;
}
// Draw the entity on the screen, required method for game
Entity.prototype.render = function () {
    // Scale x and y from grid coordinates to pixels
    const pixelX = this.x * SCALE.x;
    const pixelY = this.y * SCALE.y;
    ctx.drawImage(Resources.get(this.sprite), pixelX, pixelY - this.dimensions.offsetY);

    if (!DRAW_DEBUG) {
        return;
    }

    ctx.strokeStyle = '#ff00ff';
    ctx.lineWidth = 3;
    ctx.strokeRect(this.left, pixelY + 50, this.dimensions.width, SCALE.y);
};

// Entity collision dimensions
Object.defineProperty(Entity.prototype, 'left', {
    get: function () {
        return this.x * SCALE.x + this.dimensions.offsetX;
    }
});
Object.defineProperty(Entity.prototype, 'right', {
    get: function () {
        return this.left + this.dimensions.width;
    }
});

// Enemies our player must avoid
const Enemy = function () {

    // Start Enemy off-screen, horizontally
    const startX = -1;

    // Start Enemy in random stone block row
    const startY = Math.floor(Math.random() * 3) + 1;

    // Set starting position and inherit Entity members
    Entity.call(this, startX, startY, BUG_DIMENSIONS);

    this.sprite = 'images/enemy-bug.png';
    this.speed = BUG_MIN_SPEED + Math.random() * BUG_MAX_SPEED;
};

// Clone Entity prototype to share methods
Enemy.prototype = Object.create(Entity.prototype);

// Change constructor for proper identification
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    // Destroy this bug since he's off-screen and create a new one
    if (this.x > GRID.xMax + 1) {
        let index = allEnemies.indexOf(this);
        allEnemies.splice(index, 1);
        allEnemies.push(new Enemy());
    }
};


const Player = function () {
    window.star = new Star();

    other.unshift(window.star);

    this.haswon = false;

    // Set starting position and inherit Entity members
    Entity.call(this, PLAYER_START.x, PLAYER_START.y, PLAYER_DIMENSIONS);

    this.charIndex = 0;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = CHAR_LIST[this.charIndex];
};

// Clone Entity prototype to share methods
Player.prototype = Object.create(Entity.prototype);

// Change constructor for proper identification
Player.prototype.constructor = Player;

// Player warps from cell to cell so the 'dt' value is not needed
// Instead, check for player collisions with other Entities
Player.prototype.update = function () {

    if (this.haswon) {
        alert("You Win!");
        resetGame();
    }

    // Only check Enemies that are on the same row
    allEnemies
        .filter(enemy => enemy.y === this.y)
        .forEach(enemy => {
            if (enemy.right >= this.left && enemy.left <= this.right) {
                // Reset game
                resetGame();
                alert("You were captured by the bug.  You must never lose hope and try again.");
            }
        });

    if (this.y === 0) {
        this.x = 2;
        this.y = 5;
        alert("You fell in the water.  It took a while to swim back around but you never give up.");
    }

    if (this.x === star.x && this.y === star.y) {
        this.haswon = true;
    }

};

Player.prototype.handleInput = function (dir) {
    switch (dir) {
        case 'left':
            // set the new player location
            this.x -= 1;
            // ensure the player can't go outside the map
            this.x = Math.max(this.x, GRID.xMin);
            break;
        case 'up':
            this.y -= 1;
            this.y = Math.max(this.y, GRID.yMin);
            break;
        case 'right':
            this.x += 1;
            this.x = Math.min(this.x, GRID.xMax);
            break;
        case 'down':
            this.y += 1;
            this.y = Math.min(this.y, GRID.yMax);
            break;
        case 'comma':
            this.charIndex -= 1;
            this.charIndex = Math.max(0, this.charIndex);
            this.sprite = CHAR_LIST[this.charIndex];
            window.selector.x = this.charIndex;
            break;
        case 'period':
            this.charIndex += 1;
            this.charIndex = Math.min(4, this.charIndex);
            this.sprite = CHAR_LIST[this.charIndex];
            window.selector.x = this.charIndex;
            break;
    }
};

const Statue = function (charIndex) {

    // Set starting position and inherit Entity members
    Entity.call(this, charIndex, 7, PLAYER_DIMENSIONS);

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = CHAR_LIST[charIndex];
};

// Clone Entity prototype to share methods
Statue.prototype = Object.create(Entity.prototype);

// Change constructor for proper identification
Statue.prototype.constructor = Statue;

// howdy
const Selector = function () {
    this.x = 0;
    this.y = 7;
    // Set starting position and inherit Entity members
    Entity.call(this, this.x, this.y, PLAYER_DIMENSIONS);

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/Selector.png';
};

// Clone Entity prototype to share methods
Selector.prototype = Object.create(Entity.prototype);

// Change constructor for proper identification
Selector.prototype.constructor = Selector;

const Star = function () {
    this.x = Math.floor(Math.random() * 5);
    this.y = 1;
    // Set starting position and inherit Entity members
    Entity.call(this, this.x, this.y, PLAYER_DIMENSIONS);

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/Star.png';
};

// Clone Entity prototype to share methods
Star.prototype = Object.create(Entity.prototype);

// Change constructor for proper identification
Star.prototype.constructor = Star;
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
window.allEnemies = [new Enemy(), new Enemy(), new Enemy()];

window.selector = new Selector();

window.other = [
    window.selector,
    new Statue(0),
    new Statue(1),
    new Statue(2),
    new Statue(3),
    new Statue(4)
];


window.player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        188: 'comma',
        190: 'period'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
