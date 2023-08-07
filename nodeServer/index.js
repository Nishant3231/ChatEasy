// const cors = require("cors")

//to handle node server
// const io = require('socket.io')(8000)
// io.set('origins', 'http://localhost:8000');

const io = require("socket.io")(8800
, {
    cors:{
        origin: '*',

        handlePreFlightRequest: (req, res) => {
            res.writeHead(200, {
                "ACCESS-CONTROL-ALLOW-ORIGIN" : "*",
            })
            res.end()
        }
    }

})
// const io = require('socket.io')(server, {
//     cors: {
//       origin: '*',
//     }
//   });
// io.origins((origin, callback) => {
//     if (origin !== 'https://localhost:5500') {
//         return callback('origin not allowed', false);
//     }
//     callback(null, true);
//   });
// (httpServer, {
//     cors: {
//       origin: "http://localhost:5500",
//       methods: ["GET", "POST"],
//       allowedHeaders: ["my-custom-header"],
//       credentials: true
//     }
//   });

const users = {};

io.on('connection', socket => {
    console.log("io server connected")

    socket.on('new-user-joined', name =>{
        users[socket.id]=name;
        socket.broadcast.emit('user-joined',name);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id])
        delete users[socket.id]
    });
})
