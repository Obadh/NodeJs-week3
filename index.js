var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();
app.use(bodyParser.json());

app.get('/todo' , function (request , response) {
  fs.readFile('./todo.txt' , 'utf8' , function(error , data){
    if (error) {
      console.error('Error reading the file');
    } else{
      var lines = data.split('/n');
      response.json({todo: lines});
    }
  })
})

app.get('/', function(request , response){
  response.json({result: 'ok'});

})
app.post('/todo', function(request, response){
  fs.appendFile('./todo.txt' , request.body.task , function () {
    response.json({result: 'ok'});
  })
  console.log('Adding todo...');
  response
          .status(201)
          .json({result: 'ok'});
});

app.delete('/todo/:id(\\d+)' , function (request , response){
  response.json({todo: {id: request.params.id}});
  var task,allTasks;
  var id = request.params.id;
  fs.readFile('./todo.txt', 'utf8', function (error, data) {
    if (error == null) {
      allTasks = data.split(/\n/);
      task = allTasks[id - 1];
      allTasks[id - 1] =allTasks.splice(id,1);

    data = allTasks.join('\n');

    fs.writeFile(__dirname + '/todo.txt', data);
    response.end();
  } else if (error.code == 'ENOENT') {
    console.error('No to-do items yet');
  } else {
    console.error('Error reading to do task');
  }
});
})

app.listen(3000);
