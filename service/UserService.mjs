// import mysql from 'mysql'
import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default class UserService {

    #connection;
    #tokens;

    constructor() {
        this.#tokens = [];
        mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "admin1234",
            database: "userdb"
        }).then(res => {
            this.#connection = res;
        })
    }

    async getUsers() {
        const sql = "SELECT * FROM users";
        const [res,] = await this.#connection.execute(sql);
        return res;
    }

    async createUser(userData) {
        // const passwordHash = await bcrypt.hash(userData.password, 10);
    }

    async deleteUser(id) {
        const sql = "DELETE FROM users WHERE id = ?";
        const [res,] = await this.#connection.execute(sql, [id])
        return +res.affectedRows > 0;
    }

    async updateUser(id, userData) {
        const sql = "UPDATE users SET firstname = ?, lastname = ? WHERE id = ?";
        let res;
        [res,] = await this.#connection.execute(sql, [userData.firstname, userData.lastname, id]);
        return +res.affectedRows > 0;
    }

    async getUser(id) {
        return await this.#getAccount({ id });
    }

    async addAccount(userData) {
        const passwordHash = await bcrypt.hash(userData.password, 10);
        const sql = "INSERT INTO users (firstname, lastname, email, password) VALUES (?,?,?,?)";
        let res;
        try {
            [res,] = await this.#connection.execute(sql, [userData.firstname, userData.lastname, userData.email, passwordHash]);
            userData.id = res.insertId;
            console.log(res);
        } catch (error) {
            if (error.sqlState == 23000) {
                userData = null;
            } else {
                throw error;
            }
        }
        return userData;
    }

    async login(userData) {
        const account = await this.#getAccount({ email: userData.email });
        let accessToken;
        if (account && await bcrypt.compare(userData.password, account.password)) {
            accessToken = this.#getJwt(account.email);
            this.#tokens.push(accessToken);
        }
        return accessToken;
    }

    logout(accessToken) {
        this.#tokens.filter(token => token != accessToken)
    }

    async #getAccount(data) {
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

    #getJwt(email) {
        const payload = {
            email
        }
        const secret = 'test-secret';
        // const options = { expiresIn: '1h' };
        // return jwt.sign(payload, secret, options);
        return jwt.sign(payload, secret);
    }
}