const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

const config = {
  host: 'db',
  user: 'root',
  password: 'nodedb',
  database: 'nodedb'
};

const waitForDB = () => {
  return new Promise((resolve, reject) => {
    const tryConnect = () => {
      const connection = mysql.createConnection(config);
      connection.connect(err => {
        if (err) {
          console.log('MySQL ainda não está pronto, tentando novamente em 3s...');
          setTimeout(tryConnect, 3000);
        } else {
          console.log('Conectado ao MySQL!');
          resolve(connection);
        }
      });
    };

    tryConnect();
  });
};

(async () => {
  const connection = await waitForDB();

  app.get('/', (req, res) => {
    const name = 'Nome Teste ' + Math.floor(Math.random() * 1000);
    connection.query(`INSERT INTO people(name) VALUES(?)`, [name]);

    connection.query('SELECT name FROM people', (err, results) => {
      if (err) return res.status(500).send('Erro ao buscar nomes.');

      const namesList = results.map(row => `<li>${row.name}</li>`).join('');
      res.send(`
        <h1>Full Cycle Rocks!</h1>
        <ul>${namesList}</ul>
      `);
    });
  });

  app.listen(port, () => {
    console.log(`App rodando em http://localhost:${port}`);
  });
})();
