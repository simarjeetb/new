/**
 * Category.js
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
            required: true,
            unique:true
        },
        type: {
          type: 'string',
        },
        variety:{
            type: 'array',
        },
        isDeleted: {
            type: 'Boolean',
            defaultsTo: false
        }
  }
};

