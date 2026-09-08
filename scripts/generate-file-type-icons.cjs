/**
 * 文件类型图标生成器(cxx-ui)。
 *
 * 设计原则:每类文件用对应的视觉,不再千篇一律用"文档基线 + 字符"。
 *  - 多媒体(image/video/audio/font):对应视觉(图片框/播放/音符/Aa)
 *  - 容器(archive/jar):堆叠方块
 *  - 文档(pdf/doc/sheet/slide):对应视觉(PDF 印章/文档/表格/演示)
 *  - 工具(docker/shell/git):对应视觉(鲸鱼/终端/分叉)
 *  - 编程/配置/数据:文件基线 + 字符标签(因为它们本质就是文本,靠字符区分更清晰)
 *
 * 命名:file-{type}.svg,无序号,4 态齐全。
 * viewBox 0 0 56 56,实色填色,无脚本/无外链。
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ICON_DIR = path.resolve(__dirname, '..', 'icons');
const DOCS_DIR = path.resolve(__dirname, '..', 'docs');
const MAP_PATH = path.join(ICON_DIR, 'file-icon-map.json');
const DOC_PATH = path.join(DOCS_DIR, 'FILE_ICONS.md');

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
    teal:    { default: '#20C997', hover: '#3BC9DB', active: '#0CA678' },
    orange:  { default: '#FD7E14', hover: '#FF922B', active: '#E8590C' },
    pink:    { default: '#E64980', hover: '#F06595', active: '#C2255C' },
    brown:   { default: '#8B4513', hover: '#A0522D', active: '#6B3410' },
});
const DISABLED_COLOR = '#868E96';

/** 文档基线(用于"代码/配置/数据"类型)。 */
const FILE_BODY = 'M 12 8 L 32 8 L 44 20 L 44 48 L 12 48 Z';
const FILE_CORNER_FOLD = 'M 32 8 L 32 20 L 44 20';
const FILE_LINES = [
    { x1: 18, y1: 28, x2: 34, y2: 28 },
    { x1: 18, y1: 35, x2: 38, y2: 35 },
    { x1: 18, y1: 42, x2: 30, y2: 42 },
];

/** 字符位图(5x7)。 */
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
    '.': ['.....', '.....', '.....', '.....', '.....', '..X..', '..X..'],
    '!': ['..X..', '..X..', '..X..', '..X..', '..X..', '.....', '..X..'],
    '*': ['.....', 'X.X.X', '.XXX.', 'XXXXX', '.XXX.', 'X.X.X', '.....'],
    '+': ['..X..', '..X..', '..X..', 'XXXXX', '..X..', '..X..', '..X..'],
});

function renderTextGlyph(text, color) {
    const cells = text.toUpperCase().split('');
    const charW = 5, charH = 7, cellSize = 1, gap = 1;
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
                    rects.push({ x: charX + col * cellSize, y: startY + row * cellSize, w: cellSize, h: cellSize });
                }
            }
        }
    });
    return rects.map(r => `<rect x="${r.x.toFixed(1)}" y="${r.y.toFixed(1)}" width="${r.w}" height="${r.h}" fill="${color}"/>`).join('');
}

/**
 * 自定义形状库。
 * - SHAPES:通用形状(图/视频/音频/字体/容器/工具/办公)沿用文档基线风格的专门视觉
 * - LOGOS:品牌 logo 风格(Vue/Python/Java/Rust/Office 系列),画真正的 logo 视觉
 *
 * 形参:fillColor 主体色,glyphColor 前景色(default/hover/active 时白,disabled 时灰)。
 */
const SHAPES = {
    /** 文件夹(沿用 06-open-repo.svg) */
    folder(fill, _glyph) {
        return `<path d="M 6 18 L 22 18 L 28 24 L 50 24 L 50 46 Q 50 50 46 50 L 10 50 Q 6 50 6 46 Z" fill="${fill}"/>`;
    },
    /** 图片框:矩形 + 太阳 + 山峰 */
    image(fill, glyph) {
        return [
            `<rect x="6" y="10" width="44" height="36" rx="3" fill="${fill}"/>`,
            `<circle cx="16" cy="20" r="3" fill="#ffffff"/>`,
            `<path d="M 9 42 L 18 30 L 26 38 L 32 32 L 47 42 Z" fill="#ffffff" opacity="0.85"/>`,
        ].join('');
    },
    /** 视频:胶片孔 + 播放三角 */
    video(fill, glyph) {
        return [
            `<rect x="4" y="14" width="48" height="28" rx="2" fill="${fill}"/>`,
            // 胶片孔(两侧)
            `<rect x="7" y="18" width="3" height="3" fill="#1a1b1e"/>`,
            `<rect x="7" y="25" width="3" height="3" fill="#1a1b1e"/>`,
            `<rect x="7" y="32" width="3" height="3" fill="#1a1b1e"/>`,
            `<rect x="46" y="18" width="3" height="3" fill="#1a1b1e"/>`,
            `<rect x="46" y="25" width="3" height="3" fill="#1a1b1e"/>`,
            `<rect x="46" y="32" width="3" height="3" fill="#1a1b1e"/>`,
            // 播放三角
            `<path d="M 24 22 L 35 28 L 24 34 Z" fill="#ffffff"/>`,
        ].join('');
    },
    /** 音频:音符 + 声波条 */
    audio(fill, glyph) {
        return [
            // 5 条声波条
            `<rect x="8" y="20" width="3" height="20" rx="1" fill="#ffffff" opacity="0.7"/>`,
            `<rect x="14" y="14" width="3" height="32" rx="1" fill="#ffffff" opacity="0.8"/>`,
            `<rect x="20" y="10" width="3" height="40" rx="1" fill="#ffffff"/>`,
            `<rect x="26" y="14" width="3" height="32" rx="1" fill="#ffffff" opacity="0.8"/>`,
            `<rect x="32" y="20" width="3" height="20" rx="1" fill="#ffffff" opacity="0.7"/>`,
            // 音符
            `<path d="M 38 18 L 46 16 L 46 36 Q 46 40 42 40 Q 38 40 38 36 Q 38 32 42 32 L 46 32" fill="#ffffff" stroke="#ffffff" stroke-width="2"/>`,
        ].join('');
    },
    /** 字体:A + a 大字 */
    font(fill, glyph) {
        return [
            `<text x="28" y="38" font-family="Georgia, serif" font-size="32" font-weight="bold" fill="#ffffff" text-anchor="middle">A</text>`,
            `<text x="40" y="46" font-family="Georgia, serif" font-size="18" fill="#ffffff" text-anchor="middle" opacity="0.7">a</text>`,
        ].join('');
    },
    /** 压缩包:堆叠 3 个方块 + 扎带 */
    archive(fill, glyph) {
        return [
            // 底层方块
            `<rect x="10" y="14" width="36" height="6" rx="1" fill="#ffffff" opacity="0.5"/>`,
            // 中间层
            `<rect x="8" y="22" width="40" height="10" rx="1" fill="#ffffff" opacity="0.75"/>`,
            // 顶层
            `<rect x="6" y="34" width="44" height="12" rx="1" fill="#ffffff"/>`,
            // 扎带
            `<rect x="20" y="10" width="16" height="4" fill="${fill}"/>`,
        ].join('');
    },
    /** JAR:椭圆盖 + 罐身 */
    jar(fill, glyph) {
        return [
            // 盖子椭圆
            `<ellipse cx="28" cy="14" rx="14" ry="4" fill="#ffffff" opacity="0.6"/>`,
            `<rect x="14" y="12" width="28" height="4" fill="#ffffff" opacity="0.6"/>`,
            // 罐身
            `<rect x="14" y="16" width="28" height="28" rx="2" fill="#ffffff"/>`,
            // 标签
            `<rect x="20" y="24" width="16" height="10" fill="${fill}" opacity="0.4"/>`,
        ].join('');
    },
    /** PDF:PDF 大字 + 文档基线 */
    pdf(fill, glyph) {
        return [
            // 文档基线
            `<path d="${FILE_BODY}" fill="${fill}"/>`,
            `<path d="${FILE_CORNER_FOLD}" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round"/>`,
            // PDF 大字
            `<text x="28" y="38" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">PDF</text>`,
        ].join('');
    },
    /** 文档(Word/Docx):文档基线 + 横线表示"文 + W 角标") */
    doc(fill, glyph) {
        return [
            `<path d="${FILE_BODY}" fill="${fill}"/>`,
            `<path d="${FILE_CORNER_FOLD}" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round"/>`,
            // 角标 "W" 代表 Word
            `<rect x="36" y="38" width="14" height="12" rx="1.5" fill="#ffffff"/>`,
            `<text x="43" y="48" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="${fill}" text-anchor="middle">W</text>`,
        ].join('');
    },
    /** 表格(Sheet):表格网格 */
    sheet(fill, glyph) {
        return [
            // 文档基线
            `<path d="${FILE_BODY}" fill="${fill}"/>`,
            `<path d="${FILE_CORNER_FOLD}" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round"/>`,
            // 表格网格
            `<line x1="18" y1="30" x2="38" y2="30" stroke="#ffffff" stroke-width="1.2"/>`,
            `<line x1="18" y1="36" x2="38" y2="36" stroke="#ffffff" stroke-width="1.2"/>`,
            `<line x1="18" y1="42" x2="38" y2="42" stroke="#ffffff" stroke-width="1.2"/>`,
            `<line x1="24" y1="26" x2="24" y2="44" stroke="#ffffff" stroke-width="1.2"/>`,
            `<line x1="32" y1="26" x2="32" y2="44" stroke="#ffffff" stroke-width="1.2"/>`,
        ].join('');
    },
    /** 演示稿(Slide):矩形 + 三角播放 */
    slide(fill, glyph) {
        return [
            `<rect x="6" y="12" width="44" height="32" rx="2" fill="${fill}"/>`,
            // 矩形屏幕
            `<rect x="10" y="16" width="36" height="22" rx="1" fill="#1a1b1e" opacity="0.25"/>`,
            // 播放三角
            `<path d="M 24 22 L 32 27 L 24 32 Z" fill="#ffffff"/>`,
        ].join('');
    },
    /** Docker:鲸鱼简笔 */
    docker(fill, glyph) {
        return [
            // 鲸鱼身体
            `<path d="M 8 36 Q 8 30 16 30 L 40 30 Q 48 30 48 36 Q 48 42 42 44 L 14 44 Q 8 44 8 38 Z" fill="#ffffff"/>`,
            // 眼睛
            `<circle cx="40" cy="36" r="1.2" fill="${fill}"/>`,
            // 集装箱(顶部)
            `<rect x="14" y="22" width="4" height="4" fill="#ffffff" opacity="0.85"/>`,
            `<rect x="20" y="22" width="4" height="4" fill="#ffffff" opacity="0.85"/>`,
            `<rect x="26" y="22" width="4" height="4" fill="#ffffff" opacity="0.85"/>`,
            `<rect x="32" y="22" width="4" height="4" fill="#ffffff" opacity="0.85"/>`,
            // 喷水
            `<path d="M 12 22 L 12 18 M 16 22 L 16 16 M 20 22 L 20 18 M 24 22 L 24 16 M 28 22 L 28 18" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>`,
        ].join('');
    },
    /** Shell:终端窗口 + 提示符 */
    shell(fill, glyph) {
        return [
            // 终端窗口
            `<rect x="6" y="12" width="44" height="32" rx="2" fill="${fill}"/>`,
            // 标题栏
            `<rect x="6" y="12" width="44" height="6" rx="2" fill="#000000" opacity="0.25"/>`,
            // 三个圆点
            `<circle cx="10" cy="15" r="1" fill="#ffffff" opacity="0.5"/>`,
            `<circle cx="14" cy="15" r="1" fill="#ffffff" opacity="0.5"/>`,
            `<circle cx="18" cy="15" r="1" fill="#ffffff" opacity="0.5"/>`,
            // 提示符 + 命令
            `<text x="11" y="32" font-family="monospace" font-size="9" fill="#ffffff" font-weight="bold">$</text>`,
            `<line x1="16" y1="31" x2="22" y2="31" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>`,
            `<line x1="16" y1="34" x2="20" y2="34" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>`,
        ].join('');
    },
    /** Git:分支节点 */
    git(fill, glyph) {
        return [
            // 三个圆点(节点)
            `<circle cx="16" cy="14" r="4" fill="#ffffff"/>`,
            `<circle cx="40" cy="14" r="4" fill="#ffffff"/>`,
            `<circle cx="16" cy="42" r="4" fill="#ffffff"/>`,
            // 连接线
            `<line x1="16" y1="18" x2="16" y2="38" stroke="#ffffff" stroke-width="2"/>`,
            `<line x1="16" y1="14" x2="36" y2="14" stroke="#ffffff" stroke-width="2"/>`,
            `<path d="M 40 18 Q 40 30 16 38" fill="none" stroke="#ffffff" stroke-width="2"/>`,
        ].join('');
    },
    /** License:卷轴 */
    license(fill, glyph) {
        return [
            // 卷轴主体
            `<rect x="10" y="14" width="36" height="28" rx="2" fill="#ffffff"/>`,
            // 卷轴上端
            `<ellipse cx="28" cy="14" rx="18" ry="3" fill="#ffffff"/>`,
            // 卷轴下端
            `<ellipse cx="28" cy="42" rx="18" ry="3" fill="#ffffff"/>`,
            // 文字行
            `<line x1="16" y1="22" x2="40" y2="22" stroke="${fill}" stroke-width="1.2" opacity="0.5"/>`,
            `<line x1="16" y1="27" x2="40" y2="27" stroke="${fill}" stroke-width="1.2" opacity="0.5"/>`,
            `<line x1="16" y1="32" x2="34" y2="32" stroke="${fill}" stroke-width="1.2" opacity="0.5"/>`,
            // © 字符
            `<text x="28" y="40" font-family="serif" font-size="6" font-weight="bold" fill="${fill}" text-anchor="middle">©</text>`,
        ].join('');
    },
    /** Readme:书本打开 */
    readme(fill, glyph) {
        return [
            // 书页左
            `<path d="M 6 14 L 28 16 L 28 44 L 6 42 Z" fill="#ffffff"/>`,
            // 书页右
            `<path d="M 50 14 L 28 16 L 28 44 L 50 42 Z" fill="#ffffff" opacity="0.9"/>`,
            // 文字行
            `<line x1="10" y1="20" x2="24" y2="21" stroke="${fill}" stroke-width="1" opacity="0.5"/>`,
            `<line x1="10" y1="26" x2="24" y2="27" stroke="${fill}" stroke-width="1" opacity="0.5"/>`,
            `<line x1="10" y1="32" x2="22" y2="33" stroke="${fill}" stroke-width="1" opacity="0.5"/>`,
            `<line x1="32" y1="21" x2="46" y2="20" stroke="${fill}" stroke-width="1" opacity="0.5"/>`,
            `<line x1="32" y1="27" x2="46" y2="26" stroke="${fill}" stroke-width="1" opacity="0.5"/>`,
            // i 标识
            `<circle cx="40" cy="34" r="1.5" fill="${fill}"/>`,
            `<line x1="40" y1="33" x2="40" y2="37" stroke="${fill}" stroke-width="1.5"/>`,
        ].join('');
    },
    /** Lock:锁头 */
    lock(fill, glyph) {
        return [
            // 锁身
            `<rect x="12" y="24" width="32" height="22" rx="2" fill="#ffffff"/>`,
            // 锁钩
            `<path d="M 18 24 L 18 18 Q 18 12 24 12 L 32 12 Q 38 12 38 18 L 38 24" fill="none" stroke="#ffffff" stroke-width="3"/>`,
            // 锁孔
            `<circle cx="28" cy="34" r="2" fill="${fill}"/>`,
            `<line x1="28" y1="34" x2="28" y2="40" stroke="${fill}" stroke-width="2"/>`,
        ].join('');
    },
};

