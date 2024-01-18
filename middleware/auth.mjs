import jwt from 'jsonwebtoken';
const BEARER = 'Bearer ';

const auth = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (authHeader && authHeader.startsWith(BEARER)) {
        const accessToken = authHeader.substring(BEARER.length);
        const secret = 'test-secret'; // TODO
        try {
            const payload = jwt.verify(accessToken, secret);
            req.user = { email: payload.email, id: payload.id }
            next();
        } catch (error) {
            throw error;
        }
    } else {
        res.status(401);
        throw 'not authenticated';
    }
}

export default auth;