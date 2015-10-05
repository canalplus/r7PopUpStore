# PhotoBox STARTUP FILE

# Hack : disable some keys...
xmodmap -e "keycode 64 = 0x0000"
xmodmap -e "keycode 107 = 0x0000"
xmodmap -e "keycode 133 = 0x0000"
xmodmap -e "keycode 134 = 0x0000"

# Change current directory
cd /home/photobox/r7PopUpStore

# Update app
sh update.sh

sudo sh install.sh