module.exports = {
    "up": "CREATE TABLE technology (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user INT UNSIGNED, image VARCHAR(150), name VARCHAR(50), detail VARCHAR(1000), link VARCHAR(300), category VARCHAR(50), FOREIGN KEY (user) REFERENCES basic(id) ON DELETE CASCADE ON UPDATE CASCADE)",
    "down": "DROP TABLE `technology`"
}