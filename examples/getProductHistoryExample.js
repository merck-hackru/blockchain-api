/**
 * Created by gopinath on 3/9/19.
 * GET PRODUCT HISTORY example
 */
const request = require('request');

const base_url = process.env.BASE_URL || 'https://mercklab-poc-sl-api.mybluemix.net/api';


function getApiToken(cb) {

    let payload = {
        url: base_url + '/user/login',
        method: 'POST',
        header: {
            "Content-Type": "application/json"
        },
        json: {
            "email": "tester@merck.com",
            "password": "testing123"
        },
        proxy: '',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false
    };

    request(payload, function (err, body, response) {
        if (err) {
            cb(err, null);
        } else {
            var result = null;
            if (typeof response === 'string') {
                result = JSON.parse(response);
            } else
                result = response;
            if (result.message === 'Authorization sucessful') {
                cb(null, result.token);
            } else {
                cb(result.message, null);
            }
        }
    });
}

function getHistData(gs1, cb) {


    getApiToken(function(err, token) {
        if (err) {
            console.log(err);
            cb(err);

        } else {
            let payload = {
                url: base_url + '/products/gethistory/' + gs1.gtin + '/serialNumber/' + gs1.serialNumber + '/lotNumber/' + gs1.lotNumber + '/expiryDate/' + gs1.exprDate,
                method: 'GET',
                header: {
                    "Content-Type": "application/json"
                },
                auth: {
                    'bearer': token
                },
                proxy:'',
                rejectUnauthorized: false,
                requestCert: true,
                agent: false
            };

            request(payload, cb)

        }
    });

}


/*
 Example Key
 */
var gs1 = {
    gtin : '08806555018611',
    serialNumber: '180914578754',
    lotNumber: 'R036191',
    exprDate: "2021-07-07T00:00:00.000Z"  // Note Date should be string
};

getHistData(gs1, function(err, body, response) {
    if(err)
        console.log(err);
    else {
        let resp = response;
        if (typeof(response) == 'string')
            resp = JSON.parse(response);
        console.log(JSON.stringify(resp, null, 2));
    }
});
