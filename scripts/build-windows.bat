@echo off
REM Build script for Windows Tauri build
REM Sources MSVC env then runs the build with explicit toolchain

setlocal EnableDelayedExpansion

echo === Build start: %date% %time% ===
echo VCVARS: %MSVC_VCVARS%
echo.

REM Source vcvars
call "%MSVC_VCVARS%" >nul
if errorlevel 1 (
  echo ##[error]vcvars64.bat failed with errorlevel !errorlevel!
  exit /b 1
)

echo === After vcvars ===
where.exe link.exe
where.exe cl.exe
echo.

REM Force MSVC toolchain
set RUSTUP_TOOLCHAIN=stable-x86_64-pc-windows-msvc
set CARGO_TERM_COLOR=never
set RUST_BACKTRACE=1

echo === Rust toolchain ===
rustup show
rustc --version
echo.

echo === Running tauri build ===
call npm run tauri:build
set BUILD_EXIT=!errorlevel!

echo === Build done: exit !BUILD_EXIT! ===
exit /b !BUILD_EXIT!
