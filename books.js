const { Client } = require("pg");

if (!process.argv[2]) {
  return console.log("source_table name is invalid!!");
}

if (!process.argv[3]) {
  return console.log("destination_table path is invalid!!");
}

// Source database configuration
const sourceConfig = {
  user: "postgres",
  host: "192.168.3.12",
  database: "mcbook_books_dev",
  password: "tecinus123",
  port: 30593, // Default PostgreSQL port
};

// Destination database configuration
const destinationConfig = {
  user: "postgres",
  host: "192.168.3.12",
  database: "mcbooks_dev",
  password: "tecinus123",
  port: 30593, // Default PostgreSQL port
};

async function copyData(source_table, destination_table) {
  try {
    console.log(1);
    // Query to select data from the source table
    const selectQuery = `SELECT * FROM ${source_table}`;

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

    // Connect to the destination database
    const destinationClient = new Client(destinationConfig);
    await destinationClient.connect();

    // Insert data into the destination table
    for (const row of data) {
      const values = Object.values(row);
      const insertQuery = `INSERT INTO ${destination_table} VALUES (${values
        .map((_, i) => `$${i + 1}`)
        .join(",")})`;
      await destinationClient.query(insertQuery, values);
    }

    // Disconnect from the destination database
    await destinationClient.end();

    console.log("Data copied successfully!");
    console.log(3);
  } catch (error) {
    console.log(error);
  }
}

console.log(1);
copyData(process.argv[2], process.argv[3]).catch((err) => console.log(err));
console.log(2);
