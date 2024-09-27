const redis = require('redis');

const CHANNELS = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN',
  TRANSACTION: 'TRANSACTION'
};

class PubSub {
  constructor({ blockchain, transactionPool, redisUrl }) {
    this.transactionPool = transactionPool;
    this.blockchain = blockchain;

    this.publisher = redis.createClient(redisUrl);
    this.subscriber = redis.createClient(redisUrl);

    // Connect Redis clients
    this.publisher.connect().then(() => console.log('Publisher connected to Redis'));
    this.subscriber.connect().then(() => {
      console.log('Subscriber connected to Redis');
      this.subscribeToChannels();
      this.subscriber.on('message', (channel, message) => this.handleMessage(channel, message));
    });
  }

  handleMessage(channel, message) {
    console.log(`Message received. Channel: ${channel}, Message: ${message}`);

    const parsedMessage = JSON.parse(message);
    if (channel === CHANNELS.BLOCKCHAIN) {
      this.blockchain.replaceChain(parsedMessage);
    } else if (channel === CHANNELS.TRANSACTION) {
      this.transactionPool.setTransaction(parsedMessage);
    }
  }

  subscribeToChannels() {
    Object.values(CHANNELS).forEach(channel => {
      this.subscriber.subscribe(channel);
    });
  }

  publish({ channel, message }) {
    // First unsubscribe, publish, and then subscribe again
    this.subscriber.unsubscribe(channel, () => {
      this.publisher.publish(channel, message, () => {
        this.subscriber.subscribe(channel);
      });
    });
  }

  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain)
    });
  }

  broadcastTransaction(transaction) {
    this.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction)
    });
  }
}

module.exports = PubSub;
