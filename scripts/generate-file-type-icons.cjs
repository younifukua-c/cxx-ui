/**
 * 文件类型图标生成器(用于 cxx-ui 图标库)。
 *
 * - 风格基线:文档轮廓 + 角折 + 3 条横线,沿用 09-file.svg。
 * - 类型识别:文档体填主题色(README 配色矩阵),字符/符号表示类型。
 * - 4 状态:default / hover / active / disabled(同色系 3 档明度 + 灰)。
 * - viewBox 0 0 56 56,无脚本无外链,符合 cxx-repodock icon-system-policy 同款规范。
 *
 * 编号 61-99 留给文件类型图标;已有 60-current-branch 在 60。
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ICON_DIR = path.resolve(__dirname, '..', 'icons');

/** 配色三元组(同 README 配色矩阵)。 */
const PALETTE = Object.freeze({
    gold:    { default: '#FAB005', hover: '#FCC419', active: '#F08C00' },
    yellow:  { default: '#FCC419', hover: '#FFD43B', active: '#F08C00' },
    green:   { default: '#51CF66', hover: '#69DB7C', active: '#37B24D' },
    cyan:    { default: '#22B8CF', hover: '#3BC9DB', active: '#1098AD' },
    blue:    { default: '#228BE6', hover: '#339AF0', active: '#1971C2' },
    light:   { default: '#339AF0', hover: '#4DABF7', active: '#228BE6' },
    purple:  { default: '#845EF7', hover: '#9775FA', active: '#7048E8' },
    gray:    { default: '#495057', hover: '#5C6770', active: '#343A40' },
    red:     { default: '#FA5252', hover: '#FF6B6B', active: '#E03131' },
    dimGray: { default: '#868E96', hover: '#ADB5BD', active: '#495057' },
});
const DISABLED_COLOR = '#868E96';

/** 文档基线(跟 09-file.svg 完全一致)。 */
const FILE_BODY = 'M 12 8 L 32 8 L 44 20 L 44 48 L 12 48 Z';
const FILE_CORNER_FOLD = 'M 32 8 L 32 20 L 44 20';
const FILE_LINES = [
    { x1: 18, y1: 28, x2: 34, y2: 28 },
    { x1: 18, y1: 35, x2: 38, y2: 35 },
    { x1: 18, y1: 42, x2: 30, y2: 42 },
];

/**
 * 字符位图(5x7 网格,X=实心点)。足以拼装任何文件类型缩写。
 * 新字符补这里就行,无需改其他代码。
 */
