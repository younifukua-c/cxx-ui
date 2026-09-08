# 文件类型图标规范

> cxx-ui 图标库 · 文件类型子集 · 跟通用 `NN-name.svg` 编号图标体系并存

## 1. 命名规则

| 体系 | 命名 | 用途 | 数量 |
|---|---|---|---|
| 通用图标 | `NN-name.svg` | 固定集合(60 个) | 固定 |
| 文件类型 | `file-{type}.svg` | **无限集合**,按需扩展 | 持续 |

**文件类型图标不带序号**,因为:

- 不需要"先来后到",新加文件类型不影响既有
- 文件名稳定 → HTTP 缓存友好
- 前端可以按 `getIconByExt(ext)` 直接拿,不需要先查编号表
- 4 状态后缀固定: `file-java.svg` / `file-java-hover.svg` / `file-java-active.svg` / `file-java-disabled.svg`

## 2. 加载与缓存

### 2.1 前端标准做法

```js
// 启动时一次性拉映射,后续纯本地查询
import iconMap from '/icons/file-icon-map.json';

function getIconByPath(filePath, kind) {
    if (kind === 'folder') return `icons/file-folder.svg`;
    const name = filePath.split(/[\\/]/).pop().toLowerCase();
    // 优先按完整文件名匹配(Dockerfile / LICENSE 等)
    for (const [key, type] of Object.entries(iconMap.extMap)) {
        if (key.startsWith('__filename_') && name === key.replace('__filename_', '')) {
            return `icons/file-${type}.svg`;
        }
    }
    // 再按扩展名查
    const ext = name.includes('.') ? name.split('.').pop() : '';
    const type = iconMap.extMap[ext] || iconMap.extMap._unknown;
    return `icons/file-${type}.svg`;
}
```

### 2.2 HTTP 缓存建议

- `icons/file-icon-map.json` → `Cache-Control: max-age=86400, immutable`(启动时拉一次)
- `icons/file-{type}.svg` → `Cache-Control: public, max-age=2592000, immutable`(永不变)
- 4 状态后缀是不同 URL,各自独立缓存
- 文件名稳定 = 内容稳定,可以直接走磁盘缓存

## 3. 添加新文件类型

1. 编辑 `scripts/generate-file-type-icons.cjs` 的 `FILE_TYPES` 数组
2. `node scripts/generate-file-type-icons.cjs`
3. 自动产生 4 态 SVG + 更新 `icons/file-icon-map.json` + 更新本规范
4. 提交 PR,审核命名 + 配色 + 字符标签

配色选自 `icons/README.md` 配色矩阵,字符标签由 5x7 位图字体生成(`scripts/generate-file-type-icons.cjs` 内置)。

## 4. 已有文件类型

