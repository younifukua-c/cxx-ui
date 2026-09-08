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

## 2. 视觉差异(每类有专属形状)

**不是所有文件类型都用同一个"文档基线 + 字符"模板**,各类型有对应视觉:

| 类型 | 视觉 |
|---|---|
| `folder` | 文件夹形状 |
| `image` / `svg` | 矩形 + 太阳 + 山峰 |
| `video` | 胶片孔 + 播放三角 |
| `audio` | 5 条声波 + 音符 |
| `font` | "A" 大字 + "a" 小字 |
| `archive` | 堆叠 3 层 + 扎带 |
| `jar` | 椭圆盖 + 罐身 |
| `pdf` | 文档基线 + PDF 大字 |
| `doc` | 文档基线 + 角标 W |
| `sheet` | 文档基线 + 表格网格 |
| `slide` | 矩形屏幕 + 播放三角 |
| `docker` | 鲸鱼 + 集装箱 |
| `shell` / `bat` / `powershell` | 终端窗口 + `$` + 命令 |
| `git` | 3 节点 + 分支连接 |
| `license` | 卷轴 + © |
| `readme` | 打开的书本 + i 标识 |
| `lock` | 锁钩 + 锁身 |
| 代码/配置/数据 | 文档基线 + 字符标签 |

## 3. 加载与缓存

### 3.1 前端标准做法

```js
import iconMap from '/icons/file-icon-map.json';

function getIconByPath(filePath, kind) {
    if (kind === 'folder') return `icons/file-folder.svg`;
    const name = filePath.split(/[\\/]/).pop().toLowerCase();
    // 完整文件名优先(Dockerfile / LICENSE / package-lock.json 等)
    for (const [key, type] of Object.entries(iconMap.extMap)) {
        if (key.startsWith('__filename_') && name === key.replace('__filename_', '')) {
            return `icons/file-${type}.svg`;
        }
    }
    // 扩展名兜底
    const ext = name.includes('.') ? name.split('.').pop() : '';
    const type = iconMap.extMap[ext] || iconMap.extMap._unknown;
    return `icons/file-${type}.svg`;
}
```

### 3.2 HTTP 缓存建议

- `icons/file-icon-map.json` → `Cache-Control: max-age=86400`(启动时拉一次)
- `icons/file-{type}.svg` → `Cache-Control: public, max-age=2592000, immutable`(永不变)
- 4 状态后缀是不同 URL,各自独立缓存
- 文件名稳定 = 内容稳定,可以直接走磁盘缓存

## 4. 添加新文件类型

1. 编辑 `scripts/generate-file-type-icons.cjs` 的 `FILE_TYPES` 数组
2. `node scripts/generate-file-type-icons.cjs`
3. 自动产生 4 态 SVG + 更新 `icons/file-icon-map.json` + 更新本规范
4. 提交 PR,审核命名 + 配色 + 字符标签 / 视觉

## 5. 已有文件类型

