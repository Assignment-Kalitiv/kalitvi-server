import express from 'express'
import bodyParser from 'body-parser';
import asyncHandler from 'express-async-handler'
import errorHandler from './middleware/errorHandler.mjs';
import auth from './middleware/auth.mjs';
import { service } from './service.mjs';
import { usersRoute } from './routes/users.mjs';

const port = process.env.PORT || 4000
const app = express();
app.use(bodyParser.json())

//User Login
app.post('/api/login', asyncHandler(async (req, res) => {
    const accessToken = await service.login(req.body);
    if (!accessToken) {
        res.status(400).send("Wrong credentials");
    } else {
        res.status(200).send(accessToken)
    }
}))

//User Registration
app.post('/api/register', async (req, res) => {
    try {
        const response = await service.addAccount(req.body)
        if (response == null) {
            throw `account ${req.body.email} already exists`
        }
        res.status(200).send(response);
    } catch (error) {
        res.status(400).send(error);
    }
})

app.use(auth)
app.use('/api/users', usersRoute)

const server = app.listen(port)

server.on('listening', () => console.log(`server listening on port ${port}`))

app.use(errorHandler);