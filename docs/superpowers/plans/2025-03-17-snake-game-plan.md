# 像素贪吃蛇游戏实施计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个复古诺基亚风格的像素贪吃蛇游戏，包含计分系统、暂停功能和8-bit音效

**Architecture:** 采用模块化设计，分离游戏逻辑、渲染和音频。使用 HTML5 Canvas 进行像素级渲染，Web Audio API 生成音效，LocalStorage 存储最高分。

**Tech Stack:** HTML5, CSS3, JavaScript (ES6+), Canvas API, Web Audio API

---

## 文件结构

```
snake-game/
├── index.html          # 主页面 - 诺基亚手机外壳结构
├── css/
│   └── style.css       # 复古样式 - 手机外观、屏幕效果
└── js/
    ├── constants.js    # 游戏常量
    ├── game.js         # 游戏逻辑 - 状态管理、蛇移动、碰撞检测
    ├── renderer.js     # 渲染引擎 - Canvas 绘制
    └── audio.js        # 音效管理 - Web Audio API
```

---

## Task 1: 项目基础结构

**Files:**
- Create: `index.html`
- Create: `css/style.css`
- Create: `js/constants.js`

### Step 1.1: 创建 HTML 基础结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>诺基亚贪吃蛇</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="phone-container">
        <div class="phone-body">
            <div class="screen-container">
                <canvas id="gameCanvas" width="160" height="144"></canvas>
            </div>
            <div class="keypad">
                <div class="nav-keys">
                    <div class="key up" data-key="up">▲</div>
                    <div class="key left" data-key="left">◀</div>
                    <div class="key right" data-key="right">▶</div>
                    <div class="key down" data-key="down">▼</div>
                </div>
            </div>
        </div>
    </div>
    <script src="js/constants.js"></script>
    <script src="js/audio.js"></script>
    <script src="js/renderer.js"></script>
    <script src="js/game.js"></script>
</body>
</html>
```

### Step 1.2: 创建 CSS 样式

```css
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-family: 'Press Start 2P', cursive;
}

.phone-container {
    padding: 20px;
}

.phone-body {
    width: 240px;
    background: linear-gradient(145deg, #d4d4d4, #a8a8a8);
    border-radius: 30px;
    padding: 30px 20px;
    box-shadow: 
        0 20px 60px rgba(0,0,0,0.3),
        inset 0 2px 5px rgba(255,255,255,0.3),
        inset 0 -2px 5px rgba(0,0,0,0.2);
    border: 3px solid #909090;
}

.screen-container {
    background: #4a4a4a;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
    box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);
}

#gameCanvas {
    display: block;
    background: #9bbc0f;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.2);
    width: 100%;
    height: auto;
}

.keypad {
    display: flex;
    justify-content: center;
}

.nav-keys {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 5px;
}

