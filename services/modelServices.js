const Contact = require('../models/contact')
const { Sequelize } = require('sequelize');

const findPrimaryContactByEmailOrPhoneNumber= async(email, phoneNumber)=> {
    return await Contact.findOne({
        where: {
            [Sequelize.Op.or]: [{ email }, { phoneNumber }],
            linkPrecedence: 'primary',
        },
    })
}

const createContact= async(email, phoneNumber)=> {
    return await Contact.create({
        email,
        phoneNumber,
        linkPrecedence: 'primary',
    });
}


module.exports = {
    findPrimaryContactByEmailOrPhoneNumber,
    createContact,
};
