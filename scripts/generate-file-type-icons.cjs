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
 * 自定义形状库。每种形状都是完整的 SVG 路径/元素,不再是文档基线 + 字符。
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
    { type: 'pdf',      exts: ['pdf'],      shape: 'pdf', palette: 'red' },
    { type: 'doc',      exts: ['doc','docx','rtf','odt'], shape: 'doc', palette: 'blue' },
    { type: 'sheet',    exts: ['xls','xlsx','csv','tsv','ods'], shape: 'sheet', palette: 'teal' },
    { type: 'slide',    exts: ['ppt','pptx','odp'], shape: 'slide', palette: 'orange' },
    { type: 'docker',   exts: [], shape: 'docker', palette: 'cyan' },
    { type: 'shell',    exts: ['sh','bash','zsh','ksh'], shape: 'shell', palette: 'gray' },
    { type: 'bat',      exts: ['bat','cmd'], shape: 'shell', palette: 'gray' },
    { type: 'powershell',exts: ['ps1','psm1','psd1'], shape: 'shell', palette: 'blue' },
    { type: 'git',      exts: [], shape: 'git', palette: 'red' },
    { type: 'license',  exts: [], shape: 'license', palette: 'gray' },
    { type: 'readme',   exts: [], shape: 'readme', palette: 'gray' },
    { type: 'lock',     exts: [], shape: 'lock', palette: 'gray' },
    // 文档基线 + 字符(代码/配置/数据)
    { type: 'java',        exts: ['java'],                          label: 'JV', palette: 'green' },
    { type: 'kotlin',      exts: ['kt', 'kts'],                     label: 'Kt', palette: 'green' },
    { type: 'scala',       exts: ['scala', 'sbt'],                   label: 'Sc', palette: 'red' },
    { type: 'groovy',      exts: ['groovy'],                        label: 'Gy', palette: 'blue' },
    { type: 'c',           exts: ['c', 'h'],                        label: 'C',  palette: 'gray' },
    { type: 'cpp',         exts: ['cpp', 'cc', 'cxx', 'hpp', 'hxx'], label: 'C+', palette: 'purple' },
    { type: 'csharp',      exts: ['cs'],                            label: 'C#', palette: 'purple' },
    { type: 'go',          exts: ['go'],                            label: 'Go', palette: 'cyan' },
    { type: 'rust',        exts: ['rs'],                            label: 'Rs', palette: 'red' },
    { type: 'ruby',        exts: ['rb'],                            label: 'Rb', palette: 'red' },
    { type: 'python',      exts: ['py', 'pyi', 'pyc', 'pyd', 'pyo'],label: 'Py', palette: 'light' },
    { type: 'php',         exts: ['php', 'php5', 'phtml'],          label: 'PHP', palette: 'light' },
    { type: 'perl',        exts: ['pl', 'pm'],                      label: 'Pl', palette: 'blue' },
    { type: 'lua',         exts: ['lua'],                           label: 'Lu', palette: 'blue' },
    { type: 'erlang',      exts: ['erl', 'hrl'],                    label: 'Er', palette: 'red' },
    { type: 'elixir',      exts: ['ex', 'exs'],                     label: 'Ex', palette: 'purple' },
    { type: 'haskell',     exts: ['hs'],                            label: 'Hs', palette: 'light' },
    { type: 'clojure',     exts: ['clj', 'cljs', 'cljc'],           label: 'Cl', palette: 'teal' },
    { type: 'fsharp',      exts: ['fs', 'fsx', 'fsi'],              label: 'F#', palette: 'blue' },
    { type: 'ocaml',       exts: ['ml', 'mli'],                     label: 'Ml', palette: 'orange' },
    { type: 'dart',        exts: ['dart'],                          label: 'Dt', palette: 'light' },
    { type: 'swift',       exts: ['swift'],                         label: 'Sw', palette: 'red' },
    { type: 'lisp',        exts: ['lisp', 'lsp', 'cl'],             label: 'Lp', palette: 'purple' },
    { type: 'vb',          exts: ['vb', 'vbs'],                     label: 'VB', palette: 'blue' },
    { type: 'pascal',      exts: ['pas', 'dpr', 'pp'],              label: 'Pa', palette: 'red' },
    { type: 'ada',         exts: ['ada', 'adb', 'ads'],             label: 'Ad', palette: 'blue' },
    { type: 'fortran',     exts: ['f', 'f77', 'f90', 'f95', 'f03', 'for'], label: 'Ft', palette: 'purple' },
    { type: 'cobol',       exts: ['cob', 'cbl'],                    label: 'Cb', palette: 'blue' },
    { type: 'tcl',         exts: ['tcl'],                           label: 'Tc', palette: 'cyan' },
    { type: 'verilog',     exts: ['v', 'sv', 'vh', 'svh'],           label: 'Vg', palette: 'orange' },
    { type: 'sql',         exts: ['sql'],                           label: 'SQL', palette: 'purple' },
    { type: 'sqlite',      exts: ['sqlite', 'sqlite3', 'db', 'db3'],label: 'SL', palette: 'blue' },
    { type: 'protobuf',    exts: ['proto'],                         label: 'P#', palette: 'purple' },
    { type: 'graphql',     exts: ['graphql', 'gql'],                label: 'GQ', palette: 'purple' },
    { type: 'coffeescript',exts: ['coffee'],                        label: 'Cf', palette: 'yellow' },
    { type: 'livescript',  exts: ['ls'],                            label: 'LS', palette: 'blue' },
    { type: 'javascript',  exts: ['js', 'mjs', 'cjs'],              label: 'JS', palette: 'yellow' },
    { type: 'typescript',  exts: ['ts', 'mts', 'cts'],              label: 'TS', palette: 'blue' },
    { type: 'jsx',         exts: ['jsx'],                           label: 'JSX', palette: 'yellow' },
    { type: 'tsx',         exts: ['tsx'],                           label: 'TSX', palette: 'blue' },
    { type: 'vue',         exts: ['vue'],                           label: 'V',  palette: 'green' },
    { type: 'svelte',      exts: ['svelte'],                        label: 'Sv', palette: 'red' },
    { type: 'html',        exts: ['html', 'htm', 'xhtml'],          label: '<>', palette: 'yellow' },
    { type: 'css',         exts: ['css'],                           label: '#',  palette: 'blue' },
    { type: 'scss',        exts: ['scss'],                          label: 'Sc', palette: 'blue' },
    { type: 'sass',        exts: ['sass'],                          label: 'Sa', palette: 'blue' },
    { type: 'less',        exts: ['less'],                          label: 'Ls', palette: 'blue' },
    { type: 'stylus',      exts: ['styl'],                          label: 'St', palette: 'green' },
    { type: 'xml',         exts: ['xml', 'xsl', 'xslt'],            label: 'X',  palette: 'orange' },
    { type: 'haml',        exts: ['haml'],                          label: 'Hm', palette: 'orange' },
    { type: 'slim',        exts: ['slim'],                          label: 'Sl', palette: 'green' },
    { type: 'pug',         exts: ['pug', 'jade'],                   label: 'Pg', palette: 'red' },
    { type: 'ejs',         exts: ['ejs', 'ect'],                    label: 'EJ', palette: 'yellow' },
    { type: 'handlebars',  exts: ['hbs', 'handlebars', 'mustache'], label: 'Hb', palette: 'orange' },
    { type: 'twig',        exts: ['twig'],                          label: 'Tw', palette: 'green' },
    { type: 'jinja',       exts: ['jinja', 'jinja2', 'j2'],         label: 'Jn', palette: 'red' },
    { type: 'blade',       exts: ['blade.php', 'bladephp'],         label: 'Bl', palette: 'red' },
    { type: 'liquid',      exts: ['liquid'],                        label: 'Lq', palette: 'green' },
    { type: 'json',        exts: ['json', 'jsonc', 'json5'],        label: '{}', palette: 'yellow' },
    { type: 'yaml',        exts: ['yml', 'yaml'],                   label: 'Y',  palette: 'cyan' },
    { type: 'toml',        exts: ['toml'],                          label: 'Tl', palette: 'cyan' },
    { type: 'ini',         exts: ['ini', 'cfg', 'conf'],            label: 'I',  palette: 'cyan' },
    { type: 'properties',  exts: ['properties'],                    label: 'P',  palette: 'cyan' },
    { type: 'env',         exts: ['env'],                           label: 'E',  palette: 'yellow' },
    { type: 'plist',       exts: ['plist'],                         label: 'Ps', palette: 'gray' },
    { type: 'config',      exts: [],                                label: '*',  palette: 'cyan' },
    { type: 'vim',         exts: ['vim'],                           label: 'Vm', palette: 'green' },
    { type: 'emacs',       exts: ['el'],                            label: 'El', palette: 'purple' },
    { type: 'diff',        exts: ['diff', 'patch'],                 label: '±',  palette: 'gray' },
    { type: 'cmake',       exts: ['cmake'],                         label: 'CM', palette: 'gray' },
    { type: 'cargo',       exts: ['cargo', 'cargo.toml'],           label: 'Cg', palette: 'orange' },
    { type: 'pipfile',     exts: ['pipfile'],                       label: 'Py', palette: 'blue' },
    { type: 'pyproject',   exts: ['pyproject'],                     label: 'Py', palette: 'blue' },
    { type: 'webpack',     exts: ['webpack'],                       label: 'Wp', palette: 'blue' },
    { type: 'vite',        exts: ['vite'],                          label: 'Vi', palette: 'purple' },
    { type: 'rollup',      exts: ['rollup'],                        label: 'Rp', palette: 'red' },
    { type: 'esbuild',     exts: ['esbuild'],                       label: 'Eb', palette: 'yellow' },
    { type: 'babel',       exts: ['babel'],                         label: 'Bb', palette: 'yellow' },
    { type: 'eslint',      exts: ['eslint'],                        label: 'Es', palette: 'purple' },
    { type: 'prettier',    exts: ['prettier'],                      label: 'Pt', palette: 'blue' },
    { type: 'stylelint',   exts: ['stylelint'],                     label: 'Sn', palette: 'teal' },
    { type: 'jest',        exts: ['jest'],                          label: 'Jt', palette: 'red' },
    { type: 'vitest',      exts: ['vitest'],                        label: 'Vs', palette: 'green' },
    { type: 'cypress',     exts: ['cypress'],                       label: 'Cy', palette: 'green' },
    { type: 'playwright',  exts: ['playwright'],                    label: 'Pw', palette: 'purple' },
    { type: 'puppeteer',   exts: ['puppeteer'],                     label: 'Pu', palette: 'red' },
    { type: 'terraform',   exts: ['tf', 'tfvars', 'hcl'],           label: 'Tf', palette: 'purple' },
    { type: 'bicep',       exts: ['bicep'],                         label: 'Bi', palette: 'blue' },
    { type: 'nix',         exts: ['nix'],                           label: 'Nx', palette: 'blue' },
    { type: 'markdown',    exts: ['md', 'mdx', 'markdown'],         label: 'M.', palette: 'gray' },
    { type: 'text',        exts: ['txt', 'log'],                    label: 'TXT', palette: 'yellow' },
    { type: 'rst',         exts: ['rst'],                           label: 'R',  palette: 'gray' },
    { type: 'asciidoc',    exts: ['adoc', 'asciidoc'],              label: 'Ad', palette: 'blue' },
    { type: 'binary',      exts: ['exe', 'dll', 'so', 'dylib', 'bin', 'class', 'o', 'a'], label: 'BIN', palette: 'gray' },
    { type: 'unknown',     exts: [],                                label: '?',  palette: 'dimGray' },
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
