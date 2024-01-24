import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default class UserService {

    #db;

    constructor(connection) {
        this.#db = connection
    }

    async getUsers() {
        const users = await this.#db.getAll();
        users.forEach(user => delete user.password);
        return users
    }

    async deleteUser(id) {
        return await this.#db.deleteOne(id);
    }

    async updateUser(id, userData) {
        return await this.#db.updateOne(userData.firstname, userData.lastname, id);
    }

    async getUser(id) {
        return await this.#db.getOne({ id });
    }

    async addAccount(userData) {
        const email = userData.email;
        const passwordHash = await bcrypt.hash(userData.password, 10);
        let accessToken;
        let insertId;
        try {
            insertId = await this.#db.addOne(userData.firstname, userData.lastname, email, passwordHash)
            accessToken = this.#getJwt(email, insertId)
        } catch (error) {
            if (error.sqlState == 23000) {
                accessToken = null;
            } else {
                throw error;
            }
        }
        return { accessToken, email, id: insertId };
    }

    async login(userData) {
        const email = userData.email;
        const account = await this.#db.getOne({ email });
        let accessToken;
        if (account && await bcrypt.compare(userData.password, account.password)) {
            accessToken = this.#getJwt(account.email, account.id);
        }
        return { accessToken, email, id: account?.id };
    }

    #getJwt(email, id) {
        const payload = {
            email,
            id
        }
        const secret = process.env.SECRET_KEY
        return jwt.sign(payload, secret);
    }
}