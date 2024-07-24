const userController = require('../DL/controllers/user.controller')

async function getUser(userId) {
    console.log("getChats")
    let ret = "fullName email avatar _id"
    let user = await userController.readOne({ _id: userId }, { chats: false, users: false }, ret);
    return user;
}

async function getUsers() {
    console.log("getUsers")
    let res = await userController.read({}, "fullName avatar")
    return res;
}

async function login(loginData) {
    const password = loginData.password;
    const email = loginData.email;
    console.log(password + " " + email);
    const user = await userController.readOne({ email: email }, "+password");
    if (!user) throw { code: 404, message: "User does not exist" };
    if (user.password !== password)
        throw { code: 401, message: " Username or password incorrect" };
    //bcrypt.compare
    const token = jwtFn.createToken(user._id);
    return token;
}

async function register(data) {
    const { email, password, firstName, lastName } = data;

    if (!email || !password || !firstName || !lastName)
        throw { code: 400, message: "missing data" };

    const existUser = await userController.readOne({ email });
    console.log(existUser);
    if (existUser) throw { code: 409, message: "User already exist" };

    const user = await userController.create(data);
    const token = jwtFn.createToken(user._id);
    return token;
}

async function update(id, newData) {
    const updatedUser = await userController.update({ _id: id }, newData);
    return updatedUser;
}

async function del(id) {
    const deletedUser = await userController.del({ _id: id });
    return deletedUser;
}

module.exports = { getUser, login, register, update, del, getUsers }