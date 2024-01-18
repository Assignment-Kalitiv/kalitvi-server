import jwt from 'jsonwebtoken';
const BEARER = 'Bearer ';

const auth = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (authHeader && authHeader.startsWith(BEARER)) {
        const accessToken = authHeader.substring(BEARER.length);
        const secret = 'test-secret';
        try {
            const payload = jwt.verify(accessToken, secret);
            req.user = { username: payload.sub, roles: payload.roles }
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