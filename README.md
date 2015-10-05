# r7PopUpStore
Local express server configuration for Canal+ PopUp Stores

###Getting started
You will need to install node together with npm in order to use the development tools.

```text
apt-get install nodejs # debian / ubuntu
```

You will need to install bind9 too. It will be your DNS server.

```text
apt-get install bind9
```

Then you need to clone the git repository, and install the dependencies using npm.

```text
cd /home/photobox
git clone https://github.com/canalplus/r7PopUpStore.git
cd r7PopUpStore
```

After, you have to copy one file in bind folder. Please make this command.
```text
cp bind/named.conf.local /etc/bind/
```

Finally you received or downloaded a folder, which is called "public". This folder contains all the media and configurations necessary for the decoder. You have to place it in the following path :

```text
/var/www/html/
```

Please respect this path strictly; if the folders don't exist, you can create them.

###Tasks
There is one file that you have to launch.

* install.sh

Before launching this file, please check that ports 80 is available and do not listen to another service.

###Install.sh
This file can be launched with this command:

```text
./install.sh
```

This file will build templates and add files in bind folder to configure it. And then, the file will launch express server : index.js .
Warning : To launch this task, you have to be probably a super user, so you can use "sudo".

####Express server
This task can be launched from npm:

```text
sudo npm start
```

####Dns server
This task can be launched with this command:

```text
sudo service bind9 start
```

Warning : To launch this tasks, you have to be a super user.
If you are on a Linux environment, you can use "sudo".