#!/bin/bash
set -e

# ...existing code...

# Install Homebrew if not already installed
if ! command -v brew &> /dev/null; then
    echo "Installing Homebrew..."
    NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    # Add Homebrew to the PATH for the current session (adjust if needed)
    echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> ~/.profile
    eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
else
    echo "Homebrew is already installed."
fi

# Install Liquibase using Homebrew if not already installed
if ! command -v liquibase &> /dev/null; then
    echo "Installing Liquibase..."
    brew install liquibase
else
    echo "Liquibase is already installed."
fi

# Add Homebrew's bin directory (which includes liquibase) to .bashrc to persist in new terminal sessions
BREW_BIN="/home/linuxbrew/.linuxbrew/bin"
if ! grep -q "$BREW_BIN" ~/.bashrc; then
    echo "Adding Homebrew bin directory to PATH in .bashrc..."
    echo "export PATH=\"$BREW_BIN:\$PATH\"" >> ~/.bashrc
fi

# ...existing code...