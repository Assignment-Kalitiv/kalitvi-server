import express from 'express'
import { apiRoute } from './routes/api.mjs';
import bodyParser from 'body-parser';
import errorHandler from './middleware/errorHandler.mjs';

const port = process.env.PORT || 4000
const app = express();
app.use(bodyParser.json())

app.use('/api', apiRoute)

const server = app.listen(port)

server.on('listening', () => console.log(`server listening on port ${port}`))

app.use(errorHandler);