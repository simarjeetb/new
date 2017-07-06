/**
 * Crops.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */


module.exports = {
    autoCreatedAt: true,
    autoUpdatedAt: true,
    attributes: {
  		
  		seller:{
	      model:'users'
	    },

  		name: {
            type: 'string',
            required: true
        },     

        category: {
            model: 'Category',
            required:true
        },

        variety: {
            type: 'string'
        },

        quantity: {
            type: 'integer',
            required: true
        },

        quantityUnit: {
            type: 'string',
            enum: ['Kg', 'Quintal','Tonnes','Count','Dozen'],
            defaultsTo:'Kg',
            required: true
        },

        price : {
            type: 'integer',
            required: true
        },

        grade: {
            type: 'string',
             enum: ['A+', 'A', 'B', 'C', 'D'],
              defaultsTo:'A'
        },

        availableFrom: {
            type: 'json'
        },

        availablePeriod: {
            type: 'integer'
        },

        availableUnit: {
            type: 'string',
            enum: ['Days', 'Month','Year'],
            required: true,
            defaultsTo:'Days'
        },

        supplyAbility: {
            type: 'string',
            enum: ['Yes', 'No'],
            required: true,
            defaultsTo:'No'
        },

        supplyArea: {
            type: 'string',
            defaultsTo:'Anywhere'
        },

        supplyRange: {
            type: 'integer'
        },

        paymentPreference: {
            type: 'string',
            enum: ['COD', 'Cheque', 'Net Banking'],
            required: true,
            defaultsTo:'COD'
        },

        verified: {
            type: 'string',
            enum: ['Yes', 'No'],
            required: true,
            defaultsTo:'NO'
        },

        terms: {
            type: 'string'
        },

        image: {
            type: 'string'
        },

        lat: {
            type: 'string'
        },

        lng: {
            type: 'string'
        },
        status: {
            type: 'string',
            enum: ['Active', 'Deactive']
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
        bids:{
            type: 'json'
        },
        pincode: {
            type: 'integer',
            required: true
        },

        description : {
            type:'string'
        },
        
        isExpired: {
            type: 'boolean',
            defaultsTo:false
        },

        isDeleted: {
            type: 'boolean',
            defaultsTo:false
        }
        
  }
};

