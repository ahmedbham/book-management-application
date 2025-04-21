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

# Define and export LIQUIBASE_HOME
export LIQUIBASE_HOME="/home/linuxbrew/.linuxbrew/opt/liquibase/libexec"
echo "Setting LIQUIBASE_HOME=$LIQUIBASE_HOME"

# Add Homebrew environment setup and LIQUIBASE_HOME to profile/bashrc for persistence
PROFILE_FILE="$HOME/.profile"
BASHRC_FILE="$HOME/.bashrc"
BREW_SHELLENV_CMD='eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"'
LIQUIBASE_HOME_EXPORT='export LIQUIBASE_HOME="/home/linuxbrew/.linuxbrew/opt/liquibase/libexec"'

# Update .profile
if ! grep -qF -- "$BREW_SHELLENV_CMD" "$PROFILE_FILE"; then
    echo "Adding Homebrew shellenv to $PROFILE_FILE..."
    echo "$BREW_SHELLENV_CMD" >> "$PROFILE_FILE"
fi
if ! grep -qF -- "$LIQUIBASE_HOME_EXPORT" "$PROFILE_FILE"; then
    echo "Adding LIQUIBASE_HOME export to $PROFILE_FILE..."
    echo "$LIQUIBASE_HOME_EXPORT" >> "$PROFILE_FILE"
fi

# Update .bashrc
if [ -f "$BASHRC_FILE" ]; then
    if ! grep -qF -- "$BREW_SHELLENV_CMD" "$BASHRC_FILE"; then
        echo "Adding Homebrew shellenv to $BASHRC_FILE..."
        echo "$BREW_SHELLENV_CMD" >> "$BASHRC_FILE"
    fi
    if ! grep -qF -- "$LIQUIBASE_HOME_EXPORT" "$BASHRC_FILE"; then
        echo "Adding LIQUIBASE_HOME export to $BASHRC_FILE..."
        echo "$LIQUIBASE_HOME_EXPORT" >> "$BASHRC_FILE"
    fi
fi

# ...existing code...