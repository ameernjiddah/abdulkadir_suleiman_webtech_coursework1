module.exports = {
    sendError: (res, error) => {
        console.log(error);
        res.status(error.code || 400).send(error);
    },
    sendRawError: (res, error) => {
        console.log(error);
        res.status(error.code || 400).send(error);
    }
}