/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var promisify = require('bluebird').promisify;
var bcrypt    = require('bcrypt-nodejs');

module.exports = {
    autoCreatedAt: true,
    autoUpdatedAt: true,

    attributes: {
        firstName: {
            type: 'string',
            required: true
        },
        
        lastName: {
            type: 'string',
            required: true
        },
        fbId: {
            type: 'string',
            maxLength: 100
        },

        gId: {
            type: 'string',
            maxLength: 100
        },

        fullName: {
            type: 'string',
            required: true
        },     

        username: {
            type: 'email',
            unique: true,
            required: 'Please enter valid email id.'
        },

        mobile: {
            type: 'integer',
            maxLength: 10,
            //required: true
        },

        address: {
            type: 'string',
        },

        city: {
            type: 'string',
            //required: true
        },

        pincode: {
            type: 'integer',
            //required: true
        },

        state: {
            type: 'string',
            //required: true
        },

        district: {
            type: 'string',
            //required: true
        },

        lat: {
            type: 'string',
            defaultsTo: "0",
        },

        lng: {
            type: 'string',
            defaultsTo: "0",
        },

        password: {
            type: 'string',
            required: true,
            columnName: 'encryptedPassword',
            minLength: 8
        },

        date_verified: {
            type : 'date'
        },
        isVerified: {
            type: 'string',
            enum: ['Y','N'],
            defaultsTo: 'N'
        },
        roles: {
            type: 'string',
            enum: ['SA', 'A','U'],
            defaultsTo: 'U'
            // required: true
        },
        domain: {
            type: 'string',
            enum: ['web', 'mobile']
        },

        deviceToken: {
            type: 'string',
        },
        otp: {
            type: 'integer',
        },
        roleId: {
            model: 'roles',
        },
        isDeleted : {
            type: 'Boolean',
            defaultsTo: false
        },

        comparePassword: function(password) {
            return bcrypt.compareSync(password, this.password);
        },

        toJSON: function() {

            var obj = this.toObject();
            delete obj.password;

            return obj;
        }

    },

    beforeCreate: function(user, next) {
        if(user.firstName && user.lastName) {
            user.fullName = user.firstName + ' ' + user.lastName;
        }

        if (user.hasOwnProperty('password')) {
            user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
            next(false, user);

        } else {
            next(null, user);
        }
    },


    beforeUpdate: function(user, next) {
        if(user.firstName && user.lastName) {
            user.fullName = user.firstName + ' ' + user.lastName;
        }

        if (user.hasOwnProperty('password')) {
            user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
            next(false, user);
        } else {
            next(null, user);
        }
    },

    authenticate: function (username, password) {
        var query = {};
        query.username = username;
        query.$or = [{roles:["SA","A"]}];

        return Users.findOne(query).populate('roleId').then(function(user){ 
        //return API.Model(Users).findOne(query).then(function(user){
            return (user && user.date_verified && user.comparePassword(password))? user : null;
        });
    },

};