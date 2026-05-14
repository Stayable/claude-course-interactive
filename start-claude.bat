@echo off
REM Launches Claude Code in this project folder.
REM Prereqs (one-time):
REM   1. Install Node.js LTS: https://nodejs.org
REM   2. Install Claude Code:  npm install -g @anthropic-ai/claude-code
REM   3. First run will prompt you to sign in.

cd /d "%~dp0"
claude
