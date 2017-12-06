module.exports = {
    jwtSecret: "testSecret",
    debug: false,
    databaseDebug: {
        connectionLimit: 100,
        host: 'localhost',
        user: 'digitalcv',
        password: 'MZDZABHwNA5UIPwm',
        database: 'digitalcv'
    },
    databaseProd: {
        connectionLimit: 100,
        host: 'henry.sql.hosts.net.nz:3306',
        user: 'theda_digitalcv',
        password: 'MZDZABHwNA5UIPwm',
        database: 'thedashcoder_online_digitalcv'
    }
};