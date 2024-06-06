const Router = require('express')
const router = new Router()

const eventRouter = require('./EventRouter')
const userRouter = require('./UserRouter')

router.use('/user', userRouter)
router.use('/events', eventRouter)

module.exports = router