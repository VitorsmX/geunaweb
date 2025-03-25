"use server"

function validateEventId(eventId: string) {
    const storedEventID = process.env.EVENT_ID!
    const isValid = storedEventID === eventId.toString()
    console.log(isValid)
    return isValid;
}

export default validateEventId;