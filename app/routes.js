var Todo = require('./models/todo');
var User = require('./models/user');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
var LocalStrategy   = require('passport-local').Strategy;


function getTodos(res) {
    Todo.find(function (err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(todos); // return all todos in JSON format
    });
};

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login')
}


module.exports = function (app, passport) {
    
    // Accueil------------------------------------------------------------------
    app.get('/', isAuthenticated, function(req, res) {
        res.render('index', {user : req.user});
    });

    //Page Todolist-------------------------------------------------------------
    app.get('/todo', isAuthenticated, function(req, res) {
        res.render('todo', {user : req.user});
    });

    //Page Settings-------------------------------------------------------------
    app.get('/settings', isAuthenticated, function(req, res) {
        res.render('settings', {user : req.user});
    });

    app.post('/update', function(req, res) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(req.body.password, salt, function(err, hash) {
                if (req.body.ancienmdp = req.user.password) {
                    User.findOneAndUpdate({username: req.user.username}, 
                        {password: hash}, function(err, user) {})
                    console.log('Password Updated');
                    res.redirect('/');
                }
            });
        });
    });

    //Page Crédits-------------------------------------------------------------
    app.get('/credits', function(req, res) {
        res.render('credits', {
            user : req.user
        });
    });
    //Page Chat-------------------------------------------------------------
    app.get('/chat', isAuthenticated, function(req, res) {
        res.render('chat', {
            user : req.user
        });
    });
    // signup ------------------------------------------------------------------
    app.get('/signup', function(req, res) {
        res.render('signup');
    });

    app.post('/signup', function (req, res) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(req.body.password, salt, function(err, hash) {
                var user = {
                    username: req.body.username,
                    email: req.body.email,
                    password: hash
                };

                User.create(user, function(err, User) {
                    if(err) 
                        res.send('erreur.html');
                });
                res.redirect('/');
            })
        });
    });

    //login----------------------------------------------------------------------
    app.get('/login', function(req, res) {
        res.render('login', {message: req.flash('message')});
    });

    app.post('/login', passport.authenticate('login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash : true
    }));

    //logout--------------------------------------------------------------------
    app.get('/logout', function(req, res) {
      req.logout();
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
};
