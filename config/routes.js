/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  /*'/': {
    view: 'homepage'
  },*/

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/
  //Authorisation Routes
  'post /authorisation': 'OAuthController.token',
  'get /user/verify/:username' :'UsersController.verify/:username',
  'get /user/otp/:number' :'UsersController.otp/:number',

  //Routes for common functions which will use for every module.
  'get /common': 'CommonController.getdetails',
  'post /upload': 'CommonController.uploadImages',
  'get /assets': 'CommonController.getAssets',

  //Equipments Routes
  'get /land': 'LandController.getAllLands',
  
    
  //Equipments Routes
  'get /equipment': 'EquipmentController.getAllEquipments',
  'post /equipment/upload' : 'EquipmentController.uploadImages',

  //User Routes
  'get /user' : 'UsersController.getAllUsers', 
  'get /user/:id' :{ model: 'users', blueprint: 'find'},
  'put /user/:id' :{ model: 'users', blueprint: 'update' },
  'delete /user/:id' :{ model: 'users', blueprint: 'destroy' },
  'post /user' : 'UsersController.index',
  'post /forgotpassword' : 'UsersController.forgotPassword',

  //Crops Routes
  'get /crops': 'CropsController.getAllCrops',
  'get /crops/accept': 'CropsController.accept',
  'get /crops/:id' : { model: 'crops', blueprint: 'find'},
  'put /bids' : 'CropsController.updateBids',

  //Inputs Routes
  'get /inputs': 'InputsController.getAllInputs',
  
  //Manufacturer Routes
  'get /allmanufacturer' : 'ManufacturerController.getAllManufacturer',

  //Category Routes
  'get /allcategory' : 'CategoryController.getAllCategory',

  //Roles & Permission routes
  'post /permission' : { model: 'roles', blueprint: 'create'},
  'get /permission' : 'RolesController.getAllRoles',
  'get /permission/:id' : { model: 'roles', blueprint: 'find'},
  'put /permission/:id' : { model: 'roles', blueprint: 'update'},
  'delete /permission/:id' :{ model: 'roles', blueprint: 'destroy'},
  'post /lang' : { model: 'languages', blueprint: 'create'},
  'get /lang' : 'LanguagesController.getLanguage'
};