| 类别 | 类型 | 字符 | 配色 | 扩展名 / 文件名 |
|---|---|---|---|---|
| 目录 | `file-folder.svg` | `-` | gold | (目录) |
| 后端 / 系统语言 | `file-java.svg` | `JV` | green | java |
| 后端 / 系统语言 | `file-kotlin.svg` | `Kt` | green | kt, kts |
| 后端 / 系统语言 | `file-scala.svg` | `Sc` | red | scala, sbt |
| 后端 / 系统语言 | `file-groovy.svg` | `Gy` | blue | groovy |
| 后端 / 系统语言 | `file-c.svg` | `C` | gray | c, h |
| 后端 / 系统语言 | `file-cpp.svg` | `C+` | purple | cpp, cc, cxx, hpp, hxx |
| 后端 / 系统语言 | `file-csharp.svg` | `C#` | purple | cs |
| 后端 / 系统语言 | `file-go.svg` | `Go` | cyan | go |
| 后端 / 系统语言 | `file-rust.svg` | `Rs` | red | rs |
| 后端 / 系统语言 | `file-ruby.svg` | `Rb` | red | rb |
| 后端 / 系统语言 | `file-php.svg` | `PHP` | light | php, php5, phtml |
| 后端 / 系统语言 | `file-perl.svg` | `Pl` | blue | pl, pm |
| 后端 / 系统语言 | `file-lua.svg` | `Lu` | blue | lua |
| 后端 / 系统语言 | `file-erlang.svg` | `Er` | red | erl, hrl |
| 后端 / 系统语言 | `file-elixir.svg` | `Ex` | purple | ex, exs |
| 后端 / 系统语言 | `file-haskell.svg` | `Hs` | light | hs |
| 后端 / 系统语言 | `file-clojure.svg` | `Cl` | teal | clj, cljs, cljc |
| 后端 / 系统语言 | `file-fsharp.svg` | `F#` | blue | fs, fsx, fsi |
| 后端 / 系统语言 | `file-ocaml.svg` | `Ml` | orange | ml, mli |
| 后端 / 系统语言 | `file-dart.svg` | `Dt` | light | dart |
| 后端 / 系统语言 | `file-swift.svg` | `Sw` | red | swift |
| 前端 / 脚本 | `file-javascript.svg` | `JS` | yellow | js, mjs, cjs |
| 前端 / 脚本 | `file-typescript.svg` | `TS` | blue | ts, mts, cts |
| 前端 / 脚本 | `file-jsx.svg` | `JSX` | yellow | jsx |
| 前端 / 脚本 | `file-tsx.svg` | `TSX` | blue | tsx |
| 前端 / 脚本 | `file-vue.svg` | `V` | green | vue |
| 前端 / 脚本 | `file-svelte.svg` | `Sv` | red | svelte |
| 前端 / 脚本 | `file-html.svg` | `<>` | yellow | html, htm, xhtml |
| 前端 / 脚本 | `file-css.svg` | `#` | blue | css |
| 前端 / 脚本 | `file-scss.svg` | `Sc` | blue | scss |
| 前端 / 脚本 | `file-sass.svg` | `Sa` | blue | sass |
| 前端 / 脚本 | `file-less.svg` | `Ls` | blue | less |
| 前端 / 脚本 | `file-stylus.svg` | `St` | green | styl |
| 前端 / 脚本 | `file-xml.svg` | `X` | orange | xml, xsl, xslt |
| 前端 / 脚本 | `file-graphql.svg` | `GQ` | purple | graphql, gql |
| 配置 / 数据 | `file-json.svg` | `{}` | yellow | json, jsonc, json5 |
| 配置 / 数据 | `file-yaml.svg` | `Y` | cyan | yml, yaml |
| 配置 / 数据 | `file-toml.svg` | `Tl` | cyan | toml |
| 配置 / 数据 | `file-ini.svg` | `I` | cyan | ini, cfg, conf |
| 配置 / 数据 | `file-properties.svg` | `P` | cyan | properties |
| 配置 / 数据 | `file-env.svg` | `E` | yellow | env |
| 配置 / 数据 | `file-config.svg` | `*` | cyan | .editorconfig, .eslintrc 等 |
| 配置 / 数据 | `file-sql.svg` | `SQL` | purple | sql |
| 文档 | `file-markdown.svg` | `M.` | gray | md, mdx, markdown |
| 文档 | `file-text.svg` | `TXT` | yellow | txt, log |
| 文档 | `file-rst.svg` | `R` | gray | rst |
| 文档 | `file-asciidoc.svg` | `Ad` | blue | adoc, asciidoc |
| 文档 | `file-pdf.svg` | `PDF` | red | pdf |
| 文档 | `file-doc.svg` | `W` | blue | doc, docx, rtf, odt |
| 文档 | `file-sheet.svg` | `X` | teal | xls, xlsx, csv, tsv, ods |
| 文档 | `file-slide.svg` | `P` | orange | ppt, pptx, odp |
| 多媒体 | `file-image.svg` | `IMG` | purple | png, jpg, jpeg, gif, bmp, webp, avif, heic, tiff, tif, ico |
| 多媒体 | `file-svg.svg` | `SVG` | purple | svg |
| 多媒体 | `file-video.svg` | `VID` | red | mp4, mov, avi, mkv, webm, flv, wmv, m4v |
| 多媒体 | `file-audio.svg` | `AUD` | red | mp3, wav, flac, ogg, m4a, aac, wma |
| 多媒体 | `file-font.svg` | `Aa` | gray | ttf, otf, woff, woff2, eot |
| 归档 / 二进制 | `file-archive.svg` | `ZIP` | gray | zip, rar, 7z, tar, gz, bz2, xz, tgz |
| 归档 / 二进制 | `file-jar.svg` | `JAR` | orange | jar, war, ear, apk, aab |
| 归档 / 二进制 | `file-binary.svg` | `BIN` | gray | exe, dll, so, dylib, bin, class, o, a |
| 脚本 / 运维 | `file-shell.svg` | `>_` | gray | sh, bash, zsh, ksh |
| 脚本 / 运维 | `file-bat.svg` | `B` | gray | bat, cmd |
| 脚本 / 运维 | `file-powershell.svg` | `P$` | blue | ps1, psm1, psd1 |
| 脚本 / 运维 | `file-vim.svg` | `Vm` | green | vim |
| 脚本 / 运维 | `file-emacs.svg` | `El` | purple | el |
| 脚本 / 运维 | `file-docker.svg` | `DK` | cyan | Dockerfile, .dockerignore |
| 脚本 / 运维 | `file-git.svg` | `GIT` | red | .gitignore, .gitattributes |
| 脚本 / 运维 | `file-diff.svg` | `±` | gray | diff, patch |
| 元数据 / 占位 | `file-license.svg` | `©` | gray | LICENSE, license.md |
| 元数据 / 占位 | `file-readme.svg` | `i` | gray | README, readme.* |
| 元数据 / 占位 | `file-lock.svg` | `L` | gray | package-lock.json, *.lock |
| 元数据 / 占位 | `file-unknown.svg` | `?` | dimGray | (查不到扩展名时) |

