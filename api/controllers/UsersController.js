/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    index: function(req,res){
        API(Registration.registerUser,req,res);
    },

    register: function(req,res){
        API(Registration.registerUser,req,res);
    },
    /****
    * @Desc : Method use for sign up user via mobile. its sign up API for mobile.
    * @Params: post by mobile team
    * @return  :  Success and data
    * @Author: Rohitk.kumar
    ***/
    signup: function(req,res){
      API(Registration.signupUser,req,res);
    },
     /****
    * @Desc : Method use for sign in user via mobile. its sign in API for mobile.
    * @Params: username password and device token
    * @return  :  Success and data
    * @Author: Rohitk.kumar
    ***/
    signin: function(req,res){
      API(Registration.signinUser,req,res);
    },
    /****
    * @Desc : Method use for Verify user OTP
    * @Params: OTP
    * @return  :  Success and data (json ARRAY)
    * @Author: Rohitk.kumar
    ***/
    'otp/:number': function(req,res){
        API(Registration.checkOtpUser,req,res);
    },
    'verification/:code': function(req,res){
        API(Registration.verificationUser,req,res);
    },

    'verify/:username': function(req,res){
        API(Registration.verifyUser,req,res);
    },
    current: function(req,res){
        API(Registration.currentUser,req,res);
    },
    add: function(req,res){
        API(UserService.save,req,res);
    },

    forgotPassword: function(req,res){
        API(UserService.forgotPassword,req,res);
    },

    getAllUsers: function(req, res, next) {

        var search      = req.param('search');
        var sortBy      = req.param('sortBy');
        var roles       = req.param('roles');
        var page        = req.param('page');
        var count       = req.param('count');
        var skipNo      = (page - 1) * count;
        var query       = {};
        if(sortBy) {
            sortBy = sortBy.toString();
        } else {
            sortBy = 'createdAt desc';
        }
        if(roles) query.roles = roles;

        if (search) {
           query.$or = [
               {
                    firstName: {
                        'like': '%' + search + '%'
                    }
                },
                {
                    lastName: {
                        'like': '%' + search + '%'
                    }
                },
                {
                    fullName: {
                        'like': '%' + search + '%'
                    }
                },
                {
                    email: {
                        'like': '%' + search + '%'
                    }
                },
                {
                    username: {
                        'like': '%' + search + '%'
                    }
                },
                {
                    address: {
                        'like': '%' + search + '%'
                    }
                },
                {
                    city: {
                        'like': '%' + search + '%'
                    }
                },
                {
                    district: {
                        'like': '%' + search + '%'
                    }
                },
                {
                    state: {
                        'like': '%' + search + '%'
                    }
                },
                {
                    mobile: parseInt(search)
                }
                
           ]
       }

       Users.count(query).exec(function(err, total) {
           if (err) {
               return res.status(400).jsonx({
                   success: false,
                   error: err
               });
           } else {
               Users.find(query).populate('roleId').sort(sortBy).skip(skipNo).limit(count).exec(function(err, users) {
                    if (err) {
                        return res.status(400).jsonx({
                           success: false,
                           error: err
                        });
                    } else {
                        return res.jsonx({
                            success: true,
                            data: {
                                users: users,
                                total: total
                            },
                        });
                    }
               })
           }
       })
    }
};