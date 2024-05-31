const express = require('express'), router = express.Router();
let userService = require('../services/user.service')



router.get('/', async (req, res) => {
    try {
        let result = await userService.getUser(req.body.user._id)
        res.send(result)
    }
    catch (err) {
        res.status(400).send(err.message)
    }
})

router.get('/users', async (req, res) => {
    try {
        let result = await userService.getUsers(req.body.user._id)
        res.send(result)
    }
    catch (err) {
        res.status(400).send(err.message)
    }
})

module.exports = router