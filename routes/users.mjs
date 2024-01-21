import express from 'express'
import asyncHandler from 'express-async-handler'
import { service } from '../service.mjs';
import { throwError } from '../utils/util.js';

export const usersRoute = express.Router()

usersRoute.get('', async (req, res) => {
    const data = await service.getUsers(req.body);
    res.send(data);
})

usersRoute.delete('/:id', asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (+id != +req.user.id) {
        throwError(res, 403, `You can only delete yourself`)
    } else {
        const data = await service.deleteUser(id);
        if (data) {
            res.clearCookie(process.env.TOKEN_NAME)
            res.status(200).send(`User [${id}] deleted`);
        } else {
            throwError(res, 404, `User [${id}] not found`)
        }
    }
}))

usersRoute.put('/:id', asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (+id != +req.user.id) {
        throwError(res, 403, `You can only update yourself`)
    } else {
        const data = await service.updateUser(id, req.body);
        if (data) {
            const updatedUser = await service.getUser(id);
            delete updatedUser.password;
            res.status(200).send({ ...updatedUser })
        } else {
            throwError(res, 404, `User [${id}] not found`)
        }
    }
}))

usersRoute.get('/:id', async (req, res) => {
    const id = req.params.id;
    const data = await service.getUser(id);
    if (data) {
        res.status(200).send(data);
    } else {
        throwError(res, 404, `User [${id}] not found`)
    }
})