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
echo '- Start ntp.js in background'
sudo nohup node ntp.js &

# Send local IP addr in Firebase
firebase_name=`cat firebase.txt`
hostname=`uname -n|sed 's/[\.]/-/'g`
ip_addr=`ifconfig|grep inet|grep -v inet6|grep -v '127.0.0.1'|sed 's/^.*inet.*:\([0-9]*\.[0-9]*\.[0-9]*\.[0-9]*\)[ ]*Bcast:.*$/\1/'`

curl -s -X GET 'https://'$firebase_name'.firebaseio.com/settings/locations.json'|grep $hostname > /dev/null
res=`echo $?`

if [ "$res" == "1" ]
then
  echo 'Hostname '$hostname' does not exist in firebase, create a new resource'
  verb=PUT
else
  echo 'Hostname '$hostname' already exists in firebase, updtate the resource'
  verb=PATCH
fi

curl -s -X $verb -d '{"last_local_ip":"'$ip_addr'"}' 'https://'$firebase_name'.firebaseio.com/settings/locations/'$hostname'.json' > /dev/null

# Start express server
sudo node index.js
