var express = require('express');
var router = express.Router();
var executor = require('../mysql_/mysqlExecutor');

const topPostQuery = "select POST_ID, count(*) as COUNT from PostDetails group by POST_ID";

router.get('/', function(req, res, next) {
    executor.getResults(topPostQuery).then(result => {
        res.send(result);
    }).catch(error => {
        res.sendStatus(500);
    })
});

module.exports = router;