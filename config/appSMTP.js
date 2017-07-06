/*var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var transport = nodemailer.createTransport(smtpTransport({
host: sails.config.appSMTP.host,
port: sails.config.appSMTP.port,
debug: sails.config.appSMTP.debug,
auth: {
        user: sails.config.appSMTP.auth.user,
        pass: sails.config.appSMTP.auth.pass
      }

    }));*/
module.exports.appSMTP = { //appSmtp use in EndUserService.js
    host: 'smtp.gmail.com',

    port: 587,

    debug: true,

    auth: {

      user: 'osgroup.sdei@gmail.com',

      pass: 'mohali2378'

    }
}