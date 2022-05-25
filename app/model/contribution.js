'use strict';
const Moralis = require('moralis/node');
const BaseObject = require('./base/base');

class Contribution extends BaseObject {
  get from() { return this.get('from'); }
  set from(val) { return this.set('from', val); }

  get contract() { return this.get('contract'); }
  set contract(val) { return this.set('contract', val); }

  get tokenId() { return this.get('tokenId'); }
  set tokenId(val) { return this.set('tokenId', val); }

  get num() { return this.get('num'); }
  set num(attr) { return this.set('num', attr); }

  get point() { return this.get('point'); }
  set point(attr) { return this.set('point', attr); }

}
Moralis.Object.registerSubclass('Contribution', Contribution);

module.exports = Contribution;
