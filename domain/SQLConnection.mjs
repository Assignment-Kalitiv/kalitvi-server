import mysql from 'mysql2/promise'
import jsonData from '../config/requests.json' assert { type: "json" };

export default class SQLConnection {

    #connection;

    constructor(host, user, password, database) {
        mysql.createConnection({ host, user, password, database }).then(res => {
            this.#connection = res;
        })
    }

    async getAll() {
        const sql = jsonData.getAll;
        const [res,] = await this.#connection.execute(sql);
        return res;
    }

    async deleteOne(id) {
        const sql = jsonData.deleteOne
        const [res,] = await this.#connection.execute(sql, [id])
        return +res.affectedRows > 0;
    }

    async updateOne(firstname, lastname, id) {
        const sql = jsonData.updateOne
        const [res,] = await this.#connection.execute(sql, [firstname, lastname, id]);
        return +res.affectedRows > 0;
    }

    async addOne(firstname, lastname, email, passwordHash) {
        const sql = jsonData.addOne
        const [res,] = await this.#connection.execute(sql, [firstname, lastname, email, passwordHash]);
        return res.insertId;
    }

    async getOne(data) {
        let sql;
        let type;
        if (data.email) {
            type = data.email;
            sql = jsonData.getOneByEmail
        } else {
            type = data.id;
            sql = jsonData.getOneById
        }
        const [response,] = await this.#connection.execute(sql, [type]);
        return response[0];
    }
}