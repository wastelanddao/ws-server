'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/login', controller.auth.login);

  router.get('/players/:id', controller.player.getPlayer);
  router.put('/players/:id/contribution', controller.contribution.contribute);
  router.get('/players/:id/contribution', controller.contribution.getContribute);

  router.get('/villagers', controller.villager.getVillagers);
  router.get('/villagers/:id/items', controller.villager.getVillagerCarriage);
  router.post('/villagers/:id/items', controller.villager.carryItems);
  router.delete('/villagers/:id/items', controller.villager.unCarryItems);

  router.get('/buildings', controller.building.getBuildings);
  router.post('/buildings/:id/production', controller.building.doProduction);
  router.get('/buildings/:id/production', controller.building.getProduction);

  router.get('/activities', controller.activity.getActivitys);
  router.get('/activities/:id', controller.activity.getActivityById);
  router.post('/activities', controller.activity.doActivity);

  router.get('/chests', controller.chest.getUnopenedChests);
  router.get('/chests/:id', controller.chest.getChest);

  router.get('/items', controller.item.getItems);
};