## 5. 扩展名速查(按字母)

- `7z` → `archive`
- `a` → `binary`
- `aab` → `jar`
- `aac` → `audio`
- `adoc` → `asciidoc`
- `apk` → `jar`
- `asciidoc` → `asciidoc`
- `avi` → `video`
- `avif` → `image`
- `bash` → `shell`
- `bat` → `bat`
- `bin` → `binary`
- `bmp` → `image`
- `bz2` → `archive`
- `c` → `c`
- `cc` → `cpp`
- `cfg` → `ini`
- `cjs` → `javascript`
- `class` → `binary`
- `clj` → `clojure`
- `cljc` → `clojure`
- `cljs` → `clojure`
- `cmd` → `bat`
- `conf` → `ini`
- `cpp` → `cpp`
- `cs` → `csharp`
- `css` → `css`
- `csv` → `sheet`
- `cts` → `typescript`
- `cxx` → `cpp`
- `dart` → `dart`
- `diff` → `diff`
- `dll` → `binary`
- `doc` → `doc`
- `docx` → `doc`
- `dylib` → `binary`
- `ear` → `jar`
- `el` → `emacs`
- `env` → `env`
- `eot` → `font`
- `erl` → `erlang`
- `ex` → `elixir`
- `exe` → `binary`
- `exs` → `elixir`
- `flac` → `audio`
- `flv` → `video`
- `fs` → `fsharp`
- `fsi` → `fsharp`
- `fsx` → `fsharp`
- `gif` → `image`
- `go` → `go`
- `gql` → `graphql`
- `graphql` → `graphql`
- `groovy` → `groovy`
- `gz` → `archive`
- `h` → `c`
- `heic` → `image`
- `hpp` → `cpp`
- `hrl` → `erlang`
- `hs` → `haskell`
- `htm` → `html`
- `html` → `html`
- `hxx` → `cpp`
- `ico` → `image`
- `ini` → `ini`
- `jar` → `jar`
- `java` → `java`
- `jpeg` → `image`
- `jpg` → `image`
- `js` → `javascript`
- `json` → `json`
- `json5` → `json`
- `jsonc` → `json`
- `jsx` → `jsx`
- `ksh` → `shell`
- `kt` → `kotlin`
- `kts` → `kotlin`
- `less` → `less`
- `log` → `text`
- `lua` → `lua`
- `m4a` → `audio`
- `m4v` → `video`
- `markdown` → `markdown`
- `md` → `markdown`
- `mdx` → `markdown`
- `mjs` → `javascript`
- `mkv` → `video`
- `ml` → `ocaml`
- `mli` → `ocaml`
- `mov` → `video`
- `mp3` → `audio`
- `mp4` → `video`
- `mts` → `typescript`
- `o` → `binary`
- `odp` → `slide`
- `ods` → `sheet`
- `odt` → `doc`
- `ogg` → `audio`
- `otf` → `font`
- `patch` → `diff`
- `pdf` → `pdf`
- `php` → `php`
- `php5` → `php`
- `phtml` → `php`
- `pl` → `perl`
- `pm` → `perl`
- `png` → `image`
- `ppt` → `slide`
- `pptx` → `slide`
- `properties` → `properties`
- `ps1` → `powershell`
- `psd1` → `powershell`
- `psm1` → `powershell`
- `py` → `python`
- `pyc` → `python`
- `pyd` → `python`
- `pyi` → `python`
- `pyo` → `python`
- `rar` → `archive`
- `rb` → `ruby`
- `rs` → `rust`
- `rst` → `rst`
- `rtf` → `doc`
- `sass` → `sass`
- `sbt` → `scala`
- `scala` → `scala`
- `scss` → `scss`
- `sh` → `shell`
- `so` → `binary`
- `sql` → `sql`
- `styl` → `stylus`
- `svelte` → `svelte`
- `svg` → `svg`
- `swift` → `swift`
- `tar` → `archive`
- `tgz` → `archive`
- `tif` → `image`
- `tiff` → `image`
- `toml` → `toml`
- `ts` → `typescript`
- `tsv` → `sheet`
- `tsx` → `tsx`
- `ttf` → `font`
- `txt` → `text`
- `vim` → `vim`
- `vue` → `vue`
- `war` → `jar`
- `wav` → `audio`
- `webm` → `video`
- `webp` → `image`
- `wma` → `audio`
- `wmv` → `video`
- `woff` → `font`
- `woff2` → `font`
- `xhtml` → `html`
- `xls` → `sheet`
- `xlsx` → `sheet`
- `xml` → `xml`
- `xsl` → `xml`
- `xslt` → `xml`
- `xz` → `archive`
- `yaml` → `yaml`
- `yml` → `yaml`
- `zip` → `archive`
- `zsh` → `shell`

