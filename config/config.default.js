/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1650949694917_3820';

  // add your middleware config here
  config.middleware = [ 'errorHandler', 'jwtAuth' ];
  config.jwtAuth = {
    ignore: [ '/login' ],
  };

  // add your user config here
  const userConfig = {
    moralis: {
      serverUrl: '',
      appId: '',
      masterKey: '',
    },
  };

  config.jwt = {
    secret: '!sdfdf#@^@dsddsdavmm',
  };
  config.security = {
    csrf: {
      enable: false,
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
