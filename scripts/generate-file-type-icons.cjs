/**
 * 文件类型图标生成器(用于 cxx-ui 图标库)。
 *
 * 命名规范:文件类型图标用 file-{type}.svg,无序号(无限集合,按需添加)。
 * 通用图标(01-60)保持 NN-name.svg 序号(固定集合)。
 *
 * 风格基线:文档轮廓 + 角折 + 3 横线,沿用 09-file.svg。
 * 类型识别:文档体填主题色(README 配色矩阵),字符标签表示类型。
 * 4 状态:default / hover / active / disabled(同色系 3 档 + 灰)。
 * viewBox 0 0 56 56,无脚本无外链。
 *
 * 用法:node scripts/generate-file-type-icons.cjs
 *       改 FILE_TYPES 后再跑,自动产生 4 态文件 + 同步 docs/FILE_ICONS.md + icons/file-icon-map.json
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
});
const DISABLED_COLOR = '#868E96';

const FILE_BODY = 'M 12 8 L 32 8 L 44 20 L 44 48 L 12 48 Z';
const FILE_CORNER_FOLD = 'M 32 8 L 32 20 L 44 20';
const FILE_LINES = [
    { x1: 18, y1: 28, x2: 34, y2: 28 },
    { x1: 18, y1: 35, x2: 38, y2: 35 },
    { x1: 18, y1: 42, x2: 30, y2: 42 },
];

/** 字符位图(5x7,X=实心点)。 */
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
 * 文件类型定义(无序号,按 type 命名)。
 * exts: 映射的扩展名列表(小写、不含点);aliases: 旧名/同义扩展;label: 文档内 1-3 字符标签;palette: 配色键。
 */
const FILE_TYPES = [
    // 目录(用独立形状,不画文档)
    { type: 'folder', palette: 'gold', isFolder: true },
    // 编程语言 - 后端/系统
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
    // 前端 / 脚本
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
    { type: 'graphql',     exts: ['graphql', 'gql'],                label: 'GQ', palette: 'purple' },
    // 配置/数据
    { type: 'json',        exts: ['json', 'jsonc', 'json5'],        label: '{}', palette: 'yellow' },
    { type: 'yaml',        exts: ['yml', 'yaml'],                   label: 'Y',  palette: 'cyan' },
    { type: 'toml',        exts: ['toml'],                          label: 'Tl', palette: 'cyan' },
    { type: 'ini',         exts: ['ini', 'cfg', 'conf'],            label: 'I',  palette: 'cyan' },
    { type: 'properties',  exts: ['properties'],                    label: 'P',  palette: 'cyan' },
    { type: 'env',         exts: ['env'],                           label: 'E',  palette: 'yellow' },
    { type: 'config',      exts: [],                                label: '*',  palette: 'cyan' },
    { type: 'sql',         exts: ['sql'],                           label: 'SQL', palette: 'purple' },
    // 文档
    { type: 'markdown',    exts: ['md', 'mdx', 'markdown'],         label: 'M.', palette: 'gray' },
    { type: 'text',        exts: ['txt', 'log'],                    label: 'TXT', palette: 'yellow' },
    { type: 'rst',         exts: ['rst'],                           label: 'R',  palette: 'gray' },
    { type: 'asciidoc',    exts: ['adoc', 'asciidoc'],              label: 'Ad', palette: 'blue' },
    { type: 'pdf',         exts: ['pdf'],                           label: 'PDF', palette: 'red' },
    { type: 'doc',         exts: ['doc', 'docx', 'rtf', 'odt'],      label: 'W',  palette: 'blue' },
    { type: 'sheet',       exts: ['xls', 'xlsx', 'csv', 'tsv', 'ods'], label: 'X', palette: 'teal' },
    { type: 'slide',       exts: ['ppt', 'pptx', 'odp'],             label: 'P',  palette: 'orange' },
    // 多媒体
    { type: 'image',       exts: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'avif', 'heic', 'tiff', 'tif', 'ico'], label: 'IMG', palette: 'purple' },
    { type: 'svg',         exts: ['svg'],                           label: 'SVG', palette: 'purple' },
    { type: 'video',       exts: ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv', 'm4v'], label: 'VID', palette: 'red' },
    { type: 'audio',       exts: ['mp3', 'wav', 'flac', 'ogg', 'm4a', 'aac', 'wma'], label: 'AUD', palette: 'red' },
    { type: 'font',        exts: ['ttf', 'otf', 'woff', 'woff2', 'eot'], label: 'Aa', palette: 'gray' },
    // 归档/二进制
    { type: 'archive',     exts: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'tgz'], label: 'ZIP', palette: 'gray' },
    { type: 'jar',         exts: ['jar', 'war', 'ear', 'apk', 'aab'], label: 'JAR', palette: 'orange' },
    { type: 'binary',      exts: ['exe', 'dll', 'so', 'dylib', 'bin', 'class', 'o', 'a'], label: 'BIN', palette: 'gray' },
    // 脚本/运维
    { type: 'shell',       exts: ['sh', 'bash', 'zsh', 'ksh'],       label: '>_', palette: 'gray' },
    { type: 'bat',         exts: ['bat', 'cmd'],                    label: 'B',  palette: 'gray' },
    { type: 'powershell',  exts: ['ps1', 'psm1', 'psd1'],           label: 'P$', palette: 'blue' },
    { type: 'vim',         exts: ['vim'],                           label: 'Vm', palette: 'green' },
    { type: 'emacs',       exts: ['el'],                            label: 'El', palette: 'purple' },
    { type: 'docker',      exts: [],                                label: 'DK', palette: 'cyan' },
    { type: 'git',         exts: [],                                label: 'GIT', palette: 'red' },
    { type: 'diff',        exts: ['diff', 'patch'],                 label: '±',  palette: 'gray' },
    // 元数据
    { type: 'license',     exts: [],                                label: '©',  palette: 'gray' },
    { type: 'readme',      exts: [],                                label: 'i',  palette: 'gray' },
    { type: 'lock',        exts: [],                                label: 'L',  palette: 'gray' },
    // 占位(查不到扩展名时)
    { type: 'unknown',     exts: [],                                label: '?',  palette: 'dimGray' },
];

