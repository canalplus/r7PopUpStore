# r7PopUpStore
Local express server configuration for Canal+ PopUp Stores

###Getting started
You will need to install node together with npm in order to use the development tools.

```text
http://nodejs.org/download/ # windows
brew install node # macos with brew
apt-get install nodejs # debian / ubuntu
```

Then you need to clone the git repository, and install the dependencies using npm.

```text
git clone https://github.com/canalplus/r7PopUpStore.git
cd r7PopUpStore
```

And you received or downloaded a folder, which is called "public". This folder contains all the media and configurations necessary for the decoder. You have to place it in the following path :

```text
/var/www/html/
```

Please respect this path strictly; if the folders don't exist, you can create them.

###Tasks
There are two servers that you have to launch.

* a express server
* a dns server

Before launching the servers, please check that ports 80 and 53 are available and do not listen to another service.

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

All DNS configuration shall be copied from local bind directory to system /etc/bind.

Warning : To launch this tasks, you have to be a super user.
If you are on a Linux environment, you can use "sudo".