
async function auth(req, res, next) {
    try {
        req.body.user = { _id: "661fd4d92cfd84c1dfdbb7a6" }
        next()
    }
    catch {
        res.sendStatus(401);
    }
}

module.exports = { auth }