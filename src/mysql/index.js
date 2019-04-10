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

selectData = async (loopTimes) => {
    for (let i = 1; i < loopTimes; i++) {
        if (i % 2) {
            db.query({
                query: `SELECT * FROM persons WHERE description = "Person` + i + `"`
            })

            db.query({
                query: `SELECT * FROM heroes WHERE description = "Hero` + i + `"`
            })
        }
    }
}

updateData = async (loopTimes) => {
    for (let i = 1; i < loopTimes; i++) {
        if (i % 2) {
            db.query({
                query: `UPDATE persons SET description = "PersonUpdated" WHERE description = "Person` + i + `"`
            })

            db.query({
                query: `UPDATE persons SET description = "HeroUpdated" WHERE description = "Hero` + i + `"`
            })            
        }
    }
}

selectDataInnerJoin = async () => {
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
    console.log(`${clc.red('MySQL')}: PROCESS STARTED AT ${new Date().toISOString()}`);

    await createAndClearTable(); // Elimina tabelas antigas e cria novas

    return new Promise(async (resolve, reject) => {

        let initialTime = Date.now();

        let insertPersons = `INSERT INTO persons(description,alter_ego,createdAt) VALUES`;
        let insertHeroes = `INSERT INTO heroes(description,createdAt) VALUES`;

        for (let i = 1; i < loopTimes; i++) {
            let ishero = i % 2 === 1 ? `"Hero` + i + `"` : null;

            insertPersons += `("Person` + i + `",` + ishero + `,now()),`;

            insertHeroes += `("Hero` + i + `",now()),`;
        }

        insertPersons = insertPersons.slice(0, -1);
        insertHeroes = insertHeroes.slice(0, -1);

        let startTime = Date.now();

        await db.query({
            query: insertPersons += `;`
        });

        await db.query({
            query: insertHeroes += `;`
        });

        console.log(`${clc.red('MySQL')}: ROWS INSERT. Total: ${loopTimes * 2}. Duration: ${Date.now() - startTime} ms`);

        //Calcula SELECT
        startTime = Date.now();
        await selectData(loopTimes);
        console.log(`${clc.red('MySQL')}: SELECT HALF OF ROWS: Duration: ${Date.now() - startTime} ms`);

        //Calcula o inner join
        startTime = Date.now();
        let result = await selectDataInnerJoin();
        let countresult = JSON.parse(JSON.stringify(result));
        console.log(`${clc.red('MySQL')}: INNER JOIN SELECT COUNT: ${Object.values(countresult[0])}. Duration: ${Date.now() - startTime} ms`);

        //Calcula UPDATE
        startTime = Date.now();
        await updateData(loopTimes);
        console.log(`${clc.red('MySQL')}: UPDATE HALF OF ROWS: Duration: ${Date.now() - startTime} ms`);

        console.log(`${clc.red('MySQL')}: FINISHED. Duration: ${Date.now() - initialTime} ms`); //Mostra o resultado final */

        resolve();
    });
}