/**
 * 文件类型定义。
 *  - shape: 可选,引用 SHAPES 里的专门形状(优先级最高)
 *  - label: 文档基线 + 字符标签(用于代码/配置/数据等)
 */
const FILE_TYPES = [
    // 专门形状
    { type: 'folder',   palette: 'gold',    shape: 'folder' },
    { type: 'image',    exts: ['png','jpg','jpeg','gif','bmp','webp','avif','heic','heif','tiff','tif','ico'], shape: 'image', palette: 'purple' },
    { type: 'svg',      exts: ['svg'],      shape: 'image', palette: 'purple' },
    { type: 'video',    exts: ['mp4','mov','avi','mkv','webm','flv','wmv','m4v'], shape: 'video', palette: 'red' },
    { type: 'audio',    exts: ['mp3','wav','flac','ogg','m4a','aac','wma'], shape: 'audio', palette: 'red' },
    { type: 'font',     exts: ['ttf','otf','woff','woff2','eot'], shape: 'font', palette: 'gray' },
    { type: 'archive',  exts: ['zip','rar','7z','tar','gz','bz2','xz','tgz'], shape: 'archive', palette: 'gray' },
    { type: 'jar',      exts: ['jar','war','ear','apk','aab'], shape: 'jar', palette: 'orange' },
    { type: 'pdf',      exts: ['pdf'],      logo: 'pdf',         palette: 'red' },
    { type: 'doc',      exts: ['doc','docx','dot','dotx','wbk'], logo: 'word',        palette: 'blue' },
    { type: 'docx',     exts: [],            logo: 'docx',        palette: 'blue' },
    { type: 'rtf',      exts: ['rtf'],      logo: 'rtf',         palette: 'blue' },
    { type: 'odt',      exts: ['odt','ott','fodt','odm'], logo: 'odt',   palette: 'blue' },
    { type: 'sheet',    exts: ['xls','xlsx','xlt','xltx','xlsm','xlsb'], logo: 'excel', palette: 'teal' },
    { type: 'xlsx',     exts: [],            logo: 'xlsx',        palette: 'teal' },
    { type: 'csv',      exts: ['csv','tsv','tab'], logo: 'csv',    palette: 'green' },
    { type: 'ods',      exts: ['ods','ots','fods'], logo: 'ods',     palette: 'green' },
    { type: 'slide',    exts: ['ppt','pptx','pot','potx','pps','ppsx'], logo: 'powerpoint', palette: 'orange' },
    { type: 'pptx',     exts: [],            logo: 'pptx',        palette: 'orange' },
    { type: 'odp',      exts: ['odp','otp','fodp'], logo: 'odp',   palette: 'orange' },
    { type: 'onenote',  exts: ['one','onetoc2','onepkg'], logo: 'onenote', palette: 'purple' },
    { type: 'outlook',  exts: ['pst','ost','msg','eml'], logo: 'outlook', palette: 'blue' },
    { type: 'access',   exts: ['mdb','accdb','accde','accdt','accdr'], logo: 'access', palette: 'red' },
    { type: 'visio',    exts: ['vsd','vsdx','vss','vst','vdx'], logo: 'visio', palette: 'blue' },
    { type: 'publisher',exts: ['pub','pubx'], logo: 'publisher',  palette: 'orange' },
    { type: 'project',  exts: ['mpp','mpt'], logo: 'project',    palette: 'blue' },
    { type: 'docker',   exts: [], shape: 'docker', palette: 'cyan' },
    { type: 'shell',    exts: ['sh','bash','zsh','ksh'], shape: 'shell', palette: 'gray' },
    { type: 'bat',      exts: ['bat','cmd'], shape: 'shell', palette: 'gray' },
    { type: 'powershell',exts: ['ps1','psm1','psd1'], shape: 'shell', palette: 'blue' },
    { type: 'git',      exts: [], shape: 'git', palette: 'red' },
    { type: 'license',  exts: [], shape: 'license', palette: 'gray' },
    { type: 'readme',   exts: [], shape: 'readme', palette: 'gray' },
    { type: 'lock',     exts: [], shape: 'lock', palette: 'gray' },
    // 品牌 logo 风格(简化、品牌中性化,不直接抄官方 logo)
    { type: 'java',        exts: ['java'],                          logo: 'java',        palette: 'red' },
    { type: 'kotlin',      exts: ['kt', 'kts'],                     logo: 'kotlin',      palette: 'purple' },
    { type: 'scala',       exts: ['scala', 'sbt'],                   logo: 'scala',       palette: 'red' },
    { type: 'groovy',      exts: ['groovy'],                        logo: 'rails',       palette: 'blue' },
    { type: 'c',           exts: ['c', 'h'],                        label: 'C',            palette: 'gray' },
    { type: 'cpp',         exts: ['cpp', 'cc', 'cxx', 'hpp', 'hxx'], logo: 'cpp',         palette: 'blue' },
    { type: 'csharp',      exts: ['cs'],                            logo: 'csharp',      palette: 'purple' },
    { type: 'go',          exts: ['go'],                            logo: 'go',          palette: 'cyan' },
    { type: 'rust',        exts: ['rs'],                            logo: 'rust',        palette: 'orange' },
    { type: 'ruby',        exts: ['rb'],                            logo: 'ruby',        palette: 'red' },
    { type: 'python',      exts: ['py', 'pyi', 'pyc', 'pyd', 'pyo'],logo: 'python',      palette: 'blue' },
    { type: 'php',         exts: ['php', 'php5', 'phtml'],          logo: 'php',         palette: 'purple' },
    { type: 'perl',        exts: ['pl', 'pm'],                      logo: 'perl',        palette: 'cyan' },
    { type: 'lua',         exts: ['lua'],                           label: 'Lua',         palette: 'blue' },
    { type: 'erlang',      exts: ['erl', 'hrl'],                    logo: 'erlang',      palette: 'red' },
    { type: 'elixir',      exts: ['ex', 'exs'],                     logo: 'elixir',      palette: 'purple' },
    { type: 'haskell',     exts: ['hs'],                            logo: 'haskell',     palette: 'purple' },
    { type: 'clojure',     exts: ['clj', 'cljs', 'cljc'],           logo: 'clojure',     palette: 'blue' },
    { type: 'fsharp',      exts: ['fs', 'fsx', 'fsi'],              logo: 'csharp',      palette: 'purple' },
    { type: 'ocaml',       exts: ['ml', 'mli'],                     label: 'OC',         palette: 'orange' },
    { type: 'dart',        exts: ['dart'],                          label: 'Dart',       palette: 'cyan' },
    { type: 'swift',       exts: ['swift'],                         logo: 'swift',       palette: 'orange' },
    { type: 'lisp',        exts: ['lisp', 'lsp', 'cl'],             logo: 'clojure',     palette: 'yellow' },
    { type: 'vb',          exts: ['vb', 'vbs'],                     logo: 'vb',          palette: 'blue' },
    { type: 'pascal',      exts: ['pas', 'dpr', 'pp'],              label: 'Pas',         palette: 'red' },
    { type: 'ada',         exts: ['ada', 'adb', 'ads'],             label: 'Ada',         palette: 'blue' },
    { type: 'fortran',     exts: ['f', 'f77', 'f90', 'f95', 'f03', 'for'], label: 'Fortran', palette: 'purple' },
    { type: 'cobol',       exts: ['cob', 'cbl'],                    label: 'Cob',         palette: 'blue' },
    { type: 'tcl',         exts: ['tcl'],                           label: 'Tcl',         palette: 'cyan' },
    { type: 'verilog',     exts: ['v', 'sv', 'vh', 'svh'],           logo: 'verilog',     palette: 'orange' },
    { type: 'sql',         exts: ['sql'],                           logo: 'sql',         palette: 'blue' },
    { type: 'sqlite',      exts: ['sqlite', 'sqlite3', 'db', 'db3'],label: 'SQLite',     palette: 'blue' },
    { type: 'protobuf',    exts: ['proto'],                         label: 'Proto',       palette: 'blue' },
    { type: 'graphql',     exts: ['graphql', 'gql'],                label: 'GQL',         palette: 'pink' },
    { type: 'coffeescript',exts: ['coffee'],                        label: 'Coffee',      palette: 'brown' },
    { type: 'livescript',  exts: ['ls'],                            label: 'LS',          palette: 'blue' },
    { type: 'javascript',  exts: ['js', 'mjs', 'cjs'],              logo: 'javascript',  palette: 'yellow' },
    { type: 'typescript',  exts: ['ts', 'mts', 'cts'],              logo: 'typescript',  palette: 'blue' },
    { type: 'jsx',         exts: ['jsx'],                           logo: 'javascript',  palette: 'yellow' },
    { type: 'tsx',         exts: ['tsx'],                           logo: 'tsx',         palette: 'blue' },
    { type: 'vue',         exts: ['vue'],                           logo: 'vue',         palette: 'green' },
    { type: 'svelte',      exts: ['svelte'],                        label: 'Sv',          palette: 'red' },
    { type: 'html',        exts: ['html', 'htm', 'xhtml'],          logo: 'html',        palette: 'orange' },
    { type: 'css',         exts: ['css'],                           logo: 'css',         palette: 'blue' },
    { type: 'scss',        exts: ['scss'],                          logo: 'sass',        palette: 'pink' },
    { type: 'sass',        exts: ['sass'],                          logo: 'sass',        palette: 'pink' },
    { type: 'less',        exts: ['less'],                          logo: 'less',        palette: 'blue' },
    { type: 'stylus',      exts: ['styl'],                          label: 'Stylus',      palette: 'green' },
    { type: 'xml',         exts: ['xml', 'xsl', 'xslt'],            logo: 'xml',         palette: 'orange' },
    { type: 'haml',        exts: ['haml'],                          label: 'Haml',        palette: 'orange' },
    { type: 'slim',        exts: ['slim'],                          label: 'Slim',        palette: 'green' },
    { type: 'pug',         exts: ['pug', 'jade'],                   label: 'Pug',         palette: 'red' },
    { type: 'ejs',         exts: ['ejs', 'ect'],                    label: 'EJS',         palette: 'yellow' },
    { type: 'handlebars',  exts: ['hbs', 'handlebars', 'mustache'], label: 'Hbs',         palette: 'orange' },
    { type: 'twig',        exts: ['twig'],                          logo: 'twig',        palette: 'green' },
    { type: 'jinja',       exts: ['jinja', 'jinja2', 'j2'],         label: 'Jin',         palette: 'red' },
    { type: 'blade',       exts: ['blade.php', 'bladephp'],         label: 'Blade',       palette: 'red' },
    { type: 'liquid',      exts: ['liquid'],                        label: 'Liq',         palette: 'green' },
    { type: 'json',        exts: ['json', 'jsonc', 'json5'],        logo: 'json',        palette: 'yellow' },
    { type: 'yaml',        exts: ['yml', 'yaml'],                   logo: 'yaml',        palette: 'red' },
    { type: 'toml',        exts: ['toml'],                          label: 'TOML',        palette: 'gray' },
    { type: 'ini',         exts: ['ini', 'cfg', 'conf'],            label: 'INI',         palette: 'gray' },
    { type: 'properties',  exts: ['properties'],                    label: 'Prop',        palette: 'gray' },
    { type: 'env',         exts: ['env'],                           label: '.env',        palette: 'yellow' },
    { type: 'plist',       exts: ['plist'],                         label: 'Plist',       palette: 'gray' },
    { type: 'config',      exts: [],                                label: 'Cfg',         palette: 'gray' },
    { type: 'vim',         exts: ['vim'],                           logo: 'vim',         palette: 'green' },
    { type: 'emacs',       exts: ['el'],                            label: 'El',          palette: 'purple' },
    { type: 'diff',        exts: ['diff', 'patch'],                 label: 'Diff',        palette: 'gray' },
    { type: 'cmake',       exts: ['cmake'],                         label: 'CMake',       palette: 'gray' },
    { type: 'cargo',       exts: ['cargo', 'cargo.toml'],           label: 'Cargo',       palette: 'orange' },
    { type: 'pipfile',     exts: ['pipfile'],                       label: 'Pip',         palette: 'blue' },
    { type: 'pyproject',   exts: ['pyproject'],                     label: 'PyProj',      palette: 'blue' },
    { type: 'webpack',     exts: ['webpack'],                       logo: 'webpack',     palette: 'blue' },
    { type: 'vite',        exts: ['vite'],                          logo: 'vite',        palette: 'purple' },
    { type: 'rollup',      exts: ['rollup'],                        label: 'Roll',        palette: 'red' },
    { type: 'esbuild',     exts: ['esbuild'],                       label: 'eB',          palette: 'yellow' },
    { type: 'babel',       exts: ['babel'],                         label: 'Babel',       palette: 'yellow' },
    { type: 'eslint',      exts: ['eslint'],                        label: 'ESLint',      palette: 'purple' },
    { type: 'prettier',    exts: ['prettier'],                      label: 'Pret',        palette: 'blue' },
    { type: 'stylelint',   exts: ['stylelint'],                     label: 'Sty',         palette: 'teal' },
    { type: 'jest',        exts: ['jest'],                          label: 'Jest',        palette: 'red' },
    { type: 'vitest',      exts: ['vitest'],                        logo: 'vitest',      palette: 'green' },
    { type: 'cypress',     exts: ['cypress'],                       label: 'Cy',          palette: 'green' },
    { type: 'playwright',  exts: ['playwright'],                    label: 'PW',          palette: 'purple' },
    { type: 'puppeteer',   exts: ['puppeteer'],                     label: 'Pptr',        palette: 'red' },
    { type: 'terraform',   exts: ['tf', 'tfvars', 'hcl'],           label: 'TF',          palette: 'purple' },
    { type: 'bicep',       exts: ['bicep'],                         label: 'Bicep',       palette: 'blue' },
    { type: 'nix',         exts: ['nix'],                           label: 'Nix',         palette: 'blue' },
    { type: 'markdown',    exts: ['md', 'mdx', 'markdown'],         logo: 'markdown',    palette: 'blue' },
    { type: 'text',        exts: ['txt', 'log'],                    label: 'TXT',         palette: 'gray' },
    { type: 'rst',         exts: ['rst'],                           label: 'RST',         palette: 'gray' },
    { type: 'asciidoc',    exts: ['adoc', 'asciidoc'],              label: 'ADoc',        palette: 'gray' },
    { type: 'binary',      exts: ['exe', 'dll', 'so', 'dylib', 'bin', 'class', 'o', 'a'], label: 'BIN', palette: 'gray' },
    { type: 'numbers',     exts: ['numbers'],                       logo: 'numbers',     palette: 'yellow' },
    { type: 'pages',       exts: ['pages'],                         logo: 'pages',       palette: 'orange' },
    { type: 'keynote',     exts: ['key'],                            logo: 'keynote',     palette: 'gray' },
    { type: 'notebook',    exts: ['ipynb'],                         logo: 'notebook',    palette: 'orange' },
    { type: 'gradle',      exts: ['gradle', 'gradle.kts'],           logo: 'gradle',      palette: 'cyan' },
    { type: 'pom',         exts: ['pom'],                            logo: 'pom',         palette: 'red' },
    { type: 'mod',         exts: ['mod'],                            logo: 'gomod',       palette: 'cyan' },
    { type: 'bazel',       exts: ['bazel', 'bzl', 'bazelrc'],         logo: 'bazel',       palette: 'green' },
    { type: 'aspx',        exts: ['aspx', 'ascx', 'asax', 'asmx'],   logo: 'aspx',        palette: 'blue' },
    { type: 'cshtml',      exts: ['cshtml'],                         logo: 'cshtml',      palette: 'purple' },
    { type: 'razor',       exts: ['razor'],                          logo: 'razor',       palette: 'purple' },
    { type: 'xaml',        exts: ['xaml', 'axaml'],                  logo: 'xaml',        palette: 'purple' },
    { type: 'csproj',      exts: ['csproj', 'vbproj', 'fsproj', 'proj'], logo: 'csproj',  palette: 'purple' },
    { type: 'sln',         exts: ['sln'],                            logo: 'sln',         palette: 'gray' },
    { type: 'hql',         exts: ['hql'],                            logo: 'hql',         palette: 'orange' },
    { type: 'plsql',       exts: ['pks', 'pkb', 'plsql', 'pls', 'bdy', 'trg', 'fnc', 'spc'], logo: 'plsql', palette: 'red' },
    { type: 'postcss',     exts: ['pcss', 'postcss'],                logo: 'postcss',     palette: 'red' },
    { type: 'unknown',     exts: [],                                label: '?',           palette: 'dimGray' },
];

