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

const createSecondaryContact= async(email, phoneNumber, linkedId)=> {
    return await Contact.create({
        email,
        phoneNumber,
        linkedId,
        linkPrecedence: 'secondary',
    });
}

const findLinkedContactsByPrimaryContactId=async(primaryContactId)=>{
    return await Contact.findAll({
        where: {
            linkedId: primaryContactId,
        },
    });
}


module.exports = {
    findPrimaryContactByEmailOrPhoneNumber,
    createContact,
    findLinkedContactsByPrimaryContactId,
    createSecondaryContact,


};
