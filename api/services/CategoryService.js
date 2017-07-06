/**
  * #DESC:  In this class/files crops related functions
  * #Request param: Crops add form data values
  * #Return : Boolen and sucess message
  * #Author: Rohitk.kumar
*/

var Promise = require('bluebird'),
    promisify = Promise.promisify;

module.exports = {

    delete: function (data, context) {
      return API.Model(Category).update(data.id,data)
        .then(function (categories) {
            var result;
            if(categories){
              result =  {"sucess": {
                        "Code": 200,
                        "Message": "Category deleted successfully."
                      }}
            } else {
              result =  {"error": {
                        "Code": 301,
                        "Message": "There is some issue with the category deletion."
                      }}
            }
      return {
                "Status": true,
                  result
                };
      });
    }

}; // End Crops service class