var Todo = require('./models/todo');
var User = require('./models/user');

function getTodos(res) {
    Todo.find(function (err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(todos); // return all todos in JSON format
    });
};



module.exports = function (app) {
    
    // Accueil------------------------------------------------------------------
    app.get('/', function(req, res) {
        res.render('index');
    });

    //Page Todolist-------------------------------------------------------------
    app.get('/todo.html', function(req, res) {
        res.render('todo');
    });
    //Page Settings-------------------------------------------------------------
    app.get('/settings.html', function(req, res) {
        res.render('settings');
    });
    //Page Crédits-------------------------------------------------------------
    app.get('/credits.html', function(req, res) {
        res.render('credits');
    });
    //Page Chat-------------------------------------------------------------
    app.get('/chat.html', function(req, res) {
        res.render('chat');
    });
    // signup ------------------------------------------------------------------
    app.get('/signup.html', function(req, res) {
        res.render('signup');
    });

    app.post('/signup.html', function (req, res) {
        var user = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        };
        
        User.create(user, function(err, User) {
            if(err) 
                 res.send('erreur.html');
        });
        res.redirect('/');
    });

    //login----------------------------------------------------------------------
    app.get('/login.html', function(req, res) {
        res.render('login');
    });

    app.post('/login.html', function (req, res) {
        var user = {
            username: req.body.username,
            password: req.body.password,
        };
        
        User.create(user, function(err, User) {
            if(err) 
                 res.send(err);
            //return res.send('Logged In!');
        });
        res.redirect('/');
    });

    

    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/todos', function (req, res) {
        // use mongoose to get all todos in the database
        getTodos(res);
    });

    // create todo and send back all todos after creation
    app.post('/api/todos', function (req, res) {

        // create a todo, information comes from AJAX request from Angular
        Todo.create({
            text: req.body.text,
            done: false
        }, function (err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            getTodos(res);
        });

    });

    
    // delete a todo
    app.delete('/api/todos/:todo_id', function (req, res) {
        Todo.remove({
            _id: req.params.todo_id
        }, function (err, todo) {
            if (err)
                res.send(err);

            getTodos(res);
        });
    });

    // application -------------------------------------------------------------
    /*app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/todo.html'); // load the single view file (angular will handle the page changes on the front-end)
    });*/
};
