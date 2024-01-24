import express from 'express'
import bodyParser from 'body-parser';
import asyncHandler from 'express-async-handler'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv/config'
import Joi from 'joi'
import errorHandler from './middleware/errorHandler.mjs';
import auth from './middleware/auth.mjs';
import validate from './middleware/validate.mjs';
import { service } from './service/service.mjs';
import { usersRoute } from './routes/users.mjs';
import { throwError } from './utils/util.js';

const port = process.env.SERVER_PORT || 4000
const app = express();
app.use(cookieParser())
app.use(cors({ credentials: true, origin: `http://localhost:${process.env.CLIENT_PORT}` }))
app.use(bodyParser.json())

app.post('/api/login', asyncHandler(async (req, res) => {
    const { accessToken, email, id } = await service.login(req.body);
    if (!accessToken) {
        throwError(res, 400, "Wrong credentials")
    } else {
        res.cookie(process.env.TOKEN_NAME, accessToken, { httpOnly: true })
        res.status(200).send({ id, email })
    }
}))

app.post('/api/register', validate, asyncHandler(async (req, res) => {
    const { accessToken, email, id } = await service.addAccount(req.body)
    if (accessToken == null) {
        throwError(res, 400, `account ${req.body.email} already exists`)
    } else {
        res.cookie(process.env.TOKEN_NAME, accessToken, { httpOnly: true })
        res.status(200).send({ id, email });
    }
}))

app.post('/api/logout', asyncHandler(async (req, res) => {
    res.clearCookie(process.env.TOKEN_NAME)
    res.status(200).send('cookie deleted')
}))

app.use(auth)
app.use('/api/users', usersRoute)

const server = app.listen(port)

server.on('listening', () => console.log(`server listening on port ${port}`))

app.use(errorHandler);