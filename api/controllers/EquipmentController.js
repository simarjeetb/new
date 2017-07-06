var s3 = require('s3');
const osTmpdir = require('os-tmpdir');
//var formidable = require('formidable');
var AWS = require('aws-sdk');

var path = require('path');
/**
 * EquipmentController
 *
 * @description :: Server-side logic for managing equipment
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	add: function(req,res){
		//action generated when post api hit to save data
      var equipment = req.body;
      console.log(equipment);
	},

    delete: function(req,res){
    	// action generated when delete api hit
	  API(EquipmentServices.deleteEquip,req,res);
    },

	getAllEquipments: function(req, res, next) {
		
		var page        = req.param('page');
		var count       = req.param('count');
		var skipNo      = (page - 1) * count;
		var search      = req.param('search');
		var query       = {};

		var sortBy    	= req.param('sortBy');
		
		if (sortBy) {
            sortBy = sortBy.toString();
        } else {
            sortBy = 'createdAt desc';
        }
		
		query.isDeleted = 'false';

		if (search) {
		   query.$or = [
		       {
		            name: {
		                'like': '%' + search + '%'
		            }
		        },
		        {
		            usage: {
		                'like': '%' + search + '%'
		            }
		        },
		        {
		            modelyear: {
		                'like': '%' + search + '%'
		            }
		        },
		        {
		            rentSell: {
		                'like': '%' + search + '%'
		            }
		        },
		        {
		            quantity: {
		                'like': '%' + search + '%'
		            }
		        },
		        {
		            district: {
		                'like': '%' + search + '%'
		            }
		        }
		        
		   ]
		}

		Equipment.count(query).exec(function(err, total) {
		   if (err) {
		       return res.status(400).jsonx({
		           success: false,
		           error: err
		       });
		   } else {
		       Equipment.find(query).populate('category').populate('user').populate('companyManufacturer').sort(sortBy).skip(skipNo).limit(count).exec(function(err, equipments) {
		            if (err) {
		                return res.status(400).jsonx({
		                   success: false,
		                   error: err
		                });
		            } else {
		                return res.jsonx({
		                    success: true,
		                    data: {
		                        equipments: equipments,
		                        total: total
		                    },
		                });
		            }
		       })
		   }
		})
	},
   

    uploadImages: function(req, res) {
    	osTmpdir();
    	console.log("here before file ");


        //var form = new formidable.IncomingForm();
    	//form.keepExtensions = true;     //keep file extension
    	var uploadDir = (path.resolve(__dirname+"/../../doc/upload/equipments/"));  //set upload directory
    	//console.log(form.uploadDir)
    	//console.log("tset",uploadDir);
    	// form.keepExtensions = true;     //keep file extension
    	// console.log(req.file('abc'));
    	var dateTime = new Date().toISOString().replace(/T/,'').replace(/\..+/, '').split(" ");
    	
    	req.file('file').upload({
		  	dirname: uploadDir
		},function (err, uploadedFiles) {
		  	console.log("error is",err);
		  	console.log("uploadedFiles is",uploadedFiles);
		  	if (err){
		   		return res.negotiate(err);
		   	} else {
	   		    var client = s3.createClient({
				  	s3Options: {
					    accessKeyId: "AKIAJ4NYJKROJJL34MJQ",
					    secretAccessKey: "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"
					},
				});
			    // var client = s3.createClient(options);

			    var params = {
			      localFile: uploadedFiles[0].fd,

			      s3Params: {
			        Bucket: "farmx-data",
			        Key: "images/"+ dateTime +uploadedFiles[0].fd,
			        ACL: 'public-read',
			        // other options supported by putObject, except Body and ContentLength.
			        // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
			      },
			    };

			    var uploader = client.uploadFile(params);
			      uploader.on('error', function(err) {
			        console.error("unable to upload:", err.stack);
			        res.json({'code': 400, 'error':err.stack});
			      });
			      uploader.on('progress', function() {
			        console.log("progress", uploader.progressMd5Amount,
			                  uploader.progressAmount, uploader.progressTotal);
			        var return_data = {}
			        return_data.progressMd5Amount = uploader.progressMd5Amount
			        return_data.progressAmount    = uploader.progressAmount
			        return_data.progressTotal     = uploader.progressTotal
			      });
			      uploader.on('end', function() {
			        
			        uploader.url = s3.getPublicUrlHttp(params.s3Params.Bucket, params.s3Params.Key);
			        console.log("done uploading URL: "+uploader.url);

			      });
				// return res.json({
				//     message: uploadedFiles.length + ' file(s) uploaded successfully!'
				// });
			}
		});
    	// return;
    	// form.parse(req, function(err, fields, files) {
		//console.log("request is ",req);
			// console.log("datae",err, files, fields);
			// var dateTime = new Date().toISOString().replace(/T/,'').replace(/\..+/, '').split(" ");


	    	// UPLOADING IMAGE TO S3 BUCKET

	  //   	var awsS3Client = new AWS.S3();
	  //   	var options = {
		 //      	s3Client: awsS3Client,
	  //   	};
	  //   	console.log("options are",options);

	  //   	var client = s3.createClient(options);
			// console.log("client is ",client);
	    	
	    	/*var params = {
	      		localFile: files.file.path,
		      	s3Params: {
			        Bucket: "farmx-data",
			        Key: "images/"+req.session.equipment_id+ dateTime +files.file.name,
			        ACL: 'public-read',
			        // other options supported by putObject, except Body and ContentLength.
			        // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
		      	},
	    	};

	    	var uploader = client.uploadFile(params);
	      	
	      	console.log("Uploader is ",uploader);
	      	uploader.on('error', function(err) {
		        console.error("unable to upload:", err.stack);
		        res.json({'code': 400, 'error':err.stack});
		    });
	      	
	      	uploader.on('progress', function() {
	        	console.log("progress", uploader.progressMd5Amount,
	           	uploader.progressAmount, uploader.progressTotal);
		        var return_data = {}
		        return_data.progressMd5Amount = uploader.progressMd5Amount
		        return_data.progressAmount    = uploader.progressAmount
		        return_data.progressTotal     = uploader.progressTotal
		    });
	      	
	      	uploader.on('end', function() {
	        
	        	uploader.url = s3.getPublicUrlHttp(params.s3Params.Bucket, params.s3Params.Key);
	        	console.log("done uploading URL: "+uploader.url);

	        	var img = {};
	        	img.Title = s3.getPublicUrlHttp(params.s3Params.Bucket, params.s3Params.Key);
	        	img.Status = true;
	        	img.IsCover = false;
	        	var invn_id = fields.invn_id;              
	        
	        	Equipment.update({_id:invn_id},{$push:{"Images": img}},{},function(err, numAffected){
	          	
		          	if (err) {
		            	res.json(err);
		          	}else{
		            	Equipment.findOne({_id : invn_id},function(err,equipimages){
		              		if (err) {
		                		res.json(err);
		              		}else{
		                		res.json({'code':200,'equipment' : equipimages});
		              		}
		            	})
		          	}
	        	});
	      	//});*/
    	// });
   	},
//};

uploadImage: function (req, res) {
	console.log("control is here",req);
    req.file('file').upload({
      	adapter: require('skipper-s3'),
      	key: 'AKIAJPWHNV77ST4GC7WQ',
      	secret: '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',
      	bucket: 'farmx-data'
      	
    }, function (err, filesUploaded) {
    	if (err){
    		console.log("files error",err);
    		return res.negotiate(err);
    	} else { 
      		console.log("files uploaded",res);
      		return res.ok({

        		files: filesUploaded,
        		textParams: req.params.all()
      		});
      	}
    });
  }

};