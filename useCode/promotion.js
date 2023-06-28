const { Client } = require("pg");

// Source database configuration
const sourceUserConfig = {
    user: "postgres",
    host: "192.168.3.12",
    database: "mcbook_promotions_dev",
    password: "tecinus123",
    port: 30593, // Default PostgreSQL port
};

const code = "9EA22D41";

async function getCode() {
    try {
        console.log(1.1);
        // Query to select data from the source table
        const selectQuery = `SELECT * FROM bonus_courses WHERE code = \'${code}\'`;

        // Connect to the source database
        const sourceClient = new Client(sourceUserConfig);
        console.log(3);
        await sourceClient.connect();
        console.log(4);
        // Fetch data from the source table
        const result = await sourceClient.query(selectQuery);
        const data = result.rows;

        // Disconnect from the source database
        await sourceClient.end();

        // Is code Usable?
        const promoCode = data[0];
        let giftPromoId = "";
        if (promoCode.used_at && promoCode.used_by) {
            return "Promotion code is Invalid";
        } else {
            giftPromoId = promoCode.code;
            return giftPromoId;
        }
    } catch (error) {
        console.log(error);
    }
}

console.log(1);
getCode();
console.log(2);
