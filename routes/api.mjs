import auth from '../middleware/auth.mjs';
import UserService from '../service/UserService.mjs'
import express from 'express'

export const apiRoute = express.Router()

const userService = new UserService();


//CRUD Operations
// Get all
apiRoute.get('/users', auth, async (req, res) => {
    const data = await userService.getUsers(req.body);
    res.send(data);
})

// Delete
apiRoute.delete('/users/:id', auth, async (req, res) => {
    const id = req.params.id;
    const data = await userService.deleteUser(id);
    if (data) {
        res.status(200).send(`User [${id}] deleted`);
    } else {
        res.status(404).send(`User [${id}] not found`);
    }
})

// Update
apiRoute.put('/users/:id', auth, async (req, res) => {
    const id = req.params.id;
    const data = await userService.updateUser(id, req.body);
    if (data) {
        res.status(200).send(data)
    } else {
        res.status(404).send(`User [${id}] not found`);
    }
})

// Read
apiRoute.get('/users/:id', auth, async (req, res) => {
    const id = req.params.id;
    const data = await userService.getUser(id);
    if (data) {
        res.status(200).send(data);
    } else {
        res.status(404).send(`User [${id}] not found`);
    }
})

//User Registration
apiRoute.post('/register', async (req, res) => {
    try {
        const response = await userService.addAccount(req.body)
        if (response == null) {
            throw `account ${req.body.email} already exists`
        }
        res.status(200).send(response);
    } catch (error) {
        res.status(400).send(error);
    }
})

//User Login
apiRoute.post('/login', async (req, res) => {
    const accessToken = await userService.login(req.body);
    if (!accessToken) {
        res.status(400).send("Wrong credentials");
    } else {
        res.send(accessToken)
    }
})

//User Logoff