/** 完整文件名匹配(优先级最高)。 */
const FILE_NAME_RULES = [
    { match: (n) => n === 'dockerfile', type: 'docker' },
    { match: (n) => n === 'makefile' || n === 'gnumakefile', type: 'shell' },
    { match: (n) => n === 'rakefile', type: 'ruby' },
    { match: (n) => n === 'gemfile', type: 'ruby' },
    { match: (n) => n === 'podfile', type: 'ruby' },
    { match: (n) => n === 'procfile', type: 'config' },
    { match: (n) => n === 'vagrantfile', type: 'ruby' },
    { match: (n) => n === 'license' || n === 'license.md' || n === 'license.txt' || n === 'copying', type: 'license' },
    { match: (n) => n === 'readme' || /^readme\./i.test(n), type: 'readme' },
    { match: (n) => n === 'package-lock.json' || n === 'yarn.lock' || n === 'pnpm-lock.yaml' || /-lock\.json$/.test(n) || /\.lock$/.test(n), type: 'lock' },
    { match: (n) => n === 'tsconfig.json' || n === 'jsconfig.json', type: 'json' },
    { match: (n) => n.startsWith('.env'), type: 'env' },
    { match: (n) => n === '.gitignore' || n === '.gitattributes' || n === '.gitmodules' || n === '.gitkeep', type: 'git' },
    { match: (n) => n === '.dockerignore', type: 'docker' },
    { match: (n) => n === '.editorconfig' || n === '.eslintrc' || n === '.prettierrc' || n === '.babelrc', type: 'config' },
];

