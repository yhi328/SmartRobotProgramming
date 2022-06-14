/* DB에 있는 배열 형태로 작성한 글을 boardList에 담아서 json 형태로 가져옴 */
var express = require('express');
var router = express.Router();

// 새 글을 작성하면 boards 테이블에서 userId를 확인할 수 있음
router.post("/write", async function (req, res) {
    if (req.session.user) {
        req.body.userId = req.session.user.id
    }
    await Board.create(req.body)
    res.json({
        result: "ok"
    })
})
var Pager = require("node-jyh-pager")
var pager = new Pager({
    itemPerPage: 5
})

router.post("/list", async function (req, res) {

    // 가장 최신 글이 첫 번째로 나오도록 함
    var page = req.body.page
    if (!page) {
        page = 1
    }
    // 한 페이지에 게시글(item)이 5개까지 나오도록 함
    var itemPerPage = 5
    var offset = pager.getSkip(page)
    var boardList = await Board.findAll({
        include: {
            model: User,
            as: "writeUser"
        },
        limit: itemPerPage,
        offset: offset,
        order: [["writeTime", "DESC"]]
    })
    var count = await Board.count()   // select count(*) from Boards
    var nav = pager.getBottomNav(page, count)
    var pageCount = nav.totalPage
    res.json({
        boardList: boardList,
        pageCount: pageCount
    })
})
// 게시글 클릭하면 해당하는 게시글 상세 페이지로 이동
router.post('/item', async function (req, res) {
    var id = req.body.id
    var board = await Board.findOne({
        where: {
            id: id
        },
        include: {
            model: User,
            as: "writeUser",
            attributes: ["id", "name"]
        }
    })
    res.json({
        board: board
    })
})

router.post("/remove", async (req, res) => {
    var id = req.body.id
    if (!req.session.user) {
        return res.json({
            result: "fail",
            msg: "로그인이 필요합니다."
        })
    }
    var board = await Board.findOne({
        where: {
            id: id
        }
    })
    //삭제하려는 게시물의 작성자와 로그인된 사용자가 같은지 확인
    if (board.userId == req.session.user.id) {
        await Board.destroy({
            where: {
                id: id
            }
        })
        res.json({
            result: "ok"
        })
    }
    // 삭제하려는 게시물의 작성자와 로그인된 사용자가 같지 않음
    else {
        res.json({
            result: "fail",
            msg: "삭제할 권한이 없습니다."
        })
    }
    console.log(board)
})

router.post("/modify", async (req, res) => {
    var id = req.body.id
    if (!req.session.user) {
        return res.json({
            result: "fail",
            msg: "로그인이 필요합니다."
        })
    }

    var board = await Board.findOne({
        where: {
            id: id
        }
    })
    // 수정하려는 게시물의 작성자와 로그인된 사용자가 같은지 확인
    if (board.userId == req.session.user.id) {
        await Board.update({
            title: req.body.title,
            body: req.body.body
        }, {
            where: {
                id: id
            }
        })
        res.json({
            result: "ok"
        })
    }
    // 수정하려는 게시물의 작성자와 로그인된 사용자가 같지 않음
    else {
        res.json({
            result: "fail",
            msg: "수정할 권한이 없습니다."
        })
    }
})

module.exports = router;
