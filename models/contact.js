const { DataTypes, Sequelize } = require('sequelize')
const dotenv = require('dotenv');
dotenv.config({path: `.env`});

const sequelize = new Sequelize(process.env.SEQUELIZE_DATABASE_URI, {
    dialect: 'postgres',
})

sequelize
    .authenticate()
    .then(() => {
        console.log('Database Connection Has Been Established Successfully.');
    })
    .catch(err => {
        console.log(`Unable To Connect To The Database : ${err}`);
    });

const Contact = sequelize.define('Contact', {
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'uniquePhoneNumberEmailCombo',
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'uniquePhoneNumberEmailCombo',
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
}, {
    indexes: [
        {
            unique: true,
            fields: ['phoneNumber', 'email'],
            name: 'uniquePhoneNumberEmailCombo',
        },
    ],
});

Contact.belongsTo(Contact, {
    foreignKey: 'linkedId',
});

module.exports = Contact;
