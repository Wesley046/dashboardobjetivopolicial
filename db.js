const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://bd_objetivopolicial_user:TPWi387bS7PYSsnwzUKecpvY48bPVF8m@dpg-cuj1e69u0jms73d87rqg-a.oregon-postgres.render.com/bd_objetivopolicial',
  ssl: { rejectUnauthorized: false } // Adicionando suporte a SSL
});

client.connect()
  .then(() => console.log('Conectado ao banco de dados!'))
  .catch(err => console.error('Erro de conexão', err));

module.exports = client;
