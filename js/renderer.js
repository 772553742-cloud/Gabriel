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
