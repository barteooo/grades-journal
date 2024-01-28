import mqtt from "mqtt";

const mqttClient = mqtt.connect("wss://broker.hivemq.com:8884/mqtt");

export default mqttClient;
