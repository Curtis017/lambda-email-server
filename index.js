'use strict';
const emailAddress = process.env.EMAIL_ADDRESS;
let aws = require('aws-sdk');
let ses = new aws.SES({region: 'us-east-1'});

exports.handler = function(event, context, callback) {
    let name = (event.name === undefined ? 'No-Name' : event.name);
    let body = (event.body === undefined ? 'No-Name' : event.body);
    let clientEmail = (event.email === undefined ? 'No-Name' : event.email);
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

};
