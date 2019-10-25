/**
 * This will fetch the posts for every configured sec/minute and updates it to the db.
 */
let schedule = require('node-schedule');
let axios = require('axios');
let executor = require('../mysql_/mysqlExecutor');

let postFetchURL = "https://jsonplaceholder.typicode.com/comments";

function parseAndInsertComments(data) {
    let insertPrefix = "insert ignore into Comments (POST_ID, ID, EMAIL, NAME, BODY) values ";
    let insertValues = "";
    let commentKeyOrder = ['postId', 'id', 'name', 'email', 'body'];
    data.forEach((eachComment) => {

        let tempInsValues = "";
        let toInsert = true;
        commentKeyOrder.forEach(function (key) {
            if (eachComment.hasOwnProperty(key)) {
                let val = JSON.stringify(eachComment[key]).replace(/\"/g, "");
                tempInsValues += "'" + val + "',";
            } else {
                toInsert = false;
                return;
            }
        });
        if (toInsert) {
            tempInsValues = tempInsValues.replace(/,(\s+)?$/g, "");
            insertValues += "(";
            insertValues += tempInsValues;
            insertValues += "),";
            insertValues = insertValues.replace(/,(\s+)?$/g, "")
        }

    });
    console.log("Final Query:" + insertPrefix + insertValues);
    console.log("-------------------");
}

function scheduleJob() {
    console.log("scheduling job - " + new Date());
    schedule.scheduleJob("*/2 * * * * *", function () {
        console.log("Going to fetch data - " + new Date());
        axios.get(postFetchURL).then(function (response) {
            let commentData = response.data;
            parseAndInsertComments(commentData);
        }).catch(function (error) {
            console.log(error);
        });
    });
}

module.exports = scheduleJob;