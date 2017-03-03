'use strict';
const emailAddress = process.env.EMAIL_ADDRESS;
const siteKey = process.env.SITEKEY;
const secretKey = process.env.SECRETKEY;

let aws = require('aws-sdk');
let recaptcha = require('recaptcha2');

// Initialize
let ses = new aws.SES({region: 'us-east-1'});
let rcclient = new recaptcha({
  siteKey: siteKey,
  secretKey: secretKey
});

exports.handler = function(event, context, callback) {

  let name = (event.name === undefined ? 'No-Name' : event.name);
  let body = (event.body === undefined ? 'No-Name' : event.body);
  let clientEmail = (event.email === undefined ? 'No-Name' : event.email);
  let key = (event.recaptcha === undefined ? '' : event.recaptcha);

  rcclient.validate(key)
  .then(function(){
    // validated and secure
    let params = {
        Destination: {
            ToAddresses: [emailAddress]
        },
        Message: {
            Body: {
                Text: {
                    Data: JSON.stringify({name: name, body: body, email: clientEmail})
                }
            },
            Subject: {
                Data: "User Comment"
            }
        },
        Source: emailAddress
    };

    let email = ses.sendEmail(params, function(err, data) {
        if (err) {
            console.log(err);
            callback(null, {success: false});
        } else {
            console.log('NAME: ', name);
            callback(null, {success: true});
        }
    });
  })
  .catch(function(errorCodes){
    // invalid
    console.log(rcclient.translateErrors(errorCodes));// translate error codes to human readable text
    callback(null, {success: false});
  });

};
