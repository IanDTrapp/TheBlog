// Module dependencies
var express = require('express');
var stylus = require('stylus');
var nib = require('nib');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var stormpath = require('express-stormpath');

mongodb.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if (err) throw err;
    console.log("Connected to Database");

    var app = express();

    app.use(stormpath.init(app, {
        apiKeyFile: process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/.stormpath/apiKey.properties',
        secretKey: 'Thisisarandomlongstring',
        application: 'https://api.stormpath.com/v1/applications/7TehGJ4mHJUasfgNbZLfBM',
    }));

    function compile(str, path) {return stylus(str).set('filename', path).use(nib());
    }
    // Setting middleware
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.logger('dev'));
    app.use(stylus.middleware({ src: __dirname + '/public', compile: compile}));
    app.use(express.static(__dirname + '/public'));
    app.use(bodyParser.urlencoded({ extended: false}));
    app.use(bodyParser.json());

    var _1title, _2title, _3title, _4title, _5title;
    var _1content, _2content, _3content, _4content, _5content;
    var im1, im2, im3, im4, im5;
    var d1, d2, d3, d4, d5;

    // Renders home page and displays most recent DB posts
    app.get('/', function (req, res, next) {
        db.collection('test').find().toArray(function(err, items) {
            if (err) throw err;
            items.reverse();
            var num = db.collection('test').count();

            _1title = items[0].title.toString();
            _1content = items[0].content.toString();
            if(items[0].img) {
                im1 = items[0].img.toString();
            }


            _2title = items[1].title.toString();
            _2content = items[1].content.toString();
            if(items[1].img) {
                im2 = items[1].img.toString();
            }


            _3title = items[2].title.toString();
            _3content = items[2].content.toString();
            if(items[2].img) {
                im3 = items[2].img.toString();
            }


            _4title = items[3].title.toString();
            _4content = items[3].content.toString();
            if(items[3].img) {
                im4 = items[3].img.toString();
            }


            _5title = items[4].title.toString();
            _5content = items[4].content.toString();
            if(items[4].img) {
                im5 = items[4].img.toString();
            }


            res.render('index', {tit1: _1title, con1: _1content,
                tit2: _2title, con2: _2content, tit3: _3title,
                con4: _3content, tit4: _4title, con4: _4content,
                tit5: _5title, con5: _5content, user: req.user,
                img1: im1, img2: im2, img3: im3, img4: im4,
                img5: im5, title: 'Welcome!'
            })
        })
    })

    // Renders
    app.get('/posts', stormpath.loginRequired, function(req, res) {
        res.render('postpage', {title : 'Post Something!'})
    })

    app.get('/successful', function(req, res) {
        res.render('succpage', {title : 'Post Successful!' })
    })
    app.get('/about', function(req, res) {
        res.render('about', { title : 'About Me'})
    })
    app.get('/newuser', function(req, res) {
        res.render('newuser', {title : 'Create Account'})
    })
    app.get('/login', function(req, res) {
        res.render('login', {title : 'Login'})
    })
    app.get('/accessdenied', function(req, res) {
        res.render('accessdenied', {title : 'Uh oh!'})
    })

    // Handle Post Request for a new article
    app.post('/posts', function(req, res) {
        var title = req.body.title;
        var content = req.body.content;
        var img = req.body.img;
        var document = {title: title, content: content, img: img};
        db.collection('test').insert(document, function(err, records) {
            if (err) throw err;
        })
        console.log("Post received: \nTitle:\n%s\nContent:\n%s\nImage Link:\n%s\n", title, content, img);
        res.render('succpage', { title : 'Post successful!' })
    })

    // Handle Post Request for register user
    app.listen(3000);
    console.log("Listening on port 3000");
})