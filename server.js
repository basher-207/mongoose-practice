const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });
const dbUsername = process.env.USERNAME;
const dbPassword = process.env.PASSWORD;
const dbAdress = process.env.DB_ADDRESS;
const dbName = process.env.DB_NAME;
const db = `mongodb+srv://${dbUsername}:${dbPassword}@${dbAdress}/${dbName}?retryWrites=true&w=majority`;

mongoose.connect(db).then(() => {
  console.log('Db connection is successful');
});

const port = 3000;
app.listen(port, () => console.log(`App is running on port ${port}...`));
