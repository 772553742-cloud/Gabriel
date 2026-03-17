@echo off
chcp 65001
cls
echo ==========================================
echo   诺基亚贪吃蛇游戏 - GitHub 部署工具
echo ==========================================
echo.

REM 检查是否已配置远程仓库
git remote -v >nul 2>&1
if errorlevel 1 (
    echo [提示] 还没有配置 GitHub 远程仓库
    echo.
    echo 请先在 GitHub 上创建一个新仓库，然后运行：
    echo.
    echo   git remote add origin https://github.com/您的用户名/仓库名.git
    echo.
    echo 或者使用 SSH：
    echo   git remote add origin git@github.com:您的用户名/仓库名.git
    echo.
    pause
    exit /b 1
)

echo [1/3] 检查远程仓库...
git remote -v
echo.

echo [2/3] 推送到 GitHub...
git push -u origin master
echo.

if errorlevel 1 (
    echo [错误] 推送失败！
    echo 请检查：
    echo   1. 是否已登录 GitHub
    echo   2. 仓库地址是否正确
    echo   3. 网络连接是否正常
    pause
    exit /b 1
)

echo [3/3] 部署完成！
echo.
echo ==========================================
echo  部署成功！游戏将在几分钟后上线
echo ==========================================
echo.
echo 访问地址：https://您的用户名.github.io/仓库名
echo.
echo 注意：
echo   - 首次部署可能需要 2-5 分钟
echo   - 需要在 GitHub 仓库设置中启用 Pages
echo   - Settings ^> Pages ^> Source: GitHub Actions
echo.
pause