| 类别 | 类型 | 视觉/标签 | 配色 | 扩展名 / 文件名 |
|---|---|---|---|---|
| 目录 | `file-folder.svg` | `folder` | gold | (完整文件名或扩展名匹配) |
| 专门视觉(多媒体/容器/工具) | `file-image.svg` | `image` | purple | png, jpg, jpeg, gif, bmp, webp, avif, heic, heif, tiff, tif, ico |
| 专门视觉(多媒体/容器/工具) | `file-svg.svg` | `image` | purple | svg |
| 专门视觉(多媒体/容器/工具) | `file-video.svg` | `video` | red | mp4, mov, avi, mkv, webm, flv, wmv, m4v |
| 专门视觉(多媒体/容器/工具) | `file-audio.svg` | `audio` | red | mp3, wav, flac, ogg, m4a, aac, wma |
| 专门视觉(多媒体/容器/工具) | `file-font.svg` | `font` | gray | ttf, otf, woff, woff2, eot |
| 专门视觉(多媒体/容器/工具) | `file-archive.svg` | `archive` | gray | zip, rar, 7z, tar, gz, bz2, xz, tgz |
| 专门视觉(多媒体/容器/工具) | `file-jar.svg` | `jar` | orange | jar, war, ear, apk, aab |
| 专门视觉(多媒体/容器/工具) | `file-pdf.svg` | `-` | red | pdf |
| 专门视觉(多媒体/容器/工具) | `file-doc.svg` | `-` | blue | doc, docx, dot, dotx, wbk |
| 专门视觉(多媒体/容器/工具) | `file-sheet.svg` | `-` | teal | xls, xlsx, xlt, xltx, xlsm, xlsb |
| 专门视觉(多媒体/容器/工具) | `file-slide.svg` | `-` | orange | ppt, pptx, pot, potx, pps, ppsx |
| 专门视觉(多媒体/容器/工具) | `file-docker.svg` | `docker` | cyan | (完整文件名或扩展名匹配) |
| 专门视觉(多媒体/容器/工具) | `file-shell.svg` | `shell` | gray | sh, bash, zsh, ksh |
| 专门视觉(多媒体/容器/工具) | `file-bat.svg` | `shell` | gray | bat, cmd |
| 专门视觉(多媒体/容器/工具) | `file-powershell.svg` | `shell` | blue | ps1, psm1, psd1 |
| 专门视觉(多媒体/容器/工具) | `file-git.svg` | `git` | red | (完整文件名或扩展名匹配) |
| 专门视觉(多媒体/容器/工具) | `file-license.svg` | `license` | gray | (完整文件名或扩展名匹配) |
| 专门视觉(多媒体/容器/工具) | `file-readme.svg` | `readme` | gray | (完整文件名或扩展名匹配) |
| 专门视觉(多媒体/容器/工具) | `file-lock.svg` | `lock` | gray | (完整文件名或扩展名匹配) |
| 后端 / 系统语言 | `file-java.svg` | `-` | red | java |
| 后端 / 系统语言 | `file-kotlin.svg` | `-` | purple | kt, kts |
| 后端 / 系统语言 | `file-scala.svg` | `-` | red | scala, sbt |
| 后端 / 系统语言 | `file-groovy.svg` | `-` | blue | groovy |
| 后端 / 系统语言 | `file-c.svg` | `C` | gray | c, h |
| 后端 / 系统语言 | `file-cpp.svg` | `-` | blue | cpp, cc, cxx, hpp, hxx |
| 后端 / 系统语言 | `file-csharp.svg` | `-` | purple | cs |
| 后端 / 系统语言 | `file-go.svg` | `-` | cyan | go |
| 后端 / 系统语言 | `file-rust.svg` | `-` | orange | rs |
| 后端 / 系统语言 | `file-ruby.svg` | `-` | red | rb |
| 后端 / 系统语言 | `file-php.svg` | `-` | purple | php, php5, phtml |
| 后端 / 系统语言 | `file-perl.svg` | `-` | cyan | pl, pm |
| 后端 / 系统语言 | `file-lua.svg` | `Lua` | blue | lua |
| 后端 / 系统语言 | `file-erlang.svg` | `-` | red | erl, hrl |
| 后端 / 系统语言 | `file-elixir.svg` | `-` | purple | ex, exs |
| 后端 / 系统语言 | `file-haskell.svg` | `-` | purple | hs |
| 后端 / 系统语言 | `file-clojure.svg` | `-` | blue | clj, cljs, cljc |
| 后端 / 系统语言 | `file-fsharp.svg` | `-` | purple | fs, fsx, fsi |
| 后端 / 系统语言 | `file-ocaml.svg` | `OC` | orange | ml, mli |
| 后端 / 系统语言 | `file-dart.svg` | `Dart` | cyan | dart |
| 后端 / 系统语言 | `file-swift.svg` | `-` | orange | swift |
| 后端 / 系统语言 | `file-lisp.svg` | `-` | yellow | lisp, lsp, cl |
| 后端 / 系统语言 | `file-vb.svg` | `-` | blue | vb, vbs |
| 后端 / 系统语言 | `file-pascal.svg` | `Pas` | red | pas, dpr, pp |
| 后端 / 系统语言 | `file-ada.svg` | `Ada` | blue | ada, adb, ads |
| 后端 / 系统语言 | `file-fortran.svg` | `Fortran` | purple | f, f77, f90, f95, f03, for |
| 后端 / 系统语言 | `file-cobol.svg` | `Cob` | blue | cob, cbl |
| 后端 / 系统语言 | `file-tcl.svg` | `Tcl` | cyan | tcl |
| 后端 / 系统语言 | `file-verilog.svg` | `-` | orange | v, sv, vh, svh |
| 前端 / 脚本 | `file-graphql.svg` | `GQL` | pink | graphql, gql |
| 前端 / 脚本 | `file-coffeescript.svg` | `Coffee` | brown | coffee |
| 前端 / 脚本 | `file-livescript.svg` | `LS` | blue | ls |
| 前端 / 脚本 | `file-javascript.svg` | `-` | yellow | js, mjs, cjs |
| 前端 / 脚本 | `file-typescript.svg` | `-` | blue | ts, mts, cts |
| 前端 / 脚本 | `file-jsx.svg` | `-` | yellow | jsx |
| 前端 / 脚本 | `file-tsx.svg` | `-` | blue | tsx |
| 前端 / 脚本 | `file-vue.svg` | `-` | green | vue |
| 前端 / 脚本 | `file-svelte.svg` | `Sv` | red | svelte |
| 前端 / 脚本 | `file-html.svg` | `-` | orange | html, htm, xhtml |
| 前端 / 脚本 | `file-css.svg` | `-` | blue | css |
| 前端 / 脚本 | `file-scss.svg` | `-` | pink | scss |
| 前端 / 脚本 | `file-sass.svg` | `-` | pink | sass |
| 前端 / 脚本 | `file-less.svg` | `-` | blue | less |
| 前端 / 脚本 | `file-stylus.svg` | `Stylus` | green | styl |
| 前端 / 脚本 | `file-xml.svg` | `-` | orange | xml, xsl, xslt |
| 模板 / 视图 | `file-haml.svg` | `Haml` | orange | haml |
| 模板 / 视图 | `file-slim.svg` | `Slim` | green | slim |
| 模板 / 视图 | `file-pug.svg` | `Pug` | red | pug, jade |
| 模板 / 视图 | `file-ejs.svg` | `EJS` | yellow | ejs, ect |
| 模板 / 视图 | `file-handlebars.svg` | `Hbs` | orange | hbs, handlebars, mustache |
| 模板 / 视图 | `file-twig.svg` | `-` | green | twig |
| 模板 / 视图 | `file-jinja.svg` | `Jin` | red | jinja, jinja2, j2 |
| 模板 / 视图 | `file-blade.svg` | `Blade` | red | blade.php, bladephp |
| 模板 / 视图 | `file-liquid.svg` | `Liq` | green | liquid |
| 配置 / 数据 | `file-sql.svg` | `-` | blue | sql |
| 配置 / 数据 | `file-sqlite.svg` | `SQLite` | blue | sqlite, sqlite3, db, db3 |
| 配置 / 数据 | `file-json.svg` | `-` | yellow | json, jsonc, json5 |
| 配置 / 数据 | `file-yaml.svg` | `-` | red | yml, yaml |
| 配置 / 数据 | `file-toml.svg` | `TOML` | gray | toml |
| 配置 / 数据 | `file-ini.svg` | `INI` | gray | ini, cfg, conf |
| 配置 / 数据 | `file-properties.svg` | `Prop` | gray | properties |
| 配置 / 数据 | `file-env.svg` | `.env` | yellow | env |
| 配置 / 数据 | `file-plist.svg` | `Plist` | gray | plist |
| 配置 / 数据 | `file-config.svg` | `Cfg` | gray | (查不到扩展名时) |
| 接口 / 协议 | `file-protobuf.svg` | `Proto` | blue | proto |
| 接口 / 协议 | `file-graphql.svg` | `GQL` | pink | graphql, gql |
| 构建 / 工具 | `file-vim.svg` | `-` | green | vim |
| 构建 / 工具 | `file-emacs.svg` | `El` | purple | el |
| 构建 / 工具 | `file-diff.svg` | `Diff` | gray | diff, patch |
| 构建 / 工具 | `file-cmake.svg` | `CMake` | gray | cmake |
| 构建 / 工具 | `file-cargo.svg` | `Cargo` | orange | cargo, cargo.toml |
| 构建 / 工具 | `file-pipfile.svg` | `Pip` | blue | pipfile |
| 构建 / 工具 | `file-pyproject.svg` | `PyProj` | blue | pyproject |
| 构建 / 工具 | `file-webpack.svg` | `-` | blue | webpack |
| 构建 / 工具 | `file-vite.svg` | `-` | purple | vite |
| 构建 / 工具 | `file-rollup.svg` | `Roll` | red | rollup |
| 构建 / 工具 | `file-esbuild.svg` | `eB` | yellow | esbuild |
| 构建 / 工具 | `file-babel.svg` | `Babel` | yellow | babel |
| 构建 / 工具 | `file-eslint.svg` | `ESLint` | purple | eslint |
| 构建 / 工具 | `file-prettier.svg` | `Pret` | blue | prettier |
| 构建 / 工具 | `file-stylelint.svg` | `Sty` | teal | stylelint |
| 构建 / 工具 | `file-jest.svg` | `Jest` | red | jest |
| 构建 / 工具 | `file-vitest.svg` | `-` | green | vitest |
| 构建 / 工具 | `file-cypress.svg` | `Cy` | green | cypress |
| 构建 / 工具 | `file-playwright.svg` | `PW` | purple | playwright |
| 构建 / 工具 | `file-puppeteer.svg` | `Pptr` | red | puppeteer |
| 构建 / 工具 | `file-terraform.svg` | `TF` | purple | tf, tfvars, hcl |
| 构建 / 工具 | `file-bicep.svg` | `Bicep` | blue | bicep |
| 构建 / 工具 | `file-nix.svg` | `Nix` | blue | nix |
| 元数据 / 占位 | `file-markdown.svg` | `-` | blue | md, mdx, markdown |
| 元数据 / 占位 | `file-text.svg` | `TXT` | gray | txt, log |
| 元数据 / 占位 | `file-rst.svg` | `RST` | gray | rst |
| 元数据 / 占位 | `file-asciidoc.svg` | `ADoc` | gray | adoc, asciidoc |
| 元数据 / 占位 | `file-binary.svg` | `BIN` | gray | exe, dll, so, dylib, bin, class, o, a |
| 元数据 / 占位 | `file-unknown.svg` | `?` | dimGray | (查不到扩展名时) |

