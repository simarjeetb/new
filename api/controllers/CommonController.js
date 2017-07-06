var Promise = require('q');
var constantObj = sails.config.constants;
// var gm = require('gm');
/**
 * CommonController
 *
 * @description :: Server-side logic for managing equipment
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	getDetails: function(req, res) {
		
		var query = {};
		var Model = {};
		query.isDeleted = 'false';
		
		var modelName = req.param('model');
		var Model = sails.models[modelName];

		if(modelName === 'users'){
			query.roles = "U";
		}
		
		//console.log("value is ",Model,query);
		Model.find(query).exec(function(err,response){
			if(response){
				return res.jsonx({
	                success: true,
	                data: response
	            });
			} else {
				return res.status(400).jsonx({
                   success: false,
                   error: err
                });
			}
		});
	},

	getAssets: function(req, res) {
		console.log("here");

		var query = {};
		var Model = {};
		
		var userQuery = {};
		var CategoryQuery = {};

		userQuery.isDeleted = 'false';
		userQuery.roles = 'U';
		
		CategoryQuery.isDeleted = 'false';
		CategoryQuery.type 		= req.param('type');
		
		Promise.all([

			Category.find(CategoryQuery).then(),

			Manufacturer.find().then(),	

			Users.find(userQuery).then(),				

			States.find().then(),	

		]).spread(function(Category,Manufacturer,Users,States){ 
		return res.jsonx({
	                    success: true,
	                    data: {
	                        Users : Users,
	                        Category : Category,
	                        Manufacturer : Manufacturer,
	                        States : States
	                    },
	                });

        }).fail(function(err){
        	return res.status(400).jsonx({
	                   success: false,
	                   error: err
	                });
        	//res.jsonx(err);
        	console.log("error in common controller",err);
        });
	},

	uploadImages: function(req, res) {
		var fs = require('fs');
		//var path = require('path');
		var uuid = require('uuid');
		var randomStr = uuid.v4();
		var date = new Date();
		var currentDate = date.valueOf();
		


		//console.log("req is ", req.body.type, req);
		var modelName = req.body.type;
		//var modelName = 'crops';
		
		var Model = sails.models[modelName];
		var name = randomStr + "-" + currentDate;

		var imagedata = req.body.data;
		imageBuffer = this.decodeBase64Image(imagedata);


		var imageType = imageBuffer.type;
		
		var typeArr = new Array();
		typeArr = imageType.split("/");
		
		var fileExt = typeArr[1];
		
		
		if((fileExt === 'jpeg') || (fileExt === 'JPEG') || (fileExt === 'JPG') || (fileExt === 'jpg') || (fileExt === 'PNG') || (fileExt === 'png')) {
			if (imageBuffer.error) return imageBuffer.error;

			var fullPath = name + '.'+ fileExt ;

			var imagePath = '/images/' + modelName + '/' + name + '.' + fileExt;
			var thumbpath = '/images/' + modelName + '/thumb/' + name + '.' + fileExt;
			
			var uploadLocation = 'assets/images/' + modelName + '/' + name + '.' + fileExt ;
            var tempLocation = '.tmp/public/images/'+ modelName + '/' + name + '.' + fileExt ;

			/*gm(imageBuffer).thumb(110, 65, thumbpath, function(thumbdata){
				if(thumbdata){
					console.log("thumbdata",thumbdata);
				}
			})*/

			fs.writeFile('assets/images/'+modelName + '/'+ name + '.'+ fileExt, imageBuffer.data, function(imgerr, img) {
				if (imgerr) {
					res.status(400).json({
						"status_code": 400,
						"message": imgerr
					});
				} else {
            		fs.createReadStream(uploadLocation).pipe(fs.createWriteStream(tempLocation));
					//console.log("fullPath",fullPath);
					return res.jsonx({
	                    success: true,
	                    data: {
	                        fullPath : fullPath,
	                        imagePath : imagePath
	                    },
	                });
				}

			});
		
		} else {
			console.log("error");
			res.status(400).json({
				"status_code": 400,
				"message": constantObj.messages.INVALID_IMAGE
			});
		}
   	},

	/*function to decode base64 image*/
	decodeBase64Image: function(dataString) {
		var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
			response = {};
		if (matches) {

			if (matches.length !== 3) {
				return new Error('Invalid input string');
			}

			response.type = matches[1];
			response.data = new Buffer(matches[2], 'base64');
		} else {
			response.error = constantObj.messages.INVALID_IMAGE;
		}

		return response;
	}
};

