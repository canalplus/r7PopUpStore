#!/bin/bash
# r7PopUpStore STARTUP FILE

# Hack : disable some keys...
#xmodmap -e "keycode 64 = 0x0000"
#xmodmap -e "keycode 107 = 0x0000"
#xmodmap -e "keycode 133 = 0x0000"
#xmodmap -e "keycode 134 = 0x0000"

# Change current directory
cd /home/photobox/r7PopUpStore

./update.sh

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

# Start ntp server
echo '- Start ntp.js forever !'
sudo forever start ntp.js --colors

# Send local IP addr in Firebase
firebase_name=`cat firebase.txt`
hostname=`uname -n|sed 's/[\.]/-/'g`
ip_addr=`ifconfig|grep inet|grep -v inet6|grep -v '127.0.0.1'|sed 's/^.*inet.*:\([0-9]*\.[0-9]*\.[0-9]*\.[0-9]*\)[ ]*Bcast:.*$/\1/'`

curl -X GET 'https://fiery-fire-9464.firebaseio.com/settings/locations.json'|grep 'photobox-test-002'
res=`echo $?`

if [ "$res" == "1" ]
then
  verb=PUT
else
  verb=PATCH
fi

curl -X $verb -d '{"hostname":"'$hostname'","ipNuc":"'$ip_addr'"}' 'https://'$firebase_name'.firebaseio.com/'$hostname'.json'

# Start express server
sudo node index.js
