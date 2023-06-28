const { Client } = require("pg");

// Source database configuration
const sourceConfig = {
    user: "postgres",
    host: "192.168.3.12",
    database: "keycloak",
    password: "tecinus123",
    port: 30593, // Default PostgreSQL port
};

const email = "ducnvph10517@gmail.com";

async function getUserId() {
    try {
        console.log(1);
        // Query to select data from the source table
        const selectQuery = `SELECT id FROM user_entity WHERE email = \'${email}\'`;

        // Connect to the source database
        const sourceClient = new Client(sourceConfig);
        console.log(3);
        await sourceClient.connect();
        console.log(4);
        // Fetch data from the source table
        const result = await sourceClient.query(selectQuery);
        const data = result.rows;

        // Disconnect from the source database
        await sourceClient.end();

        const user_id = data[0].id;
        return user_id;
    } catch (error) {
        console.log(error);
    }
}

async function run() {
    const user_id = await getUserId();
    console.log(user_id);
}

run();

// node .\user.js user_entity
