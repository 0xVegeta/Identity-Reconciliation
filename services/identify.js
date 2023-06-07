const {
    findPrimaryContactByEmailOrPhoneNumber,
    createContact,
} = require('./modelServices');
const processIdentification = async({requestData})=>{
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

}

module.exports = {
    processIdentification
}