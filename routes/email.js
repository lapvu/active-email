const router = require('express').Router();
const fs = require('fs');
const path = require('path');
router.get('/:id', (req, res) => {
    const data = fs.readFileSync(path.join(__dirname, '..', '/db/db.json'));
    const db = JSON.parse(data);
    const emailRecord = db.find(value => value.email == req.params.id);
    if (emailRecord) {
        res.render('email', {
            emailRecord: emailRecord
        })
    } else {
        res.render('error')
    }
});

module.exports = router;