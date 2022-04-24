"use strict";
exports.__esModule = true;
var express = require("express");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var morgan = require("morgan");
/* import cors from 'cors'; */
// coneccion de sockets
var server = express();
var app = require('http').Server(server);
var io = require('socket.io')(app, {
    cors: {
        origin: '*'
    }
});
io.on('connection', function (socket) {
    var idRoom = socket.handshake.query.idRoom;
    socket.join(idRoom);
    //crear ruta en rooms para conectar un usuario nuevo
    io.to(idRoom).emit('NEW_CONNECTION');
    socket.on('NEW_MESSAGE', function (_a) {
        var text = _a.text, name = _a.name;
        //alguien envia un nuevo mensaje
        /* const {text, name, email} = data; */
        io.to(idRoom).emit('NEW_MESSAGE', { text: text, name: name });
    });
    socket.on('DISCONNECT', function (id) {
        //alguien se desconecta de la room
        console.log('se desconecto');
        io.to(idRoom).emit('DISCONNECT', id);
    });
});
/* server.name = 'API'; */
/* server.use(cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "authorization",
    ],
  })); */
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
//server.use(cookieParser());
server.use(morgan('dev'));
server.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Expose-Headers', 'Set-Cookie');
    next();
});
// Error catching endware.
server.use(function (err, req, res, next) {
    // eslint-disable-line no-unused-vars
    var status = err.status || 500;
    var message = err.message || err;
    console.error(err);
    res.status(status).send(message);
});
server.use(cookieParser('secret'));
exports["default"] = app;
