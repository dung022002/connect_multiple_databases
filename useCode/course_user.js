const { Client } = require("pg");

// Source database configuration
const sourceConfig = {
    user: "postgres",
    host: "192.168.3.12",
    database: "mcbook_courses_dev",
    password: "tecinus123",
    port: 30593, // Default PostgreSQL port
};

async function checkCourses() {
    const arrId = [164, 165, 14];
    const userId = "eb717490-106b-4a47-a692-d4372c2ca223";
    for (const iterator of arrId) {
        try {
            // Query to select data from the source table
            const selectQuery = `SELECT DISTINCT * FROM courses_users WHERE user_id = \'${userId}\' AND course_id = \'${iterator}\'`;

            // Connect to the source database
            const sourceClient = new Client(sourceConfig);
            await sourceClient.connect();

            // Fetch data from the source table
            const result = await sourceClient.query(selectQuery);
            const data = result.rows;

            // Disconnect from the source database
            await sourceClient.end();
            console.log(data);
            if (data[0]) {
                console.log(
                    `You already have this course, course id: ${iterator}.`
                );
            } else {
                console.log(`You own new course, course id: ${iterator}.`);
            }
        } catch (error) {
            console.log(error);
        }
    }
}

console.log(1);
checkCourses();
