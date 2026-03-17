// js/tetris/pieces.js
// 俄罗斯方块定义

const TETRIS_PIECES = {
    I: {
        shape: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        color: '#00f0f0', // 青色
        name: 'I'
    },
    O: {
        shape: [
            [1, 1],
            [1, 1]
        ],
        color: '#f0f000', // 黄色
        name: 'O'
    },
    T: {
        shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: '#a000f0', // 紫色
        name: 'T'
    },
    S: {
        shape: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ],
        color: '#00f000', // 绿色
        name: 'S'
    },
    Z: {
        shape: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ],
        color: '#f00000', // 红色
        name: 'Z'
    },
    J: {
        shape: [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: '#0000f0', // 蓝色
        name: 'J'
    },
    L: {
        shape: [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: '#f0a000', // 橙色
        name: 'L'
    }
};

// 旋转矩阵（顺时针90度）
function rotatePiece(shape) {
    const N = shape.length;
    const M = shape[0].length;
    const rotated = Array(N).fill().map(() => Array(M).fill(0));
    
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < M; j++) {
            rotated[j][N - 1 - i] = shape[i][j];
        }
    }
    
    return rotated;
}
