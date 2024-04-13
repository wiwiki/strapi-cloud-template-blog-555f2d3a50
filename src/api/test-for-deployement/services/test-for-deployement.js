'use strict';

/**
 * test-for-deployement service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::test-for-deployement.test-for-deployement');
