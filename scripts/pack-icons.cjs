#!/usr/bin/env node
/**
 * 把 cxx-ui 图标库打成 zip 到 A:\temp\,保留目录结构:
 *   icons/<file>.svg          通用图标
 *   icons/file-types/<file>   文件类型图标
 *   icons/file-types/file-icon-map.json   扩展名映射
 *   docs/FILE_ICONS.md         规范文档
 *   README.md                  启动说明
 *
 * 用法: node scripts/pack-icons.cjs
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const ROOT = path.resolve(__dirname, '..');
const OUT = process.argv[2] || 'A:\\temp\\cxx-ui-icons-v1.zip';

// 一份 zip 自己手写(避免引第三方),按 PKZIP 规范
class ZipWriter {
    constructor() {
        this.entries = [];
    }
    addFile(name, data) {
        const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
        const compressed = zlib.deflateRawSync(buf);
        const useDeflate = compressed.length < buf.length;
        const crc = crc32(buf);
        const local = Buffer.alloc(30 + name.length);
        let p = 0;
        local.writeUInt32LE(0x04034b50, p); p += 4;       // signature
        local.writeUInt16LE(20, p); p += 2;                // version
        local.writeUInt16LE(0, p); p += 2;                 // flags
        local.writeUInt16LE(useDeflate ? 8 : 0, p); p += 2; // method (8 = deflate)
        local.writeUInt16LE(0, p); p += 2;                 // mod time
        local.writeUInt16LE(0, p); p += 2;                 // mod date
        local.writeUInt32LE(crc, p); p += 4;
        local.writeUInt32LE(compressed.length, p); p += 4; // compressed size
        local.writeUInt32LE(buf.length, p); p += 4;        // uncompressed size
        local.writeUInt16LE(name.length, p); p += 2;       // file name length
        local.writeUInt16LE(0, p); p += 2;                 // extra field length
        local.write(name, p, 'utf8');
        this.entries.push({ name, local, body: useDeflate ? compressed : buf, method: useDeflate ? 8 : 0, crc, size: buf.length, csize: useDeflate ? compressed.length : buf.length });
    }
    build() {
        const central = [];
        let offset = 0;
        const parts = [];
        for (const e of this.entries) {
            parts.push(e.local);
            parts.push(e.body);
            const c = Buffer.alloc(46 + e.name.length);
            let p = 0;
            c.writeUInt32LE(0x02014b50, p); p += 4;        // central signature
            c.writeUInt16LE(20, p); p += 2;                 // version made by
            c.writeUInt16LE(20, p); p += 2;                 // version needed
            c.writeUInt16LE(0, p); p += 2;                  // flags
            c.writeUInt16LE(e.method, p); p += 2;           // method
            c.writeUInt16LE(0, p); p += 2;                  // mod time
            c.writeUInt16LE(0, p); p += 2;                  // mod date
            c.writeUInt32LE(e.crc, p); p += 4;
            c.writeUInt32LE(e.csize, p); p += 4;            // compressed size
            c.writeUInt32LE(e.size, p); p += 4;             // uncompressed size
            c.writeUInt16LE(e.name.length, p); p += 2;
            c.writeUInt16LE(0, p); p += 2;                  // extra field length
            c.writeUInt16LE(0, p); p += 2;                  // comment length
            c.writeUInt16LE(0, p); p += 2;                  // disk number
            c.writeUInt16LE(0, p); p += 2;                  // internal attrs
            c.writeUInt32LE(0, p); p += 4;                  // external attrs
            c.writeUInt32LE(offset, p); p += 4;             // local header offset
            c.write(e.name, p, 'utf8');
            central.push(c);
            offset += e.local.length + e.body.length;
        }
        for (const c of central) parts.push(c);
        const eocd = Buffer.alloc(22);
        let p = 0;
        eocd.writeUInt32LE(0x06054b50, p); p += 4;
        eocd.writeUInt16LE(0, p); p += 2;
        eocd.writeUInt16LE(0, p); p += 2;
        eocd.writeUInt16LE(this.entries.length, p); p += 2;
        eocd.writeUInt16LE(this.entries.length, p); p += 2;
        eocd.writeUInt32LE(central.reduce((s, c) => s + c.length, 0), p); p += 4;
        eocd.writeUInt32LE(offset, p); p += 4;
        eocd.writeUInt16LE(0, p); p += 2;
        parts.push(eocd);
        return Buffer.concat(parts);
    }
}

// 标准 CRC-32 (PKZIP 多项式)
const CRC_TABLE = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        t[n] = c >>> 0;
    }
    return t;
})();
function crc32(buf) {
    let c = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
}

const zip = new ZipWriter();
function add(absPath, inZip) {
    const data = fs.readFileSync(absPath);
    zip.addFile(inZip.replace(/\\/g, '/'), data);
}

// 通用图标
for (const f of fs.readdirSync(path.join(ROOT, 'icons'))) {
    if (f.endsWith('.svg') && !f.startsWith('file-')) {
        add(path.join(ROOT, 'icons', f), `icons/${f}`);
    }
}
// 文件类型图标 + 映射
for (const f of fs.readdirSync(path.join(ROOT, 'icons', 'file-types'))) {
    add(path.join(ROOT, 'icons', 'file-types', f), `icons/file-types/${f}`);
}
// 文档
add(path.join(ROOT, 'docs', 'FILE_ICONS.md'), 'docs/FILE_ICONS.md');
// 启动说明
add(path.join(ROOT, 'README.md'), 'README.md');

const buf = zip.build();
fs.writeFileSync(OUT, buf);
console.log(`已生成 ${OUT}`);
console.log(`大小: ${(buf.length / 1024).toFixed(1)} KB,条目: ${zip.entries.length}`);
