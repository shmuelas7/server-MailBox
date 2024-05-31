const userController = require('../DL/controllers/user.controller')
//const messageController = require('../DL/controllers/message.controller')
const chatController = require('../DL/controllers/chat.controller')
const { Flags } = require('../utility');
const chatModel = require('../DL/models/chat.model');



let funcs = {
    inbox: [Flags.Inbox],
    notread: [Flags.NotRead],
    sent: [Flags.Sent],
    favorite: [Flags.Favorite],
    deleted: [Flags.Deleted],
    draft: [Flags.Draft],
}

async function getUnReadMess(userId, flag) {
    let chats = await userController.readOne({ _id: userId }, { chats: true });
    let data = {
        inbox: 0,
        sentEmails: 0,
        Favorite: 0
    }
    chats.chats.forEach((value) => {
        if (!value.isRead && value.isRecieved) {
            data.inbox++;
            if (value.isFavorite) data.Favorite++;
        }
    })

    console.log(data)
    return data
}
async function getChats(userId, flag) {
    flag = flag.toLowerCase()
    if (!funcs[flag]) throw ""
    let { chats } = await userController.readByFlags(userId, funcs[flag], { chats: true, users: true });
    return chats
}


async function getChatsById(chatId) {
    let chats = await chatController.readOne({ _id: chatId }, { users: true });
    return chats
}




async function updateReadChat(userId, chatId, flags) {
    let user = await userController.readOne({ _id: userId }, { chats: true });
    let fieldToUpdate = Object.keys(flags)
    fieldToUpdate = fieldToUpdate[0]
    user.chats.find(c => c.chat._id == chatId)[fieldToUpdate] = flags[fieldToUpdate]
    userController.save(user)
    return user

}


async function addMessage(userId, data) {
    console.log("addMessage")
    let msg = {
        from: userId,
        content: data.content,
    }
    let chat = await chatController.update({ _id: data.chatId }, {
        $push: {
            msg: msg,
        },
    }, { new: true });
    chat.members.forEach((value) => {
        if (value != userId)
            updateReadChat(value, data.chatId, { isRead: false })
    })
    return chat;
}

async function createMessage(userId, data) {
    console.log("createMessage")

    let chat = await chatController.create(data);
    let chatId = chat._id

    console.log(chatId)
    for (let user of chat.members) {
        let getUser = await userController.readOne({ _id: user }, { chats: true, users: true });
        for (let idChat of getUser.chats) {
            if (!idChat.chat.equals(chatId)) {
                let newChat = await userController.update({ _id: user }, {
                    $push: {
                        chats: {
                            chat: chatId,
                            isRecieved: true,
                            isRead: false,
                            labels: []
                        }
                    }
                });
            }
        }

    }
    return chat;
}

async function search(userId, search) {
    let getUser = await userController.readOne({ _id: userId }, { chats: true, users: true });
    console.log(search)
    let chats = getUser.chats.filter((value) => (
        value.chat.subject.includes(search) ||
        value.chat.members.some(s => s.fullName.includes(search)) ||
        value.chat.msg.some(s => s.content.includes(search))
    ))
    // value.forEach(async (chat) => {
    //     let find = await chatController.readOne(_id = chat._id);
    //     console.log(find + "11")
    // })

    return chats
}


module.exports = { getChats, updateReadChat, getChats, addMessage, createMessage, getUnReadMess, search, getChatsById }