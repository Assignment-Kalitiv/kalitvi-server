export default function errorHandler(err, req, res, next) {
    console.log(err);
    if (!res.statusCode || res.statusCode < 400) {
        res.status(500)
    }
    res.send(typeof err === 'string' ? err : err.toString());
}