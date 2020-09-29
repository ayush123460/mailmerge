const express = require('express')
const { google } = require('googleapis')

const router = express.Router()

const gAuth = new google.auth.OAuth2(
    process.env.GGL_ID,
    process.env.GGL_SECRET,
    process.env.GGL_RED_URI
)

google.options({
    auth: gAuth
})

const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.send'
]

router.get('/getOauthUrl', (req, res) => {
    const authUri = gAuth.generateAuthUrl({
        access_type: 'offline',
        scope: scopes.join(' ')
    })

    res.json({
        uri: authUri
    })
})

module.exports = router
