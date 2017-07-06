/**
 * Inputs.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    autoCreatedAt: true,
    autoUpdatedAt: true,
  attributes: {
  		
  		name: {
            type: 'string',
            required: true
        },

        user:{
          model:'users'
        },

        category:{
          model:'category',
          required: true
        },

        variety: {
            type: 'string'
        },

        manufacturer:{
         model:'manufacturer'
        },

        price: {
            type: 'integer',
            required: true
        },

        priceUnit: {
            type: 'string',
            required: true
        },

        quantity: {
            type: 'integer'
        },

        address: {
            type: 'string',
            required: true
        },

        city: {
            type: 'string',
            required: true
        },

        district: {
            type: 'string',
            required: true
        },

        state: {
            type: 'string',
            required: true
        },
        
        pincode: {
            type: 'integer',
            required: true
        }, 

        additionalInformation: {
            type: 'string'
        },

        tearms: {
            type: 'string'
        },
        image: {
            type: 'string'
        },
		isDeleted: {
			type: 'boolean',
            defaultsTo: false
		}
    }
};