## 6. 完整文件名匹配(优先级最高)

- 完整文件名匹配 → `file-docker.svg`
- 完整文件名匹配 → `file-shell.svg`
- 完整文件名匹配 → `file-ruby.svg`
- 完整文件名匹配 → `file-ruby.svg`
- 完整文件名匹配 → `file-ruby.svg`
- 完整文件名匹配 → `file-config.svg`
- 完整文件名匹配 → `file-ruby.svg`
- 完整文件名匹配 → `file-license.svg`
- 完整文件名匹配 → `file-readme.svg`
- 完整文件名匹配 → `file-lock.svg`
- 完整文件名匹配 → `file-json.svg`
- 完整文件名匹配 → `file-env.svg`
- 完整文件名匹配 → `file-git.svg`
- 完整文件名匹配 → `file-docker.svg`
- 完整文件名匹配 → `file-config.svg`

## 7. 4 状态

| 状态 | 触发 | 视觉 |
|---|---|---|
| `default` | 默认 | 配色矩阵 base 色 |
| `hover` | 鼠标悬停 | 同色浅一档 |
| `active` | 鼠标按下 | 同色深一档 |
| `disabled` | 不可用 | 统一灰 `#868E96` |

## 8. 风格一致性

- viewBox 统一 `0 0 56 56`,源文件 `width="56" height="56"`
- 文档基线:角折 + 3 横线(沿用 `09-file.svg`)
- 字符标签用 5x7 位图字体(避免 `<text>` 字体依赖)
- 不用 `<script>` / `<foreignObject>` / 外链 `href` / `url()` / `onload` / `onclick`
