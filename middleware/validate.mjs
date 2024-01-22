import { schema } from '../config/schema.mjs'
import { throwError } from '../utils/util.js';


const validate = (req, res, next) => {
    if (schema && req.body) {
        const { error } = schema.validate(req.body);
        console.log(error);
        if (error) {
            throwError(res, 402, error.details[0].message)
        }
    }
    next();
}

export default validate