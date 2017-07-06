var Promise = require('bluebird'),
    promisify = Promise.promisify;
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var bcrypt    = require('bcrypt-nodejs');

var constantObj = sails.config.constants;

// Create authenticated  Twilio API clients
const twilioClient = require('twilio')(constantObj.twillio.accountSid, constantObj.twillio.authToken);

var transport = nodemailer.createTransport(smtpTransport({
                host: sails.config.appSMTP.host,
                port: sails.config.appSMTP.port,
                debug: sails.config.appSMTP.debug,
                auth: {
                        user: sails.config.appSMTP.auth.user, //access using /congig/appSMTP.js
                        pass: sails.config.appSMTP.auth.pass
                    }
            }));


emailGeneratedCode = function (options) { //email generated code 
    var url = options.verifyURL,
        email = options.username,
        password = options.password;

    message = 'Hello!';
    message += '<br/>';
    message += 'Your account has been created please login with following credentials.';
    message += '<br/><br/>';
    message += 'Email Id : ' + email;
    message += '<br/>';
    message += 'Password : ' + password;

    transport.sendMail({
        from: sails.config.appSMTP.auth.user,
        to: email,
        subject: 'eFarmX registration',
        html: message
    }, function (err, info) {
        console.log("errro is ",err, info);
    });

    return {
        url: url
    }
};
emailVerifyLink = function (options) { //email generated code 
    var url = options.verifyURL,
        email = options.username;

    message = 'Hello!';
    message += '<br/>';
    message += 'Thanks for sign up on eFarnmx. Your account has been registered successfullly. Please click on link for verify your account that link as below :';
    message += '<br/><br/>';
    message += '<a href="'+options.verifyURL+'" target="_blankh" >Click and Verify</a>';
    message += '<br/><br/>';
    message += 'Regards, eFarmx Support Team';


    transport.sendMail({
        from: sails.config.appSMTP.auth.user,
        to: email,
        subject: 'eFarmX Registration',
        html: message
    }, function (err, info) {
        console.log("errro is ",err, info);
    });

    return true;
};
generatePassword = function () { // action are perform to generate random password for user 
    var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-=+;:,.?",
    retVal = "";
    
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
};
    saveUser = function(data){

            data["fullName"] = data.firstName + ' ' + data.lastName;
            data["email"] = data.username
            delete data['client_id'];




            /*if(data.mobile && data.domain == "mobile"){

            var OTP = Math.floor(100001 + Math.random() * 900001);
            data['otp'] = OTP;           
            var message = "This is your OTP password : "+OTP+"You can sign in with verified OTP. Regards, eFarmx";

                 twilioClient.messages.create({
                              to: data.mobile,
                              from: constantObj.twillio.outboundPhoneNumber,
                              body: message,
                        }); 
            }*/

       // console.log("sign up ");
            return API.Model(Users).create(data).then(function (user) {

                return user;

            });

    };

    socialUserAccess = function(client_id,user){

            if(client_id){
                return Tokens.generateToken({
                            client_id: client_id,
                            user_id: user.id
                        }).then(function (token) {
                            user.access_token = token.access_token;
                            user.refresh_token = token.refresh_token;
                            return {success: true, code:200, message: constantObj.messages.SOCIAL_USER_EXIST, data: user};
                        });
                
            }else{
                return {success: true, code:401, message: "Client Id is missing"};
            }


        
    }

