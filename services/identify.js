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

        const linkedContacts = await findLinkedContactsByPrimaryContactId(primaryContact.id)
        if ((email && primaryContact.email !== email) || (phoneNumber && primaryContact.phoneNumber !== phoneNumber)) {
            await createSecondaryContact(email, phoneNumber, primaryContact.id)
        }

        return {
            statusCode: 200,
            responseData: {
                contact: {
                    primaryContactId: primaryContact.id,
                    emails: [primaryContact.email, ...linkedContacts.map(contact => contact.email)],
                    phoneNumbers: [primaryContact.phoneNumber, ...linkedContacts.map(contact => contact.phoneNumber)],
                    secondaryContactIds: linkedContacts.map(contact => contact.id),
                },
            }
        }
    }catch (err) {
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