## 6. 扩展名速查(按字母)

- `7z` → `archive`
- `a` → `binary`
- `aab` → `jar`
- `aac` → `audio`
- `accdb` → `access`
- `accde` → `access`
- `accdr` → `access`
- `accdt` → `access`
- `ada` → `ada`
- `adb` → `ada`
- `adoc` → `asciidoc`
- `ads` → `ada`
- `apk` → `jar`
- `asax` → `aspx`
- `asciidoc` → `asciidoc`
- `ascx` → `aspx`
- `asmx` → `aspx`
- `aspx` → `aspx`
- `avi` → `video`
- `avif` → `image`
- `axaml` → `xaml`
- `babel` → `babel`
- `bash` → `shell`
- `bat` → `bat`
- `bazel` → `bazel`
- `bazelrc` → `bazel`
- `bdy` → `plsql`
- `bicep` → `bicep`
- `bin` → `binary`
- `blade.php` → `blade`
- `bladephp` → `blade`
- `bmp` → `image`
- `bz2` → `archive`
- `bzl` → `bazel`
- `c` → `c`
- `cargo` → `cargo`
- `cargo.toml` → `cargo`
- `cbl` → `cobol`
- `cc` → `cpp`
- `cfg` → `ini`
- `cjs` → `javascript`
- `cl` → `lisp`
- `class` → `binary`
- `clj` → `clojure`
- `cljc` → `clojure`
- `cljs` → `clojure`
- `cmake` → `cmake`
- `cmd` → `bat`
- `cob` → `cobol`
- `coffee` → `coffeescript`
- `conf` → `ini`
- `cpp` → `cpp`
- `cs` → `csharp`
- `cshtml` → `cshtml`
- `csproj` → `csproj`
- `css` → `css`
- `csv` → `csv`
- `cts` → `typescript`
- `cxx` → `cpp`
- `cypress` → `cypress`
- `dart` → `dart`
- `db` → `sqlite`
- `db3` → `sqlite`
- `diff` → `diff`
- `dll` → `binary`
- `doc` → `doc`
- `docx` → `doc`
- `dot` → `doc`
- `dotx` → `doc`
- `dpr` → `pascal`
- `dylib` → `binary`
- `ear` → `jar`
- `ect` → `ejs`
- `ejs` → `ejs`
- `el` → `emacs`
- `eml` → `outlook`
- `env` → `env`
- `eot` → `font`
- `erl` → `erlang`
- `esbuild` → `esbuild`
- `eslint` → `eslint`
- `ex` → `elixir`
- `exe` → `binary`
- `exs` → `elixir`
- `f` → `fortran`
- `f03` → `fortran`
- `f77` → `fortran`
- `f90` → `fortran`
- `f95` → `fortran`
- `flac` → `audio`
- `flv` → `video`
- `fnc` → `plsql`
- `fodp` → `odp`
- `fods` → `ods`
- `fodt` → `odt`
- `for` → `fortran`
- `fs` → `fsharp`
- `fsi` → `fsharp`
- `fsproj` → `csproj`
- `fsx` → `fsharp`
- `gif` → `image`
- `go` → `go`
- `gql` → `graphql`
- `gradle` → `gradle`
- `gradle.kts` → `gradle`
- `graphql` → `graphql`
- `groovy` → `groovy`
- `gz` → `archive`
- `h` → `c`
- `haml` → `haml`
- `handlebars` → `handlebars`
- `hbs` → `handlebars`
- `hcl` → `terraform`
- `heic` → `image`
- `heif` → `image`
- `hpp` → `cpp`
- `hql` → `hql`
- `hrl` → `erlang`
- `hs` → `haskell`
- `htm` → `html`
- `html` → `html`
- `hxx` → `cpp`
- `ico` → `image`
- `ini` → `ini`
- `ipynb` → `notebook`
- `j2` → `jinja`
- `jade` → `pug`
- `jar` → `jar`
- `java` → `java`
- `jest` → `jest`
- `jinja` → `jinja`
- `jinja2` → `jinja`
- `jpeg` → `image`
- `jpg` → `image`
- `js` → `javascript`
- `json` → `json`
- `json5` → `json`
- `jsonc` → `json`
- `jsx` → `jsx`
- `key` → `keynote`
- `ksh` → `shell`
- `kt` → `kotlin`
- `kts` → `kotlin`
- `less` → `less`
- `liquid` → `liquid`
- `lisp` → `lisp`
- `log` → `text`
- `ls` → `livescript`
- `lsp` → `lisp`
- `lua` → `lua`
- `m4a` → `audio`
- `m4v` → `video`
- `markdown` → `markdown`
- `md` → `markdown`
- `mdb` → `access`
- `mdx` → `markdown`
- `mjs` → `javascript`
- `mkv` → `video`
- `ml` → `ocaml`
- `mli` → `ocaml`
- `mod` → `mod`
- `mov` → `video`
- `mp3` → `audio`
- `mp4` → `video`
- `mpp` → `project`
- `mpt` → `project`
- `msg` → `outlook`
- `mts` → `typescript`
- `mustache` → `handlebars`
- `nix` → `nix`
- `numbers` → `numbers`
- `o` → `binary`
- `odm` → `odt`
- `odp` → `odp`
- `ods` → `ods`
- `odt` → `odt`
- `ogg` → `audio`
- `one` → `onenote`
- `onepkg` → `onenote`
- `onetoc2` → `onenote`
- `ost` → `outlook`
- `otf` → `font`
- `otp` → `odp`
- `ots` → `ods`
- `ott` → `odt`
- `pages` → `pages`
- `pas` → `pascal`
- `patch` → `diff`
- `pcss` → `postcss`
- `pdf` → `pdf`
- `php` → `php`
- `php5` → `php`
- `phtml` → `php`
- `pipfile` → `pipfile`
- `pkb` → `plsql`
- `pks` → `plsql`
- `pl` → `perl`
- `playwright` → `playwright`
- `plist` → `plist`
- `pls` → `plsql`
- `plsql` → `plsql`
- `pm` → `perl`
- `png` → `image`
- `pom` → `pom`
- `postcss` → `postcss`
- `pot` → `slide`
- `potx` → `slide`
- `pp` → `pascal`
- `pps` → `slide`
- `ppsx` → `slide`
- `ppt` → `slide`
- `pptx` → `slide`
- `prettier` → `prettier`
- `proj` → `csproj`
- `properties` → `properties`
- `proto` → `protobuf`
- `ps1` → `powershell`
- `psd1` → `powershell`
- `psm1` → `powershell`
- `pst` → `outlook`
- `pub` → `publisher`
- `pubx` → `publisher`
- `pug` → `pug`
- `puppeteer` → `puppeteer`
- `py` → `python`
- `pyc` → `python`
- `pyd` → `python`
- `pyi` → `python`
- `pyo` → `python`
- `pyproject` → `pyproject`
- `rar` → `archive`
- `razor` → `razor`
- `rb` → `ruby`
- `rollup` → `rollup`
- `rs` → `rust`
- `rst` → `rst`
- `rtf` → `rtf`
- `sass` → `sass`
- `sbt` → `scala`
- `scala` → `scala`
- `scss` → `scss`
- `sh` → `shell`
- `slim` → `slim`
- `sln` → `sln`
- `so` → `binary`
- `spc` → `plsql`
- `sql` → `sql`
- `sqlite` → `sqlite`
- `sqlite3` → `sqlite`
- `styl` → `stylus`
- `stylelint` → `stylelint`
- `sv` → `verilog`
- `svelte` → `svelte`
- `svg` → `svg`
- `svh` → `verilog`
- `swift` → `swift`
- `tab` → `csv`
- `tar` → `archive`
- `tcl` → `tcl`
- `tf` → `terraform`
- `tfvars` → `terraform`
- `tgz` → `archive`
- `tif` → `image`
- `tiff` → `image`
- `toml` → `toml`
- `trg` → `plsql`
- `ts` → `typescript`
- `tsv` → `csv`
- `tsx` → `tsx`
- `ttf` → `font`
- `twig` → `twig`
- `txt` → `text`
- `v` → `verilog`
- `vb` → `vb`
- `vbproj` → `csproj`
- `vbs` → `vb`
- `vdx` → `visio`
- `vh` → `verilog`
- `vim` → `vim`
- `vite` → `vite`
- `vitest` → `vitest`
- `vsd` → `visio`
- `vsdx` → `visio`
- `vss` → `visio`
- `vst` → `visio`
- `vue` → `vue`
- `war` → `jar`
- `wav` → `audio`
- `wbk` → `doc`
- `webm` → `video`
- `webp` → `image`
- `webpack` → `webpack`
- `wma` → `audio`
- `wmv` → `video`
- `woff` → `font`
- `woff2` → `font`
- `xaml` → `xaml`
- `xhtml` → `html`
- `xls` → `sheet`
- `xlsb` → `sheet`
- `xlsm` → `sheet`
- `xlsx` → `sheet`
- `xlt` → `sheet`
- `xltx` → `sheet`
- `xml` → `xml`
- `xsl` → `xml`
- `xslt` → `xml`
- `xz` → `archive`
- `yaml` → `yaml`
- `yml` → `yaml`
- `zip` → `archive`
- `zsh` → `shell`

