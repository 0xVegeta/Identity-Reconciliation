const { DataTypes, Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.SEQUELIZE_DATABASE_URI)

const Contact = sequelize.define('Contact', {
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    linkedId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    linkPrecedence: {
        type: DataTypes.ENUM('primary', 'secondary'),
        defaultValue: 'secondary',
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

module.exports = Contact;
