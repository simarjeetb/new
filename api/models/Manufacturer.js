/**
 * Manufacturer.js
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
          description: {
            type: 'text',
          },
          email: {
            type: 'email'
          },
          mobile: {
            type: 'integer',
            maxLength: 10
          },
          isDeleted: {
            type: 'Boolean',
            defaultsTo: false
          }
  	}
};