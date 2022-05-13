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

  config.cluster = {
    listen: {
      path: '',
      port: 7002,
      hostname: '0.0.0.0',
    },
  };

  // add your user config here
  const userConfig = {
    moralis: {
      serverUrl: 'https://9jb2mu5k9rwl.usemoralis.com:2053/server',
      appId: 'Acp7Y2B66otKg9pxcvCsoIpd8fnCr0gulX6l6l8p',
      masterKey: 'wMqzIe4K1XvmLdiO98e2Ai0CYpfPmQxiBJh0adxk',
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
