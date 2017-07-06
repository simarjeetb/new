/**
 * Equipment.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    autoCreatedAt: true,
    autoUpdatedAt: true,
    attributes: {


        user_id:{
            type: 'string',
            required: true
        },

        user:{
            model:'users'
            /*required: true*/
        },

        companyManufacturer:{
         model:'manufacturer'
        },

        category:{
            model:"Category",
            required: true
        },

        category_id:{
            type:'string',
            required: true
        }, 

        quantity:{
            type:'integer'
        }, 

  		name: {
            type: 'string',
            required: true
        },

        company:{
        	type:'string'
        },

        model:{
        	type:'string'
        },

        model_year:
        {
        	type:'integer'
        },

        engine_power:
        {
        	type:'integer'
        },

        usage:
        {
        	type:'text'
        },
        purchase_status:
        {
        	type:'string',
        	enum: ['rent', 'sell']
        },

        image: {
            type: 'string'
        },
        
        description: {
            type: 'text'
        },

        term_condition:{
        	type:'text'
        },

        isDeleted:{
            type:'boolean',
            defaultsTo: false
        }
    }
};

