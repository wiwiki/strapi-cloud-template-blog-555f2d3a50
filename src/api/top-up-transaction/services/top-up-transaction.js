'use strict';

/**
 * top-up-transaction service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::top-up-transaction.top-up-transaction');
