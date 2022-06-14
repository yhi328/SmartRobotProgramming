/* MySQL에 어떤 구조로 저장될 것인지 */
var { Sequelize } = require("sequelize")

// 모델 생성
// users 테이블 생성
global.User = sequelize.define("User", {
    id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    }

})
// boards 테이블 생성
global.Board = sequelize.define("Board", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    //제목
    title: Sequelize.STRING,
    //내용
    body: Sequelize.TEXT,
    //작성시간
    writeTime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    viewCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
})
// 사용자(userId)를 작성자(writeUser) 
Board.belongsTo(User, {
    foreignKey: "userId",
    as: "writeUser"
})

// 모델이 바뀌게 되면 alter 옵션으로 바뀌게 함
sequelize.sync({
    alter: true
})