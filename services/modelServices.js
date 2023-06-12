const Contact = require('../models/contact')
const { Sequelize } = require('sequelize');

const findContactByEmailOrPhoneNumber= async({email, phoneNumber, contactType})=> {
    return await Contact.findOne({
        where: {
            [Sequelize.Op.or]: [{ email }, { phoneNumber }],
            linkPrecedence: contactType,
        },
    })
}

const findContactByEmailAndPhoneNumber= async({email, phoneNumber, contactType})=> {
    return await Contact.findOne({
        where: {
            [Sequelize.Op.and]: [{ email }, { phoneNumber }],
            linkPrecedence: contactType,
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
    })
}

const findContactById = async ({contactId, contactType}) => {
    return await Contact.findOne({
            where: {
                id: contactId,
                linkPrecedence: contactType,
            },
    })
}

const updateContact = async({ contactId, contactType,primaryContactId })=>{
    return await Contact.update(
        {
            linkPrecedence: contactType,
            linkedId: primaryContactId
        },
        {where: {id: contactId}}
    )
}


module.exports = {
    findContactByEmailOrPhoneNumber,
    findContactByEmailAndPhoneNumber,
    createContact,
    findLinkedContactsByPrimaryContactId,
    createSecondaryContact,
    findContactById,
    updateContact
};