function resolveIconType(filePath, kind) {
    if (kind === 'folder') return 'folder';
    if (!filePath) return 'unknown';
    const slash = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'));
    const base = (slash >= 0 ? filePath.slice(slash + 1) : filePath).toLowerCase();
    for (const rule of FILE_NAME_RULES) {
        if (rule.match(base)) return rule.type;
    }
    const dot = base.lastIndexOf('.');
    if (dot > 0) {
        const ext = base.slice(dot + 1);
        for (const t of FILE_TYPES) {
            if (t.exts && t.exts.includes(ext)) return t.type;
        }
    }
    return 'unknown';
}

function renderIcon(type, state) {
    const palette = PALETTE[type.palette];
    const fillColor = state === 'disabled' ? DISABLED_COLOR : palette[state];
    const glyphColor = state === 'disabled' ? '#5C6770' : '#ffffff';

    // 自定义形状
    if (type.shape && SHAPES[type.shape]) {
        const inner = SHAPES[type.shape](fillColor, glyphColor);
        return [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" width="56" height="56">',
            '  ' + inner,
            '</svg>',
            '',
        ].join('\n');
    }

    // 品牌 logo 风格(简化,品牌中性化,不直接抄官方 logo)
    if (type.logo && LOGOS[type.logo]) {
        const inner = LOGOS[type.logo](fillColor, glyphColor);
        return [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" width="56" height="56">',
            '  ' + inner,
            '</svg>',
            '',
        ].join('\n');
    }

    // 文档基线 + 字符(默认)。用 SVG <text> + 等宽字体,字符在 14px 实际显示时仍清晰。
    const label = (type.label || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" width="56" height="56">',
        '  <path d="' + FILE_BODY + '" fill="' + fillColor + '"/>',
        '  <path d="' + FILE_CORNER_FOLD + '" fill="none" stroke="' + glyphColor + '" stroke-width="2.5" stroke-linejoin="round"/>',
        // 3 行模拟代码高亮(色块,代表代码内容)
        '  <rect x="18" y="28" width="16" height="2" fill="' + glyphColor + '" opacity="0.55"/>',
        '  <rect x="18" y="35" width="20" height="2" fill="' + glyphColor + '" opacity="0.75"/>',
        '  <rect x="18" y="42" width="12" height="2" fill="' + glyphColor + '" opacity="0.55"/>',
        // 字符标签(系统等宽字体,大字号清晰)
        '  <text x="36" y="46" font-family="ui-monospace, SFMono-Regular, Consolas, Menlo, monospace" font-size="9" font-weight="700" fill="' + glyphColor + '" text-anchor="middle" letter-spacing="0.5">' + label + '</text>',
        '</svg>',
        '',
    ].join('\n');
}

/**
 * 品牌 logo 风格(简化、品牌中性化,不直接抄官方 logo)。
 * 全部用几何/字符/简化符号传达品牌特征,不依赖外链。
 */