.key {
    width: 45px;
    height: 35px;
    background: linear-gradient(145deg, #e0e0e0, #b0b0b0);
    border: 2px solid #808080;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #404040;
    cursor: pointer;
    box-shadow: 
        0 3px 5px rgba(0,0,0,0.2),
        inset 0 1px 2px rgba(255,255,255,0.5);
    user-select: none;
}

.key:active {
    transform: translateY(2px);
    box-shadow: 
        0 1px 2px rgba(0,0,0,0.2),
        inset 0 2px 5px rgba(0,0,0,0.2);
}

.key.up { grid-column: 2; }
.key.left { grid-column: 1; grid-row: 2; }
.key.right { grid-column: 3; grid-row: 2; }
.key.down { grid-column: 2; grid-row: 2; }
```

### Step 1.3: 创建常量文件

```javascript
// js/constants.js
const CONSTANTS = {
    // 游戏网格
    GRID_WIDTH: 20,
    GRID_HEIGHT: 18,
    TILE_SIZE: 8,
    
    // Canvas 尺寸
    CANVAS_WIDTH: 160,
    CANVAS_HEIGHT: 144,
    
    // 游戏速度
    INITIAL_SPEED: 150,
    SPEED_INCREMENT: 10,
    SPEED_THRESHOLD: 5,
    MIN_SPEED: 80,
    
    // 分数
    POINTS_PER_FOOD: 10,
    
    // 颜色
    COLORS: {
        SCREEN_BG: '#9bbc0f',
        SCREEN_DARK: '#0f380f',
        FOOD: '#0f380f'
    },
    
    // 方向
    DIRECTIONS: {
        UP: { x: 0, y: -1 },
        DOWN: { x: 0, y: 1 },
        LEFT: { x: -1, y: 0 },
        RIGHT: { x: 1, y: 0 }
    }
};
```

---

## Task 2: 音效系统

**Files:**
- Create: `js/audio.js`

### Step 2.1: 实现 Web Audio API 音效

```javascript
// js/audio.js
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
    }
    
    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    
    playEatSound() {
        if (!this.enabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }
    
    playGameOverSound() {
        if (!this.enabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }
    
    toggle() {
        this.enabled = !this.enabled;
    }
}

const audioManager = new AudioManager();
```

---

## Task 3: 渲染引擎

**Files:**
- Create: `js/renderer.js`

### Step 3.1: 实现 Canvas 渲染

```javascript
// js/renderer.js
class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
    }
    
    clear() {
        this.ctx.fillStyle = CONSTANTS.COLORS.SCREEN_BG;
        this.ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);
    }
    
    drawPixel(x, y, color = CONSTANTS.COLORS.SCREEN_DARK) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            x * CONSTANTS.TILE_SIZE,
            y * CONSTANTS.TILE_SIZE,
            CONSTANTS.TILE_SIZE,
            CONSTANTS.TILE_SIZE
        );
    }
    
    drawSnake(snake) {
        snake.forEach((segment, index) => {
            // 蛇头稍微不同
            const color = index === 0 
                ? CONSTANTS.COLORS.SCREEN_DARK 
                : CONSTANTS.COLORS.SCREEN_DARK;
            this.drawPixel(segment.x, segment.y, color);
        });
    }
    
    drawFood(food) {
        this.ctx.fillStyle = CONSTANTS.COLORS.FOOD;
        // 食物小一点，2x2 像素在中心
        const offset = 2;
        this.ctx.fillRect(
            food.x * CONSTANTS.TILE_SIZE + offset,
            food.y * CONSTANTS.TILE_SIZE + offset,
            CONSTANTS.TILE_SIZE - offset * 2,
            CONSTANTS.TILE_SIZE - offset * 2
        );
    }
    
    drawScore(score, highScore) {
        this.ctx.fillStyle = CONSTANTS.COLORS.SCREEN_DARK;
        this.ctx.font = '8px "Press Start 2P"';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`SCORE:${score}`, 4, 10);
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`HI:${highScore}`, CONSTANTS.CANVAS_WIDTH - 4, 10);
    }
    
    drawGameOver() {
        this.ctx.fillStyle = 'rgba(155, 188, 15, 0.8)';
        this.ctx.fillRect(20, 50, 120, 44);
        
        this.ctx.fillStyle = CONSTANTS.COLORS.SCREEN_DARK;
        this.ctx.font = '8px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', CONSTANTS.CANVAS_WIDTH / 2, 70);
        this.ctx.fillText('Press R', CONSTANTS.CANVAS_WIDTH / 2, 85);
    }
    
    drawPause() {
        this.ctx.fillStyle = 'rgba(155, 188, 15, 0.8)';
        this.ctx.fillRect(40, 60, 80, 24);
        
        this.ctx.fillStyle = CONSTANTS.COLORS.SCREEN_DARK;
        this.ctx.font = '8px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSED', CONSTANTS.CANVAS_WIDTH / 2, 76);
    }
    
    render(gameState) {
        this.clear();
        this.drawSnake(gameState.snake);
        this.drawFood(gameState.food);
        this.drawScore(gameState.score, gameState.highScore);
        
        if (gameState.gameOver) {
            this.drawGameOver();
        } else if (gameState.paused) {
            this.drawPause();
        }
    }
}
```

---

## Task 4: 游戏逻辑

**Files:**
- Create: `js/game.js`

### Step 4.1: 实现游戏核心逻辑

```javascript
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
```

---

## Task 5: 测试和验证

### Step 5.1: 功能测试清单

- [ ] 游戏正常启动，显示诺基亚手机外观
- [ ] 蛇可以正常移动（方向键/WASD）
- [ ] 蛇不能反向移动（防止自杀）
- [ ] 吃到食物后蛇增长
- [ ] 吃到食物后分数增加
- [ ] 每吃5个食物速度加快
- [ ] 撞墙游戏结束
- [ ] 撞自己游戏结束
- [ ] 游戏结束显示 GAME OVER
- [ ] 按 R 键可以重新开始
- [ ] 按空格键可以暂停/继续
- [ ] 最高分正确保存和显示
- [ ] 吃食物有音效
- [ ] 游戏结束有音效
- [ ] 点击屏幕按键可以控制方向

### Step 5.2: 浏览器兼容性测试

- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (Mac/iOS)

---

## 完成标准

✅ 所有文件创建完成  
✅ 功能测试全部通过  
✅ 在浏览器中可以直接打开 `index.html` 运行游戏  
✅ 代码注释清晰  
✅ 无控制台错误

---

**计划完成！** 准备开始实施。
