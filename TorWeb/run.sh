#!/bin/bash

# Function definitions

function startTor(){
  # Create tor directory structure if it doesn't exist
  if [ ! -d "./TorWeb/tor/hidden_service" ]
  then
    mkdir -p ./TorWeb/tor/hidden_service 2> /dev/null
    echo "Created hidden service directory"
  fi
  
  # Check if keys exist, if not, Tor will generate new ones
  if [ ! -f "./TorWeb/tor/hidden_service/hs_ed25519_secret_key" ]
  then
    echo "No existing keys found. Tor will generate new ones..."
    echo "This will create a new .onion domain!"
  fi
  
  # Run The Tor Hidden Service with the `.torrc` file as config
  echo "Starting Tor hidden service..."
  tor -f ./TorWeb/.torrc
}

function server(){
  # Install dependencies if node_modules doesn't exist
  if [ ! -d "./node_modules" ]
  then
    echo "Installing dependencies..."
    npm install
  fi

  # Build the Vite project
  echo "Building the project..."
  npm run build
  
  # Serve the built files on port 80 (required for Tor)
  echo "Starting web server on port 80..."
  npx serve -s dist -l 80
}

function showDomain(){
  # Wait a bit for Tor to generate the domain
  sleep 5
  if [ -f "./TorWeb/tor/hidden_service/hostname" ]
  then
    domain=$(cat ./TorWeb/tor/hidden_service/hostname)
    echo ""
    echo "=================================="
    echo "🧅 Your new onion domain is:"
    echo "http://$domain"
    echo "=================================="
    echo ""
  else
    echo "Domain not ready yet, check ./TorWeb/tor/hidden_service/hostname later"
  fi
}

function run(){
  # Run Server and Tor in parallel, then show domain
  server & 
  startTor &
  showDomain
  wait
}

# Run The Script
run
