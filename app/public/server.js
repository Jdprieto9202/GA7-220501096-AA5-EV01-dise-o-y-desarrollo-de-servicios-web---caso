const express = require ('express');
const server = express();
const mongoose = require('mongoose');
const bodyparser = require('body-parser');

server.use(bodyparser.json());

