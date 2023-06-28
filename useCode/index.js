const { Client } = require("pg");

if (!process.argv[2]) {
    return console.log("Please enter your email");
}

if (!process.argv[3]) {
    return console.log("code is invalid");
}

// keycloak database config
const keycloakConfig = {
    user: "postgres",
    host: "192.168.3.12",
    database: "keycloak",
    password: "tecinus123",
    port: 30593, // Default PostgreSQL port
};

// mcbook_promotion_dev config
const promotionConfig = {
    user: "postgres",
    host: "192.168.3.12",
    database: "mcbook_promotions_dev",
    password: "tecinus123",
    port: 30593, // Default PostgreSQL port
};

// mcbook_courses_dev config
const courseConfig = {
    user: "postgres",
    host: "192.168.3.12",
    database: "mcbook_courses_dev",
    password: "tecinus123",
    port: 30593, // Default PostgreSQL port
};

async function usePromoCode(email, code) {
    try {
        // Get userId from user_entity
        // Query to select data from the user_entity table
        const query1 = `SELECT DISTINCT id FROM user_entity WHERE email = \'${email}\'`;

        // Connect to the keycloak database
        const client1 = new Client(keycloakConfig);
        await client1.connect();

        // Fetch data from the user_entity table
        const result1 = await client1.query(query1);
        const data1 = result1.rows;

        // Disconnect from the keycloak database
        await client1.end();

        // USER_ID
        if (!data1[0]) {
            return console.log("this email does not exist");
        }
        const userId = data1[0].id;
        console.log(`user id: ${userId}`);

        // Get code from bonus_courses
        // Query to select/insert data from the bonus_courses table
        const query2a = `SELECT * FROM bonus_courses WHERE code = \'${code}\'`;
        const query2b = `UPDATE bonus_courses SET used_at = CURRENT_TIMESTAMP, used_by = \'${userId}\' WHERE code = \'${code}\'`;
        // Connect to the source database
        const Client2 = new Client(promotionConfig);
        await Client2.connect();

        // Fetch data from the source table
        const result2 = await Client2.query(query2a);
        const data2 = result2.rows;
        await Client2.query(query2b);
        // Disconnect from the source database
        await Client2.end();

        if (!data2[0]) {
            return console.log("this code does not exist");
        }
        // Is code Usable?
        const promoCode = data2[0];
        let giftPromoId = "";
        if (promoCode.used_at && promoCode.used_by) {
            return console.log("Promotion code is used");
        } else {
            giftPromoId = promoCode.gift_promotion_id;
        }
        console.log(`gift promotion id: ${giftPromoId}`);

        // Which courses does code applies to?
        // Query to select data from the gift_promotion_courses table
        const query3 = `SELECT DISTINCT courses_id FROM gift_promotion_courses WHERE gift_promotion_id = \'${giftPromoId}\'`;

        // Connect to the mcbook_promotions_dev database
        const client3 = new Client(promotionConfig);
        await client3.connect();

        // Fetch data from the gift_promotion_courses table
        const result3 = await client3.query(query3);
        const data3 = result3.rows;

        const arr = [];
        for (const iterator of data3) {
            arr.push(iterator.courses_id);
        }
        console.log(`courses id that code applies to: ${arr}`);
        // Disconnect from the mcbook_promotions_dev database
        await client3.end();

        // Does user have those courses?
        for (const iterator of arr) {
            try {
                // Query to select/create data from the courses_users table
                const query4a = `SELECT * FROM courses_users WHERE user_id = \'${userId}\' AND course_id = \'${iterator}\'`;
                const query4b = `INSERT INTO courses_users (user_id, course_id, code, used_at, created_at, updated_at) VALUES (\'${userId}\', \'${iterator}\', \'${code}\', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;

                // Connect to the mcbook_courses_dev database
                const client4 = new Client(courseConfig);
                await client4.connect();

                // Fetch data from the courses_users table
                const result4 = await client4.query(query4a);
                const data4 = result4.rows;

                // Disconnect from the mcbook_courses_dev database
                await client4.end();
                if (data4[0]) {
                    console.log(
                        `You already have this course, course id: ${iterator}.`
                    );
                } else {
                    console.log(`You own new course, course id: ${iterator}.`);
                    await client4.query(query4b);
                }
            } catch (error) {
                console.log(error);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

console.log("running...");
usePromoCode(process.argv[2], process.argv[3]);
