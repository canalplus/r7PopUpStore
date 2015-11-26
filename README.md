# r7PopUpStore
Local express server configuration for Canal+ PopUp Stores

###Getting started
Dépendance: git

1. Clone the repository

```text
$ https://github.com/canalplus/r7PopUpStore.git
```
2. Get the static archived public directory. This archive contains all the media and configurations necessary for the decoder. You have to place the 'public' directory under the following path:

```text
/var/www/html/
```

Please respect this path strictly; if the folders don't exist, you can create them.

3. Launch the installation script

```text
$ cd r7PopUpStore
$ sudo ./install.sh
```

4. Start the server

```text
$ sudo node index.js
or
$ sudo ./start.sh
```
