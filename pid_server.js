var five = require("johnny-five"),
    board, photoresistor;

board = new five.Board();

var io = require('socket.io')(8000);

board.on("ready", function() {

    // Create a new `photoresistor` hardware instance.
    photoresistor = new five.Sensor({
        pin: "A0",
        freq: 100
    });

    // Inject the `sensor` hardware into
    // the Repl instance's context;
    // allows direct command line access
    board.repl.inject({
        pot: photoresistor
    });

    photoresistor.on("data", function() {
        console.log(this.value);
        io.emit('sensing', this.value);

    });

    var led = new five.Led(11);
    io.on('connection', function(socket){
        socket.on('control', function(value){
            led.brightness(value);
        });
    });
});