module.exports = {
    emailGeneratedCode: emailGeneratedCode,
    currentUser: function(data,context){
      return context.identity;
    },
    registerUser: function (data, context) {
        var date = new Date();
        
        if((!data.firstName) || typeof data.firstName == undefined){ 
            return {"success": false, "error": {"code": 404,"message": constantObj.messages.FIRSTNAME_REQUIRED} };
        }
        if((!data.lastName) || typeof data.lastName == undefined){ 
            return {"success": false, "error": {"code": 404,"message": constantObj.messages.LASTNAME_REQUIRED} };
        }
        if((!data.username) || typeof data.username == undefined){ 
            return {"success": false, "error": {"code": 404,"message": constantObj.messages.USERNAME_REQUIRED} };
        }
        if((!data.mobile) || typeof data.mobile == undefined){ 
            return {"success": false, "error": {"code": 404,"message": constantObj.messages.MOBILE_REQUIRED} };
        }

        return Users.findOne({username:data.username}).then(function (user) {
            
            if (user !== undefined) {
                return {"success": false, "error": {"code": 301,"message": constantObj.messages.USER_EXIST} };                   
            } else {
                if(data.roles == 'SA' || data.roles == 'A'){
                    data['roles'] = data.roles;

                } else {
                    data['roles'] = 'U';
                }

                if(!data['password']){
                    data['password'] = generatePassword();
                }

                data['date_registered'] = date;

                if(data.mobile){
                    if(typeof data.mobile == 'string'){
                        var phExpression = /^\d+$/;
                        if(data.mobile.match(phExpression)) {
                            if(data.mobile.length>10 || data.mobile.length<10){
                                return {"success": false, "error": {"code": 412,"message": constantObj.messages.PHONE_NUMBER} };
                            }

                            data['mobile'] = data.mobile;
                            
                        } else {
                            return {"success": false, "error": {"code": 412,"message": constantObj.messages.PHONE_INVALID} };                
                        } 
                    } else {
                        var mobile = data.mobile.toString();
                            if(mobile.length>10 || mobile.length<10){
                                return {"success": false, "error": {"code": 412,"message": constantObj.messages.PHONE_NUMBER} };
                            } else {
                                data['mobile'] = data.mobile;
                            }
                    }                      
                }
                data["fullName"] = data.firstName + ' ' + data.lastName;
                return API.Model(Users).create(data).then(function (user) {       
                
                    context.id = user.username;
                    context.type = 'Email';
                    return Tokens.generateToken({
                        user_id: user.id,
                        client_id: Tokens.generateTokenString()
                    });
                }).then(function (token) {
                    return emailGeneratedCode({
                        id: context.id,
                        type: context.type,
                        username: data.username,
                        password: data.password,
                        verifyURL: sails.config.security.server.url + "/user/verify/" + data.username + "?code=" + token.code
                    });
                });
                
            }
        })

    },
    signupUser: function (data, context) {
       
            data['roles'] = 'U';
            if(!data.password){
                data['password'] = generatePassword();
            }
                var date = new Date();
                data['date_registered'] = date;
                data['date_verified'] = date;
                var cId = data.client_id;
           if(data.fbId && data.providers == "facebook"){
                var query = {"fbId":data.fbId};
                        return API.Model(Users).findOne(query).then(function (user) {
                        //console.log("user fb ",user);
                if( user != undefined ) {
                        //console.log("Already");
                        //return {success: true,code:200,message: "Third party login User Already Exist"} ;
                        return socialUserAccess(cId,user);

                }else{  

                        if(!data['firstName'] && !data['lastName']){
                            data['firstName'] = "efarmx";
                            data['lastName'] = "facebook user";
                        }  
                    return Users.findOne({username:data.username}).then(function (user) {
                        if( user != undefined ){
                            return {"success": false, "error": {"code": 301,"message": constantObj.messages.USER_EXIST} };                
                        }else{
                            return saveUser(data).then(function(res){
                                return socialUserAccess(cId,res);
                            });                     
                        }
                    });

                    }
                });
            } else if(data.gId && data.providers == "google"){
                // User save information in this methods
                var query = {"gId":data.gId};
               return API.Model(Users).findOne(query).then(function (user) {
                if( user != undefined ){
                       
                        return socialUserAccess(data.client_id,user);
                    
                }else{  
                        if(!data['firstName'] && !data['lastName']){
                            data['firstName'] = "efarmx";
                            data['lastName'] = "facebook user";
                        }     

                    return Users.findOne({username:data.username}).then(function (user) {
                        if( user != undefined ){
                            return {"success": false, "error": {"code": 301,"message": constantObj.messages.USER_EXIST} };                
                        }else{
                            return saveUser(data).then(function(res){
                                return socialUserAccess(cId,res);
                            });                     
                        }
                    });

                          
                }
               });
            }else{
                    if( (!data.username && !data.mobile) ){
                      return {"success": false, "error": {"code": 404,"message": constantObj.messages.REQUIRED_FIELD} };
                    }

                    return Users.findOne({username:data.username}).then(function (user) {
                        if( user != undefined ){
                            return {"success": false, "error": {"code": 301,"message": constantObj.messages.USER_EXIST} };                
                        }else{
                             return saveUser(data).then(function(res){
                        var code = Math.floor(100000001 + Math.random() * 900000001);
                    emailVerifyLink({
                        id: res.id,
                        type: "Email",
                        username: res.username,
                        verifyURL: sails.config.security.server.url + "/user/verification/" + code 
                    });
                                
                                return {success: true, code:200, message: constantObj.messages.SUCCESSFULLY_REGISTERED, data: res};

                            });                   
                        }
                    });
            }
    },

    signinUser: function (data, context) {
        //console.log(data);
        let username = data.username;
         return Users.findOne({username:username,roles:'U'}).then(function (user) {
            
          if( user == undefined ){
              return {"success": false, "error": {"code": 404,"message": constantObj.messages.WRONG_USERNAME} };
          }
            if( !bcrypt.compareSync(data.password, user.password) ){
                return {"success": false, "error": {"code": 404,"message": constantObj.messages.WRONG_PASSWORD} };
            }else{
                return Tokens.generateToken({
                    client_id: data.client_id,
                    user_id: user.id
                }).then(function (token) {

                    //console.log(token);
                    user.access_token = token.access_token;
                    user.refresh_token = token.refresh_token;

                    return {success: true, code:200, message: constantObj.messages.SUCCESSFULLY_LOGGEDIN, data: user};

                });
            }

        });
    },
    checkOtpUser: function (data, context) {
            let userOtp = parseInt(data.number);
        return Users.findOne({otp:userOtp}).then(function (user) {
            
          if( user == undefined ){
              return {"success": false, "error": {"code": 404,"message": constantObj.messages.WRONG_OTP} };
          }
            API.Model(Users).update(
                {
                    id:user.id
                },
                {
                    otpVerified: 'Y'
                }
            );

            return {
                userVerifiedByOtp: true,
                username: user.username,
                username: user.id
            }
        });
    },
    verificationUser: function (data, context) {
         let verifyCode = parseInt(data.code);
         console.log(verifyCode);
       /* return Users.findOne({otp:userOtp}).then(function (user) {
            
          if( user == undefined ){
              return {"success": false, "error": {"code": 404,"message": constantObj.messages.WRONG_OTP} };
          }
            API.Model(Users).update(
                {
                    id:user.id
                },
                {
                    otpVerified: 'Y'
                }
            );

            return {
                userVerifiedByOtp: true,
                username: user.username,
                username: user.id
            }
        });*/
    },
    verifyUser: function (data, context) {
        console.log("in verify user",data);
        return Tokens.authenticate({
            code: data.code,
            type: 'verification',
            username: data.username
        }).then(function (info) {
            var date = new Date();
            if (!info) return Promise.reject('Unauthorized');

            API.Model(Users).update(
                {
                    username: info.identity.username
                },
                {
                    date_verified: date
                }
            );

            return {
                verified: true,
                username: info.identity.username
            }
        });
    },
    registerClient: function (data, context) {
        return API.Model(Clients).create({
            client_id: Tokens.generateTokenString(),
            client_secret: Tokens.generateTokenString(),
            username: data.username
        }).then(function (client) {
            context.id = client.client_id;
            context.type = 'Client ID';

            return Tokens.generateToken({
                client_id: client.client_id
            });
        }).then(function (token) {
            return emailGeneratedCode({
                id: context.id,
                type: context.type,
                verifyURL: sails.config.security.server.url + "/clients/verify/" + data.username + "?code=" + token.code,
                username: data.username
            });
        });
    },
    verifyClient: function (data, context) {
        return Tokens.authenticate({
            type: 'verification',
            code: data.code,
            username: data.username
        }).then(function (info) {
            var date = new Date();
            if (!info) return Promise.reject('Unauthorized');

            API.Model(Clients).update(
                {
                    client_id: info.identity.client_id
                },
                {
                    date_verified: date
                }
            );

            return {
                verified: true,
                username: info.identity.username
            };
        });
    }
};