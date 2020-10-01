const express = require('express')
const path = require('path')
const { google } = require('googleapis')
const axios = require('axios')

const { codeSchema } = require('./schema')

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
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.send'
]

router.get('/getOauthUrl', (req, res, next) => {
    const authUri = gAuth.generateAuthUrl({
        access_type: 'offline',
        scope: scopes.join(' ')
    })

    res.json({
        uri: authUri
    })
})

router.get('/callback', async (req, res, next) => {
    try {
        const code = req.query.code
        console.log(code)
        const { tokens } = await gAuth.getToken(code)
        gAuth.setCredentials(tokens)
        console.log(tokens)

        const res2 = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + tokens.access_token)

        const service = google.gmail('v1')

        const subject = `=?utf-8?B?${Buffer.from('Placements Mis-use').toString('base64')}?=`

        const messageParts = [
            `From: Dr. Samuel L. Rajkumar <${res2.data.email}>`,
            'To: Mohit BEACH <mohi.dxb+ayushsucks@gmail.com>',
            'Content-Type: text/html; charset=utf-8',
            'MIME-Version: 1.0',
            `Subject: ${subject}`,
            '',
            'HAHAHA gottem',
            'Sent from Mail Merge, v0.8.0'
        ]

        const msg = messageParts.join('\n')

        const em = Buffer.from(msg).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

        const repl = await service.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: em,
            }
        })

        console.log(repl.data)


        res.json({
            result: res2.data,
            gmail: repl.data
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router
