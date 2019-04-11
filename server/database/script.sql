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
    `PHOTOURL`              TEXT,
    `ACTIVE`                    BOOLEAN  DEFAULT TRUE,
    `CREATED`                       datetime NOT NULL  DEFAULT current_timestamp,
    `UPDATED`                       datetime NOT NULL  DEFAULT current_timestamp
);

CREATE TRIGGER IF NOT EXISTS userTrigger AFTER UPDATE ON User
    BEGIN
        update User SET UPDATED = datetime('now') WHERE ID = NEW.ID;
    END;

DROP TABLE School;
CREATE TABLE IF NOT EXISTS School (
    `ID` INTEGER PRIMARY KEY AUTOINCREMENT,
    `NAME`                 TEXT  NOT NULL
);


INSERT INTO School (NAME) VALUES ('Carleton University');
INSERT INTO School (NAME) VALUES('University of Ottawa');

DROP TABLE UserSchoolInfo;
CREATE TABLE IF NOT EXISTS UserSchoolInfo (
    `USERID`            TEXT   NOT NULL,
    `SCHOOLID`            INTEGER NOT NULL,
    `START`                 TEXT NOT NULL,
    `END`                   TEXT NOT NULL,
    `CREATED`                       datetime NOT NULL  DEFAULT current_timestamp,
    `UPDATED`                       datetime NOT NULL  DEFAULT current_timestamp,
    FOREIGN KEY(`USERID`) REFERENCES User(`ID`),
    FOREIGN KEY (`SCHOOLID`) REFERENCES School(`ID`),
    PRIMARY KEY (`USERID`, `SCHOOLID`)
);

CREATE TRIGGER IF NOT EXISTS userSchoolInfoUpdateTrigger AFTER UPDATE ON UserSchoolInfo
    BEGIN
        update UserSchoolInfo SET UPDATED = datetime('now') WHERE USERID = NEW.USERID AND SCHOOLID = NEW.SCHOOLID ;
    END;

DROP TABLE EventType;
CREATE TABLE IF NOT EXISTS EventType (
    `ID` INTEGER PRIMARY KEY AUTOINCREMENT,
    `CATEGORY`                 INTEGER  NOT NULL
);


INSERT INTO EventType (CATEGORY) VALUES ('AI');
INSERT INTO EventType (CATEGORY) VALUES('FIXED');
INSERT INTO EventType (CATEGORY) VALUES('SCHOOL');

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
    `ACTIVE`                    BOOLEAN  DEFAULT TRUE,
    `CREATED`                       datetime NOT NULL  DEFAULT current_timestamp,
    `UPDATED`                       datetime NOT NULL  DEFAULT current_timestamp,
    FOREIGN KEY(USERID) REFERENCES User(ID),
    FOREIGN KEY(CATEGORY) REFERENCES EventType(ID)
);

CREATE TRIGGER IF NOT EXISTS userEventsUpdateTrigger AFTER UPDATE ON UserEvent
    BEGIN
        update UserEvent SET UPDATED = datetime('now') WHERE ID = NEW.ID;
    END;

DROP TABLE UnavailableHours;
CREATE TABLE IF NOT EXISTS  UnavailableHours (
    `ID` INTEGER  auto_increment,
    `USERID`                TEXT NOT NULL,
    `WEEK`                BOOLEAN NOT NULL,
    `CATEGORY`               TEXT NOT NULL,
    `START`                 DATE NOT NULL,
    `END`                   DATE NOT NULL,
    `CREATED`                       datetime NOT NULL  DEFAULT current_timestamp,
    `UPDATED`                       datetime NOT NULL  DEFAULT current_timestamp,
    FOREIGN KEY(USERID) REFERENCES User(ID),
    PRIMARY KEY (`WEEK`, `CATEGORY`, `USERID`)
);
CREATE TRIGGER IF NOT EXISTS hoursUpdateTrigger AFTER UPDATE ON UnavailableHours
    BEGIN
        update UnavailableHours SET UPDATED = datetime('now') WHERE USERID = NEW.USERID;
    END;


END TRANSACTION;