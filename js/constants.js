// js/constants.js
const CONSTANTS = {
    // 游戏网格
    GRID_WIDTH: 20,
    GRID_HEIGHT: 18,
    TILE_SIZE: 8,
    
    // Canvas 尺寸
    CANVAS_WIDTH: 160,
    CANVAS_HEIGHT: 144,
    
    // 游戏速度（第一档，降低50%）
    INITIAL_SPEED: 225,
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
