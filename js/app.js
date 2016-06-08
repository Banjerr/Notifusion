'use strict'

// this is db stuff
const task_db = low('tasks.json', { storage });

// Define the `notifusion` module
var notifusionApp = angular.module('notifusionApp', ['ngMaterial']).config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default').dark()
    .primaryPalette('lime', {'default':'900'})
    .accentPalette('yellow', {'default':'500'});
});

// Task controller
notifusionApp.controller('TaskListController', function TaskListController($scope) {
  $scope.retrieveTasks = function(){
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
                  //console.log(parsed.tasks);
                  $scope.save_tasks(parsed.tasks);
              }
      );
  }

  // save tasks to db until they're cleared
  $scope.save_tasks = function(tasks){
      // loop through all and save those tasks to the tasks.json file
      for ( var i = 0; i < tasks.length; i++) {
          //console.log(tasks[i].title);
          task_db('tasks').push({
              completed: tasks[i].completed,
              completion_date: tasks[i].completion_date,
              contact: {
                  email: tasks[i].contact.email,
                  first_name: tasks[i].contact.first_name,
                  id: tasks[i].contact.id,
                  last_name: tasks[i].contact.last_name
              },
              creation_date: tasks[i].creation_date,
              description: tasks[i].description,
              due_date: tasks[i].due_date,
              id: tasks[i].id,
              modification_date: tasks[i].modification_date,
              priority: tasks[i].priority,
              title: tasks[i].title,
              type: tasks[i].type,
              url: tasks[i].url,
              user_id: tasks[i].user_id
          });
      }
  }

  // delete all saved tasks
  $scope.delete_tasks = function(){
      task_db('tasks').remove();
  }

  // get the saved tasks from the db
  $scope.tasks_from_db = function(){
      var has_saved_tasks = task_db.read();
      var tasks_list = task_db('tasks').__wrapped__;
      if(has_saved_tasks.length > 0){
          console.log(tasks_list);
          $scope.tasks = tasks_list;
      } else {
          return 'You have no tasks; go git some!'
      }
  }
});
