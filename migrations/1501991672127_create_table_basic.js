module.exports = {
    "up": "CREATE TABLE basic (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, folder_id VARCHAR(500), avatar_img VARCHAR(150), profile_img VARCHAR(150), name VARCHAR(100), address_1 VARCHAR(200), address_2 VARCHAR(200), address_3 VARCHAR(200), city VARCHAR(100), summary VARCHAR(1000), show_referees TINYINT(1) UNSIGNED, show_repositories TINYINT(1) UNSIGNED)",
    "down": "DROP TABLE `basic`"
}