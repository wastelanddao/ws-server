'use strict';
// const Joi = require('joi');
const Moralis = require('moralis/node');
const MockBase = require('./mock_base');

class MockNFT extends MockBase {
  constructor() {
    // Pass the ClassName to the Moralis.Object constructor
    super('MockNFT');
  }
}

MockNFT.schema = {
};

Moralis.Object.registerSubclass('MockNFT', MockNFT);
module.exports = MockNFT;
