#!/bin/bash

echo ''
echo -e '\e[31m _  __    _  _  _     _     _____ _  _  __\e[0m'
echo -e '\e[31m|_)  /   |_)/ \|_)| ||_)   (_  | / \|_)|_ \e[0m'
echo -e '\e[31m| \ /    |  \_/|  |_||     __) | \_/| \|__\e[0m'
echo ''

echo 'Start install'

dpkg -l npm > /dev/null
res=`echo $?`
if [ "$res" == "1" ]
then
  echo '- Install npm'
    curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
  echo '- npm is already installed, skip this step'
fi

echo '- Install node dependencies'
#npm install

echo '- Install bind9'
#sudo apt-get install -y bind9

echo '- Stop ntpd'
if [ -f /etc/init.d/ntpd ]
then
  echo '- Stop ntpd'
  sudo service ntpd stop
else
  echo '- ntpd is not started'
fi

echo '- install bind9 configuration files'
# Templates creation
#sudo node ip.js
#sudo cp bind/named.conf.local /etc/bind

echo '- Install forever'
#sudo npm install forever -g

# Start ntp server
echo '- Start ntp.js forever !'
#sudo forever start ntp.js -l /var/log/ntpjs.log --colors

echo 'Done.'
