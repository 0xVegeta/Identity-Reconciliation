const {
    findPrimaryContactByEmailOrPhoneNumber,
    createContact,
    findLinkedContactsByPrimaryContactId,
    createSecondaryContact
} = require('./modelServices');
const processIdentification = async({requestData})=>{
    try {
        const {email, phoneNumber} = requestData
        // Find primary contact based on email or phoneNumber

        let primaryContact = await findPrimaryContactByEmailOrPhoneNumber(email, phoneNumber)
        if (!primaryContact) {

            // If no primary contact found, create a new primary contact
            if(!email || !phoneNumber) {
                return {
                    statusCode: 400,
                    responseData:{
                        errorMsg: "Email or phone number can't be null for creating a new contact"
                    }
                }
            }
            primaryContact = await createContact(email, phoneNumber);
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
        if ((email && primaryContact.email !== email) || (phoneNumber &&primaryContact.phoneNumber !== phoneNumber)) {
                await createSecondaryContact(email, phoneNumber, primaryContact.id)
                linkedContacts = await findLinkedContactsByPrimaryContactId(primaryContact.id)
        }
        const contacts = Array.from(new Set([primaryContact.phoneNumber, ...linkedContacts.map(contact => contact.phoneNumber)]))
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