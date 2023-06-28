const { Client } = require("pg");

// Source database configuration
const sourceConfig = {
    user: "postgres",
    host: "192.168.3.12",
    database: "mcbook_promotions_dev",
    password: "tecinus123",
    port: 30593, // Default PostgreSQL port
};

async function getCourses() {
    try {
        const giftPromoId = "867"; //test

        // Query to select data from the source table
        const selectQuery = `SELECT DISTINCT courses_id FROM gift_promotion_courses WHERE gift_promotion_id = \'${giftPromoId}\'`;

        // Connect to the source database
        const sourceClient = new Client(sourceConfig);
        console.log(3);
        await sourceClient.connect();
        console.log(4);
        // Fetch data from the source table
        const result = await sourceClient.query(selectQuery);
        const data = result.rows;

        const arr = [];
        for (const iterator of data) {
            arr.push(iterator.courses_id);
        }
        console.log(arr);
        // Disconnect from the source database
        await sourceClient.end();
    } catch (error) {
        console.log(error);
    }
}

getCourses();
