#!/bin/bash
# Prints the Domain on which the website can be opened in Tor Browser
function TOR_DOMAIN(){
  if [ -f "./TorWeb/tor/hidden_service/hostname" ]
  then
    domain=$(cat ./TorWeb/tor/hidden_service/hostname)
    echo -e "\033[32mhttp://$domain/\033[0m"
  else
    echo -e "\033[31mDomain not generated yet. Run the server first.\033[0m"
  fi
}
TOR_DOMAIN
