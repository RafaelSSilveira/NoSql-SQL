const db = require("./database");

const clc = require('cli-colors');

createAndClearTable = () => {
    return new Promise((resolve, reject) => {
        db.query({
            query: `DROP TABLE persons`,
            values: []
        })
        db.query({
            query: `DROP TABLE heroes`,
            values: []
        })
        db.query({
            query: `CREATE TABLE IF NOT EXISTS persons(
                id INT PRIMARY KEY AUTO_INCREMENT,
                description VARCHAR(100),
                alter_ego VARCHAR(20),
                createdAt DATETIME
            )`,
            values: []
        })
        db.query({
            query: `CREATE TABLE IF NOT EXISTS heroes(
                id INT PRIMARY KEY AUTO_INCREMENT,
                description VARCHAR(100),
                createdAt DATETIME
            )`,
            values: []
        })
            .then(data => resolve())
            .catch(err => reject(err));
    });
}

selectData = () => {
    return new Promise((resolve, reject) => {
        db.query({
            query: `SELECT COUNT(persons.id) FROM persons
                    INNER JOIN heroes ON persons.alter_ego = heroes.description`,
            values: []
        })
            .then(data => resolve(data))
            .catch(err => reject(err));
    });
}

/**
 * @param loopTimes quantidade de vezes que será executado o loop
 * @returns Promise<number>
 */
exports.start = async (loopTimes) => {
    let startTime = Date.now();
    console.log(`${clc.red('MySQL')} Process Started at ${new Date().toISOString()}`);

    await createAndClearTable(); // Elimina tabelas antigas e cria novas

    return new Promise(async (resolve, reject) => {

        let times = [];
        let alterEgo = 1

        //Faz um loop para inserir no banco
        for (let i = 1; i < loopTimes; i++) {
            let startTime = Date.now(); //Hora inicial do processo

            //Await serve somente para esperar a promise e então continuar a função
            await db.query({
                query: `INSERT INTO persons(description,alter_ego,createdAt) VALUES(?,?,now());`,
                values: [`Person` + i, i % 2 === 1 ? `Hero` + i: null]
            });

            await db.query({
                query: `INSERT INTO heroes(description,createdAt) VALUES(?,now());`,
                values: [`Hero` + i]    
            });

            let duration = Date.now() - startTime; //Faz a diferença da hora inicial com a atual para saber a duração
            times.push(duration); //Adiciona a duração no array pra faze a média total depois

            console.log(`${clc.red('MySQL')}: Row inserted. Total: ${i + 1}. Duration: ${duration} ms`); //clc.red muda a cor da letra no console.log
        };

        //Calcula a média de tempo dos resultados
        let sum = times.reduce((a, b) => a + b);
        let avg = sum / times.length;
        console.log(`${clc.red('MySQL')}  Average: ${avg} ms`);
 
        //Calcula o inner join
        let startTimeSelect = Date.now();
        let result = await selectData(); 
        let countresult = JSON.parse(JSON.stringify(result));
        let durationSelect = Date.now() - startTimeSelect;
        console.log(`${clc.red('MySQL')}: SELECT COUNT: ${Object.values(countresult[0])}. Duration: ${durationSelect} ms`);

        let duration = Date.now() - startTime; //Calcula a duração
        console.log(`${clc.red('MySQL')} Finished. Duration: ${duration} ms`); //Mostra o resultado final

        resolve();
    });
}

