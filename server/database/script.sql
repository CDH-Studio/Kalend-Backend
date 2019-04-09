BEGIN TRANSACTION;

DROP TABLE User;
CREATE TABLE IF NOT EXISTS User (
    `ID`                 TEXT PRIMARY KEY  NOT NULL,
    `EMAIL`                 TEXT NOT NULL,
    `FULLNAME`              TEXT,
    `SERVERAUTHCODE`        TEXT,
    `CALENDARID`            TEXT,
    `FIREBASEID`            TEXT,
    `ACCESSTOKEN`           TEXT,
    `REFRESHTOKEN`           TEXT,
    `PHOTOURL`              TEXT
);

CREATE TABLE IF NOT EXISTS School (
    `ID` INTEGER PRIMARY KEY AUTOINCREMENT,
    `NAME`                 TEXT  NOT NULL
);


-- INSERT INTO School (NAME) VALUES ('Carleton University');
-- INSERT INTO School (NAME) VALUES('University of Ottawa');
-- DROP TABLE UserSchoolInfo;
CREATE TABLE IF NOT EXISTS UserSchoolInfo (
    `USERID`            TEXT   NOT NULL,
    `SCHOOLID`            INTEGER NOT NULL,
    `START`                 TEXT NOT NULL,
    `END`                   TEXT NOT NULL,
    FOREIGN KEY(`USERID`) REFERENCES User(`ID`),
    FOREIGN KEY (`SCHOOLID`) REFERENCES School(`ID`),
    PRIMARY KEY (`USERID`, `SCHOOLID`)
);

CREATE TABLE IF NOT EXISTS EventType (
    `ID` INTEGER PRIMARY KEY AUTOINCREMENT,
    `CATEGORY`                 INTEGER  NOT NULL
);

-- INSERT INTO EventType (CATEGORY) VALUES ('AI');
-- INSERT INTO EventType (CATEGORY) VALUES('FIXED');
-- INSERT INTO EventType (CATEGORY) VALUES('SCHOOL');
DROP TABLE UserEvent;
CREATE TABLE IF NOT EXISTS  UserEvent (
    `ID`                    TEXT PRIMARY KEY  NOT NULL,
    `USERID`                TEXT NOT NULL,
    `CATEGORY`               TEXT,
    `START`                 DATE NOT NULL,
    `ALLDAY`                BOOLEAN  DEFAULT FALSE,
    `END`                   DATE NOT NULL,
    `SUMMARY`                 TEXT NOT NULL,
    `RECURRENCE`                TEXT,
    `LOCATION`                   TEXT,
    `DESCRIPTION`                   TEXT,
    `CREATED`                       datetime NOT NULL  DEFAULT current_timestamp,
    `UPDATED`                       datetime NOT NULL  DEFAULT current_timestamp,
    FOREIGN KEY(USERID) REFERENCES User(ID),
    FOREIGN KEY(CATEGORY) REFERENCES EventType(ID)
);

END TRANSACTION;