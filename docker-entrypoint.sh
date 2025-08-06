#!/bin/sh

# This script is the entrypoint for the Docker container.
# Its job is to substitute environment variables into our JavaScript files.

# Set the path to our env file
ENV_JS_FILE="/usr/share/nginx/html/env.js"

# --- JS Lesson: Why this script is necessary ---
# Docker environment variables only exist on the server (the container).
# The browser has no access to them. This script runs *before* the web server starts.
# It acts as a bridge, reading the server-side environment variables and
# injecting them into our client-side JavaScript file.

# Replace the placeholders with the actual environment variable values.
# We use a different delimiter (|) for sed because URLs contain slashes (/).
sed -i "s|__SUPABASE_URL__|${SUPABASE_URL}|g" "$ENV_JS_FILE"
sed -i "s|__SUPABASE_ANON_KEY__|${SUPABASE_ANON_KEY}|g" "$ENV_JS_FILE"

# --- JS Lesson: `exec "$@"` ---
# This is a standard command in entrypoint scripts.
# `"$@"` represents the command that was passed to the script.
# In our Dockerfile, this is `nginx -g 'daemon off;'`.
# `exec` replaces the current process (the shell script) with the new process (nginx).
# This is important so that Nginx becomes the main process (PID 1) in the container,
# which allows it to receive signals from Docker correctly (like the stop signal).

exec "$@"
