#!/usr/bin/env node
/**
 * cxx-ui 图标库本地预览服务。
 *
 * 任何人 clone 仓库后,在仓库根目录运行:
 *     node scripts/start.mjs
 *     # 或
 *     npm start
 *     # Windows 习惯
 *     .\scripts\start.ps1
 *
 * 服务启动后会自动打开浏览器到 http://127.0.0.1:<port>/ 展示图标库原型页。
 * 修改 icons/ 下的 SVG 后,刷新页面即可看到效果。
 *
 * 零依赖:只使用 Node.js 内置 http / fs / path / url 模块,任何 Node 14+ 都能跑。
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const ICONS_DIR = path.join(ROOT, 'icons');
const PROTOTYPE_DIR = path.join(ROOT, 'prototype');
const DEFAULT_PORT = 8001;
const PORT = Number(process.env.CXX_UI_PORT) || DEFAULT_PORT;
const HOST = '127.0.0.1';
const MIME_TYPES = Object.freeze({
    '.html': 'text/html; charset=utf-8',
    '.js':   'text/javascript; charset=utf-8',
    '.mjs':  'text/javascript; charset=utf-8',
    '.css':  'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg':  'image/svg+xml',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.ico':  'image/x-icon',
    '.txt':  'text/plain; charset=utf-8',
    '.md':   'text/markdown; charset=utf-8',
});

/** 读取 icons/ 目录,按"编号-名称"归并成清单(每图标返回 num + name)。 */
function listIcons() {
    if (!fs.existsSync(ICONS_DIR)) return [];
    const groups = new Map();
    for (const entry of fs.readdirSync(ICONS_DIR, { withFileTypes: true })) {
        if (!entry.isFile() || !entry.name.endsWith('.svg')) continue;
        const base = entry.name.replace(/-(?:hover|active|disabled)(?=\.svg$)/, '').replace(/\.svg$/, '');
        const match = /^(\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)$/i.exec(base);
        if (!match) continue;
        const num = match[1];
        const name = match[0];
        if (!groups.has(num)) groups.set(num, { num, name, files: [] });
        groups.get(num).files.push(entry.name);
    }
    return [...groups.values()]
        .filter(g => g.files.some(f => !f.includes('-hover') && !f.includes('-active') && !f.includes('-disabled')))
        .sort((a, b) => Number(a.num) - Number(b.num));
}

/** 把 URL 路径解析成磁盘路径,防止越界访问仓库外文件。 */
function resolveSafePath(urlPath) {
    const decoded = decodeURIComponent(urlPath.split('?')[0]);
    const candidate = path.normalize(path.join(ROOT, decoded));
    if (!candidate.startsWith(ROOT)) return null;
    return candidate;
}

/** 目录请求自动落到 index.html(参考常见静态服务器)。 */
function resolveIndexForDir(filePath) {
    const indexFile = path.join(filePath, 'index.html');
    if (fs.existsSync(indexFile)) return indexFile;
    return null;
}

/** 主请求处理:静态文件 + /api/icons + 根路径重定向到 prototype/。 */
const server = http.createServer((req, res) => {
    const start = Date.now();
    const url = new URL(req.url, `http://${req.headers.host}`);
    let pathname = url.pathname;
    if (pathname === '/' || pathname === '') pathname = '/prototype/';
    if (pathname === '/api/icons') {
        const payload = JSON.stringify({ icons: listIcons() });
        res.writeHead(200, { 'Content-Type': MIME_TYPES['.json'], 'Cache-Control': 'no-store' });
        res.end(payload);
        log(req, res, start);
        return;
    }
    const filePath = resolveSafePath(pathname);
    if (!filePath) {
        res.writeHead(403, { 'Content-Type': MIME_TYPES['.txt'] });
        res.end('Forbidden');
        log(req, res, start);
        return;
    }
    fs.stat(filePath, (err, stat) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': MIME_TYPES['.txt'] });
            res.end('Not Found');
            log(req, res, start);
            return;
        }
        let servePath = filePath;
        if (stat.isDirectory()) {
            const indexFile = resolveIndexForDir(filePath);
            if (!indexFile) {
                res.writeHead(404, { 'Content-Type': MIME_TYPES['.txt'] });
                res.end('Not Found');
                log(req, res, start);
                return;
            }
            servePath = indexFile;
            stat = fs.statSync(servePath);
        }
        const ext = path.extname(servePath).toLowerCase();
        const mime = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, {
            'Content-Type': mime,
            'Cache-Control': 'no-store',
            'Content-Length': stat.size,
        });
        fs.createReadStream(servePath).pipe(res);
        log(req, res, start);
    });
});

function log(req, res, start) {
    const ms = Date.now() - start;
    console.log(`${new Date().toISOString()} ${req.method} ${req.url} -> ${res.statusCode} (${ms}ms)`);
}

server.listen(PORT, HOST, () => {
    const url = `http://${HOST}:${PORT}/`;
    console.log(`cxx-ui 原型服务已启动: ${url}`);
    if (Number(PORT) === DEFAULT_PORT) {
        console.log('提示:可通过 $env:CXX_UI_PORT=其它端口(或 set CXX_UI_PORT=其它端口)切换。');
    }
    console.log('按 Ctrl+C 停止。');
    openBrowser(url);
});

/** 跨平台打开默认浏览器。失败不报错(在无 GUI 环境下也不影响服务)。 */
function openBrowser(url) {
    if (process.env.CXX_UI_NO_BROWSER === '1') return;
    const platform = process.platform;
    let command;
    let args;
    if (platform === 'win32') {
        command = 'cmd';
        args = ['/c', 'start', '""', url];
    } else if (platform === 'darwin') {
        command = 'open';
        args = [url];
    } else {
        command = 'xdg-open';
        args = [url];
    }
    try {
        const child = spawn(command, args, { detached: true, stdio: 'ignore' });
        child.on('error', () => { /* 浏览器没装也不影响服务 */ });
        child.unref();
    } catch {
        /* 静默失败 */
    }
}

process.on('SIGINT', () => {
    console.log('\n已停止。');
    server.close();
    process.exit(0);
});
