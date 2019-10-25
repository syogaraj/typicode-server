var express = require('express');
var router = express.Router();
var executor = require('../mysql_/mysqlExecutor');

let postDetailQuery = "select NAME, EMAIL, BODY from PostDetails inner join UserDetails using(ID) where POST_ID = ";

router.get("/", function (req, res, next) {
    // console.log(req);
    let postID = req.query.ID;
    console.log(postID);
    // res.status(200);
    executor.executeQuery(postDetailQuery + postID).then(result => {
        res.send(result);
    }).catch(error => {
        res.sendStatus(500);
    });
});

module.exports = router;