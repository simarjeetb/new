/**
 * LandController
 *
 * @description :: Server-side logic for managing lands
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	 add: function(req,res){
      var land = req.body;
      console.log(land);

    },
     delete: function(req,res){
    	// action generated when delete api hit
	  API(LandServices.deleteLand,req,res);
    },  

    getAllLands: function(req, res, next) {

		var sortBy    	= req.param('sortBy');
		var page        = req.param('page');
		var count       = req.param('count');
		var search      = req.param('search');
		var skipNo      = (page - 1) * count;
		var query       = {};

		sortBy = sortBy.toString();
        if (sortBy) {
            sortBy = sortBy.toString();
        } else {
            sortBy = 'createdAt desc';
        }	

		query.isDeleted = 'false';

		if (search) {
		   query.$or = [
		       {
		            expected_price: {
		                'like': '%' + search + '%'
		            }
		        },
		        {
		            district: {
		                'like': '%' + search + '%'
		            }
		        },
		        {
		            area: {
		                'like': '%' + search + '%'
		            }
		        },
		        {
		            rentSell: {
		                'like': '%' + search + '%'
		            }
		        }
		        
		   ]
		}

		Land.count(query).exec(function(err, total) {
		   if (err) {
		       return res.status(400).jsonx({
		           success: false,
		           error: err
		       });
		   } else {
		       Land.find(query).populate('category').populate('user').sort(sortBy).skip(skipNo).limit(count).exec(function(err, lands) {
		            if (err) {
		                return res.status(400).jsonx({
		                   success: false,
		                   error: err
		                });
		            } else {
		                return res.jsonx({
		                    success: true,
		                    data: {
		                        lands: lands,
		                        total: total
		                    },
		                });
		            }
		       })
		   }
		})
	},



};

