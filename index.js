const express = require('express');
const bodyParser = require('body-parser');
const amqp = require("amqplib");
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = 3000;

const qname = 'data-q';
let channel, consumeChannel, connection = null;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

async function connectQueue() {
    try {
        connection = await amqp.connect('amqp://localhost');
        channel = await connection.createChannel();

        await channel.assertQueue(qname);
    } catch (error) {
        console.log('Error creating channel', error);
    }
}

async function consumeQueue() {
    try {
        if (!connection) {
            connection = await amqp.connect('amqp://localhost');
        }

        consumeChannel = await connection.createChannel();
        await consumeChannel.assertQueue(qname);

        consumeChannel.consume(qname, (data) => {
            const message = JSON.parse(data.content);
            consumeChannel.ack(data);
            console.log(new Date().toISOString(), 'Consumed Message', message);
        });
    } catch (error) {
        console.log('Error consuming messages from queue:', error);
    }
}

async function sendDataToQueue(data) {
    channel.sendToQueue(qname, Buffer.from(JSON.stringify(data)));
}

connectQueue();
consumeQueue();

app.listen(PORT, () => {
    console.log('Listening to the app on', PORT);
});

app.get('/send-data', async (req, res) => {
    const message = `${ new Date().toISOString() } Queuing data for processing`;
    await sendDataToQueue({ msg_id: `node-rabbit_${uuidv4()}`, user: 'TEST_USER' });
    res.status(200).json({ message });
});
