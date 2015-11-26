# r7PopUpStore
Local express server configuration for Canal+ PopUp Stores

## Getting started
Dépendance: git

### Clone the repository

```text
git clone https://github.com/canalplus/r7PopUpStore.git
```
* Get the static archived public directory. This archive contains all the media and configurations necessary for the decoder. You have to place the 'public' directory under the following path:

```text
/var/www/html/
```

Please respect this path strictly; if the folders don't exist, you can create them.

### Launch the installation script

```text
cd r7PopUpStore
sudo ./install.sh
```

This script will install:
* nodejs (if not already installed)
* bind9
* forever
* project npm dependencies


In addition, the 'fake' ntp script will be installed thanks to forever.

### Startup script

Please set up your own firebase_name in <code>start.sh</code> (seek for the string <code>firebase_name='<ENTER_FIREBASE_NAME_HERE>'</code>)
It will stop the ntpd linux service (if it exists), send to firebase a log with the local ethernet interface IP, and start the express server.

* Option 1 : manually start the server

```text
sudo ./start.sh
```

* Option 2 : start the server after every os boot

This script is supposed to be started at server startup.

```text
cp start.sh /etc/init.d/
sudo update-rc.d start.sh defaults
```
