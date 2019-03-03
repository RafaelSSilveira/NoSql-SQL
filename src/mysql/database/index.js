const mysql = require('mysql');
const dbConfig = require('./db.config');

//Cria o pool de conexão
let pool = mysql.createPool(dbConfig);

module.exports = {
  /**
   * Executa uma query no banco
   */
  query: (sql = { query, values }) => {
    return new Promise((resolve, reject) => {
      //Pega a conexão
      pool.getConnection((err, conn) => {
        if (err) return reject(err);

        conn.query({
          sql: sql.query,
          timeout: 15000,
          values: sql.values
        }, (err, results, fields) => {

          conn.destroy(); //Desliga a conexão

          if (err) {
            return reject(err);
          }

          //Retorna os resultados, se for um select
          resolve(results);
        });
      });
    });
  }
}
