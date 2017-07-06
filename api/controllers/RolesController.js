/**
 * RolesController
 *
 * @description :: Server-side logic for managing roles and permission
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	getAllRoles: function(req, res) {
		
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
		        }
		    ]
		}

		Roles.count(query).exec(function(err, total) {
		   if (err) {
		       return res.status(400).jsonx({
		           success: false,
		           error: err
		       });
		   } else {
		        Roles.find(query).sort(sortBy).skip(skipNo).limit(count).exec(function(err, roles) {
		            if (err) {
		                return res.status(400).jsonx({
		                   success: false,
		                   error: err
		                });
		            } else {
		            	var query ={}

		            	async.each(roles, function(role, callback) {
		            		query.roleId = role.id;
	        				query.isDeleted = false;

	        				Users.count(query)
	        				.then(function(totalUsers){
	        					role.totalUsers = totalUsers;
	        					callback();
	        				})
	        				.fail(function(error){
	        					callback(error);
	        				})
							
		            	},function(error){
		            		if(error){ 
		            			console.log("error is here",error);
		            		} else {
		            			return res.jsonx({
				                    success: true,
				                    data: {
				                        roles: roles,
				                        total: total
				                    },
				                });
		            		}
		            	});
		                
		            }
		       })
		    }
		})
	}

};