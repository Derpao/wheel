import mysql from 'mysql2/promise';

export const createPool = (config: {
    host?: string;
    user?: string;
    password?: string;
    database?: string;
    port?: string;
}) => {
    if (!config.host || !config.user || !config.password || !config.database) {
        throw new Error('Missing database configuration');
    }

    return mysql.createPool({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        port: config.port ? parseInt(config.port, 10) : undefined,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
};
