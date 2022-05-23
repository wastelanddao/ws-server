'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/login', controller.auth.login);

  router.get('/player/:id', controller.player.getPlayer);

  router.get('/villagers', controller.villager.getVillagers);

  router.get('/buildings', controller.building.getBuildings);

  router.get('/activities', controller.activity.getActivitys);
  router.get('/activities/:id', controller.activity.getActivityById);
  router.post('/activities', controller.activity.doActivity);

  router.get('/chests', controller.chest.getUnopenedChests);
  router.get('/chests/:id', controller.chest.getChest);

  router.get('/items', controller.item.getItems);
};