const GLYPH = Object.freeze({
    A: ['.XXX.', 'X...X', 'X...X', 'XXXXX', 'X...X', 'X...X', 'X...X'],
    B: ['XXXX.', 'X...X', 'X...X', 'XXXX.', 'X...X', 'X...X', 'XXXX.'],
    C: ['.XXXX', 'X....', 'X....', 'X....', 'X....', 'X....', '.XXXX'],
    D: ['XXXX.', 'X...X', 'X...X', 'X...X', 'X...X', 'X...X', 'XXXX.'],
    E: ['XXXXX', 'X....', 'X....', 'XXXX.', 'X....', 'X....', 'XXXXX'],
    F: ['XXXXX', 'X....', 'X....', 'XXXX.', 'X....', 'X....', 'X....'],
    G: ['.XXXX', 'X....', 'X....', 'X..XX', 'X...X', 'X...X', '.XXX.'],
    H: ['X...X', 'X...X', 'X...X', 'XXXXX', 'X...X', 'X...X', 'X...X'],
    I: ['XXXXX', '..X..', '..X..', '..X..', '..X..', '..X..', 'XXXXX'],
    J: ['XXXXX', '....X', '....X', '....X', 'X...X', 'X...X', '.XXX.'],
    K: ['X...X', 'X..X.', 'X.X..', 'XX...', 'X.X..', 'X..X.', 'X...X'],
    L: ['X....', 'X....', 'X....', 'X....', 'X....', 'X....', 'XXXXX'],
    M: ['X...X', 'XX.XX', 'X.X.X', 'X.X.X', 'X...X', 'X...X', 'X...X'],
    N: ['X...X', 'XX..X', 'X.X.X', 'X.X.X', 'X..XX', 'X...X', 'X...X'],
    O: ['.XXX.', 'X...X', 'X...X', 'X...X', 'X...X', 'X...X', '.XXX.'],
    P: ['XXXX.', 'X...X', 'X...X', 'XXXX.', 'X....', 'X....', 'X....'],
    Q: ['.XXX.', 'X...X', 'X...X', 'X...X', 'X.X.X', 'X..X.', '.XX.X'],
    R: ['XXXX.', 'X...X', 'X...X', 'XXXX.', 'X.X..', 'X..X.', 'X...X'],
    S: ['.XXXX', 'X....', 'X....', '.XXX.', '....X', '....X', 'XXXX.'],
    T: ['XXXXX', '..X..', '..X..', '..X..', '..X..', '..X..', '..X..'],
    U: ['X...X', 'X...X', 'X...X', 'X...X', 'X...X', 'X...X', '.XXX.'],
    V: ['X...X', 'X...X', 'X...X', 'X...X', 'X...X', '.X.X.', '..X..'],
    W: ['X...X', 'X...X', 'X...X', 'X.X.X', 'X.X.X', 'XX.XX', 'X...X'],
    X: ['X...X', 'X...X', '.X.X.', '..X..', '.X.X.', 'X...X', 'X...X'],
    Y: ['X...X', 'X...X', '.X.X.', '..X..', '..X..', '..X..', '..X..'],
    Z: ['XXXXX', '....X', '...X.', '..X..', '.X...', 'X....', 'XXXXX'],
    '0': ['.XXX.', 'X...X', 'X..XX', 'X.X.X', 'XX..X', 'X...X', '.XXX.'],
    '1': ['..X..', '.XX..', '..X..', '..X..', '..X..', '..X..', '.XXX.'],
    '2': ['.XXX.', 'X...X', '....X', '...X.', '..X..', '.X...', 'XXXXX'],
    '3': ['.XXX.', 'X...X', '....X', '..XX.', '....X', 'X...X', '.XXX.'],
    '4': ['...X.', '..XX.', '.X.X.', 'X..X.', 'XXXXX', '...X.', '...X.'],
    '5': ['XXXXX', 'X....', 'XXXX.', '....X', '....X', 'X...X', '.XXX.'],
    '6': ['.XXX.', 'X....', 'X....', 'XXXX.', 'X...X', 'X...X', '.XXX.'],
    '7': ['XXXXX', '....X', '...X.', '..X..', '.X...', '.X...', '.X...'],
    '8': ['.XXX.', 'X...X', 'X...X', '.XXX.', 'X...X', 'X...X', '.XXX.'],
    '9': ['.XXX.', 'X...X', 'X...X', '.XXXX', '....X', '....X', '.XXX.'],
    '#': ['.X.X.', '.X.X.', 'XXXXX', '.X.X.', 'XXXXX', '.X.X.', '.X.X.'],
    '+': ['..X..', '..X..', '..X..', 'XXXXX', '..X..', '..X..', '..X..'],
    '<': ['....X', '...X.', '..X..', '.X...', '..X..', '...X.', '....X'],
    '>': ['X....', '.X...', '..X..', '...X.', '..X..', '.X...', 'X....'],
    '/': ['....X', '....X', '...X.', '..X..', '.X...', 'X....', 'X....'],
    '_': ['.....', '.....', '.....', '.....', '.....', '.....', 'XXXXX'],
    '?': ['.XXX.', 'X...X', '....X', '...X.', '..X..', '.....', '..X..'],
    '{': ['..XX.', '.X...', '.X...', 'X....', '.X...', '.X...', '..XX.'],
    '}': ['.XX..', '...X.', '...X.', '....X', '...X.', '...X.', '.XX..'],
    '-': ['.....', '.....', '.....', 'XXXXX', '.....', '.....', '.....'],
    '.': ['.....', '.....', '.....', '.....', '.....', '..X..', '..X..'],
    '!': ['..X..', '..X..', '..X..', '..X..', '..X..', '.....', '..X..'],
    '★': ['..X..', '.X.X.', 'X...X', 'XXXXX', 'X...X', 'X...X', 'X...X'],
});

/** 文档内字符渲染(2-3 字符标签,水平居中,绘制在文档下半区域 22-40 y)。 */
function renderTextGlyph(text, color) {
    const cells = text.toUpperCase().split('');
    const charW = 5;
    const charH = 7;
    const cellSize = 1;
    const gap = 1;
    const totalW = cells.length * charW + (cells.length - 1) * gap;
    const startX = 28 - totalW / 2;
    const startY = 32;
    const rects = [];
    cells.forEach((ch, i) => {
        const bitmap = GLYPH[ch] || GLYPH['?'];
        const charX = startX + i * (charW + gap);
        for (let row = 0; row < charH; row++) {
            for (let col = 0; col < charW; col++) {
                if (bitmap[row][col] === 'X') {
                    rects.push({
                        x: charX + col * cellSize,
                        y: startY + row * cellSize,
                        w: cellSize,
                        h: cellSize,
                    });
                }
            }
        }
    });
    return rects.map(r =>
        `<rect x="${r.x.toFixed(1)}" y="${r.y.toFixed(1)}" width="${r.w}" height="${r.h}" fill="${color}"/>`
    ).join('');
}

