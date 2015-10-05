#!/bin/bash

# Templates creation
node ip.js

# Start ntp server
node ntp.js &

# Start express server
npm start