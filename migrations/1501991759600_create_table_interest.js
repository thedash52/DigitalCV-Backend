module.exports = {
    "up": "CREATE TABLE interest (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user INT UNSIGNED, image VARCHAR(150) NULL, name VARCHAR(50), FOREIGN KEY (user) REFERENCES basic(id))",
    "down": "DROP TABLE `interest`"
}