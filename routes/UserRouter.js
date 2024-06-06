const Router = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const router = new Router()

const userController = require('../controllers/UserController')

router.post('/signup', userController.registration)
router.post('/signup/employee', checkRoleMiddleware(['admin']), userController.registrationEmployee)
router.post('/signin', userController.login)
router.get('/getbyid', authMiddleware, userController.getUserById)
router.put('/update', authMiddleware, userController.update)
router.get('/employeeroles', authMiddleware, userController.getRoles)

module.exports = router