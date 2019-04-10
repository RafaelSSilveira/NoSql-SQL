const mongoose = require('mongoose');
const People = require('./schemas/people.schema');
const Heroes = require('./schemas/heroes.schema');

const clc = require('cli-colors');

/**
 * Conecta o MongoDB
 */
connect = async () => {
    return new Promise((resolve, reject) => {
        mongoose.connect('mongodb://mongo:27017/example', {
            useNewUrlParser: true,
            useFindAndModify: false
        });

        mongoose.set('useCreateIndex', true);

        //Avisa que pode continuar
        resolve();
    });
}

selectData = async (loopTimes) => {
    for (let i = 1; i < loopTimes; i++) {
        if (i % 2) {
            People.find({ description: 'People ' + i});
            Heroes.find({ description: 'Heroes ' + i});
        }
    }
}

updateData = async (loopTimes) => {
    for (let i = 1; i < loopTimes; i++) {
        if (i % 2) {
            People.findOneAndUpdate({ description: 'People ' + i }, { $set: { description: 'PeopleUpdated'} }, { new: true });
            People.findOneAndUpdate({ description: 'Heroes ' + i }, { $set: { description: 'HeroesUpdated'} }, { new: true });         
        }
    }
}

/**
 * Limpa a tabela
 */
deleteOldData = async () => {
    return new Promise(async (resolve, reject) => {
        await People.deleteMany({});
        await Heroes.deleteMany({});
        resolve();
    })
}

/**
 * @param loopTimes quantidade de vezes que será executado o loop
 * @returns Promise<number>
 */
exports.start = async (loopTimes) => {
    console.log(`${clc.blue('MongoDB')}: PROCESS STARTED AT ${new Date().toISOString()}`);

    await connect();
    await deleteOldData(); //Limpa as tabelas

    return new Promise(async (resolve, reject) => {
        let initialTime = Date.now();
        let startTime = Date.now();

        //Faz um loop para inserir no banco
        for (let i = 1; i < loopTimes; i++) {
            let alterEgoKey = i % 2 === 1 ? `alter_ego` : null

            let returnHeroes = await Heroes.create({
                description: `Heroes ${i + 1}`
            });

            await People.create({
                description: `People ${i + 1}`,
                [alterEgoKey]: i % 2 === 1 ? returnHeroes._id : null
            });
        };

        console.log(`${clc.blue('MongoDB')}: ROWS INSERT. Total: ${loopTimes * 2}. Duration: ${Date.now() - startTime} ms`);

        //Calcula SELECT
        startTime = Date.now();
        await selectData(loopTimes);
        console.log(`${clc.blue('MongoDB')}: SELECT HALF OF ROWS: Duration: ${Date.now() - startTime} ms`);

        //Calcula o 'inner join'
        initialTime = Date.now();
        let result = await People.find({ alter_ego: { $ne: null } }).populate({ path: "alter_ego", model: "Heroes" });
        console.log(`${clc.blue('MongoDB')}: INNER JOIN SELECT COUNT: ${result.length}. Duration: ${Date.now() - startTime} ms`); //clc.red muda a cor da letra no console.log

        //Calcula UPDATE
        startTime = Date.now();
        await updateData(loopTimes);
        console.log(`${clc.blue('MongoDB')}: UPDATE HALF OF ROWS: Duration: ${Date.now() - startTime} ms`);

        console.log(`${clc.blue('MongoDB')}: FINISHED. Duration: ${Date.now() - initialTime} ms`); //Mostra o resultado final

        //Retorna a média
        resolve();
    });

}