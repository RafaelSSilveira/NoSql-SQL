# NoSQl x Sql

This project is a comparitive of performance between NoSql(MongoDB) and Sql(Mysql)

### Build
    $ docker-compose up --build


### Run
    $ docker-compose up

Start comparative

    $ docker exec -it nosqlxsql_example_1 node index

Acess MongoDB

    $ docker exec -it nosqlxsql_mongo_1 mongo

Acess MySql

    $ docker exec -it nosqlxsql_db_1 mysql -uroot -pexample

