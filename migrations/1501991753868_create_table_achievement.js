module.exports = {
    "up": "CREATE TABLE achievement (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user INT UNSIGNED, name VARCHAR(50), `where` VARCHAR(50), what_why VARCHAR(300), FOREIGN KEY (user) REFERENCES basic(id) ON DELETE CASCADE ON UPDATE CASCADE)",
    "down": "DROP TABLE `achievement`"
}