var Promise = require('bluebird'),
    promisify = Promise.promisify;

    module.exports = {

    saveLand: function (data, context) {
        console.log(data);
    },
    deleteLand: function (data, context) { //soft delete land api
       
     return API.Model(Land).update(data.id,data) // delete and update
        .then(function (land) {
            var report;
            if(land){
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
                    "Status": true, //when delete action performed its status true
                     report
                };
        });
    },
    
};