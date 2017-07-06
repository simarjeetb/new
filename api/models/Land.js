/**
 * Land.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    autoCreatedAt: true,
    autoUpdatedAt: true,
  attributes: 
  	{
    user:{
      model:'users'
    },

    category:{
      model:'category'
    },

    location:{
      type:'string',
      required: true
    },

    avail_date: {
      type:'json',
    },

    periods:{
      type:'string',
    },

    description: {
      type:'text'
    },

    area:{
      type:'string',
      required: true
    },

    khasra_no:{
      type:'integer',
      required: true
    },

    expected_price:{
      type:'integer',
      required: true
    },

    term_condition:{
      type:'text'
    },
    image: {
      type: 'string'
    },
    isDeleted:{
      type:'boolean',
      defaultsTo: false
    }
	}
};