const sgEmail = require('@sendgrid/mail')

sgEmail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgEmail.send({
        to: email,
        from: 'karanparwani.parwani102@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app`
    })
}

const sendCancelEmail = (email, name) => {
    sgEmail.send({
        to: email,
        from: 'karanparwani.parwani102@gmail.com',
        subject: 'Account removed',
        text: `${name} your account has been removed`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}