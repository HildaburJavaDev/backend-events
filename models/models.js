const sequelize = require('../db')
const { DataTypes, EmptyResultError, DATE } = require('sequelize')

const User = sequelize.define('users', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	firstname: { type: DataTypes.STRING, allowNull: false },
	lastname: { type: DataTypes.STRING, allowNull: false },
	patronimyc: { type: DataTypes.STRING },
	email: { type: DataTypes.STRING, allowNull: false },
	password: { type: DataTypes.STRING, allowNull: false },
	phoneNumber: { type: DataTypes.STRING, allowNull: false },
}, {
	timestamps: false,
	freezeTableName: true
})

const UserRole = sequelize.define('user_role', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	role_name: { type: DataTypes.STRING, allowNull: false },
}, {
	timestamps: false,
	freezeTableName: true
}, {
	timestamps: false,
	freezeTableName: true
})

const Event = sequelize.define('event', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	title: { type: DataTypes.STRING, allowNull: false },
	description: { type: DataTypes.STRING },
	address: { type: DataTypes.STRING, allowNull: false },
	isAdult: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
	registrationIsOpen: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
	date: { type: DataTypes.DATE }
}, {
	timestamps: false,
	freezeTableName: true
})

const Producers = sequelize.define('producers', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	title: { type: DataTypes.STRING, allowNull: false },
	phoneNumber: { type: DataTypes.STRING },
	email: { type: DataTypes.STRING, allowNull: false }
}, {
	timestamps: false,
	freezeTableName: true
})

const UserEventRecords = sequelize.define('user_event_records', {
	isConfirmed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, {
	timestamps: false,
	freezeTableName: true
})

UserEventRecords.belongsTo(User, { foreignKey: 'user_id' });
UserEventRecords.belongsTo(Event, { foreignKey: 'event_id' });

Producers.hasMany(Event, { foreignKey: 'producer_id' });

User.belongsTo(UserRole, { foreignKey: 'role_id' })

Producers.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
	User,
	UserRole,
	Producers,
	UserEventRecords,
	Event
}