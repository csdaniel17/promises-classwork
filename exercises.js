
// Write a Node script that uses Mongoose's promise support to find a user from the database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/users'); // dummy db

User.findOne({ _id: username })
  .then(function(user) {
    console.log('found user - ', user);
  })
  .catch(function(err) {
    console.error(err.message);
  });


/*
Rewrite the code in wiki.js (below) in promise-based style.

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/wiki');

var Page = mongoose.model('Page', {
  _id: String,
  content: String
});

Page.findById('HomePage', function(err, page) {
  if (err) {
    console.error(err.message);
    return;
  }
  page.content = 'Welcome to my grand wiki!';
  page.save(function(err) {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log('Success!');
  });
});
*/

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/wiki');

var Page = mongoose.model('Page', {
  _id: String,
  content: String
});

Page.findById('HomePage')
  .then(function(page) {
    page.content = 'Welcome to my grand wiki!';
    return page.save();
  })
  .then(function(page) {
    console.log('Success!');
  })
  .catch(function(err) {
    console.error(err.message);
  });

/*
Rewrite the code in register.js (below) in promised-based style

var express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
mongoose.connect('mongodb://localhost/coffee-store');

var User = mongoose.model('User', {
  _id: String,
  encryptedPassword: String
});

var app = express();
app.use(bodyParser.json());

function formatMongooseError(err) {
  var message = err.message + '. ';
  if (err.errors) {
    message +=
      Object.keys(err.errors).map(function(key) {
        return err.errors[key].message
      }).join(' ');
  }
  return message;
}

app.post('/register', function(request, response) {
  var info = request.body;

  // 1. Use bcrypt to encrypt the user's password
  bcrypt.hash(info.password, 10, function(err, encryptedPassword) {
    // 2. Return error response if bcrypt failed
    if (err) {
      var message = formatMongooseError(err);
      response.json({ status: 'fail', error: message });
      return;
    }
    // 3. Create a user in the DB
    User.create({
      _id: info.username,
      encryptedPassword: encryptedPassword
    }, function(err) {
      // 4. Return error response if created failed
      if (err) {
        var message = formatMongooseError(err);
        response.json({ status: 'fail', error: message });
      } else {
        // 5. Return ok response
        response.json({
          status: 'ok'
        });
      }
    });
  });
});

app.listen(3000, function() {
  console.log('Listening on port 3000.');
});
*/

var express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-as-promised');
var bodyParser = require('body-parser');
mongoose.connect('mongodb://localhost/coffee-store');

var User = mongoose.model('User', {
  _id: String,
  encryptedPassword: String
});

var app = express();
app.use(bodyParser.json());

function formatMongooseError(err) {
  var message = err.message + '. ';
  if (err.errors) {
    message += Object.keys(err.errors).map(function(key) {
      return err.errors[key].message;
    }).join(' ');
  }
  return message;
}

app.post('/register', function(req, res) {
  var info = req.body;
  bcrypt.hash(info.password, 10)
    .then(function(encryptedPassword) {
      return User.create({
        _id: info.username,
        encryptedPassword: encryptedPassword
      });
    })
    .then(function() {
      res.json({ "status": "ok" });
    })
    .catch(function(err) {
      var message = formatMongooseError(err);
      res.json({ "status": "fail", "message": message });
    });
});

app.listen(3000, function() {
  console.log('Listening on port 3000.');
});

/*
Rewrite this code is promise-based style.
Hint: replace the fs module with fs-promise

var fs = require('fs');
var marked = require('marked');
fs.readFile('README.md', function(err, buffer) {
  if (err) {
    console.error(err.message);
    return;
  }
  var contents = buffer.toString();
  var html = marked(contents);
  fs.writeFile('README.html', html, function(err) {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log('Wrote README.html');
  });
});
*/

var fs = require('fs-promise');
var marked = require('marked');

fs.readFile('README.md')
  .then(function(buffer) {
    var contents = buffer.toString();
    var html = marked(contents);
    return fs.writeFile('README.md', html);
  })
  .catch(function(err) {
    console.error(err.message);
  });
