module.exports = {
    "up": "CREATE TABLE education (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user INT UNSIGNED, image VARCHAR(150), course VARCHAR(300), school VARCHAR(200), link VARCHAR(300), year INT, FOREIGN KEY (user) REFERENCES basic(id) ON DELETE CASCADE ON UPDATE CASCADE)",
    "down": "DROP TABLE `education`"
}