const LOGOS = {
    /** Vue: 绿底圆角矩形 + 大 V 字 */
    vue(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#41B883"/>',
            // 外 V
            '<path d="M 12 14 L 18 14 L 28 32 L 38 14 L 44 14 L 30 38 L 26 38 Z" fill="#ffffff"/>',
            // 内 V
            '<path d="M 24 28 L 28 22 L 32 28 L 30 32 L 28 28 L 26 32 Z" fill="#ffffff" opacity="0.5"/>',
        ].join('');
    },
    /** Python: 蓝黄双蛇简笔 */
    python(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#306998"/>',
            // 上半(蓝)
            '<path d="M 14 16 Q 14 12 18 12 L 36 12 Q 40 12 40 16 L 40 26 Q 40 30 36 30 L 22 30 Q 18 30 18 26 L 18 22" fill="none" stroke="#FFD43B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
            // 下半(黄)
            '<path d="M 18 30 L 18 40 Q 18 44 22 44 L 40 44 Q 42 44 42 42 L 42 32" fill="none" stroke="#FFD43B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
            // 眼
            '<circle cx="20" cy="18" r="1.2" fill="#FFD43B"/>',
            '<circle cx="36" cy="38" r="1.2" fill="#FFD43B"/>',
        ].join('');
    },
    /** Java: 红色咖啡杯 + 蒸汽 */
    java(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#E76F00"/>',
            // 蒸汽
            '<path d="M 22 12 Q 20 14 22 16 M 28 12 Q 30 14 28 16 M 34 12 Q 32 14 34 16" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>',
            // 杯身
            '<path d="M 16 18 L 40 18 L 38 40 Q 38 44 34 44 L 22 44 Q 18 44 18 40 Z" fill="#ffffff"/>',
            // 把手
            '<path d="M 40 22 Q 46 22 46 28 Q 46 34 40 34" fill="none" stroke="#ffffff" stroke-width="2"/>',
            // 杯中咖啡
            '<path d="M 20 22 L 36 22" stroke="#E76F00" stroke-width="1.5" opacity="0.5"/>',
        ].join('');
    },
    /** Rust: 深灰齿轮 */
    rust(fill, glyph) {
        // 6 齿齿轮简化
        return [
            '<circle cx="28" cy="28" r="22" fill="#000000"/>',
            '<circle cx="28" cy="28" r="18" fill="#CE422B"/>',
            // 6 齿
            '<rect x="25" y="2" width="6" height="8" fill="#CE422B"/>',
            '<rect x="25" y="46" width="6" height="8" fill="#CE422B"/>',
            '<rect x="2" y="25" width="8" height="6" fill="#CE422B"/>',
            '<rect x="46" y="25" width="8" height="6" fill="#CE422B"/>',
            '<rect x="8" y="8" width="6" height="8" fill="#CE422B" transform="rotate(45 11 11)"/>',
            '<rect x="42" y="8" width="6" height="8" fill="#CE422B" transform="rotate(-45 45 11)"/>',
            '<rect x="8" y="40" width="6" height="8" fill="#CE422B" transform="rotate(-45 11 45)"/>',
            '<rect x="42" y="40" width="6" height="8" fill="#CE422B" transform="rotate(45 45 45)"/>',
            // 中心
            '<circle cx="28" cy="28" r="6" fill="#ffffff"/>',
            // 简化 R 字符
            '<text x="28" y="32" font-family="Georgia, serif" font-size="9" font-weight="bold" fill="#CE422B" text-anchor="middle">R</text>',
        ].join('');
    },
    /** Office Word: 蓝底 + 文档(内嵌 W 折线) */
    word(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#2B579A"/>',
            // 文档形状(白色,带角折)
            '<path d="M 14 12 L 30 12 L 38 20 L 38 44 L 14 44 Z" fill="#ffffff"/>',
            '<path d="M 30 12 L 30 20 L 38 20" fill="none" stroke="#2B579A" stroke-width="1.5"/>',
            // W 折线(用 path 模拟笔迹风格)
            '<path d="M 17 18 L 19 26 L 21 18 L 23 26 L 25 18" fill="none" stroke="#2B579A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
            // 文字行
            '<line x1="18" y1="32" x2="32" y2="32" stroke="#2B579A" stroke-width="1.5" stroke-linecap="round"/>',
            '<line x1="18" y1="37" x2="30" y2="37" stroke="#2B579A" stroke-width="1.5" stroke-linecap="round"/>',
        ].join('');
    },
    /** Office Excel: 绿底 + 表格(内嵌 X 字符) */
    excel(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#217346"/>',
            // 表格
            '<rect x="12" y="12" width="32" height="32" rx="1" fill="#ffffff"/>',
            '<line x1="22" y1="12" x2="22" y2="44" stroke="#217346" stroke-width="1.5"/>',
            '<line x1="34" y1="12" x2="34" y2="44" stroke="#217346" stroke-width="1.5"/>',
            '<line x1="12" y1="22" x2="44" y2="22" stroke="#217346" stroke-width="1.5"/>',
            '<line x1="12" y1="33" x2="44" y2="33" stroke="#217346" stroke-width="1.5"/>',
            // X 字符
            '<line x1="14" y1="14" x2="20" y2="20" stroke="#217346" stroke-width="2.5" stroke-linecap="round"/>',
            '<line x1="20" y1="14" x2="14" y2="20" stroke="#217346" stroke-width="2.5" stroke-linecap="round"/>',
        ].join('');
    },
    /** Office PowerPoint: 橙底 + 演示稿(内嵌 P 字符) */
    powerpoint(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#D24726"/>',
            // 演示稿形状(白色,带角折)
            '<path d="M 14 12 L 32 12 L 38 18 L 38 38 L 14 38 Z" fill="#ffffff"/>',
            '<path d="M 32 12 L 32 18 L 38 18" fill="none" stroke="#D24726" stroke-width="1.5"/>',
            // P 字符(用 path 画,接近 P 形)
            '<path d="M 19 16 L 19 32 M 19 16 L 25 16 Q 28 16 28 20 Q 28 24 25 24 L 19 24" fill="none" stroke="#D24726" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
        ].join('');
    },
    /** PHP: 紫底椭圆 + PHP 字符 */
    php(fill, glyph) {
        return [
            '<ellipse cx="28" cy="28" rx="24" ry="14" fill="#777BB4"/>',
            '<ellipse cx="28" cy="28" rx="22" ry="12" fill="none" stroke="#ffffff" stroke-width="0.5" opacity="0.3"/>',
            '<text x="28" y="34" font-family="Georgia, serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle" font-style="italic">PHP</text>',
        ].join('');
    },
    /** C++: 蓝色 + 大 ++ */
    cpp(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#00599C"/>',
            '<text x="28" y="36" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" fill="#ffffff" text-anchor="middle">C++</text>',
        ].join('');
    },
    /** C#: 紫色 + 大 # */
    csharp(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#9B4F96"/>',
            '<text x="28" y="38" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="#ffffff" text-anchor="middle">C#</text>',
        ].join('');
    },
    /** Ruby: 红宝石 */
    ruby(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#CC342D"/>',
            // 红宝石菱形
            '<path d="M 28 12 L 40 22 L 28 44 L 16 22 Z" fill="#ffffff"/>',
            '<path d="M 28 12 L 16 22 L 28 22 Z" fill="#9B1B1B"/>',
            '<path d="M 28 12 L 40 22 L 28 22 Z" fill="#B52521"/>',
            '<path d="M 28 22 L 16 22 L 28 44 Z" fill="#CC342D"/>',
            '<path d="M 28 22 L 40 22 L 28 44 Z" fill="#E04A3F"/>',
        ].join('');
    },
    /** Go: 蓝色 + 简化 Gopher(简化为 GO 字符) */
    go(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#00ADD8"/>',
            '<text x="28" y="36" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" fill="#ffffff" text-anchor="middle">Go</text>',
            // 底部波浪(Go 的特色)
            '<path d="M 12 44 Q 18 40 24 44 T 36 44 T 48 44" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.5"/>',
        ].join('');
    },
    /** Swift: 橙红 + 鸟形简笔 */
    swift(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="10" fill="#F05138"/>',
            // 鸟的简化(像 V 形)
            '<path d="M 12 36 Q 18 24 28 18 Q 38 12 44 14 Q 38 18 32 24 Q 26 30 18 36 Z" fill="#ffffff"/>',
            '<circle cx="38" cy="18" r="1.5" fill="#F05138"/>',
        ].join('');
    },
    /** Kotlin: 紫底 + 简化 K */
    kotlin(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#7F52FF"/>',
            // K 形
            '<path d="M 16 12 L 22 12 L 22 28 L 36 12 L 44 12 L 30 28 L 44 44 L 36 44 L 22 28 L 22 44 L 16 44 Z" fill="#ffffff"/>',
        ].join('');
    },
    /** TypeScript: 蓝底 + TS 字符 */
    typescript(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#3178C6"/>',
            '<text x="28" y="36" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" fill="#ffffff" text-anchor="middle">TS</text>',
        ].join('');
    },
    /** JavaScript: 黄底 + JS 字符 */
    javascript(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#F7DF1E"/>',
            '<text x="28" y="36" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" fill="#000000" text-anchor="middle">JS</text>',
        ].join('');
    },
    /** Scala: 红底 + Scala 字符 */
    scala(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#DC322F"/>',
            // 简化的阶梯(向上)
            '<path d="M 10 38 L 18 38 L 18 30 L 26 30 L 26 22 L 34 22 L 34 14 L 42 14" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="square"/>',
        ].join('');
    },
    /** Haskell: 紫底 + λ(希腊字母) */
    haskell(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#5E5086"/>',
            '<text x="28" y="40" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">λ</text>',
        ].join('');
    },
    /** Clojure: 蓝绿 + 简化括号 */
    clojure(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#5881D8"/>',
            '<text x="28" y="38" font-family="Georgia, serif" font-size="22" font-weight="bold" fill="#ffffff" text-anchor="middle">[ ]</text>',
        ].join('');
    },
    /** Erlang: 红 + E 字符 */
    erlang(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#A90533"/>',
            '<text x="28" y="38" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="#ffffff" text-anchor="middle">Er</text>',
        ].join('');
    },
    /** Elixir: 紫 + 紫色宝石 */
    elixir(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#9159A1"/>',
            // 宝石
            '<path d="M 28 14 L 38 22 L 28 42 L 18 22 Z" fill="#ffffff"/>',
            '<path d="M 28 14 L 28 42 L 18 22 Z" fill="#A589B5"/>',
        ].join('');
    },
    /** HTML: 橙底 + </> */
    html(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#E34F26"/>',
            '<text x="28" y="34" font-family="ui-monospace, monospace" font-size="18" font-weight="700" fill="#ffffff" text-anchor="middle">&lt;/&gt;</text>',
        ].join('');
    },
    /** CSS: 蓝底 + # */
    css(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#1572B6"/>',
            '<text x="28" y="38" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="#ffffff" text-anchor="middle">#</text>',
        ].join('');
    },
    /** Sass: 粉红 */
    sass(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#CD6799"/>',
            '<text x="28" y="34" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" fill="#ffffff" text-anchor="middle">Sass</text>',
        ].join('');
    },
    /** Less: 蓝 */
    less(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#1D365D"/>',
            '<text x="28" y="34" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" fill="#ffffff" text-anchor="middle">Less</text>',
        ].join('');
    },
    /** Markdown: 灰底 + M↓ */
    markdown(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#083FA1"/>',
            '<text x="28" y="34" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" fill="#ffffff" text-anchor="middle">M↓</text>',
        ].join('');
    },
    /** JSON: 黄底 + {} */
    json(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#F7DF1E"/>',
            '<text x="28" y="36" font-family="ui-monospace, monospace" font-size="22" font-weight="700" fill="#000000" text-anchor="middle">{}</text>',
        ].join('');
    },
    /** YAML: 红底 + YML */
    yaml(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#CB171E"/>',
            '<text x="28" y="34" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" fill="#ffffff" text-anchor="middle">YML</text>',
        ].join('');
    },
    /** SQL: 蓝底 + 圆柱 */
    sql(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#00758F"/>',
            '<ellipse cx="28" cy="14" rx="12" ry="4" fill="#ffffff"/>',
            '<path d="M 16 14 L 16 42 Q 16 46 28 46 Q 40 46 40 42 L 40 14" fill="#ffffff" opacity="0.3"/>',
            '<ellipse cx="28" cy="14" rx="12" ry="4" fill="none" stroke="#ffffff" stroke-width="1.5"/>',
            '<ellipse cx="28" cy="26" rx="12" ry="4" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.6"/>',
            '<ellipse cx="28" cy="38" rx="12" ry="4" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.6"/>',
        ].join('');
    },
    /** Perl: 蓝底 + 大象简笔(只画头+鼻) */
    perl(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#0298C3"/>',
            '<text x="28" y="36" font-family="Georgia, serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle" font-style="italic">Perl</text>',
        ].join('');
    },
    /** Ruby on Rails: 红 + 简化 */
    rails(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#CC0000"/>',
            '<text x="28" y="36" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" fill="#ffffff" text-anchor="middle">R</text>',
        ].join('');
    },
    /** Apple Numbers: 黄 + 绿表 */
    numbers(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#FFFBE5"/>',
            '<rect x="4" y="4" width="48" height="14" fill="#FFCB05"/>',
            '<rect x="10" y="22" width="14" height="22" fill="#41AD45"/>',
            '<rect x="26" y="22" width="20" height="10" fill="#41AD45"/>',
            '<rect x="26" y="34" width="20" height="10" fill="#41AD45" opacity="0.7"/>',
        ].join('');
    },
    /** Apple Pages: 橙 + 笔尖 */
    pages(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#FFCB05"/>',
            // 文档
            '<rect x="12" y="12" width="32" height="32" rx="2" fill="#ffffff"/>',
            // 笔尖
            '<path d="M 14 38 L 22 30 L 26 34 L 18 42 Z" fill="#FF3B30"/>',
            '<line x1="22" y1="30" x2="30" y2="22" stroke="#FF3B30" stroke-width="3" stroke-linecap="round"/>',
        ].join('');
    },
    /** Apple Keynote: 黑 + 播放 + 灯 */
    keynote(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#1A1A1A"/>',
            '<path d="M 24 18 L 36 30 L 24 42 Z" fill="url(#kg)" />',
            '<defs><linearGradient id="kg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FF3B30"/><stop offset="50%" stop-color="#FFCB05"/><stop offset="100%" stop-color="#34C759"/></linearGradient></defs>',
        ].join('');
    },
    /** Jupyter Notebook: 橙 + 笔记本 */
    notebook(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#F37626"/>',
            '<rect x="14" y="14" width="28" height="28" rx="2" fill="#ffffff"/>',
            '<line x1="20" y1="22" x2="36" y2="22" stroke="#F37626" stroke-width="2" stroke-linecap="round"/>',
            '<line x1="20" y1="28" x2="36" y2="28" stroke="#F37626" stroke-width="2" stroke-linecap="round"/>',
            '<line x1="20" y1="34" x2="32" y2="34" stroke="#F37626" stroke-width="2" stroke-linecap="round"/>',
            // 圆环(jupyter 标志)
            '<circle cx="28" cy="28" r="3" fill="none" stroke="#F37626" stroke-width="1"/>',
        ].join('');
    },
    /** Gradle: 蓝绿 + 大象头 */
    gradle(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#02303A"/>',
            // 简化大象头
            '<ellipse cx="28" cy="28" rx="14" ry="11" fill="#ffffff"/>',
            '<circle cx="24" cy="24" r="1.5" fill="#02303A"/>',
            '<path d="M 32 28 Q 38 28 38 22" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>',
        ].join('');
    },
    /** Maven POM: 红 + 羽毛 */
    pom(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#C71A36"/>',
            // 羽毛笔
            '<path d="M 16 40 L 36 20 Q 40 16 42 18 Q 40 22 36 26 L 16 42 Z" fill="#ffffff"/>',
            '<line x1="18" y1="38" x2="22" y2="42" stroke="#C71A36" stroke-width="1.5"/>',
        ].join('');
    },
    /** Go module: 蓝 + Go 字 */
    gomod(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#00ADD8"/>',
            '<text x="28" y="32" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" fill="#ffffff" text-anchor="middle">mod</text>',
            '<path d="M 12 42 Q 18 38 24 42 T 36 42 T 48 42" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.5"/>',
        ].join('');
    },
    /** Bazel: 绿 + B */
    bazel(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#43A047"/>',
            '<text x="28" y="38" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="#ffffff" text-anchor="middle">B</text>',
            '<line x1="14" y1="44" x2="42" y2="44" stroke="#ffffff" stroke-width="1.5" opacity="0.5"/>',
        ].join('');
    },
    /** ASPX: 蓝 + <% */
    aspx(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#005A9C"/>',
            '<text x="28" y="36" font-family="ui-monospace, monospace" font-size="18" font-weight="700" fill="#ffffff" text-anchor="middle">&lt;%</text>',
        ].join('');
    },
    /** Razor cshtml: 紫 + @ */
    cshtml(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#512BD4"/>',
            '<text x="28" y="40" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="700" fill="#ffffff" text-anchor="middle">@</text>',
        ].join('');
    },
    /** Razor: 紫 + razor 字 */
    razor(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#512BD4"/>',
            '<text x="28" y="22" font-family="Arial, Helvetica, sans-serif" font-size="9" font-weight="700" fill="#ffffff" text-anchor="middle">RAZOR</text>',
            '<line x1="10" y1="32" x2="46" y2="32" stroke="#ffffff" stroke-width="2"/>',
            '<line x1="10" y1="38" x2="38" y2="38" stroke="#ffffff" stroke-width="1.5" opacity="0.6"/>',
        ].join('');
    },
    /** XAML: 蓝 + 网格 */
    xaml(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#512BD4"/>',
            '<rect x="12" y="12" width="32" height="32" fill="none" stroke="#ffffff" stroke-width="1.5"/>',
            '<line x1="12" y1="22" x2="44" y2="22" stroke="#ffffff" stroke-width="1"/>',
            '<line x1="12" y1="32" x2="44" y2="32" stroke="#ffffff" stroke-width="1"/>',
            '<line x1="22" y1="12" x2="22" y2="44" stroke="#ffffff" stroke-width="1"/>',
            '<line x1="32" y1="12" x2="32" y2="44" stroke="#ffffff" stroke-width="1"/>',
        ].join('');
    },
    /** .NET csproj: 蓝 + {} */
    csproj(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#9B4F96"/>',
            '<text x="28" y="36" font-family="ui-monospace, monospace" font-size="22" font-weight="700" fill="#ffffff" text-anchor="middle">{}</text>',
            '<text x="28" y="46" font-family="Arial, Helvetica, sans-serif" font-size="6" font-weight="700" fill="#ffffff" text-anchor="middle" opacity="0.7">.csproj</text>',
        ].join('');
    },
    /** .NET sln: 蓝 + Visual Studio 简化 */
    sln(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#5E5E5E"/>',
            '<rect x="10" y="14" width="36" height="28" rx="1" fill="none" stroke="#ffffff" stroke-width="2"/>',
            '<line x1="10" y1="22" x2="46" y2="22" stroke="#ffffff" stroke-width="1.5"/>',
            '<line x1="18" y1="22" x2="18" y2="42" stroke="#ffffff" stroke-width="1.5" opacity="0.6"/>',
            '<line x1="28" y1="22" x2="28" y2="42" stroke="#ffffff" stroke-width="1.5" opacity="0.6"/>',
            '<line x1="38" y1="22" x2="38" y2="42" stroke="#ffffff" stroke-width="1.5" opacity="0.6"/>',
        ].join('');
    },
    /** HiveQL: 橙 + 蜂巢 */
    hql(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#F58500"/>',
            // 蜂巢
            '<polygon points="28,14 36,19 36,29 28,34 20,29 20,19" fill="none" stroke="#ffffff" stroke-width="2"/>',
            '<polygon points="20,29 12,34 12,44 20,49 28,44 28,34" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.6"/>',
            '<polygon points="36,29 44,34 44,44 36,49 28,44 28,34" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.6"/>',
        ].join('');
    },
    /** PL/SQL: 橙红 + 圆柱 */
    plsql(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#F80000"/>',
            '<ellipse cx="28" cy="16" rx="14" ry="4" fill="#ffffff"/>',
            '<path d="M 14 16 L 14 42 Q 14 46 28 46 Q 42 46 42 42 L 42 16" fill="#ffffff" opacity="0.3"/>',
            '<ellipse cx="28" cy="16" rx="14" ry="4" fill="none" stroke="#ffffff" stroke-width="1.5"/>',
            '<ellipse cx="28" cy="28" rx="14" ry="4" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.6"/>',
            '<ellipse cx="28" cy="40" rx="14" ry="4" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.6"/>',
        ].join('');
    },
    /** PostCSS: 红 + DC */
    postcss(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#DC3A00"/>',
            '<text x="28" y="36" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" fill="#ffffff" text-anchor="middle">PC</text>',
        ].join('');
    },
    /** Twig: 绿 + 树叶 */
    twig(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#138F4A"/>',
            // 叶子
            '<path d="M 28 14 Q 16 18 16 32 Q 16 40 28 42 Q 40 40 40 32 Q 40 18 28 14 Z" fill="#ffffff"/>',
            '<path d="M 28 14 L 28 42" stroke="#138F4A" stroke-width="2" stroke-linecap="round"/>',
            '<path d="M 28 22 L 22 26 M 28 28 L 22 32 M 28 34 L 22 38" stroke="#138F4A" stroke-width="1.2" stroke-linecap="round"/>',
        ].join('');
    },
    /** Verilog: 橙 + 芯片引脚 */
    verilog(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#FF7043"/>',
            // 芯片
            '<rect x="14" y="14" width="28" height="28" rx="2" fill="#ffffff"/>',
            // 引脚
            '<rect x="11" y="18" width="3" height="2" fill="#ffffff"/>',
            '<rect x="11" y="24" width="3" height="2" fill="#ffffff"/>',
            '<rect x="11" y="30" width="3" height="2" fill="#ffffff"/>',
            '<rect x="11" y="36" width="3" height="2" fill="#ffffff"/>',
            '<rect x="42" y="18" width="3" height="2" fill="#ffffff"/>',
            '<rect x="42" y="24" width="3" height="2" fill="#ffffff"/>',
            '<rect x="42" y="30" width="3" height="2" fill="#ffffff"/>',
            '<rect x="42" y="36" width="3" height="2" fill="#ffffff"/>',
            // V 字
            '<text x="28" y="36" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="#FF7043" text-anchor="middle">V</text>',
        ].join('');
    },
    /** Vim: 绿 + 字母 V + 路径 */
    vim(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#199F4B"/>',
            // 折叠的角(模拟编辑器)
            '<path d="M 14 16 L 30 16 L 30 24 L 38 16 L 42 20 L 34 28 L 42 36 L 38 40 L 30 32 L 30 40 L 14 40 Z" fill="#ffffff"/>',
        ].join('');
    },
    /** Vite: 紫 + 闪电 */
    vite(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#646CFF"/>',
            // 闪电
            '<path d="M 32 8 L 16 32 L 26 32 L 22 48 L 40 22 L 30 22 L 36 8 Z" fill="#FFD62F" stroke="#ffffff" stroke-width="0.5" stroke-linejoin="round"/>',
        ].join('');
    },
    /** Vitest: 绿 + 试管 */
    vitest(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#729B1B"/>',
            // 试管
            '<path d="M 22 12 L 22 22 L 16 38 Q 16 44 22 44 L 34 44 Q 40 44 40 38 L 34 22 L 34 12 Z" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round"/>',
            // 液体
            '<path d="M 18 32 L 38 32 L 40 38 Q 40 44 34 44 L 22 44 Q 16 44 16 38 Z" fill="#ffffff" opacity="0.4"/>',
            // V 标
            '<text x="28" y="24" font-family="Arial, sans-serif" font-size="9" font-weight="700" fill="#ffffff" text-anchor="middle">V</text>',
        ].join('');
    },
    /** Webpack: 蓝 + 立方体 */
    webpack(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#1C78C0"/>',
            // 立方体(简化的 webpack logo)
            '<path d="M 28 12 L 40 19 L 40 37 L 28 44 L 16 37 L 16 19 Z" fill="none" stroke="#ffffff" stroke-width="2" stroke-linejoin="round"/>',
            '<line x1="28" y1="12" x2="28" y2="44" stroke="#ffffff" stroke-width="2"/>',
            '<line x1="28" y1="12" x2="16" y2="19" stroke="#ffffff" stroke-width="2"/>',
            '<line x1="28" y1="12" x2="40" y2="19" stroke="#ffffff" stroke-width="2"/>',
            '<line x1="16" y1="19" x2="28" y2="27" stroke="#ffffff" stroke-width="2"/>',
            '<line x1="40" y1="19" x2="28" y2="27" stroke="#ffffff" stroke-width="2"/>',
        ].join('');
    },
    /** XML: 橙 + 角括号 */
    xml(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#FF6600"/>',
            // 角括号
            '<path d="M 16 16 L 22 28 L 16 40" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
            '<path d="M 40 16 L 34 28 L 40 40" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
            '<line x1="26" y1="14" x2="30" y2="42" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>',
        ].join('');
    },
    /** VB: 蓝 + 窗口 */
    vb(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#005A9C"/>',
            // 三个窗口
            '<rect x="12" y="14" width="20" height="14" rx="1" fill="none" stroke="#ffffff" stroke-width="2"/>',
            '<rect x="24" y="24" width="20" height="14" rx="1" fill="none" stroke="#ffffff" stroke-width="2"/>',
            '<line x1="12" y1="18" x2="32" y2="18" stroke="#ffffff" stroke-width="1.5"/>',
            '<line x1="24" y1="28" x2="44" y2="28" stroke="#ffffff" stroke-width="1.5"/>',
            '<circle cx="15" cy="16" r="0.7" fill="#ffffff"/>',
            '<circle cx="27" cy="26" r="0.7" fill="#ffffff"/>',
        ].join('');
    },
    /** tsx (TypeScript JSX): 蓝 + TSX */
    tsx(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#3178C6"/>',
            '<text x="28" y="36" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" fill="#ffffff" text-anchor="middle">TSX</text>',
        ].join('');
    },
    /** Office 365 Word: 蓝 + 文档(跟 Word 略有不同,圆角更现代) */
    docx(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#2B579A"/>',
            '<path d="M 14 10 L 30 10 L 40 20 L 40 46 L 14 46 Z" fill="#ffffff"/>',
            '<path d="M 30 10 L 30 20 L 40 20" fill="none" stroke="#2B579A" stroke-width="1.5" stroke-linejoin="round"/>',
            '<path d="M 18 18 L 21 30 L 24 18 L 27 30 L 30 18" fill="none" stroke="#2B579A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
            '<line x1="18" y1="36" x2="34" y2="36" stroke="#2B579A" stroke-width="1.5" stroke-linecap="round"/>',
            '<line x1="18" y1="40" x2="30" y2="40" stroke="#2B579A" stroke-width="1.5" stroke-linecap="round"/>',
        ].join('');
    },
    /** Office 365 Excel: 绿 + 表格 + X */
    xlsx(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#217346"/>',
            '<rect x="12" y="12" width="32" height="32" rx="2" fill="#ffffff"/>',
            // 列分隔
            '<line x1="20" y1="12" x2="20" y2="44" stroke="#217346" stroke-width="1.2"/>',
            '<line x1="28" y1="12" x2="28" y2="44" stroke="#217346" stroke-width="1.2"/>',
            '<line x1="36" y1="12" x2="36" y2="44" stroke="#217346" stroke-width="1.2"/>',
            // 行分隔
            '<line x1="12" y1="20" x2="44" y2="20" stroke="#217346" stroke-width="1.2"/>',
            '<line x1="12" y1="28" x2="44" y2="28" stroke="#217346" stroke-width="1.2"/>',
            '<line x1="12" y1="36" x2="44" y2="36" stroke="#217346" stroke-width="1.2"/>',
            // X 字符
            '<line x1="14" y1="14" x2="18" y2="18" stroke="#217346" stroke-width="2" stroke-linecap="round"/>',
            '<line x1="18" y1="14" x2="14" y2="18" stroke="#217346" stroke-width="2" stroke-linecap="round"/>',
        ].join('');
    },
    /** Office 365 PowerPoint: 橙 + 演示稿 + P */
    pptx(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#D24726"/>',
            '<path d="M 12 14 L 32 14 L 40 22 L 40 42 L 12 42 Z" fill="#ffffff"/>',
            '<path d="M 32 14 L 32 22 L 40 22" fill="none" stroke="#D24726" stroke-width="1.5" stroke-linejoin="round"/>',
            // P 字符
            '<path d="M 18 18 L 18 36 M 18 18 L 24 18 Q 28 18 28 22 Q 28 26 24 26 L 18 26" fill="none" stroke="#D24726" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
        ].join('');
    },
    /** OpenDocument Text: 蓝白 + odt */
    odt(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#0078C8"/>',
            '<path d="M 14 10 L 30 10 L 40 20 L 40 46 L 14 46 Z" fill="#ffffff"/>',
            '<path d="M 30 10 L 30 20 L 40 20" fill="none" stroke="#0078C8" stroke-width="1.5" stroke-linejoin="round"/>',
            // ODT 字
            '<text x="27" y="40" font-family="Arial, sans-serif" font-size="9" font-weight="700" fill="#0078C8" text-anchor="middle">ODT</text>',
        ].join('');
    },
    /** OpenDocument Spreadsheet: 蓝绿 + ods */
    ods(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#009A44"/>',
            '<rect x="10" y="10" width="36" height="36" rx="2" fill="#ffffff"/>',
            '<line x1="20" y1="10" x2="20" y2="46" stroke="#009A44" stroke-width="1.2"/>',
            '<line x1="30" y1="10" x2="30" y2="46" stroke="#009A44" stroke-width="1.2"/>',
            '<line x1="40" y1="10" x2="40" y2="46" stroke="#009A44" stroke-width="1.2"/>',
            '<line x1="10" y1="20" x2="46" y2="20" stroke="#009A44" stroke-width="1.2"/>',
            '<line x1="10" y1="30" x2="46" y2="30" stroke="#009A44" stroke-width="1.2"/>',
            '<line x1="10" y1="40" x2="46" y2="40" stroke="#009A44" stroke-width="1.2"/>',
            '<text x="28" y="9" font-family="Arial, sans-serif" font-size="6" font-weight="700" fill="#0078C8" text-anchor="middle">ODS</text>',
        ].join('');
    },
    /** OpenDocument Presentation: 橙红 + odp */
    odp(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#E66B0F"/>',
            '<path d="M 12 14 L 32 14 L 40 22 L 40 42 L 12 42 Z" fill="#ffffff"/>',
            '<path d="M 32 14 L 32 22 L 40 22" fill="none" stroke="#E66B0F" stroke-width="1.5" stroke-linejoin="round"/>',
            // 播放三角
            '<path d="M 22 26 L 32 30 L 22 34 Z" fill="#E66B0F"/>',
        ].join('');
    },
    /** CSV: 绿白 + 表格 */
    csv(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#1F6F43"/>',
            '<rect x="10" y="10" width="36" height="36" rx="2" fill="#ffffff"/>',
            // 列分隔
            '<line x1="20" y1="10" x2="20" y2="46" stroke="#1F6F43" stroke-width="1"/>',
            '<line x1="30" y1="10" x2="30" y2="46" stroke="#1F6F43" stroke-width="1"/>',
            '<line x1="40" y1="10" x2="40" y2="46" stroke="#1F6F43" stroke-width="1"/>',
            // 行分隔
            '<line x1="10" y1="18" x2="46" y2="18" stroke="#1F6F43" stroke-width="1"/>',
            '<line x1="10" y1="28" x2="46" y2="28" stroke="#1F6F43" stroke-width="1"/>',
            '<line x1="10" y1="38" x2="46" y2="38" stroke="#1F6F43" stroke-width="1"/>',
            // 顶部表头(深色)
            '<rect x="10" y="10" width="36" height="8" fill="#1F6F43"/>',
        ].join('');
    },
    /** RTF: 蓝 + 文档 + R */
    rtf(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#0078C8"/>',
            '<path d="M 14 10 L 30 10 L 40 20 L 40 46 L 14 46 Z" fill="#ffffff"/>',
            '<path d="M 30 10 L 30 20 L 40 20" fill="none" stroke="#0078C8" stroke-width="1.5" stroke-linejoin="round"/>',
            // R 字符
            '<text x="27" y="40" font-family="Georgia, serif" font-size="20" font-weight="700" font-style="italic" fill="#0078C8" text-anchor="middle">R</text>',
        ].join('');
    },
    /** OneNote: 紫 + 笔记本 */
    onenote(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#80397B"/>',
            // 笔记本
            '<rect x="10" y="10" width="36" height="36" rx="2" fill="#ffffff"/>',
            // 装订线
            '<rect x="10" y="10" width="6" height="36" fill="#80397B"/>',
            // 文字行
            '<line x1="20" y1="20" x2="42" y2="20" stroke="#80397B" stroke-width="1.5"/>',
            '<line x1="20" y1="28" x2="42" y2="28" stroke="#80397B" stroke-width="1.5"/>',
            '<line x1="20" y1="36" x2="38" y2="36" stroke="#80397B" stroke-width="1.5"/>',
        ].join('');
    },
    /** Outlook: 蓝 + 信封 */
    outlook(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#0078D4"/>',
            // 信封
            '<rect x="10" y="16" width="36" height="24" rx="2" fill="#ffffff"/>',
            '<path d="M 10 16 L 28 30 L 46 16" fill="none" stroke="#0078D4" stroke-width="2" stroke-linejoin="round"/>',
        ].join('');
    },
    /** Access: 红橙 + 数据库 */
    access(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#A4373A"/>',
            // 数据库圆柱
            '<ellipse cx="28" cy="16" rx="14" ry="4" fill="#ffffff"/>',
            '<path d="M 14 16 L 14 40 Q 14 44 28 44 Q 42 44 42 40 L 42 16" fill="#ffffff" opacity="0.4"/>',
            '<ellipse cx="28" cy="16" rx="14" ry="4" fill="none" stroke="#A4373A" stroke-width="1.5"/>',
            '<ellipse cx="28" cy="26" rx="14" ry="4" fill="none" stroke="#A4373A" stroke-width="1" opacity="0.6"/>',
            '<ellipse cx="28" cy="36" rx="14" ry="4" fill="none" stroke="#A4373A" stroke-width="1" opacity="0.6"/>',
        ].join('');
    },
    /** Visio: 蓝 + 形状 + 流程 */
    visio(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#3955A3"/>',
            // 流程图形状
            '<rect x="10" y="20" width="12" height="8" rx="1" fill="#ffffff"/>',
            '<polygon points="34,18 44,24 34,30" fill="#ffffff"/>',
            '<line x1="22" y1="24" x2="34" y2="24" stroke="#ffffff" stroke-width="1.5"/>',
        ].join('');
    },
    /** Publisher: 绿 + 卡片 */
    publisher(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#D56E0B"/>',
            // 卡片
            '<rect x="10" y="14" width="24" height="28" rx="1" fill="#ffffff"/>',
            '<line x1="14" y1="20" x2="30" y2="20" stroke="#D56E0B" stroke-width="1"/>',
            '<line x1="14" y1="24" x2="30" y2="24" stroke="#D56E0B" stroke-width="1"/>',
            '<line x1="14" y1="28" x2="30" y2="28" stroke="#D56E0B" stroke-width="1"/>',
            // 第二张
            '<rect x="20" y="22" width="20" height="20" rx="1" fill="#ffffff" opacity="0.6"/>',
        ].join('');
    },
    /** Project: 绿 + 甘特 */
    project(fill, glyph) {
        return [
            '<rect x="4" y="4" width="48" height="48" rx="6" fill="#1D7CB6"/>',
            // 甘特图条
            '<rect x="10" y="16" width="6" height="3" fill="#ffffff"/>',
            '<rect x="18" y="16" width="14" height="3" fill="#ffffff"/>',
            '<rect x="14" y="24" width="10" height="3" fill="#ffffff"/>',
            '<rect x="26" y="24" width="12" height="3" fill="#ffffff"/>',
            '<rect x="12" y="32" width="8" height="3" fill="#ffffff"/>',
            '<rect x="22" y="32" width="16" height="3" fill="#ffffff"/>',
            '<rect x="16" y="40" width="14" height="3" fill="#ffffff"/>',
        ].join('');
    },
};

