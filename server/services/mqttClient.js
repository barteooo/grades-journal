const mqtt = require("mqtt");
const client = mqtt.connect("mqtts://broker.hivemq.com:8883");

module.exports = client;
