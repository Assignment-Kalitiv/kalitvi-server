// import mysql from 'mysql'
import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import SQLConnection from '../domain/SQLConnection.mjs';

export default class UserService {

    // #connection;
    #db;

    constructor() {
        // TODO перенсти данные
        // process.env.
        // mysql.createConnection({
        //     host: "localhost",
        //     user: "root",
        //     password: "admin1234",
        //     database: "userdb"
        // }).then(res => {
        //     this.#connection = res;
        // })
        this.#db = new SQLConnection("localhost", "root", "admin1234", "userdb");
    }

    async getUsers() {
        // const sql = "SELECT * FROM users";
        // const [res,] = await this.#connection.execute(sql);
        // return res;
        return await this.#db.getAll();
    }

    async deleteUser(id) {
        // const sql = "DELETE FROM users WHERE id = ?";
        // const [res,] = await this.#connection.execute(sql, [id])
        // return +res.affectedRows > 0;
        return await this.#db.deleteOne(id);
    }

    async updateUser(id, userData) {
        // const sql = "UPDATE users SET firstname = ?, lastname = ? WHERE id = ?";
        // const [res,] = await this.#connection.execute(sql, [userData.firstname, userData.lastname, id]);
        // return +res.affectedRows > 0;
        return await this.#db.updateOne(userData.firstname, userData.lastname, id);
    }

    async getUser(id) {
        return await this.#db.getOne({ id });
        // return await this.#getAccount({ id });
    }

    async addAccount(userData) {
        const passwordHash = await bcrypt.hash(userData.password, 10);
        // const sql = "INSERT INTO users (firstname, lastname, email, password) VALUES (?,?,?,?)";
        let accessToken;
        try {
            // [res,] = await this.#connection.execute(sql, [userData.firstname, userData.lastname, userData.email, passwordHash]);
            const insertId = await this.#db.addOne(userData.firstname, userData.lastname, userData.email, passwordHash)
            accessToken = this.#getJwt(userData.email, insertId)
        } catch (error) {
            if (error.sqlState == 23000) {
                accessToken = null;
            } else {
                throw error;
            }
        }
        return accessToken;
    }

    async login(userData) {
        // const account = await this.#getAccount({ email: userData.email });
        const account = await this.#db.getOne({ email: userData.email });
        let accessToken;
        if (account && await bcrypt.compare(userData.password, account.password)) {
            accessToken = this.#getJwt(account.email, account.id);
        }
        return accessToken;
    }

    // async #getAccount(data) {
    // let sql;
    // let type;
    // if (data.email) {
    //     type = data.email;
    //     sql = "SELECT * FROM users where email = (?)"
    // } else {
    //     type = data.id;
    //     sql = "SELECT * FROM users where id = (?)"
    // }
    // const [response,] = await this.#connection.execute(sql, [type]);
    // return response[0];
    // }

    #getJwt(email, id) {
        const payload = {
            email,
            id
        }
        const secret = 'test-secret'; //TODO перенести в переменную среды
        return jwt.sign(payload, secret);
    }
}