/**
 * This will fetch the posts for every configured sec/minute and updates it to the db.
 */
let schedule = require('node-schedule');
let axios = require('axios');
let executor = require('../mysql_/mysqlExecutor');

let postFetchURL = "https://jsonplaceholder.typicode.com/comments";

function getUserID(eachComment) {
    let userOrder = ['name', 'email'];
    let insertUserQuery = "insert ignore into UserDetails (NAME, EMAIL) values ";
    let insertUserVal = "";
    let tempUserVal = "";
    let insertUser = true;
    let userDetail = {}
    userOrder.forEach(function (key) {
        if (eachComment.hasOwnProperty(key)) {
            let val = JSON.stringify(eachComment[key]).replace(/\"/g, "");
            userDetail[key] = val;
            tempUserVal += "'" + val + "',";
        } else {
            insertUser = false;
            return;
        }
    });
    if (insertUser) {
        tempUserVal = tempUserVal.replace(/,(\s+)?$/g, "");
        insertUserVal += "(";
        insertUserVal += tempUserVal;
        insertUserVal += "),";
        insertUserVal = insertUserVal.replace(/,(\s+)?$/g, "")
    }
    // console.log(insertUserQuery + insertUserVal);
    return executor.executeQuery(insertUserQuery + insertUserVal).then(function (response) {
        let userIDQuery = "select ID from UserDetails where NAME='" + userDetail['name'] + "' and EMAIL = '" + userDetail['email'] + "'";
        return executor.getResultAsString(userIDQuery);
    }).catch(error => {
        return null;
    });
}

function insertPostDetails(eachComment, userID) {
    let insertPrefix = "insert ignore into PostDetails (ID, POST_ID, BODY) values ";
    let insertValues = "";
    let commentKeyOrder = ['postId', 'body'];
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
        insertValues += userID + ",";
        insertValues += tempInsValues;
        insertValues += "),";
        insertValues = insertValues.replace(/,(\s+)?$/g, "");
    }
    // console.log(insertPrefix + insertValues);
    executor.executeQuery(insertPrefix + insertValues).then(success => {
        // do nothing;
    }).catch(error => {
        console.log(error);
    })
}


function parseAndInsertComments(data) {

    data.forEach((eachComment) => {
        let userID = "";
        getUserID(eachComment).then(function (response) {
            userID = response[0].ID;
            // console.log("------" + userID);
            insertPostDetails(eachComment, userID);
        });
    });
}

function scheduleJob() {
    console.log("scheduling job - " + new Date());
    schedule.scheduleJob("*/2 * * * * *", function () {
        console.log("Going to fetch data - " + new Date());
        axios.get(postFetchURL).then(function (response) {
            let commentData = response.data;
            parseAndInsertComments(commentData);
            console.log("Job finished at - " + new Date());
        }).catch(function (error) {
            console.log(error);
        });
    });
}

module.exports = scheduleJob;