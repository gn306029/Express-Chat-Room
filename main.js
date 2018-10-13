"use strict";
// import module
const express = require("express");
const http = require("http");
const io = require("socket.io")(http);

// create express application
// and create server , after that socket will listen this server
const app = express();
const server = http.createServer(app);
// current online user
const clientList = [];
// get route is / the request
app.get("/" , (req , res) => {
	res.sendFile(__dirname + "/public/index.html");
});

io.listen(server);
// listen socket character is connection the event
io.sockets.on("connection" , (socket) =>{

	// listen socket character is new user the event
	socket.on("new user" , (res) =>{

		clientList.push(socket.id);

		io.sockets.emit("addList" , socket.id);
		io.to(socket.id).emit("getList" , clientList);

	})

	// listen socket character is disconnection the event
	socket.on("disconnection" , (res) =>{

		let index = clientList.indexOf(socket.id);

		if(index != -1){
			clientList.splice(index , 1);
		}

		io.sockets.emit("delList" , clientList);
	});

	// listen socket character is new message the event
	socket.on("new message" , (res) => {
		console.log(socket.id + "say : " + res);

		let data = {
			id:res.id ,
			msg:res.msg
		};

		io.sockets.emit("broadcast message" , data);

	});

});

// set server listen the port in 8080
server.listen(process.env.PORT || 8080, () => {
	console.log("Server already start");
});