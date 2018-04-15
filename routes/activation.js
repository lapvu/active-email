const router = require('express').Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

router.get('/:token', (req, res) => {
    const token = req.params.token;
    try {
        var decoded = jwt.verify(token, 'mysecret');
        if (!decoded) {
            res.render('error')
        } else {
            const data = fs.readFileSync(path.join(__dirname, '..', '/db/db.json'));
            const db = JSON.parse(data);
            //find index
            const indexRecord = db.findIndex((value, index) => {
                if (value.email == decoded.mail) {
                    return index
                }
            });
            if (!indexRecord) {
                res.render('error')
            } else {
                //set status = active
                db[indexRecord].status = 'active';
                fs.writeFileSync(path.join(__dirname, '..', '/db/db.json'), JSON.stringify(db));
                res.redirect('/email/' + decoded.mail)
            }
        }
    } catch (err) {
        console.log(err)
    }
})

module.exports = router;