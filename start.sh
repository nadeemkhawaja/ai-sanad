#!/usr/bin/env bash
# AI-Sanad — build the frontend and start the server on a fixed port.
#   ./start.sh              → http://localhost:3210
#   PORT=4000 ./start.sh    → custom port
set -euo pipefail
cd "$(dirname "$0")"

PORT="${PORT:-3210}"
PID_FILE=".server.pid"
LOG_FILE="server.log"

if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
  echo "Already running (PID $(cat "$PID_FILE")). Use ./stop.sh first."
  exit 1
fi

if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port $PORT is already in use by another program."
  echo "Stop that program, or run:  PORT=4000 ./start.sh"
  exit 1
fi

if [ ! -f .env ]; then
  echo "⚠️  No .env file found. Create one with:  ANTHROPIC_API_KEY=sk-ant-..."
  echo "   (The app still starts — you can also enter a key in the ⚙ Settings panel.)"
fi

[ -d node_modules ] || npm install
echo "Building frontend…"
npm run build --silent

PORT="$PORT" nohup node server/index.js > "$LOG_FILE" 2>&1 &
echo $! > "$PID_FILE"
sleep 1

if ! kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
  echo "❌ Server failed to start — see $LOG_FILE"
  rm -f "$PID_FILE"
  exit 1
fi

IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "127.0.0.1")

echo ""
echo "✅ AI-Sanad running  →  http://$IP:$PORT"
echo "   PID $(cat "$PID_FILE") · log: $LOG_FILE · stop with ./stop.sh"

# Open the browser automatically
open "http://$IP:$PORT" 2>/dev/null || true
