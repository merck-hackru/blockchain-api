/**
 * Created by gopinath on 3/9/19.
 */
/**
 * Created by gopinath on 3/9/19.
 */
/**
 * Created by gopinath on 3/9/19.
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

function updateData(gs1, cb) {


    getApiToken(function(err, token) {
        if (err) {
            console.log(err);
            cb(err);

        } else {
            let payload = {
                url: base_url + '/products/' + gs1.gtin + '/serialNumber/' + gs1.serialNumber + '/lotNumber/' + gs1.lotNumber + '/expiryDate/' + gs1.expiryDate,
                method: 'PATCH',
                header: {
                    "Content-Type": "application/json"
                },
                auth: {
                    'bearer': token
                },
                proxy:'',
                json: gs1,
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
    "gtin" : '12206555018611',  // Keys to update
    "serialNumber": '180914578754',
    "lotNumber": 'R036191',
    "expiryDate": "2021-07-07T00:00:00.000Z", // Keys
    "longitude": "40.50270993",  // Sample location
    "latitude": "-74.45260496"
};

updateData(gs1, function(err, body, response) {
    if(err)
        console.log(err);
    else {
        console.log(response);
        let resp = response;
        if (typeof(response) == 'string')
            resp = JSON.parse(response);
        console.log(JSON.stringify(resp, null, 2));
    }
});
