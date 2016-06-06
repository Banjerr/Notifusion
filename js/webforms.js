'use strict'

// function to pull back all active webforms
var get_webforms = function()
{
    // grab the access_token object from the db
    var access_token = db('access_token').__wrapped__[0];

    // make a get request to the ghetto api endpoint
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
}

// function to show all active webforms
var show_webforms = function()
{

}
