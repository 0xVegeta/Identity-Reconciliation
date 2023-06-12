const identityService = require("../services/identify");
const Joi = require("joi")
const handleInput = async(req, res)=>{
    const { email, phoneNumber } = req.body
    if(!email && !phoneNumber){
        return res.status(400).json({
            error: "Both phone number and email can't be zero"
        })
    }

    //validation of email and phone numbers
    const schema = Joi.object({
        email: Joi.string().email().required().allow(null),
        phoneNumber: Joi.string().required().allow(null).pattern(/^[0-9]{6,14}$/,
            'Phone number must be a string of 6 to 14 digits.')
    })

    const { error } = schema.validate({ email, phoneNumber });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
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