const Dev = require('../model/Dev')
module.exports = {
    async store(req, res) {

        console.log(req.io, req.connectedUsers);

        const { user } = req.headers;
        const { devId } = req.params;

        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(devId);

        if (!targetDev) {
            return res.status(400).json({ error: 'Dev no exists' });
        }

        if (targetDev.likes.includes(loggedDev._id)) {
            console.log("DEU MACTH!");
            const loggedSocket = req.connectedUsers[user];
            const targetSocket = req.connectedUsers[devId];

            if(loggedSocket){
                req.io.to(loggedSocket).emit('macth',targetDev);
            }

            if(targetSocket){
                req.io.to(targetSocket).emit('macth',loggedDev);
            }
        }

        loggedDev.likes.push(targetDev._id);

        await loggedDev.save();

        return res.json(loggedDev)
    }
}