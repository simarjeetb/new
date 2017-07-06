/**
  * #DESC:  In this class/files crops related functions
  * #Request param: Crops add form data values
  * #Return : Boolen and sucess message
  * #Author: Rohitk.kumar
  */

var Promise = require('bluebird'),
    promisify = Promise.promisify;
var constantObj = sails.config.constants;


  getCrop = function(Id){
         return API.Model(Crops).findOne(Id)
        .then(function (crop) {
            return crop;
        });
  }


module.exports = {

    save: function (data, context) {
        var date = new Date();
        return API.Model(Crops).create(data)
        .then(function (crop) {
            var result;
            if(crop){
                result = {
                            "Status": true,
                            "Code": 200,
                            "Message": constantObj.crops.ADDED_CROP,
                            "data": crop,
                        }
                
            }else{
                result = {
                           "Status": false,
                           "Code": 301,
                           "Message": "Faild"
                           }
            }

            return result;

        });
    },
    list: function (data, context) {
        
        return Crops.find({"isDeleted":false}).populate('user').populate('category')
        .then(function (crops) {
            var result;
            if(crop){
                result = {
                            "Status": true,
                            "Code": 200,
                            "Message": "OK",
                            "data": crop,
                        }
                
            }else{
                result = {
                           "Status": false,
                           "Code": 301,
                           "Message": "Faild"
                           }
            }
            return result;

        });
    },
    update: function (data, context) {
       
        return API.Model(Crops).update(data.id,data)
        .then(function (crop) {

             var result;
            if(crop){
                result = {
                            "status": true,
                            "code": 200,
                            "data": crop,
                        }
                
            }else{
                result = {
                           "status": false,
                           "code": 301,
                           "message": "Faild"
                           }
            }

            return result;

        });
    },
    delete: function (data, context) {
       
     return API.Model(Crops).update(data.id,data)
        .then(function (crop) {
            var Report;
            if(crop){
                Report = {"sucess": {
                            "Code": 200,
                            "Message": "Deleted"
                            }}
            }else{
                Report = {"error": {
                            "Code": 301,
                            "Message": "Faild"
                            }}
            }
            return {
                    "Status": true,
                     Report
                };
        });
    },
    changeStatus: function (data, context) {
       
     return API.Model(Crops).update(data.id,data)
        .then(function (crop) {
            var Report;
            if(crop){
                Report = {"sucess": {
                            "Code": 200,
                            "Message": "StatusUpdated"
                            }}
            }else{
                Report = {"error": {
                            "Code": 301,
                            "Message": "Faild"
                            }}
            }
            return {
                    "Status": true,
                     Report
                };
        });
    },
    buyerAccepted: function (data, context) {
        
        return getCrop(data.crop).then(function(cropData){
           let bidsData = [];
           let i = 0;
        cropData.bids.forEach(function(bid){

            if(data.buyer == bid.user_id.toString() && bid.status == "Pending"){
                  bid.status = "Accepted";
            }else{
                bid.status = "Pending";
            }

          bidsData.push(bid);
          
        });
                return Crops.update(
                    {id:cropData.id},
                    {bids:bidsData}
                    )
                    .then(function (crop) {
                        
                        return crop[0];
                }).fail(function(err){
                    return {
                       Code:400,
                       success: false,
                       error: "There is some problem to accept the bid."
                    };
                });

        });
    },
    get: function (data, context) {

        return API.Model(Crops).findOne(data.id)
        .then(function (crop) {
            var Report;
            
            if(crop){
                Report = {"sucess": {
                            "Code": 200,
                            "Message": "OK"
                            }}
            }else{
                Report = {"error": {
                            "Code": 301,
                            "Message": "Faild"
                            }}
            }
            return {
                    "Status": true,
                    "Data": crop,
                     Report
                };
        });
    },
  




 
}; // End Crops service class