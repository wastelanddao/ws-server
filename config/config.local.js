/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
// eslint-disable-next-line no-unused-vars
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // add your user config here
  const userConfig = {
    moralis: {
      serverUrl: 'https://30jblur4nj39.usemoralis.com:2053/server',
      appId: 'VphL0X602u5aluvXSkB8wbCKtH1SHfcMBTOQGz55',
      masterKey: 'Z5IXk9Kk6vSuO5xuspnGmtNUjXzUur49iLLFmGV4',
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
