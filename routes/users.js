const express = require('express');
const userInteractor = require('../interactors/userInteractor');
const tryCatch = require('../utils/tryCatch');


const router = express.Router();
/* GET users listing. */
router.post('/',
    tryCatch(async (req, res) => {
        console.log(req.body);
        const newUser = await userInteractor.createUser(req.body);
        return res.send({_id: newUser._id});
    }));

module.exports = router;
