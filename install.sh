#!/bin/bash

echo ''
echo -e '\e[31m _  __    _  _  _     _     _____ _  _  __\e[0m'
echo -e '\e[31m|_)  /   |_)/ \|_)| ||_)   (_  | / \|_)|_ \e[0m'
echo -e '\e[31m| \ /    |  \_/|  |_||     __) | \_/| \|__\e[0m'
echo ''

echo 'Start install'

echo '- Install npm'
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
echo '- Install bind9'
sudo apt-get install -y bind9

echo '- Install node dependencies'
npm install

echo 'Done.'
