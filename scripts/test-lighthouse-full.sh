#!/bin/bash
# Builds the static export, serves it on port 3000, runs the Lighthouse Jest
# suite against it, then guarantees the server is torn down.
#
# The previous inline npm script (`serve & sleep 5 && test:lighthouse; kill $!`)
# had a fatal flaw: `kill $!` only ever targeted the `build && serve` chain,
# never the actual `serve` process it spawns. That process outlives the test
# run and keeps holding stdout open, so anything piping the script's output
# (e.g. `| tail -100`, or a background task capturing logs) hangs forever
# waiting for EOF that never comes — observed as a 1.5h "hang" with zero
# visible output.
set -euo pipefail

PORT=3000

cleanup() {
  local pids
  pids=$(lsof -ti:"$PORT" 2>/dev/null || true)
  if [ -n "$pids" ]; then
    kill -9 $pids 2>/dev/null || true
  fi
}
trap cleanup EXIT

# Clear out any server left over from a previous interrupted run before we
# start our own, so we don't bind to an already-occupied port.
cleanup

npm run build
npm run serve &

for _ in $(seq 1 30); do
  if curl -sf "http://localhost:$PORT/" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

npm run test:lighthouse
