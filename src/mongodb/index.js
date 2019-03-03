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
    let startTime = Date.now();
    console.log(`${clc.green('MongoDB')} Process Started at ${new Date().toISOString()}`);

    await connect();
    await deleteOldData(); //Limpa as tabelas

    return new Promise(async (resolve, reject) => {

        let times = [];
        let alterEgo = 1

        //Faz um loop para inserir no banco
        for (let i = 1; i < loopTimes; i++) {
            let startTime = Date.now(); //Hora de inicio do processo

            let alterEgoKey = i % 2 === 1 ? `alter_ego` : null

            //Cria um documento do Schema Heroes

            let returnHeroes = await Heroes.create({
                description: `Heroes ${i + 1}`
            });

            //Cria um documento do Schema People
            await People.create({
                description: `People ${i + 1}`,
                [alterEgoKey]: i % 2 === 1 ? returnHeroes._id : null
            });


            let duration = Date.now() - startTime; //Faz a diferença da hora inicial com a atual para saber a duração
            times.push(duration); //Adiciona a duração no array pra faze a média total depois
            console.log(`${clc.green('MongoDB')}: Document created. Total: ${i + 1}. Duration: ${duration} ms`);
        };

        //Calcula a média de tempo dos resultados
        let sum = times.reduce((a, b) => a + b);
        let avg = sum / times.length;
        console.log(`${clc.green('MongoDB')} Average: ${avg} ms`);


        //Calcula o 'inner join'
        let startTimeSelect = Date.now();        
        let result = await People.find({alter_ego: { $ne: null}}).populate({path : "alter_ego", model:"Heroes"});
        let durationSelect = Date.now() - startTimeSelect;
        console.log(`${clc.green('MongoDB')}: SELECT COUNT: ${result.length}. Duration: ${durationSelect} ms`); //clc.red muda a cor da letra no console.log

        let duration = Date.now() - startTime; //Calcula a duração
        console.log(`${clc.green('MongoDB')} Finished. Duration: ${duration} ms`); //Mostra o resultado final

        //Retorna a média
        resolve();
    });

}