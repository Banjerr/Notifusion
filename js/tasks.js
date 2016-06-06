'use strict'

// this is db stuff
const task_db = low('tasks.json', { storage });

// get all the tasks
var retrieveTasks = function(){
    var since_date = '2015-01-01T17:00:00.000Z';
    var until_date = '2017-01-01T17:00:00.00Z';
    var limit_results = '100';
    var offset_results = '0';
    var order_by = 'priority';
    var show_completed = 'true';
    var has_due_date = 'true';

    // grab the access_token object from the db
    var access_token = db('access_token').__wrapped__[0];

    // make a get request to the ghetto api endpoint
    request.get({
        url: 'https://api.infusionsoft.com/crm/rest/v1/tasks/search?access_token=' + access_token.access_token + '&since=' + since_date + '&until=' + until_date + '&limit=' + limit_results + '&offset=' + offset_results + '&order=' + order_by + '&completed=' + show_completed + '&has_due_date=' + has_due_date
        },
            function (error, response, body)
            {
                if (!error && response.statusCode == 200)
                {
                    //console.log(body)
                }

                if (error)
                {
                    console.log('somethin goofed');
                    console.log(error);
                }

                var json = body;
                var parsed = JSON.parse(json);
                console.log(parsed.tasks[0].title);
                //save_tasks(parsed.tasks);
            }
    );
}

// save tasks to db until they're cleared
var save_tasks = function(tasks){
    // db('tasks').push({
    //
    // });
}
