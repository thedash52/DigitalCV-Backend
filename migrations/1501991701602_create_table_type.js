module.exports = {
    "up": "CREATE TABLE type (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, short VARCHAR(5), `long` VARCHAR(30), category VARCHAR(100))",
    "down": "DROP TABLE `type`"
}