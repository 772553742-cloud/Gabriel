// js/game-manager.js
// 游戏管理器 - 统一管理多个游戏

class GameManager {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.currentGameType = 'snake'; // 'snake' | 'tetris'
        
        // 初始化音频
        this.audioManager = audioManager;
        this.audioManager.init();
        
        // 初始化游戏实例
        this.games = {
            snake: null,
            tetris: null
        };
        
        // 渲染器
        this.renderers = {
            snake: null,
            tetris: null
        };
        
        // 初始化
        this.init();
    }
    
    init() {
        // 初始化贪吃蛇
        this.initSnake();
        
        // 初始化俄罗斯方块
        this.initTetris();
        
        // 设置事件监听
        this.setupEventListeners();
        
        // 开始游戏循环
        this.lastTime = 0;
        this.snakeTimer = 0;
        
        // 长按状态
        this.longPressState = {
            active: false,
            direction: null,
            startTime: 0,
            repeatDelay: 100 // 长按重复间隔
        };
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    initSnake() {
        // 创建贪吃蛇游戏实例
        this.games.snake = {
            snake: [],
            food: {},
            direction: CONSTANTS.DIRECTIONS.RIGHT,
            nextDirection: CONSTANTS.DIRECTIONS.RIGHT,
            score: 0,
            highScore: this.loadHighScore('snake'),
            gameOver: false,
            paused: false,
            speed: CONSTANTS.INITIAL_SPEED,
            foodsEaten: 0
        };
        
        this.renderers.snake = new Renderer(this.canvas);
        this.resetSnake();
    }
    
    initTetris() {
        // 创建俄罗斯方块游戏实例
        this.games.tetris = new TetrisGame(this);
        this.renderers.tetris = new TetrisRenderer(this.canvas);
    }
    
    resetSnake() {
        const game = this.games.snake;
        const startX = Math.floor(CONSTANTS.GRID_WIDTH / 2);
        const startY = Math.floor(CONSTANTS.GRID_HEIGHT / 2);
        
        game.snake = [
            { x: startX, y: startY },
            { x: startX - 1, y: startY },
            { x: startX - 2, y: startY }
        ];
        
        game.direction = CONSTANTS.DIRECTIONS.RIGHT;
        game.nextDirection = CONSTANTS.DIRECTIONS.RIGHT;
        game.score = 0;
        game.gameOver = false;
        game.paused = false;
        game.speed = CONSTANTS.INITIAL_SPEED;
        game.foodsEaten = 0;
        
        this.spawnSnakeFood();
    }
    
    spawnSnakeFood() {
        const game = this.games.snake;
        let validPosition = false;
        
        while (!validPosition) {
            game.food = {
                x: Math.floor(Math.random() * CONSTANTS.GRID_WIDTH),
                y: Math.floor(Math.random() * CONSTANTS.GRID_HEIGHT)
            };
            
            validPosition = !game.snake.some(segment => 
                segment.x === game.food.x && segment.y === game.food.y
            );
        }
    }
    
    switchGame(gameType) {
        if (this.games[gameType]) {
            this.currentGameType = gameType;
        }
    }
    
    gameLoop(currentTime) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // 更新当前游戏
        if (this.currentGameType === 'snake') {
            this.updateSnakeTimer(deltaTime);
        } else {
            this.update(deltaTime);
        }
        
        // 渲染当前游戏
        this.render();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update(deltaTime) {
        if (this.currentGameType === 'tetris') {
            this.games.tetris.update(deltaTime);
        }
    }
    
    updateSnakeTimer(deltaTime) {
        const game = this.games.snake;
        if (game.gameOver || game.paused) return;
        
        this.snakeTimer += deltaTime;
        
        // 根据速度设置更新间隔
        if (this.snakeTimer >= game.speed) {
            this.updateSnake();
            this.snakeTimer = 0;
        }
    }
    
    updateSnake() {
        const game = this.games.snake;
        if (game.gameOver || game.paused) return;
        
        game.direction = game.nextDirection;
        
        const head = { ...game.snake[0] };
        head.x += game.direction.x;
        head.y += game.direction.y;
        
        // 碰撞检测
        if (head.x < 0 || head.x >= CONSTANTS.GRID_WIDTH ||
            head.y < 0 || head.y >= CONSTANTS.GRID_HEIGHT) {
            this.endSnakeGame();
            return;
        }
        
        if (game.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.endSnakeGame();
            return;
        }
        
        game.snake.unshift(head);
        
        // 吃食物
        if (head.x === game.food.x && head.y === game.food.y) {
            game.score += CONSTANTS.POINTS_PER_FOOD;
            game.foodsEaten++;
            this.audioManager.playEatSound();
            
            if (game.foodsEaten % CONSTANTS.SPEED_THRESHOLD === 0) {
                game.speed = Math.max(CONSTANTS.MIN_SPEED, game.speed - CONSTANTS.SPEED_INCREMENT);
            }
            
            this.spawnSnakeFood();
        } else {
            game.snake.pop();
        }
    }
    
    endSnakeGame() {
        const game = this.games.snake;
        game.gameOver = true;
        this.audioManager.playGameOverSound();
        
        if (game.score > game.highScore) {
            game.highScore = game.score;
            this.saveHighScore('snake', game.highScore);
        }
    }
    
    render() {
        if (this.currentGameType === 'snake') {
            const game = this.games.snake;
            this.renderers.snake.render({
                snake: game.snake,
                food: game.food,
                score: game.score,
                highScore: game.highScore,
                gameOver: game.gameOver,
                paused: game.paused
            });
        } else if (this.currentGameType === 'tetris') {
            const game = this.games.tetris;
            this.renderers.tetris.render({
                board: game.board,
                currentPiece: game.currentPiece,
                currentX: game.currentX,
                currentY: game.currentY,
                score: game.score,
                highScore: game.highScore,
                gameOver: game.gameOver,
                paused: game.paused
            });
        }
    }
    
    handleInput(action) {
        if (this.currentGameType === 'snake') {
            this.handleSnakeInput(action);
        } else if (this.currentGameType === 'tetris') {
            this.games.tetris.handleInput(action);
        }
    }
    
    handleSnakeInput(action) {
        const game = this.games.snake;
        
        switch(action) {
            case 'up':
                if (game.direction.y === 0) game.nextDirection = CONSTANTS.DIRECTIONS.UP;
                break;
            case 'down':
                if (game.direction.y === 0) game.nextDirection = CONSTANTS.DIRECTIONS.DOWN;
                break;
            case 'left':
                if (game.direction.x === 0) game.nextDirection = CONSTANTS.DIRECTIONS.LEFT;
                break;
            case 'right':
                if (game.direction.x === 0) game.nextDirection = CONSTANTS.DIRECTIONS.RIGHT;
                break;
            case 'rotate':
                // 贪吃蛇模式下旋转键作为暂停
                if (!game.gameOver) {
                    game.paused = !game.paused;
                }
                break;
            case 'pause':
                if (!game.gameOver) {
                    game.paused = !game.paused;
                }
                break;
            case 'restart':
                if (game.gameOver) {
                    this.resetSnake();
                }
                break;
        }
    }
    
    setupEventListeners() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
            
            // 检测长按开始
            const keyMap = {
                'ArrowUp': 'up', 'w': 'up', 'W': 'up',
                'ArrowDown': 'down', 's': 'down', 'S': 'down',
                'ArrowLeft': 'left', 'a': 'left', 'A': 'left',
                'ArrowRight': 'right', 'd': 'right', 'D': 'right'
            };
            
            if (keyMap[e.key] && !this.longPressState.active) {
                this.startLongPress(keyMap[e.key]);
            }
            
            switch(e.key) {
                case ' ':
                    this.handleInput('pause');
                    break;
                case 'r':
                case 'R':
                    this.handleInput('restart');
                    break;
                case 'z':
                case 'Z':
                case 'x':
                case 'X':
                    this.handleInput('rotate');
                    break;
            }
        });
        
        // 键盘释放事件
        document.addEventListener('keyup', (e) => {
            const keyMap = {
                'ArrowUp': 'up', 'w': 'up', 'W': 'up',
                'ArrowDown': 'down', 's': 'down', 'S': 'down',
                'ArrowLeft': 'left', 'a': 'left', 'A': 'left',
                'ArrowRight': 'right', 'd': 'right', 'D': 'right'
            };
            
            if (keyMap[e.key]) {
                this.endLongPress();
            }
        });
        
        // 触摸/点击按键 - 支持长按
        document.querySelectorAll('.key').forEach(key => {
            let pressTimer = null;
            let isLongPress = false;
            const keyType = key.dataset.key;
            
            // 鼠标/触摸按下
            const startPress = (e) => {
                if (e.type === 'touchstart') {
                    e.preventDefault();
                }
                isLongPress = false;
                
                // 立即执行一次
                if (keyType) {
                    this.handleInput(keyType);
                }
                
                // 设置长按定时器
                pressTimer = setTimeout(() => {
                    isLongPress = true;
                    if (['up', 'down', 'left', 'right'].includes(keyType)) {
                        this.startLongPress(keyType);
                    }
                }, 200);
            };
            
            // 鼠标/触摸释放
            const endPress = () => {
                if (pressTimer) {
                    clearTimeout(pressTimer);
                    pressTimer = null;
                }
                if (isLongPress) {
                    this.endLongPress();
                }
            };
            
            // 鼠标事件
            key.addEventListener('mousedown', startPress);
            key.addEventListener('mouseup', endPress);
            key.addEventListener('mouseleave', endPress);
            
            // 触摸事件
            key.addEventListener('touchstart', startPress, { passive: false });
            key.addEventListener('touchend', endPress);
            key.addEventListener('touchcancel', endPress);
        });
        
        // 重新开始按钮
        const restartBtn = document.getElementById('restartBtn');
        if (restartBtn) {
            restartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleInput('restart');
            });
            
            restartBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleInput('restart');
            }, { passive: false });
        }
        
        // 游戏选择下拉菜单
        const gameSelect = document.getElementById('gameSelect');
        if (gameSelect) {
            gameSelect.addEventListener('change', (e) => {
                this.switchGame(e.target.value);
            });
        }
    }
    
    loadHighScore(game) {
        const saved = localStorage.getItem(`${game}HighScore`);
        return saved ? parseInt(saved, 10) : 0;
    }
    
    saveHighScore(game, score) {
        localStorage.setItem(`${game}HighScore`, score.toString());
    }
    
    // 开始长按
    startLongPress(direction) {
        this.longPressState.active = true;
        this.longPressState.direction = direction;
        this.longPressState.startTime = Date.now();
        
        // 贪吃蛇：加快移动速度
        if (this.currentGameType === 'snake') {
            const game = this.games.snake;
            // 临时加速到原来的 1/3
            this.originalSpeed = game.speed;
            game.speed = Math.max(50, game.speed / 3);
        }
        // 俄罗斯方块：加快下落速度
        else if (this.currentGameType === 'tetris') {
            const game = this.games.tetris;
            this.originalDropInterval = game.dropInterval;
            // 下方向键才加速下落
            if (direction === 'down') {
                game.dropInterval = 50; // 快速下落
            }
        }
    }
    
    // 结束长按
    endLongPress() {
        if (!this.longPressState.active) return;
        
        // 恢复原始速度
        if (this.currentGameType === 'snake') {
            const game = this.games.snake;
            if (this.originalSpeed) {
                game.speed = this.originalSpeed;
                this.originalSpeed = null;
            }
        }
        // 俄罗斯方块：恢复下落速度
        else if (this.currentGameType === 'tetris') {
            const game = this.games.tetris;
            if (this.originalDropInterval) {
                game.dropInterval = this.originalDropInterval;
                this.originalDropInterval = null;
            }
        }
        
        this.longPressState.active = false;
        this.longPressState.direction = null;
    }
}

// 启动游戏管理器
document.addEventListener('DOMContentLoaded', () => {
    new GameManager();
});
