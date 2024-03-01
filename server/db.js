const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_store_db"
);

const createTables = async () => {
  const SQL = `
    DROP TABLE IF EXISTS favorites
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS product;
    CREATE TABLE users(
        id UUID PRIMARY KEY,
        username VARCHAR(20) NOT NULL UNIQUE,
        password VARCHAR(20) NOT NULL
    );
    CREATE TABLE products(
        id UUID PRIMARY KEY,
        product VARCHAR(20) NOT NULL UNIQUE
    );
    CREATE TABLE favorites(
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id) NOT NULL,
        product_id UUID REFERENCES product(id) NOT NULL,

    );

`;
  await client.query(SQL);
};

module.exports = {
  client,
  createTables,
};
