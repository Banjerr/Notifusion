'use strict'

function get_webforms()
{
    // grab the access_token object from the db
    var access_token = db('access_token').__wrapped__[0];
    //var token_json = JSON.parse(access_token);

    // var options = {
    //   url: 'http://infusionrest.dev/public/webforms',
    //   headers: {
    //       'access_token': token_json.access_token,
    //       'token_type': token_json.token_type,
    //       'expires_in': token_json.expires_in,
    //       'refresh_token':token_json.refresh_token,
    //       'scope':token_json.scope
    //   }
    // };
    //
    // function callback(error, response, body)
    // {
    //   if (!error && response.statusCode == 200)
    //   {
    //     var info = JSON.parse(body);
    //     console.log(body);
    //     console.log(info);
    //   }
    //
    //   if (error)
    //   {
    //       console.log('somethin goofed');
    //       console.log(error);
    //   }
    //
    //   console.log(response);
    // }
    // request(options, callback);

    // request.post({
    //     url: 'http://infusionrest.countryfriedcoders.me/webforms/',
    //         form: {
    //             'access_token': access_token.access_token,
    //             'token_type': access_token.token_type,
    //             'expires_in': access_token.expires_in,
    //             'refresh_token':access_token.refresh_token,
    //             'scope':access_token.scope
    //         }
    //     },
    //         function (error, response, body)
    //         {
    //             if (!error && response.statusCode == 200)
    //             {
    //                 console.log(body)
    //             }
    //
    //             if (error)
    //             {
    //                 console.log('somethin goofed');
    //                 console.log(error);
    //             }
    //
    //             console.log(response);
    //         }
    // );

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
    );

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
}
