const jwt = require('jsonwebtoken')
const { UserRole } = require("../models/models")

module.exports = function (allowedRoles) {
	return async function (req, res, next) {
		if (req.method === "OPTIONS") {
			next()
		}
		try {
			const token = req.headers.authorization.split(' ')[1]
			if (!token) return res.status(401).json({ message: "Не авторизован" })
			const decoded = jwt.verify(token, process.env.SECRET_KEY)
			console.log(decoded)
			const roleName = await UserRole.findOne({ where: { id: decoded.role_id } })
			if (roleName === null) return res.status(403).json({ message: "Нет доступа" })
			if (!allowedRoles.includes(roleName.role_name)) return res.status(403).json({ message: "Нет доступа" })
			req.user = decoded;
			next()
		} catch (e) {
			console.log(e)
			res.status(401).json({ message: "Не авторизован" })
		}
	};
}
