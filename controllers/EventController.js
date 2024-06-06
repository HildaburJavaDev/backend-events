const APIErrors = require("../errors/APIErrors");
const sequelize = require('../db');
const { UserRole, Event, Producers, UserEventRecords } = require("../models/models");

class EventController {
	async getAll(req, res, next) {
		try {
			const roleName = await UserRole.findOne({ where: { id: req.user.role_id } })
			if (roleName.role_name === 'user') {
				return res.json(await Event.findAll({ where: { registrationIsOpen: true } }))
			} else {
				return res.json(await Event.findAll({ order: [['registrationIsOpen']] }))
			}
		} catch (error) {
			console.log(error)
			next(APIErrors.internalQuery('Error'))
		}
	}

	async createEvent(req, res, next) {
		try {
			const isProducer = await Producers.findOne({ where: { user_id: req.user.id } });
			const userRole = await UserRole.findOne({ where: { id: req.user.role_id } });
			if (!isProducer && userRole.role_name !== 'admin') {
				return res.status(403).json({ message: "Только продюсеры и администраторы могут создавать мероприятия" });
			}
			const { title, description, date, address, isAdult, registrationIsOpen } = req.body;
			const newEvent = await Event.create({
				title: title,
				description: description,
				address: address,
				isAdult: isAdult,
				registrationIsOpen: registrationIsOpen,
				producer_id: req.user.id
			});

			return res.status(201).json(newEvent);
		} catch (error) {
			console.error(error);
			next(APIErrors.internalQuery('Ошибка при создании мероприятия'));
		}
	}

	async getStatsByEvent(req, res, next) {
		try {
			console.log(req.body.id)
			const query = `select 
			count(user_id) as total_users,
			count("isConfirmed") filter (where "isConfirmed" = true) as confirmed_users
		FROM user_event_records
		WHERE event_id = ${req.body.id}
		GROUP BY event_id
		`
			await sequelize.query(query, { type: sequelize.QueryTypes.SELECT }).then(results => {
				res.json(results);
			});
		} catch (error) {
			next(APIErrors.internalQuery('Ошибка при создании мероприятия'));
		}
	}

	async confirmUser(req, res, next) {
		try {
			const { user_id } = req.body;
			const { eventId } = req.params;
			console.log(user_id + " " + eventId)
			await UserEventRecords.update({ isConfirmed: true }, {
				where: {
					user_id,
					event_id: eventId
				}
			});
			return res.status(200).json({ message: 'Статус пользователя подтвержден' });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ message: 'Произошла ошибка при обновлении статуса пользователя' });
		}
	}

	async registerOnEvent(req, res, next) {
		try {
			const existingRecord = await UserEventRecords.findOne({
				where: {
					user_id: req.user.id,
					event_id: req.body.eventId
				}
			});

			if (existingRecord) {
				return res.status(400).json({ message: 'Вы уже зарегистрированы на данное мероприятие' });
			}
			const newUserEventRecord = await UserEventRecords.create({ user_id: req.user.id, event_id: req.body.eventId });
			return res.status(200).json({ message: 'Успешно зарегистрирован', newUserEventRecord });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Ошибка при регистрации на мероприятие' });
		}
	}

	async getMembersForEvent(req, res, next) {
		try {
			const query = `SELECT u.id, firstname, lastname, patronimyc, "phoneNumber", "isConfirmed" FROM user_event_records uer
								JOIN users u ON u.id = uer.user_id
								WHERE event_id = ${req.params.eventId}
								ORDER BY 5`
			await sequelize.query(query, { type: sequelize.QueryTypes.SELECT }).then(results => {
				res.json(results);
			});
		} catch (error) {
			return next(APIErrors.badRequest('Ошибка'))
		}
	}

	async updateMember(req, res, next) {
		try {
			const query = `UPDATE user_event_records
              SET "isConfirmed" = '${req.body.status}'
              WHERE user_id = ${req.body.user_id} AND event_id = ${req.params.eventId}`;
			await sequelize.query(query, { type: sequelize.QueryTypes.UPDATE })
			return res.status(200).json({ message: 'Статус пользователя обновлен' });
		} catch (error) {
			console.log(error.message)
			return next(APIErrors.badRequest('Ошибка'))
		}
	}


	async getOne(req, res, next) {
		try {
			res.json(await Event.findByPk(req.params.eventId))
		} catch (error) {
			console.log(error)
		}
	}

	async updateEvent(req, res, next) {
		try {
			const { id, title, description, address, date, registrationIsOpen } = req.body;
			await Event.update({ title, description, address, date, registrationIsOpen }, { where: { id } });
			res.json({ message: 'Мероприятие успешно обновлено' });
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
		}
	}

	async changeRegistrationOpenned(req, res, next) {
		try {
			const { id, registrationIsOpen } = req.body
			await Event.update({ registrationIsOpen }, { where: { id } })
			res.json({ message: 'Мероприятие успешно обновлено' });
		} catch (error) {
			console.log(error.message)
		}
	}
}

module.exports = new EventController()