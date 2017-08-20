module.exports = {
    "up": "CREATE TABLE phone (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user INT UNSIGNED, type_id INT UNSIGNED, number INT UNSIGNED, FOREIGN KEY (user) REFERENCES basic(id), FOREIGN KEY (type_id) REFERENCES type(id))",
    "down": "DROP TABLE `phone`"
}