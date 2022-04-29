'use strict';
const Base = require('./base/base');
const Joi = require('joi');

class Activity extends Base {
  constructor() {
    // Pass the ClassName to the Moralis.Object constructor
    super('Activity');
  }
  get type() {
    return this.get('type');
  }
  set type(attr) {
    return this.set('type', attr);
  }
  get startTime() {
    return this.get('startTime');
  }
  set startTime(attr) {
    return this.set('startTime', attr);
  }
  get dueTime() {
    return this.get('dueTime');
  }
  set dueTime(attr) {
    return this.set('dueTime', attr);
  }
  get villagerId() {
    return this.get('villagerId');
  }
  set villagerId(attr) {
    return this.set('villagerId', attr);
  }
  get status() {
    return this.get('status');
  }
  set status(attr) {
    return this.set('status', attr);
  }
}

Activity.schema = {
  type: Joi.valid('Idle', 'Hunting', 'Exploring', 'Picking Fruits', 'Pregnant'),
  startTime: Joi.date(),
  dueTime: Joi.date(),
  villagerId: Joi.string(),
  status: Joi.valid('STARTED', 'ENDED'),
};

module.exports = Activity;
