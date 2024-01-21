import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    const accessToken = req.cookies.token
    if (accessToken) {
        const secret = process.env.SECRET_KEY
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