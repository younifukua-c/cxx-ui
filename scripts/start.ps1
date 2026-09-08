# cxx-ui 图标库本地预览服务(Windows PowerShell 入口)。
#
# 用法:在仓库根目录执行
#     .\scripts\start.ps1
# 自定义端口:
#     $env:CXX_UI_PORT = 8080; .\scripts\start.ps1
# 禁止自动打开浏览器(无 GUI 环境):
#     $env:CXX_UI_NO_BROWSER = "1"; .\scripts\start.ps1
$ErrorActionPreference = 'Stop'

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Root = Split-Path -Parent $ScriptDir

Push-Location $Root
try {
    & node "$ScriptDir\start.mjs" @args
} finally {
    Pop-Location
}
