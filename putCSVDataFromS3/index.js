 const AWS = require('aws-sdk');
 const s3 = new AWS.S3();
 const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

exports.handler = (event, context) => {
    const bucketName = process.env.bucketName;
    const keyName = process.env.key;
    const params = { Bucket: bucketName, Key: keyName };
    const csv=require('csvtojson');
//grab the csv file from s3        
    const s3Stream = s3.getObject(params).createReadStream()

    csv().fromStream(s3Stream)
         .on('data', (row) => {
//read each row 
             let jsonContent = JSON.parse(row);
             console.log(JSON.stringify(jsonContent));
             
//push each row into DynamoDB
             let paramsToPush = {
                    TableName:process.env.tableName,
                    Item:{
                       "dateStart" :new Date(jsonContent.holidayStart).getTime(),
                       "dateEnd":new Date(jsonContent.holidayEnd).getTime(),
                       "reason":jsonContent.reason,
                       "holidayStart":jsonContent.holidayStart,
                       "holidayEnd":jsonContent.holidayEnd
                    }
                };
            addData(paramsToPush);
    });
      
};


 function addData(params) {
            console.log("Adding a new item based on: ");
            docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Added item:", JSON.stringify(params.Item, null, 2));
                }
            });
        }