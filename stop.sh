#!/usr/bin/env bash
# AI-Sanad — stop the server started by ./start.sh
set -euo pipefail
cd "$(dirname "$0")"

PID_FILE=".server.pid"

if [ ! -f "$PID_FILE" ]; then
  echo "Not running (no $PID_FILE)."
  exit 0
fi

PID="$(cat "$PID_FILE")"
if kill -0 "$PID" 2>/dev/null; then
  kill "$PID"
  echo "🛑 Stopped AI-Sanad (PID $PID)."
else
  echo "Process $PID was not running — cleaning up."
fi
rm -f "$PID_FILE" .server-port
