module.exports = {
    "up": "CREATE TABLE skill (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user INT UNSIGNED, category VARCHAR(50), details VARCHAR(1000), FOREIGN KEY (user) REFERENCES basic(id))",
    "down": "DROP TABLE `skill`"
}