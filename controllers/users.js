//Require the express package and use express.Router()
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const user = require('../models/user');

router.get('/:un?', (req, res) => {
    let uname = req.params.un;
    console.log(`GET\t${uname}`);
    if (typeof uname === 'undefined') {
        user.getAll((err, users) => {
            if (err) {
                res.json({ success: false, message: `Failed to load users. Error: ${err}` });
            }
            else {
                res.json({ success: true, users: users });
                //res.write(JSON.stringify({success: true, users:users},null,2));
                res.end();
            }
        });
    } else {
        user.get({ username: uname }, (err, u) => {
            if (err) {
                res.json({ success: false, message: `Failed to load users. Error: ${err}` });
            }
            else if (!u) {
                res.json({ success: false, message: `Failed to load users. Error: No user with username ${uname}` });
            }
            else {
                res.json({ success: true, user: u });
                res.end();
            }
        });
    }
});
/*var token = jwt.sign(payload, app.get('superSecret'), {
          expiresInMinutes: 1440 // expires in 24 hours
        });*/
router.post('/new', (req, res) => {
    let newUser = new user({
        name: req.body.name,
        email: req.body.email,
        pass: req.body.pass,
        grade: req.body.grade,
        sec: req.body.sec,
        status: req.body.status,
        username: req.body.username
    });
    console.log(`REG\t${newUser}`);
    user.register(newUser, (err, u) => {
        if (err) {
            res.json({ success: false, message: `Failed to create a new user. Error: ${err}\n ${newUser}` });
        }
        else
            res.json({ success: true, message: "Added successfully." });

    });
});
router.post('/edit/:id', (req, res) => {
    let id = req.params.id;
    let update = req.body.update;
    console.log(`UPDATE ${id}`);
    user.edit({ _id: id }, update, (err, updatedUser) => {
        if (err) {
            res.json({ success: false, message: `Failed to update user. Error: ${err}\n ${update}` });
        }
        else if (!updatedUser) {
            res.json({ success: false, message: `Failed to update user. Error: No user with id ${id}` });
        }
        else {
            res.json({ success: true, user: updatedUser });
            res.end();
        }
    })
})
router.delete('/:id', (req, res) => {
    //access the parameter which is the id of the item to be deleted
    let id = req.params.id;
    console.log(`DELETE\t${id}`);
    //Call the model method delete
    user.delete(id, (err, u) => {
        if (err) {
            res.json({ success: false, message: `Failed to delete the user. Error: ${err}` });
        }
        else if (u) {
            res.json({ success: true, message: "Deleted successfully" });
        }
        else
            res.json({ success: false });
    })
});
module.exports = router;