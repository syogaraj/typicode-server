var executor = require('../mysql_/mysqlExecutor');

function migrate() {
    createTables();
}

function createTables() {
    const check_if_exist_query = "show tables like 'UserDetails'";
    executor.hasResults(check_if_exist_query).then(
        message => { console.log("Migration: UserDetails table already exists!") }
    ).catch(table_does_not_exist => {
        console.log("Comment table doesn't exists! Going to create");
        const create_user_query = "CREATE TABLE `UserDetails` (`ID` bigint(20) NOT NULL AUTO_INCREMENT, `EMAIL` varchar(255) NOT NULL, `NAME` varchar(255) NOT NULL, PRIMARY KEY(`ID`), UNIQUE KEY`EMAIL`(`EMAIL`, `NAME`))";
        executor.executeQuery(create_user_query).then(
            message => { console.log("UserDetails table successfully created."); }
        ).catch(exception => {
            console.log("Error occurred while creating table UserDetails");
            createTables();
        });

    });

    const check_post_if_exist_query = "show tables like 'PostDetails'";
    executor.hasResults(check_post_if_exist_query).then(
        message => { console.log("Migration: PostDetails table already exists!") }
    ).catch(table_does_not_exist => {
        console.log("Comment table doesn't exists! Going to create");
        const create_post_query = "CREATE TABLE `PostDetails` (`ID` bigint(20) DEFAULT NULL, `BODY` varchar(1000) DEFAULT NULL, `POST_ID` bigint(20) DEFAULT NULL, KEY`ID`(`ID`), KEY`postID_INDEX`(`POST_ID`), CONSTRAINT`PostDetails_ibfk_1` FOREIGN KEY(`ID`) REFERENCES`UserDetails`(`ID`))";
        executor.executeQuery(create_post_query).then(
            message => { console.log("PostDetails table successfully created."); }
        ).catch(exception => {
            console.log("Error occurred while creating table UserDetails");
            createTables();
        });

    });
}


module.exports = migrate;