module.exports = {
    "up": "CREATE TABLE skill (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user INT UNSIGNED, category VARCHAR(50), details VARCHAR(1000), FOREIGN KEY (user) REFERENCES basic(id) ON DELETE CASCADE ON UPDATE CASCADE)",
    "down": "DROP TABLE `skill`"
}