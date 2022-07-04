const IP_SERVER = "localhost";
const PORT_DB = 27017;
// const IP_SERVER = "mongodb";
// const PORT_DB = 28017;
const API_VERSION = "v1";

const LOCAL_DB = `mongodb://${IP_SERVER}:${PORT_DB}/camilovallejosprovoste`;
const DOCKER_DB = `mongodb://mongodb/camilovallejosprovoste`;
const AZURE_DB = "mongodb://portafoliodb:fn2Ok8vSaePGtWtrcQshs8Qjc7OYEkI4OENz2qQ73bcAdLkZrEGXQsnApkFUNHw2qE0LFC8Z18etrtbzfnjEuw==@portafoliodb.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=camilovallejosprovoste";
const PRODUCTION_DB = `mongodb+srv://admin:Mern1234@portafoliodb.vx4wb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

module.exports = {
    API_VERSION,
    IP_SERVER,
    PORT_DB,
    LOCAL_DB,
    DOCKER_DB,
    AZURE_DB,
    PRODUCTION_DB,
};