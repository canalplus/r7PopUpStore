#!/bin/bash
# r7PopUpStore STARTUP FILE

# Hack : disable some keys...
#xmodmap -e "keycode 64 = 0x0000"
#xmodmap -e "keycode 107 = 0x0000"
#xmodmap -e "keycode 133 = 0x0000"
#xmodmap -e "keycode 134 = 0x0000"

# Change current directory
cd /home/photobox/r7PopUpStore


echo '- Stop ntpd'
if [ -f /etc/init.d/ntpd ]
then
  echo '- Stop ntpd'
  sudo service ntpd stop
else
  echo '- ntpd is not started'
fi

echo '- Install bind9 configuration files'
# Templates creation
sudo node ip.js
sudo cp bind/named.conf.local /etc/bind
sudo service bind9 reload

# Send local IP addr in Firebase
firebase_name='<ENTER_FIREBASE_NAME_HERE>'
hostname=`uname -n|sed 's/[\.]/-/'g`
ip_addr=`ifconfig|grep inet|grep -v inet6|grep -v '127.0.0.1'|awk '{print $2}'`
curl -X PUT -d '{"hostname":"'$hostname'","ipNuc":"'$ip_addr'"}' 'https://'$firebase_name'.firebaseio.com/'$hostname'.json'

# Start express server
sudo node index.js
