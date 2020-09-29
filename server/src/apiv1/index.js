const express = require('express')

const router = express.Router()

const auth = require('./auth')

router.get('/', (req, res) => {
    res.json({
        message: 'Mail Merge API v1.0'
    })
})

router.use('/auth', auth)

module.exports = router
