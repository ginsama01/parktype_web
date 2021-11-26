const { dbConnect, DataTypes, Deferrable } = require('../connectDB');


const Owner = dbConnect.define('owner', {
    own_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER
    },
    ssid: {
        type: DataTypes.BIGINT(12)
    },
    isactivated: {
        type: DataTypes.TINYINT,
        allowNull: false
    }, 
}, {
    freezeTableName: true
});


// dbConnect.sync().then(() => {
//     console.log('Owner model sync ok');
// }).catch(e => console.error(e));

module.exports = Owner;