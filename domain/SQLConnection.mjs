import mysql from 'mysql2/promise'

export default class SQLConnection {

    #connection;

    constructor(host, user, password, database) {
        mysql.createConnection({ host, user, password, database }).then(res => this.#connection = res)
    }

    async getAll() {
        const sql = "SELECT * FROM users";
        const [res,] = await this.#connection.execute(sql);
        return res;
    }

    async deleteOne(id) {
        const sql = "DELETE FROM users WHERE id = ?";
        const [res,] = await this.#connection.execute(sql, [id])
        return +res.affectedRows > 0;
    }

    async updateOne(firstname, lastname, id) {
        const sql = "UPDATE users SET firstname = ?, lastname = ? WHERE id = ?";
        const [res,] = await this.#connection.execute(sql, [firstname, lastname, id]);
        return +res.affectedRows > 0;
    }

    async addOne(firstname, lastname, email, passwordHash) {
        const sql = "INSERT INTO users (firstname, lastname, email, password) VALUES (?,?,?,?)";
        const [res,] = await this.#connection.execute(sql, [firstname, lastname, email, passwordHash]);
        return res.insertId;
    }

    async getOne(data) {
        let sql;
        let type;
        if (data.email) {
            type = data.email;
            sql = "SELECT * FROM users where email = (?)"
        } else {
            type = data.id;
            sql = "SELECT * FROM users where id = (?)"
        }
        const [response,] = await this.#connection.execute(sql, [type]);
        return response[0];
    }
}