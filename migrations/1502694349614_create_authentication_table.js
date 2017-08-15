module.exports = {
    "up": "CREATE TABLE `user` (`id` INT PRIMARY KEY AUTO_INCREMENT, `name` VARCHAR(50), `username` VARCHAR(150), `password` VARCHAR(200))",
    "down": "DROP TABLE `user`"
}