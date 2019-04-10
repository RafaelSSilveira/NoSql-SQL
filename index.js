const robotMysql = require('./src/mysql');
const robotMongo = require('./src/mongodb');
const inquirer = require('inquirer');

start = async () => {

  const content = {};

  content.option = await askAndReturnOption(); //Mostra as opções para o usuário
  content.howManyInserts = await askAndReturnHowManyInserts(); //Quantos documentos ele quer inserir no teste?

  switch (content.option) {
    case 'MySql':
      await robotMysql.start(content.howManyInserts);
      process.exit();
      break;

    case 'MongoDb':
      await robotMongo.start(content.howManyInserts);
      process.exit();
      break;

    case 'MySql/MongoDB':
      await robotMysql.start(content.howManyInserts);
      await robotMongo.start(content.howManyInserts);
      process.exit();
      break;

    case 'Exit':
      process.exit();
      break;

    default:
      process.exit();
      break;
  }

  //Pergunta se ele quer executar separado ou os 2 de uma vez
  async function askAndReturnOption() {
    let option = await inquirer
      .prompt([{
        type: 'list',
        name: 'choice',
        message: 'Qual teste deseja iniciar?',
        choices: ['MySql', 'MongoDb', 'MySql/MongoDB', 'Exit']
      }]);

    //Retorno de ption = { choice :'MySql' }
    return option['choice'];
  }

  async function askAndReturnHowManyInserts() {
    let answer = await inquirer.prompt([{
      type: 'input',
      name: 'count',
      message: 'Quantos inserts quer fazer?'
    }]);

    //Retorno de asnwer = { count : '100' }
    return Number(answer['count']);
  }
}

start();