module.exports = {
    "up": "CREATE TABLE experience (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user INT UNSIGNED, image VARCHAR(150), title VARCHAR(150), location VARCHAR(100), description VARCHAR(1000), start_date DATE, end_date DATE, current TINYINT(1) UNSIGNED, FOREIGN KEY (user) REFERENCES basic(id) ON DELETE CASCADE ON UPDATE CASCADE)",
    "down": "DROP TABLE experience"
}