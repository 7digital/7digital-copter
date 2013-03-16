var arDrone = require('ar-drone');
//var fs = require('fs');
var maxAltitude = 2.3;
var minAltitude = 1.0;
var client = arDrone.createClient();
client.on('navdata', function () {
  //console.log('navdata: %j', arguments);
});

[ 'navdata', 'landing', 'landed', 'takeoff', 'hovering', 'flying', 'lowBattery' ].forEach(function (state) {
    client.on(state, function(data) {
        console.log('.');
    })
});

client.on('batteryChange', function (e) {
   console.log('battery: ', e);
});

client.on('altitudeChange', function (alt) {
   console.log('altutudeChange')
    if (alt > maxAltitude) {
        console.log('Reached max altitude, going down!');
        this.stop();
        this.clockwise(0.5);
        this.down(0.5);
    } else if (alt < minAltitude) {
        console.log('Reached min altitude, going up!');
        this.counterClockwise(0.5);
        this.up(0.5);
    }

});

console.log('Taking off: %s', client.takeoff());

// start scanning
client.after(2000, function startScanning() {
   console.log('Starting sequence');
   this.up(0.5);
   this.after(1000 * 30, function () {
       console.log('landing!');
       this.stop();
       this.land();
   });
})

process.on('SIGINT', function () {
    process.exit(0);
});
