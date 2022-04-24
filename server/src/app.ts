import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
/* import cors from 'cors'; */

// coneccion de sockets
const server = express();
var app = require('http').Server(server);
var io = require('socket.io')(app, {
	cors: {
		origin: '*',
	},
});



io.on('connection', (socket) => {
	
	const {idRoom} = socket.handshake.query;
	socket.join(idRoom);
	//crear ruta en rooms para conectar un usuario nuevo
	
    io.to(idRoom).emit('NEW_CONNECTION')
    
	socket.on('NEW_MESSAGE', ({text, name}) => {
		//alguien envia un nuevo mensaje
		/* const {text, name, email} = data; */ 
		io.to(idRoom).emit('NEW_MESSAGE', {text, name});
	});
	
	socket.on('DISCONNECT', (id) => {
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


server.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
server.use(bodyParser.json({limit: '50mb'}));


//server.use(cookieParser());
server.use(morgan('dev'));
server.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Access-Control-Expose-Headers', 'Set-Cookie');
	next();
});

// Error catching endware.
server.use((err, req, res, next) => {
	// eslint-disable-line no-unused-vars
	const status = err.status || 500;
	const message = err.message || err;
	console.error(err);
	res.status(status).send(message);
});


server.use(cookieParser('secret'));


app.listen('http://localhost:3001', async () => {
	console.log('%s listening at 3001'); // eslint-disable-line no-console
});