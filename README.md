# r7PopUpStore
Local NodeJS Express server configuration for Canal+ PopUp Stores.

# TODO
* What about the DNS stuff ?

## About

No documentation yet.

## Getting Started

Clone this repository and install the dependencies with npm :

```bash
git clone https://github.com/canalplus/r7PopUpStore.git
cd r7PopUpStore
npm install
```

### Configuration

Make sure all configuration settings are ok in `config.json` :

```json
{
    "staticRoot": "/var/www/html/public/",
    "apiRoot": "/GNCPF/vod/cplusod/ctx/json/g5r7t/",
}
```

### Routes

Also, make sure a `routes.json` file with the following format is present next to `index.js` :

```json
{
    "csatod/xtc/ws/content/csatald_chaines_musique":"csatald_content/csatald_chaines_musique.json",
    "{{vod/endpoint}}":"{{/json/file.json}}"
}
```

### Video Assets

You will need to place all the video assets in the `config.staticRoot` folder.

### Usage

Then, start Express server with NPM :

```bash
npm start
```

or with native NodeJS CLI :

```bash
nodejs index.js
```

NOTE : you might have to be a superuser to listen to ports 80.

## Tests

No tests yet.

## Credits

2015 - Canal+