function stateSuffix(state) {
    return state === 'default' ? '' : '-' + state;
}

function main() {
    let count = 0;
    for (const type of FILE_TYPES) {
        for (const state of ['default', 'hover', 'active', 'disabled']) {
            const fileName = 'file-' + type.type + stateSuffix(state) + '.svg';
            fs.writeFileSync(path.join(ICON_DIR, fileName), renderIcon(type, state), 'utf8');
            count++;
        }
    }
    console.log('已生成 ' + FILE_TYPES.length + ' 类 × 4 状态 = ' + count + ' 个图标到 ' + ICON_DIR);

    const extMap = { _folder: 'folder', _unknown: 'unknown' };
    for (const t of FILE_TYPES) for (const ext of t.exts || []) extMap[ext] = t.type;
    for (const rule of FILE_NAME_RULES) extMap['__filename_' + rule.type] = rule.type;
    fs.writeFileSync(MAP_PATH, JSON.stringify({
        version: 1,
        description: '扩展名/文件名 → 文件类型图标名(file-{type})。前端可直接 import 此 JSON 用。',
        extMap,
        types: FILE_TYPES.map(t => ({ type: t.type, label: t.label || null, shape: t.shape || null, palette: t.palette, exts: t.exts || [] })),
    }, null, 2) + '\n', 'utf8');
    console.log('已生成扩展名映射: ' + MAP_PATH);

    writeDocs();
    console.log('已更新规范文档: ' + DOC_PATH);
}

