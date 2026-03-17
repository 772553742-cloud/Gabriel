// js/tetris/game.js
// 俄罗斯方块游戏逻辑

class TetrisGame {
    constructor(gameManager) {
        this.manager = gameManager;
        this.canvas = gameManager.canvas;
        
        // 游戏板设置（与渲染器一致）
        this.cols = 10;
        this.rows = 16;
        this.cellSize = 8;
        
        // 游戏状态
        this.board = [];
        this.currentPiece = null;
        this.currentX = 0;
        this.currentY = 0;
        this.score = 0;
        this.highScore = this.loadHighScore();
        this.gameOver = false;
        this.paused = false;
        
        // 下落控制
        this.dropCounter = 0;
        this.dropInterval = 1000;
        this.lastTime = 0;
        
        // 初始化
        this.reset();
    }
    
    reset() {
        // 清空游戏板
        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.score = 0;
        this.gameOver = false;
        this.paused = false;
        this.dropInterval = 1000;
        this.spawnPiece();
    }
    
    spawnPiece() {
        const pieces = Object.keys(TETRIS_PIECES);
        const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
        const pieceData = TETRIS_PIECES[randomPiece];
        
        this.currentPiece = {
            shape: pieceData.shape,
            color: pieceData.color,
            name: pieceData.name
        };
        
        // 初始位置（顶部中央）
        this.currentX = Math.floor((this.cols - this.currentPiece.shape[0].length) / 2);
        this.currentY = 0;
        
        // 检查是否可以放置
        if (!this.isValidPosition(this.currentPiece.shape, this.currentX, this.currentY)) {
            this.gameOver = true;
            if (this.score > this.highScore) {
                this.highScore = this.score;
                this.saveHighScore();
            }
            if (this.manager.audioManager) {
                this.manager.audioManager.playGameOverSound();
            }
        }
    }
    
    isValidPosition(shape, offsetX, offsetY) {
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    const newX = offsetX + x;
                    const newY = offsetY + y;
                    
                    // 检查边界
                    if (newX < 0 || newX >= this.cols || newY >= this.rows) {
                        return false;
                    }
                    
                    // 检查碰撞（只检查已经在板子上的）
                    if (newY >= 0 && this.board[newY][newX]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    rotate() {
        if (!this.currentPiece || this.gameOver || this.paused) return;
        
        const rotated = rotatePiece(this.currentPiece.shape);
        
        // 尝试旋转，如果碰撞则放弃
        if (this.isValidPosition(rotated, this.currentX, this.currentY)) {
            this.currentPiece.shape = rotated;
        } else {
            // 尝试左右移动后旋转（踢墙）
            const kicks = [-1, 1, -2, 2];
            for (const kick of kicks) {
                if (this.isValidPosition(rotated, this.currentX + kick, this.currentY)) {
                    this.currentPiece.shape = rotated;
                    this.currentX += kick;
                    return;
                }
            }
        }
    }
    
    move(dir) {
        if (!this.currentPiece || this.gameOver || this.paused) return;
        
        const newX = this.currentX + dir;
        if (this.isValidPosition(this.currentPiece.shape, newX, this.currentY)) {
            this.currentX = newX;
        }
    }
    
    moveDown() {
        if (!this.currentPiece || this.gameOver || this.paused) return;
        
        const newY = this.currentY + 1;
        if (this.isValidPosition(this.currentPiece.shape, this.currentX, newY)) {
            this.currentY = newY;
            this.dropCounter = 0;
        } else {
            this.lockPiece();
        }
    }
    
    hardDrop() {
        if (!this.currentPiece || this.gameOver || this.paused) return;
        
        while (this.isValidPosition(this.currentPiece.shape, this.currentX, this.currentY + 1)) {
            this.currentY++;
            this.score += 2; // 硬降奖励
        }
        this.lockPiece();
    }
    
    lockPiece() {
        // 将当前方块固定到游戏板
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
            for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                if (this.currentPiece.shape[y][x]) {
                    const boardY = this.currentY + y;
                    const boardX = this.currentX + x;
                    if (boardY >= 0) {
                        this.board[boardY][boardX] = this.currentPiece.color;
                    }
                }
            }
        }
        
        // 播放音效
        if (this.manager.audioManager) {
            this.manager.audioManager.playEatSound();
        }
        
        // 检查消行
        this.clearLines();
        
        // 生成新方块
        this.spawnPiece();
    }
    
    clearLines() {
        let linesCleared = 0;
        
        for (let y = this.rows - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                // 移除该行
                this.board.splice(y, 1);
                // 在顶部添加新行
                this.board.unshift(Array(this.cols).fill(0));
                linesCleared++;
                y++; // 重新检查当前行
            }
        }
        
        // 计分
        const points = [0, 100, 300, 600, 1000];
        this.score += points[linesCleared] || 0;
        
        // 加速
        if (linesCleared > 0) {
            this.dropInterval = Math.max(200, this.dropInterval - linesCleared * 20);
        }
    }
    
    update(deltaTime) {
        if (this.gameOver || this.paused) return;
        
        this.dropCounter += deltaTime;
        if (this.dropCounter > this.dropInterval) {
            this.moveDown();
        }
    }
    
    togglePause() {
        if (!this.gameOver) {
            this.paused = !this.paused;
        }
    }
    
    loadHighScore() {
        const saved = localStorage.getItem('tetrisHighScore');
        return saved ? parseInt(saved, 10) : 0;
    }
    
    saveHighScore() {
        localStorage.setItem('tetrisHighScore', this.highScore.toString());
    }
    
    // 输入处理
    handleInput(action) {
        switch(action) {
            case 'left':
                this.move(-1);
                break;
            case 'right':
                this.move(1);
                break;
            case 'down':
                this.moveDown();
                break;
            case 'rotate':
                this.rotate();
                break;
            case 'pause':
                this.togglePause();
                break;
            case 'restart':
                this.reset();
                break;
        }
    }
}
