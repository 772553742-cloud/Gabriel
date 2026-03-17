// js/tetris/renderer.js
// 俄罗斯方块渲染器

class TetrisRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        
        // 游戏板尺寸（适配 Canvas 160x144）
        this.cols = 10;
        this.rows = 16; // 减少行数以适应屏幕
        this.cellSize = 8;
        
        // 计算居中偏移
        this.offsetX = Math.floor((160 - this.cols * this.cellSize) / 2);
        this.offsetY = 24; // 顶部留空给分数
    }
    
    clear() {
        this.ctx.fillStyle = '#9bbc0f';
        this.ctx.fillRect(0, 0, 160, 144);
    }
    
    drawCell(x, y, color) {
        const px = this.offsetX + x * this.cellSize;
        const py = this.offsetY + y * this.cellSize;
        
        this.ctx.fillStyle = color;
        this.ctx.fillRect(px, py, this.cellSize, this.cellSize);
        
        // 绘制边框效果
        this.ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        this.ctx.lineWidth = 0.5;
        this.ctx.strokeRect(px, py, this.cellSize, this.cellSize);
    }
    
    drawBoard(board) {
        for (let y = 0; y < board.length; y++) {
            for (let x = 0; x < board[y].length; x++) {
                if (board[y][x]) {
                    this.drawCell(x, y, board[y][x]);
                }
            }
        }
    }
    
    drawPiece(piece, offsetX, offsetY) {
        if (!piece) return;
        
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const boardX = offsetX + x;
                    const boardY = offsetY + y;
                    if (boardY >= 0) {
                        this.drawCell(boardX, boardY, piece.color);
                    }
                }
            }
        }
    }
    
    drawScore(score, highScore) {
        this.ctx.fillStyle = '#0f380f';
        this.ctx.font = '8px "Press Start 2P"';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`S:${score}`, 4, 10);
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`H:${highScore}`, 156, 10);
    }
    
    drawGameOver() {
        this.ctx.fillStyle = 'rgba(155, 188, 15, 0.8)';
        this.ctx.fillRect(20, 50, 120, 44);
        
        this.ctx.fillStyle = '#0f380f';
        this.ctx.font = '8px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', 80, 70);
        this.ctx.fillText('Press R', 80, 85);
    }
    
    drawPause() {
        this.ctx.fillStyle = 'rgba(155, 188, 15, 0.8)';
        this.ctx.fillRect(40, 60, 80, 24);
        
        this.ctx.fillStyle = '#0f380f';
        this.ctx.font = '8px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSED', 80, 76);
    }
    
    render(gameState) {
        this.clear();
        this.drawBoard(gameState.board);
        this.drawPiece(gameState.currentPiece, gameState.currentX, gameState.currentY);
        this.drawScore(gameState.score, gameState.highScore);
        
        if (gameState.gameOver) {
            this.drawGameOver();
        } else if (gameState.paused) {
            this.drawPause();
        }
    }
}
