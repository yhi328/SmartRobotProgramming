var hello = require("./test2.js")
hello.name = "윤혜인"
hello.hello()
hello.test(function () {
    console.log("콜백 호출됨")
})