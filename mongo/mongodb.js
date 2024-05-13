// database.js
const { MongoClient } = require('mongodb');

// Configura tu cadena de conexión
const uri = process.env.MONGODB;

// Crea una instancia del cliente
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Función para conectarse a la base de datos
async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Conexión exitosa a la base de datos');
    const db = client.db('webhook_hsm');
    return db;
  } catch (err) {
    console.error('Error al conectar a la base de datos', err);
  }
}

module.exports = { connectToDatabase };
