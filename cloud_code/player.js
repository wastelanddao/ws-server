'use strict';

Moralis.Cloud.define('getPlayer', async request => {
  const query = new Moralis.Query('Player');
  query.equalTo('objectId', request.params.id);
  const player = await query.first({ useMasterKey: true });
  return player;
});

