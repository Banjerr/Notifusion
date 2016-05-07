'use strict'

function get_webforms()
{
    // grab the access_token object from the db
    var access_token = db('access_token').__wrapped__[0];

    request.get({
        url: 'http://infusionrest.countryfriedcoders.me/webforms/access_token=' + access_token.access_token + '&token_type=' + access_token.token_type + '&expires_in=' + access_token.expires_in + '&refresh_token=' + access_token.refresh_token + '&scope=' + access_token.scope
        },
            function (error, response, body)
            {
                if (!error && response.statusCode == 200)
                {
                    console.log(body)
                }

                if (error)
                {
                    console.log('somethin goofed');
                    console.log(error);
                }

                console.log(response.body);
            }
<<<<<<< HEAD
    );
=======
    });

    // send a post request to the webform endpoint
    // request.get(
    //     'http://infusionrest.dev/public/webforms/',
    //     { form: {
    //             access_token: token_json.access_token,
    //             token_type: token_json.token_type,
    //             expires_in: token_json.expires_in,
    //             refresh_token: token_json.refresh_token,
    //             scope: token_json.scope
    //         }
    //     },
    //     function (error, response, body)
    //     {
    //         if (!error && response.statusCode == 200)
    //         {
    //             console.log(body)
    //         }
    //
    //         if (error)
    //         {
    //             console.log('somethin goofed');
    //             console.log(error);
    //         }
    //
    //         console.log(response);
    //     }
    // );
>>>>>>> 0d9c9f12bcd2b89d4371b98e9bf4c5400240a585
}
