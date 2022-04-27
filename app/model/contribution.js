'use strict';
const Moralis = require('moralis/node');
const BaseObject = require('./base/base');
class Contribution extends BaseObject {
  constructor() {
    // Pass the ClassName to the Moralis.Object constructor
    super('Contribution');
    this.metal = 0;
    this.wood = 0;
    this.water = 0;
    this.fire = 0;
    this.earth = 0;
  }
  get metal() {
    return this.get('metal');
  }
  set metal(attr) {
    this.set('metal', attr);
  }
  get wood() {
    return this.get('wood');
  }
  set wood(attr) {
    this.set('wood', attr);
  }
  get water() {
    return this.get('water');
  }
  set water(attr) {
    this.set('water', attr);
  }
  get fire() {
    return this.get('fire');
  }
  set fire(attr) {
    this.set('fire', attr);
  }
  get earth() {
    return this.get('earth');
  }
  set earth(attr) {
    this.set('earth', attr);
  }
}
Moralis.Object.registerSubclass('Contribution', Contribution);
module.exports = Contribution;