## 7. 完整文件名匹配(优先级最高)

- 完整文件名 `n === 'dockerfile'...` → `file-docker.svg`
- 完整文件名 `n === 'makefile' || n === 'gnumakefile'...` → `file-shell.svg`
- 完整文件名 `n === 'rakefile'...` → `file-ruby.svg`
- 完整文件名 `n === 'gemfile'...` → `file-ruby.svg`
- 完整文件名 `n === 'podfile'...` → `file-ruby.svg`
- 完整文件名 `n === 'procfile'...` → `file-config.svg`
- 完整文件名 `n === 'vagrantfile'...` → `file-ruby.svg`
- 完整文件名 `n === 'license' || n === 'license.md' || n === 'li...` → `file-license.svg`
- 完整文件名 `n === 'readme' || /^readme\./i.test(n)...` → `file-readme.svg`
- 完整文件名 `n === 'package-lock.json' || n === 'yarn.lock' || ...` → `file-lock.svg`
- 完整文件名 `n === 'tsconfig.json' || n === 'jsconfig.json'...` → `file-json.svg`
- 完整文件名 `n.startsWith('.env')...` → `file-env.svg`
- 完整文件名 `n === '.gitignore' || n === '.gitattributes' || n ...` → `file-git.svg`
- 完整文件名 `n === '.dockerignore'...` → `file-docker.svg`
- 完整文件名 `n === '.editorconfig' || n === '.eslintrc' || n ==...` → `file-config.svg`

## 8. 4 状态

| 状态 | 触发 | 视觉 |
|---|---|---|
| `default` | 默认 | 配色矩阵 base 色 |
| `hover` | 鼠标悬停 | 同色浅一档 |
| `active` | 鼠标按下 | 同色深一档 |
| `disabled` | 不可用 | 统一灰 `#868E96` |

## 9. 风格一致性

- viewBox 统一 `0 0 56 56`,源文件 `width="56" height="56"`
- 不用 `<script>` / `<foreignObject>` / 外链 `href` / `url()` / `onload` / `onclick`
- 专门形状优先纯几何(矩形/圆形/直线),必要时用 `<text>` 表达字符(只在 PDF/font 视觉使用)
