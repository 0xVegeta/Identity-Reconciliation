const {
    findContactByEmailOrPhoneNumber,
    createContact,
    findLinkedContactsByPrimaryContactId,
    createSecondaryContact,
    findContactById
} = require('./modelServices');
const processIdentification = async({requestData})=>{
    try {
        const {email, phoneNumber} = requestData
        // Find primary contact based on email or phoneNumber

        let primaryContact = await findContactByEmailOrPhoneNumber({email, phoneNumber, contactType: 'primary'})
        if (!primaryContact) {
            const secondaryContact = await findContactByEmailOrPhoneNumber({email, phoneNumber, contactType: 'secondary'})
            // Check if a secondary contact is present for the given contact details
            if(secondaryContact){
                primaryContact = await findContactById({contactId: secondaryContact.linkedId, contactType: 'primary'})
            }else{
                // If no primary or secondary contact found, create a new primary contact
                if(!email || !phoneNumber) {
                    return {
                        statusCode: 400,
                        responseData:{
                            errorMsg: "Email or phone number can't be null for creating a new contact"
                        }
                    }
                }
                primaryContact = await createContact(email, phoneNumber)
                return {
                    statusCode: 200,
                    responseData: {
                        contact: {
                            primaryContactId: primaryContact.id,
                            emails: [primaryContact.email],
                            phoneNumbers: [primaryContact.phoneNumber],
                            secondaryContactIds: [],
                        },
                    }
                }

            }

        }

        let linkedContacts = await findLinkedContactsByPrimaryContactId(primaryContact.id)
        const existingSecondaryContact = linkedContacts.find(
            contact => (contact.email === email && contact.phoneNumber === phoneNumber)
        )
        if(existingSecondaryContact){
            return {
                statusCode: 200,
                responseData: {
                    contact: {
                        primaryContactId: primaryContact.id,
                        emails: [...new Set([primaryContact.email, ...linkedContacts.map(contact => contact.email)])],
                        phoneNumbers: [...new Set([primaryContact.phoneNumber, ...linkedContacts.map(contact => contact.phoneNumber)])],
                        secondaryContactIds: linkedContacts.map(contact => contact.id),
                    },
                }
            }
        }
        if ((primaryContact.email !== email) || (primaryContact.phoneNumber !== phoneNumber)) {
            if(email && phoneNumber) {
                await createSecondaryContact(email, phoneNumber, primaryContact.id)
                linkedContacts = await findLinkedContactsByPrimaryContactId(primaryContact.id)
            }
        }

        return {
            statusCode: 200,
            responseData: {
                contact: {
                    primaryContactId: primaryContact.id,
                    emails: [...new Set([primaryContact.email, ...linkedContacts.map(contact => contact.email)])],
                    phoneNumbers: [...new Set([primaryContact.phoneNumber, ...linkedContacts.map(contact => contact.phoneNumber)])],
                    secondaryContactIds: linkedContacts.map(contact => contact.id),
                },
            }
        }
    }catch (err) {
        console.log('check err', err.stack)
        return {
            statusCode: 500,
            responseData: {
                errorMsg: err
            }
        }
    }
}

module.exports = {
    processIdentification
}