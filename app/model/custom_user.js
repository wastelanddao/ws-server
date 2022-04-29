'use strict';
const Moralis = require('moralis/node');
const BaseObject = require('./base/base');

// 重写moralis的user class
// note: 此类应为只读，仅仅用来方便查数据，不要进行任何写操作，例如save等
// 也不应该有setter方法，因为我们不对Moralis自带表进行修改
class CustomUser extends BaseObject {
  get accounts() {
    return this.get('accounts');
  }
  get ACL() {
    return this.get('ACL');
  }
  get authData() {
    return this.get('authData');
  }
  get ethAddress() {
    return this.get('ethAddress');
  }
  get sessionToken() {
    return this.get('sessionToken');
  }
  get username() {
    return this.get('username');
  }

  static async getByWallet(address) {
    return await this.query().equalTo('ethAddress', address).first({ useMasterKey: true });
  }

  save() {
    throw new Error('should not call save method');
  }

}
Moralis.Object.registerSubclass('_User', CustomUser);

module.exports = CustomUser;