/** 文件类型定义。label 是文档内显示的字符标签(1-3 字符);symbol 是覆盖文档的特殊形状(可选)。 */
const FILE_TYPES = [
    { number: 61, name: 'file-folder',    palette: 'gold',    useFolder: true },
    { number: 62, name: 'file-java',      palette: 'green',   label: 'JV' },
    { number: 63, name: 'file-kotlin',    palette: 'green',   label: 'Kt' },
    { number: 64, name: 'file-javascript',palette: 'yellow',  label: 'JS' },
    { number: 65, name: 'file-typescript',palette: 'blue',    label: 'TS' },
    { number: 66, name: 'file-python',    palette: 'light',   label: 'Py' },
    { number: 67, name: 'file-go',        palette: 'cyan',    label: 'Go' },
    { number: 68, name: 'file-rust',      palette: 'red',     label: 'Rs' },
    { number: 69, name: 'file-c',         palette: 'gray',    label: 'C' },
    { number: 70, name: 'file-cpp',       palette: 'purple',  label: 'C+' },
    { number: 71, name: 'file-csharp',    palette: 'purple',  label: 'C#' },
    { number: 72, name: 'file-ruby',      palette: 'red',     label: 'Rb' },
    { number: 73, name: 'file-php',       palette: 'light',   label: 'PHP' },
    { number: 74, name: 'file-swift',     palette: 'red',     label: 'Sw' },
    { number: 75, name: 'file-dart',      palette: 'light',   label: 'Dt' },
    { number: 76, name: 'file-html',      palette: 'yellow',  label: '<>' },
    { number: 77, name: 'file-css',       palette: 'blue',    label: '#' },
    { number: 78, name: 'file-scss',      palette: 'blue',    label: 'Sc' },
    { number: 79, name: 'file-json',      palette: 'yellow',  label: '{}' },
    { number: 80, name: 'file-yaml',      palette: 'cyan',    label: 'Y' },
    { number: 81, name: 'file-toml',      palette: 'cyan',    label: 'Tl' },
    { number: 82, name: 'file-markdown',  palette: 'gray',    label: 'M.' },
    { number: 83, name: 'file-text',      palette: 'yellow',  label: 'TXT' },
    { number: 84, name: 'file-pdf',       palette: 'red',     label: 'PDF' },
    { number: 85, name: 'file-image',     palette: 'purple',  label: 'IMG' },
    { number: 86, name: 'file-svg',       palette: 'purple',  label: 'SVG' },
    { number: 87, name: 'file-video',     palette: 'red',     label: 'VID' },
    { number: 88, name: 'file-audio',     palette: 'red',     label: 'AUD' },
    { number: 89, name: 'file-archive',   palette: 'gray',    label: 'ZIP' },
    { number: 90, name: 'file-font',      palette: 'gray',    label: 'Aa' },
    { number: 91, name: 'file-binary',    palette: 'gray',    label: 'BIN' },
    { number: 92, name: 'file-shell',     palette: 'gray',    label: '>_' },
    { number: 93, name: 'file-docker',    palette: 'cyan',    label: 'DK' },
    { number: 94, name: 'file-git',       palette: 'red',     label: 'GIT' },
    { number: 95, name: 'file-license',   palette: 'gray',    label: '©' },
    { number: 96, name: 'file-readme',    palette: 'gray',    label: 'i' },
    { number: 97, name: 'file-config',    palette: 'cyan',    label: '*' },
    { number: 98, name: 'file-sql',       palette: 'purple',  label: 'SQL' },
    { number: 99, name: 'file-unknown',   palette: 'dimGray', label: '?' },
];

/** 渲染单个图标的 SVG 字符串。 */
function renderIcon(type, state) {
    const palette = PALETTE[type.palette];
    const fillColor = state === 'disabled' ? DISABLED_COLOR : palette[state];
    const glyphColor = state === 'disabled' ? '#5C6770' : '#ffffff';

    if (type.useFolder) {
        // 文件夹(独立形状,沿用 06-open-repo.svg 的版式)
        return [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" width="56" height="56">',
            '  <path d="M 6 18 L 22 18 L 28 24 L 50 24 L 50 46 Q 50 50 46 50 L 10 50 Q 6 50 6 46 Z" fill="' + fillColor + '"/>',
            '</svg>',
            '',
        ].join('\n');
    }

    const lines = FILE_LINES.map(l =>
        '<line x1="' + l.x1 + '" y1="' + l.y1 + '" x2="' + l.x2 + '" y2="' + l.y2 + '" stroke="' + glyphColor + '" stroke-width="2.5" stroke-linecap="round"/>'
    ).join('\n  ');

    const label = type.label ? renderTextGlyph(type.label, glyphColor) : '';

    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" width="56" height="56">',
        '  <path d="' + FILE_BODY + '" fill="' + fillColor + '"/>',
        '  <path d="' + FILE_CORNER_FOLD + '" fill="none" stroke="' + glyphColor + '" stroke-width="2.5" stroke-linejoin="round"/>',
        '  ' + lines,
        '  ' + label,
        '</svg>',
        '',
    ].join('\n');
}

function stateSuffix(state) {
    return state === 'default' ? '' : '-' + state;
}

function main() {
    let count = 0;
    for (const type of FILE_TYPES) {
        for (const state of ['default', 'hover', 'active', 'disabled']) {
            const fileName = String(type.number).padStart(2, '0') + '-' + type.name + stateSuffix(state) + '.svg';
            const fullPath = path.join(ICON_DIR, fileName);
            fs.writeFileSync(fullPath, renderIcon(type, state), 'utf8');
            count++;
        }
    }
    console.log('已生成 ' + FILE_TYPES.length + ' 类 × 4 状态 = ' + count + ' 个图标到 ' + ICON_DIR);
}

main();
