BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS USER (
    `ID` INT PRIMARY KEY     NOT NULL,
    `FIRSTNAME`           TEXT    NOT NULL,
    `LASTNAME`            TEXT     NOT NULL,
    `ACCESSTOKEN`               TEXT     NOT NULL,
    `IDTOKEN`               TEXT     NOT NULL,
    `EMAIL`                 TEXT  NOT NULL,
    `PHOTO`                 TEXT,
    `FULLNAME`              TEXT,
    `SERVERAUTHCODE`        TEXT
);

INSERT INTO USER (
   ID,
    FIRSTNAME,
    LASTNAME,
    ACCESSTOKEN,
    IDTOKEN,
    EMAIL,
    PHOTO,
    FULLNAME,
    SERVERAUTHCODE
)
VALUES
    (
        1,
        'Fahad',
        'Hayat',
        'AccessToken',
        'IDtoken',
        'fahadhayat@outlook.com',
        'inset url here',
        'Fahad Hayat',
        'Server Auth'
    );
END TRANSACTION;