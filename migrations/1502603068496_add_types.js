module.exports = {
    "up": "INSERT INTO type (`short`, `long`, `category`) VALUES ('m', 'Mobile', 'phone'), ('h', 'Home', 'phone'), ('w', 'Work', 'phone'), ('git', 'GitHub', 'repository'), ('bit', 'BitBucket', 'repository'), ('fb', 'Facebook', 'social'), ('tw', 'Twitter', 'social'), ('in', 'LinkedIn', 'social'), ('g', 'Google', 'social'), ('ig', 'Instagram', 'social')",
    "down": "DELETE FROM `type`"
}