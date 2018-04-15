var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'home' });
});

router.post('/', (req, res, next) => {
  const email = req.body.email;
  const data = fs.readFileSync(path.join(__dirname, '..', '/db/db.json'));
  const db = JSON.parse(data);
  const emailRecord = db.find(value => value.email == email);
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'egvn001@gmail.com',
      pass: '123456vn'
    }
  });
  var token = jwt.sign({ mail: email }, 'mysecret');
  var mailOptions = {
    from: 'egvn001@gmail.com',
    to: email,
    subject: 'active email',
    html: '<p>Follow this </p><a href="https://active-email.herokuapp.com/activation/' + token + '">link</a>'
  };
  if (emailRecord) {
    res.redirect('/email/' + email)
  } else {
    const newEmail = {
      "email": email,
      "status": "not active"
    }
    db.push(newEmail);
    fs.writeFileSync(path.join(__dirname, '..', '/db/db.json'), JSON.stringify(db));
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        res.redirect('/email/' + email)
      }
    });
  }
})


module.exports = router;
