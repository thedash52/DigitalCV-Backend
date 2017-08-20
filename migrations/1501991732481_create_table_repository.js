module.exports = {
    "up": "CREATE TABLE repository (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user INT UNSIGNED, type_id INT UNSIGNED, link VARCHAR(300), FOREIGN KEY (user) REFERENCES basic(id), FOREIGN KEY (type_id) REFERENCES type(id))",
    "down": "DROP TABLE `repository`"
}