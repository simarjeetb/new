/**
  * #DESC:  In this class/files crops related functions
  * #Request param: Crops add form data values
  * #Return : Boolen and sucess message
  * #Author: Rohitk.kumar
  */

var Promise = require('bluebird'),
    promisify = Promise.promisify
    ;

module.exports = {

     deleteInput: function (data, context) {
       
     return API.Model(Inputs).update(data.id,data)
        .then(function (inputs) {
            var report;
            if(inputs){
                report = {"sucess": {
                            "Code": 200,
                            "Message": "Deleted"
                            }}
            }else{
                report = {"error": {
                            "Code": 301,
                            "Message": "Faild"
                            }}
            }
            return {
                    "Status": true,
                     report
                };
        });
    },
    


 
}; // End Crops service class