/** 文件名规则(完整文件名匹配,优先级最高)。 */
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

/** 把 file path 解析成图标 type。kind=folder 时返回 'folder',否则按文件名/扩展名查表。 */
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

    if (type.isFolder) {
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

/** 写出所有图标 + 生成扩展名映射 JSON + 规范文档。 */
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

    // 扩展名映射 JSON
    const extMap = { _folder: 'folder', _unknown: 'unknown' };
    for (const t of FILE_TYPES) {
        for (const ext of t.exts || []) extMap[ext] = t.type;
    }
    for (const rule of FILE_NAME_RULES) {
        extMap['__filename_' + rule.type] = rule.type;
    }
    fs.writeFileSync(MAP_PATH, JSON.stringify({
        version: 1,
        description: '扩展名/文件名 → 文件类型图标名(file-{type})。前端可直接 import 此 JSON 用。',
        extMap,
        types: FILE_TYPES.map(t => ({ type: t.type, label: t.label || null, palette: t.palette, exts: t.exts || [] })),
    }, null, 2) + '\n', 'utf8');
    console.log('已生成扩展名映射: ' + MAP_PATH);

    // 规范文档
    writeDocs(extMap);
    console.log('已更新规范文档: ' + DOC_PATH);
}

function writeDocs(extMap) {
    const groups = [
        { name: '目录', types: ['folder'] },
        { name: '后端 / 系统语言', palette: ['green', 'red', 'gray', 'purple', 'cyan'], filter: (t) =>
            ['java','kotlin','scala','groovy','c','cpp','csharp','go','rust','ruby','php','perl','lua','erlang','elixir','haskell','clojure','fsharp','ocaml','dart','swift'].includes(t.type) },
        { name: '前端 / 脚本', filter: (t) => ['javascript','typescript','jsx','tsx','vue','svelte','html','css','scss','sass','less','stylus','xml','graphql'].includes(t.type) },
        { name: '配置 / 数据', filter: (t) => ['json','yaml','toml','ini','properties','env','config','sql'].includes(t.type) },
        { name: '文档', filter: (t) => ['markdown','text','rst','asciidoc','pdf','doc','sheet','slide'].includes(t.type) },
        { name: '多媒体', filter: (t) => ['image','svg','video','audio','font'].includes(t.type) },
        { name: '归档 / 二进制', filter: (t) => ['archive','jar','binary'].includes(t.type) },
        { name: '脚本 / 运维', filter: (t) => ['shell','bat','powershell','vim','emacs','docker','git','diff'].includes(t.type) },
        { name: '元数据 / 占位', filter: (t) => ['license','readme','lock','unknown'].includes(t.type) },
    ];

    const tableRows = [];
    for (const g of groups) {
        const types = g.filter ? FILE_TYPES.filter(g.filter) : FILE_TYPES.filter(t => g.types.includes(t.type));
        for (const t of types) {
            const extStr = (t.exts || []).join(', ') || (t.isFolder ? '(目录)' : t.type === 'docker' ? 'Dockerfile, .dockerignore' : t.type === 'git' ? '.gitignore, .gitattributes' : t.type === 'license' ? 'LICENSE, license.md' : t.type === 'readme' ? 'README, readme.*' : t.type === 'lock' ? 'package-lock.json, *.lock' : t.type === 'config' ? '.editorconfig, .eslintrc 等' : '(查不到扩展名时)');
            tableRows.push({ group: g.name, type: t.type, label: t.label || '-', palette: t.palette, ext: extStr });
        }
    }

    const extByType = {};
    for (const t of FILE_TYPES) for (const e of t.exts || []) (extByType[e] ||= []).push(t.type);
    const extLines = Object.keys(extByType).sort().map(k => '- `' + k + '` → `' + extByType[k].join('`, `') + '`').join('\n');
    const fnLines = FILE_NAME_RULES.map(r => {
        const sample = r.match.toString();
        return '- 完整文件名匹配 → `file-' + r.type + '.svg`';
    }).join('\n');

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
        '## 2. 加载与缓存',
        '',
        '### 2.1 前端标准做法',
        '',
        '```js',
        '// 启动时一次性拉映射,后续纯本地查询',
        'import iconMap from \'/icons/file-icon-map.json\';',
        '',
        'function getIconByPath(filePath, kind) {',
        '    if (kind === \'folder\') return `icons/file-folder.svg`;',
        '    const name = filePath.split(/[\\\\/]/).pop().toLowerCase();',
        '    // 优先按完整文件名匹配(Dockerfile / LICENSE 等)',
        '    for (const [key, type] of Object.entries(iconMap.extMap)) {',
        '        if (key.startsWith(\'__filename_\') && name === key.replace(\'__filename_\', \'\')) {',
        '            return `icons/file-${type}.svg`;',
        '        }',
        '    }',
        '    // 再按扩展名查',
        '    const ext = name.includes(\'.\') ? name.split(\'.\').pop() : \'\';',
        '    const type = iconMap.extMap[ext] || iconMap.extMap._unknown;',
        '    return `icons/file-${type}.svg`;',
        '}',
        '```',
        '',
        '### 2.2 HTTP 缓存建议',
        '',
        '- `icons/file-icon-map.json` → `Cache-Control: max-age=86400, immutable`(启动时拉一次)',
        '- `icons/file-{type}.svg` → `Cache-Control: public, max-age=2592000, immutable`(永不变)',
        '- 4 状态后缀是不同 URL,各自独立缓存',
        '- 文件名稳定 = 内容稳定,可以直接走磁盘缓存',
        '',
        '## 3. 添加新文件类型',
        '',
        '1. 编辑 `scripts/generate-file-type-icons.cjs` 的 `FILE_TYPES` 数组',
        '2. `node scripts/generate-file-type-icons.cjs`',
        '3. 自动产生 4 态 SVG + 更新 `icons/file-icon-map.json` + 更新本规范',
        '4. 提交 PR,审核命名 + 配色 + 字符标签',
        '',
        '配色选自 `icons/README.md` 配色矩阵,字符标签由 5x7 位图字体生成(`scripts/generate-file-type-icons.cjs` 内置)。',
        '',
        '## 4. 已有文件类型',
        '',
        '| 类别 | 类型 | 字符 | 配色 | 扩展名 / 文件名 |',
        '|---|---|---|---|---|',
        ...tableRows.map(r => '| ' + r.group + ' | `file-' + r.type + '.svg` | `' + r.label + '` | ' + r.palette + ' | ' + r.ext + ' |'),
        '',
        '## 5. 扩展名速查(按字母)',
        '',
        extLines,
        '',
        '## 6. 完整文件名匹配(优先级最高)',
        '',
        fnLines,
        '',
        '## 7. 4 状态',
        '',
        '| 状态 | 触发 | 视觉 |',
        '|---|---|---|',
        '| `default` | 默认 | 配色矩阵 base 色 |',
        '| `hover` | 鼠标悬停 | 同色浅一档 |',
        '| `active` | 鼠标按下 | 同色深一档 |',
        '| `disabled` | 不可用 | 统一灰 `#868E96` |',
        '',
        '## 8. 风格一致性',
        '',
        '- viewBox 统一 `0 0 56 56`,源文件 `width="56" height="56"`',
        '- 文档基线:角折 + 3 横线(沿用 `09-file.svg`)',
        '- 字符标签用 5x7 位图字体(避免 `<text>` 字体依赖)',
        '- 不用 `<script>` / `<foreignObject>` / 外链 `href` / `url()` / `onload` / `onclick`',
        '',
    ].join('\n');

    fs.mkdirSync(DOCS_DIR, { recursive: true });
    fs.writeFileSync(DOC_PATH, md, 'utf8');
}

main();
