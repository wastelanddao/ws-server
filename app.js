'use strict';
const Moralis = require('moralis/node');

class AppBootHook {
  constructor(app) {
    this.app = app;
  }
  async didLoad() {
    const { serverUrl, appId, masterKey } = this.app.config.moralis;
    await Moralis.start({ serverUrl, appId, masterKey });
    console.log(Moralis);
  }
}

module.exports = AppBootHook;
