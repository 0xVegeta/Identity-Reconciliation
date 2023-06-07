const identityService = require("../services/identify");
const handleInput = async(req, res)=>{
    const { email, phoneNumber } = req.body
    return identityService.processIdentification({
        requestData: {email, phoneNumber}
    })
        .then(({ statusCode, responseData }) => {
            return res.status(statusCode).json(responseData)
        })
        .catch(err => {
            return res.status(500).json({errMsg: err})
        })
}

module.exports = {
    handleInput
}