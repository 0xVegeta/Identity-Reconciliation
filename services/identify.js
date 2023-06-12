const {
    findContactByEmailOrPhoneNumber,
    findContactByEmailAndPhoneNumber,
    createContact,
    findLinkedContactsByPrimaryContactId,
    createSecondaryContact,
    findContactById,
    updateContact
} = require('./modelServices');
const processIdentification = async({requestData})=>{
    try {
        const {email, phoneNumber} = requestData
        // Find primary contact based on email or phoneNumber
        let primaryContact = await findContactByEmailOrPhoneNumber({email, phoneNumber, contactType: 'primary'})
        let primaryContactUpdated = false
        //Check if details provided are from two different primary contacts
        if((email && phoneNumber && primaryContact) && (email!==primaryContact.email || phoneNumber !== primaryContact.phoneNumber)){
            // const existingContact = await findContactByEmailAndPhoneNumber({email, phoneNumber})
            const existingPrimaryMailContact = await findContactByEmailOrPhoneNumber({email, phoneNumber:null, contactType: 'primary'})
            const existingPrimaryPhoneContact = await findContactByEmailOrPhoneNumber({email:"", phoneNumber, contactType: 'primary'})
            if(existingPrimaryMailContact && existingPrimaryPhoneContact) {
                let intendedContact, originalContact
                if (new Date(existingPrimaryMailContact).getTime() < new Date(existingPrimaryPhoneContact).getTime()) {
                    intendedContact = existingPrimaryPhoneContact
                    originalContact = existingPrimaryMailContact
                } else {
                    originalContact = existingPrimaryPhoneContact
                    intendedContact = existingPrimaryMailContact
                }

                primaryContactUpdated = true
                await updateContact({
                    contactId: intendedContact.id, primaryContactId: originalContact.id, contactType: 'secondary'
                })
                primaryContact = originalContact
            }

        }
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
                            error: "Email or phone number can't be null for creating a new contact"
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
        if ((primaryContact.email !== email) || (primaryContact.phoneNumber !== phoneNumber)) {
            if(email && phoneNumber && !primaryContactUpdated) {
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
        return {
            statusCode: 500,
            responseData: {
                error: err
            }
        }
    }
}

module.exports = {
    processIdentification
}