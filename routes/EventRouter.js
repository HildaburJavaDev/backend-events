const Router = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const router = new Router()

const eventController = require('../controllers/EventController')

router.get('/', authMiddleware, eventController.getAll)
router.get('/:eventId/members', authMiddleware, eventController.getMembersForEvent)
router.patch('/:eventId/', authMiddleware, eventController.updateMember)
router.patch('/', authMiddleware, eventController.updateEvent)
router.patch('/changeregister', authMiddleware, eventController.changeRegistrationOpenned)
router.post('/create', authMiddleware, eventController.createEvent)
router.post('/reg', authMiddleware, eventController.registerOnEvent)
router.post('/:eventId/confirmUser', checkRoleMiddleware(['admin', 'employee']), eventController.confirmUser)
router.post('/getstats', authMiddleware, eventController.getStatsByEvent)
module.exports = router