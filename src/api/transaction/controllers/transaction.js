'use strict';

/**
 * transaction controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::transaction.transaction', ({ strapi }) => ({
    async customAction(ctx) {
      try {
        console.log('Request received:', ctx.request.body);

        const userId = ctx.request.body.userId;
        const productId = ctx.request.body.productId;
        const entrepriseId = ctx.request.body.entrepriseId;
        //console.log('userId sent:', userId);
        //console.log('productId sent:', productId);
  
        // Fetch the user
        const user = await strapi.db.query('plugin::users-permissions.user').findOne({where: {Id : userId}});
        //console.log('User found:', user);
        console.log('Value of wallet found:', user.wallet)

        // Fetch the product
        const product = await strapi.db.query('api::product.product').findOne({where:{ id: productId }});
        //console.log('product found:', product);
        //console.log('product value:', product.Price)

        // Fetch the Entreprise
        const entreprise = await strapi.db.query('api::entreprise.entreprise').findOne({where:{ id: entrepriseId }})
        //console.log('entreprise found:', entreprise);
        console.log('entreprise sold found:', entreprise.sold)
        console.log('entreprise Name:', entreprise.EntrepriseName)

        // Check if the user has enough balance in their wallet
        if (user.wallet < product.Price) {
            return ctx.badRequest(null, 'Insufficient funds in wallet');
        }

        // Update the user's wallet balance
        const updatedWalletValue = user.wallet - product.Price;
        //console.log(updatedWalletValue)

        const updatedUser = await strapi.db.query('plugin::users-permissions.user').update({
        where: { id: userId }, 
        data: { wallet: 
            updatedWalletValue 
            },
        });
        console.log('new value wallet = ', updatedWalletValue);

        //Update the entreprise sold
        const updateSoldValue = entreprise.sold + product.Price

        const updatedSold = await strapi.db.query('api::entreprise.entreprise').update({
          where: { id: entrepriseId }, 
          data: { sold: updateSoldValue },
          });
          console.log('new value = ', updateSoldValue);


        //Creation of the transaction
        //get the time for my transaction
        const currentTimeISO = new Date().toISOString();
        //console.log('Current time in ISO format:', currentTimeISO);

        // Generate random hexadecimal color code and take the first six characters
        const randomHexColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        const firstSixChars = randomHexColor.slice(1, 8);

        // Get the current date and format it in YYMMDD format
        const currentDate = new Date();
        const year = currentDate.getFullYear().toString().slice(2, 4);
        const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
        const day = ('0' + currentDate.getDate()).slice(-2);
        const lastSixChars = year + month + day;

        // Concatenate firstSixChars and lastSixChars to create orderNumberRando
        const orderNumberRando = firstSixChars + lastSixChars;
        console.log('Order number:', orderNumberRando);

        // Create a new transaction
        const transaction = await strapi.db.query('api::transaction.transaction').create({
            data: {
            orderNumber: orderNumberRando,
            users_permissions_user: userId,
            products: product,
            status: 'completed',
            total: product.Price,
            created_at: currentTimeISO,
            publishedAt: currentTimeISO,
            entreprise: entrepriseId,
            },
        });

        // Return the wallet value
        ctx.body = {
          wallet: user.wallet,
          productPrice: product.Price
        };

      } catch (err) {
        console.log('Error:', err);
        ctx.body = err;
      }
    },
  }));