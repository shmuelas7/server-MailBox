const express = require('express'),
    router = express.Router();
let chatService = require('../services/chat.service')


router.get('/not-read', async (req, res) => {
    try {
        let result = await chatService.getUnReadMess(req.body.user._id)
        res.send(result)
    }
    catch (err) {
        res.status(400).send(err.message)
    }
})
router.get('/search', async (req, res) => {
    try {
        console.log(req.query.search)
        let result = await chatService.search(req.body.user._id, req.query.search)
        res.send(result)
    }
    catch (err) {
        res.status(400).send(err.message)
    }
})


router.get('/chats/:chatId', async (req, res) => {
    try {
        // console.log(req.params.chatId)
        let result = await chatService.getChatsById(req.params.chatId)
        res.send(result)

    }
    catch (err) {
        res.status(400).send(err.message)
    }
})

router.get('/flag/:flag', async (req, res) => {
    try {

        let result = await chatService.getChats(req.body.user._id, req.params.flag)
        res.send(result)

    }
    catch (err) {
        res.status(400).send(err.message)
    }
})


router.put('/:chatId', async (req, res) => {
    try {
        console.log("update chat")
        let result = await chatService.updateReadChat(req.body.user._id, req.params.chatId, req.body)
        res.send(result)
    }
    catch (err) {
        res.status(400).send(err.message)
    }
})



router.post('/createMessage', async (req, res) => {
    try {
        let result = await chatService.createMessage(req.body.user._id)
        res.send(result)
    }
    catch (err) {
        res.status(400).send(err.message)
    }
})

router.post('/addMessage', async (req, res) => {
    try {
        let result = await chatService.addMessage(req.body.user._id, req.body)
        res.send(result)
    }
    catch (err) {
        res.status(400).send(err.message)
    }
})





module.exports = router