const mongoose = require('mongoose')
require('./chat.model')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        select: false
    },
    avatar: String,

    chats: [{
        chat: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'chat'
        },
        isSent: Boolean,
        isRecieved: Boolean,
        isFavorite: Boolean,
        isDeleted: Boolean,
        isDraft: Boolean,
        isRead: { type: Boolean, default: false },
        labels: [String]
    }],

    isActive: {
        type: Boolean,
        default: true
    }
})

const userModel = mongoose.model('user', userSchema)

module.exports = userModel

async function go() {
    require('dotenv').config()
    require('../db').connect()
    let chats2 = await userModel.findOne({ _id: "660d26b92a155d99889d3942" }).populate('chats.chat')
    let { chats } = await chats2.populate('chats.chat.msg')//.populate('chats.chat.to');
    // console.log(chats[0].chat);
    let res = chats.filter(c => c.isRecieved)
    console.log(res);

}
// go()