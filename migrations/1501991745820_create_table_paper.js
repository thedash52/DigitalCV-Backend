module.exports = {
    "up": "CREATE TABLE paper (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, code VARCHAR(10), name VARCHAR(150), details VARCHAR(1000), grade VARCHAR(3), course_id INT UNSIGNED)",
    "down": "DROP TABLE `paper`"
}