function writeDocs() {
    const groups = [
        { name: '目录', types: ['folder'] },
        { name: '专门视觉(多媒体/容器/工具)', filter: (t) => ['image','svg','video','audio','font','archive','jar','pdf','doc','sheet','slide','docker','shell','bat','powershell','git','license','readme','lock'].includes(t.type) },
        { name: '后端 / 系统语言', filter: (t) => ['java','kotlin','scala','groovy','c','cpp','csharp','go','rust','ruby','php','perl','lua','erlang','elixir','haskell','clojure','fsharp','ocaml','dart','swift','lisp','vb','pascal','ada','fortran','cobol','tcl','verilog'].includes(t.type) },
        { name: '前端 / 脚本', filter: (t) => ['javascript','typescript','jsx','tsx','vue','svelte','html','css','scss','sass','less','stylus','xml','graphql','coffeescript','livescript'].includes(t.type) },
        { name: '模板 / 视图', filter: (t) => ['haml','slim','pug','ejs','handlebars','twig','jinja','blade','liquid'].includes(t.type) },
        { name: '配置 / 数据', filter: (t) => ['json','yaml','toml','ini','properties','env','config','sql','sqlite','plist'].includes(t.type) },
        { name: '接口 / 协议', filter: (t) => ['protobuf','graphql'].includes(t.type) },
        { name: '构建 / 工具', filter: (t) => ['webpack','vite','rollup','esbuild','babel','eslint','prettier','stylelint','jest','vitest','cypress','playwright','puppeteer','cmake','cargo','pipfile','pyproject','terraform','bicep','nix','vim','emacs','diff'].includes(t.type) },
        { name: '元数据 / 占位', filter: (t) => ['markdown','text','rst','asciidoc','binary','unknown'].includes(t.type) },
    ];
    const tableRows = [];
    for (const g of groups) {
        const types = g.filter ? FILE_TYPES.filter(g.filter) : FILE_TYPES.filter(t => g.types.includes(t.type));
        for (const t of types) {
            const extStr = (t.exts || []).join(', ') || (t.shape ? '(完整文件名或扩展名匹配)' : '(查不到扩展名时)');
            tableRows.push({ group: g.name, type: t.type, label: t.label || (t.shape || '-'), palette: t.palette, ext: extStr });
        }
    }
    const extByType = {};
    for (const t of FILE_TYPES) for (const e of t.exts || []) (extByType[e] ||= []).push(t.type);
    const extLines = Object.keys(extByType).sort().map(k => '- `' + k + '` → `' + extByType[k].join('`, `') + '`').join('\n');
    const fnLines = FILE_NAME_RULES.map(r => '- 完整文件名 `' + r.match.toString().replace(/^\(n\) => /, '').slice(0, 50) + '...` → `file-' + r.type + '.svg`').join('\n');

    const md = [
        '# 文件类型图标规范',
        '',
        '> cxx-ui 图标库 · 文件类型子集 · 跟通用 `NN-name.svg` 编号图标体系并存',
        '',
        '## 1. 命名规则',
        '',
        '| 体系 | 命名 | 用途 | 数量 |',
        '|---|---|---|---|',
        '| 通用图标 | `NN-name.svg` | 固定集合(60 个) | 固定 |',
        '| 文件类型 | `file-{type}.svg` | **无限集合**,按需扩展 | 持续 |',
        '',
        '**文件类型图标不带序号**,因为:',
        '',
        '- 不需要"先来后到",新加文件类型不影响既有',
        '- 文件名稳定 → HTTP 缓存友好',
        '- 前端可以按 `getIconByExt(ext)` 直接拿,不需要先查编号表',
        '- 4 状态后缀固定: `file-java.svg` / `file-java-hover.svg` / `file-java-active.svg` / `file-java-disabled.svg`',
        '',
        '## 2. 视觉差异(每类有专属形状)',
        '',
        '**不是所有文件类型都用同一个"文档基线 + 字符"模板**,各类型有对应视觉:',
        '',
        '| 类型 | 视觉 |',
        '|---|---|',
        '| `folder` | 文件夹形状 |',
        '| `image` / `svg` | 矩形 + 太阳 + 山峰 |',
        '| `video` | 胶片孔 + 播放三角 |',
        '| `audio` | 5 条声波 + 音符 |',
        '| `font` | "A" 大字 + "a" 小字 |',
        '| `archive` | 堆叠 3 层 + 扎带 |',
        '| `jar` | 椭圆盖 + 罐身 |',
        '| `pdf` | 文档基线 + PDF 大字 |',
        '| `doc` | 文档基线 + 角标 W |',
        '| `sheet` | 文档基线 + 表格网格 |',
        '| `slide` | 矩形屏幕 + 播放三角 |',
        '| `docker` | 鲸鱼 + 集装箱 |',
        '| `shell` / `bat` / `powershell` | 终端窗口 + `$` + 命令 |',
        '| `git` | 3 节点 + 分支连接 |',
        '| `license` | 卷轴 + © |',
        '| `readme` | 打开的书本 + i 标识 |',
        '| `lock` | 锁钩 + 锁身 |',
        '| 代码/配置/数据 | 文档基线 + 字符标签 |',
        '',
        '## 3. 加载与缓存',
        '',
        '### 3.1 前端标准做法',
        '',
        '```js',
        'import iconMap from \'/icons/file-icon-map.json\';',
        '',
        'function getIconByPath(filePath, kind) {',
        '    if (kind === \'folder\') return `icons/file-folder.svg`;',
        '    const name = filePath.split(/[\\\\/]/).pop().toLowerCase();',
        '    // 完整文件名优先(Dockerfile / LICENSE / package-lock.json 等)',
        '    for (const [key, type] of Object.entries(iconMap.extMap)) {',
        '        if (key.startsWith(\'__filename_\') && name === key.replace(\'__filename_\', \'\')) {',
        '            return `icons/file-${type}.svg`;',
        '        }',
        '    }',
        '    // 扩展名兜底',
        '    const ext = name.includes(\'.\') ? name.split(\'.\').pop() : \'\';',
        '    const type = iconMap.extMap[ext] || iconMap.extMap._unknown;',
        '    return `icons/file-${type}.svg`;',
        '}',
        '```',
        '',
        '### 3.2 HTTP 缓存建议',
        '',
        '- `icons/file-icon-map.json` → `Cache-Control: max-age=86400`(启动时拉一次)',
        '- `icons/file-{type}.svg` → `Cache-Control: public, max-age=2592000, immutable`(永不变)',
        '- 4 状态后缀是不同 URL,各自独立缓存',
        '- 文件名稳定 = 内容稳定,可以直接走磁盘缓存',
        '',
        '## 4. 添加新文件类型',
        '',
        '1. 编辑 `scripts/generate-file-type-icons.cjs` 的 `FILE_TYPES` 数组',
        '2. `node scripts/generate-file-type-icons.cjs`',
        '3. 自动产生 4 态 SVG + 更新 `icons/file-icon-map.json` + 更新本规范',
        '4. 提交 PR,审核命名 + 配色 + 字符标签 / 视觉',
        '',
        '## 5. 已有文件类型',
        '',
        '| 类别 | 类型 | 视觉/标签 | 配色 | 扩展名 / 文件名 |',
        '|---|---|---|---|---|',
        ...tableRows.map(r => '| ' + r.group + ' | `file-' + r.type + '.svg` | `' + r.label + '` | ' + r.palette + ' | ' + r.ext + ' |'),
        '',
        '## 6. 扩展名速查(按字母)',
        '',
        extLines,
        '',
        '## 7. 完整文件名匹配(优先级最高)',
        '',
        fnLines,
        '',
        '## 8. 4 状态',
        '',
        '| 状态 | 触发 | 视觉 |',
        '|---|---|---|',
        '| `default` | 默认 | 配色矩阵 base 色 |',
        '| `hover` | 鼠标悬停 | 同色浅一档 |',
        '| `active` | 鼠标按下 | 同色深一档 |',
        '| `disabled` | 不可用 | 统一灰 `#868E96` |',
        '',
        '## 9. 风格一致性',
        '',
        '- viewBox 统一 `0 0 56 56`,源文件 `width="56" height="56"`',
        '- 不用 `<script>` / `<foreignObject>` / 外链 `href` / `url()` / `onload` / `onclick`',
        '- 专门形状优先纯几何(矩形/圆形/直线),必要时用 `<text>` 表达字符(只在 PDF/font 视觉使用)',
        '',
    ].join('\n');
    fs.mkdirSync(DOCS_DIR, { recursive: true });
    fs.writeFileSync(DOC_PATH, md, 'utf8');
}

main();
