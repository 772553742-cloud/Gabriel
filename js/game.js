// js/game.js
class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.renderer = new Renderer(this.canvas);
        
        this.snake = [];
        this.food = {};
        this.direction = CONSTANTS.DIRECTIONS.RIGHT;
        this.nextDirection = CONSTANTS.DIRECTIONS.RIGHT;
        this.score = 0;
        this.highScore = this.loadHighScore();
        this.gameOver = false;
        this.paused = false;
        this.speed = CONSTANTS.INITIAL_SPEED;
        this.foodsEaten = 0;
        
        this.gameLoop = null;
        this.lastRenderTime = 0;
        
        this.init();
    }
    
    init() {
        this.resetGame();
        this.setupEventListeners();
        this.startGameLoop();
        audioManager.init();
    }
    
    resetGame() {
        // 初始蛇位置（屏幕中央偏左）
        const startX = Math.floor(CONSTANTS.GRID_WIDTH / 2);
        const startY = Math.floor(CONSTANTS.GRID_HEIGHT / 2);
        
        this.snake = [
            { x: startX, y: startY },
            { x: startX - 1, y: startY },
            { x: startX - 2, y: startY }
        ];
        
        this.direction = CONSTANTS.DIRECTIONS.RIGHT;
        this.nextDirection = CONSTANTS.DIRECTIONS.RIGHT;
        this.score = 0;
        this.gameOver = false;
        this.paused = false;
        this.speed = CONSTANTS.INITIAL_SPEED;
        this.foodsEaten = 0;
        
        this.spawnFood();
    }
    
    spawnFood() {
        let validPosition = false;
        while (!validPosition) {
            this.food = {
                x: Math.floor(Math.random() * CONSTANTS.GRID_WIDTH),
                y: Math.floor(Math.random() * CONSTANTS.GRID_HEIGHT)
            };
            
            // 确保食物不在蛇身上
            validPosition = !this.snake.some(segment => 
                segment.x === this.food.x && segment.y === this.food.y
            );
        }
    }
    
    update() {
        if (this.gameOver || this.paused) return;
        
        this.direction = this.nextDirection;
        
        const head = { ...this.snake[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;
        
        // 碰撞检测 - 墙壁
        if (head.x < 0 || head.x >= CONSTANTS.GRID_WIDTH ||
            head.y < 0 || head.y >= CONSTANTS.GRID_HEIGHT) {
            this.endGame();
            return;
        }
        
        // 碰撞检测 - 自己
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.endGame();
            return;
        }
        
        this.snake.unshift(head);
        
        // 检查是否吃到食物
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += CONSTANTS.POINTS_PER_FOOD;
            this.foodsEaten++;
            audioManager.playEatSound();
            
            // 加速
            if (this.foodsEaten % CONSTANTS.SPEED_THRESHOLD === 0) {
                this.speed = Math.max(
                    CONSTANTS.MIN_SPEED,
                    this.speed - CONSTANTS.SPEED_INCREMENT
                );
            }
            
            this.spawnFood();
        } else {
            this.snake.pop();
        }
    }
    
    endGame() {
        this.gameOver = true;
        audioManager.playGameOverSound();
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
    }
    
    togglePause() {
        if (!this.gameOver) {
            this.paused = !this.paused;
        }
    }
    
    loadHighScore() {
        const saved = localStorage.getItem('snakeHighScore');
        return saved ? parseInt(saved, 10) : 0;
    }
    
    saveHighScore() {
        localStorage.setItem('snakeHighScore', this.highScore.toString());
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            // 防止方向键滚动页面
            if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
            
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    if (this.direction.y === 0) this.nextDirection = CONSTANTS.DIRECTIONS.UP;
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    if (this.direction.y === 0) this.nextDirection = CONSTANTS.DIRECTIONS.DOWN;
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (this.direction.x === 0) this.nextDirection = CONSTANTS.DIRECTIONS.LEFT;
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (this.direction.x === 0) this.nextDirection = CONSTANTS.DIRECTIONS.RIGHT;
                    break;
                case ' ':
                    this.togglePause();
                    break;
                case 'r':
                case 'R':
                    if (this.gameOver) {
                        this.resetGame();
                    }
                    break;
            }
        });
        
        // 触摸/点击按键支持
        document.querySelectorAll('.key').forEach(key => {
            key.addEventListener('click', () => {
                const keyType = key.dataset.key;
                switch(keyType) {
                    case 'up':
                        if (this.direction.y === 0) this.nextDirection = CONSTANTS.DIRECTIONS.UP;
                        break;
                    case 'down':
                        if (this.direction.y === 0) this.nextDirection = CONSTANTS.DIRECTIONS.DOWN;
                        break;
                    case 'left':
                        if (this.direction.x === 0) this.nextDirection = CONSTANTS.DIRECTIONS.LEFT;
                        break;
                    case 'right':
                        if (this.direction.x === 0) this.nextDirection = CONSTANTS.DIRECTIONS.RIGHT;
                        break;
                }
            });
        });
        
        // 点击画布暂停
        this.canvas.addEventListener('click', () => {
            this.togglePause();
        });
        
        // 重新开始按钮
        const restartBtn = document.getElementById('restartBtn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.resetGame();
            });
        }
    }
    
    startGameLoop() {
        const loop = (currentTime) => {
            const secondsSinceLastRender = (currentTime - this.lastRenderTime) / 1000;
            
            if (secondsSinceLastRender >= this.speed / 1000) {
                this.update();
                this.lastRenderTime = currentTime;
            }
            
            this.renderer.render({
                snake: this.snake,
                food: this.food,
                score: this.score,
                highScore: this.highScore,
                gameOver: this.gameOver,
                paused: this.paused
            });
            
            requestAnimationFrame(loop);
        };
        
        requestAnimationFrame(loop);
    }
}

// 启动游戏
document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});
