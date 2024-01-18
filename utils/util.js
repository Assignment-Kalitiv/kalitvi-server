export function throwError(res, statusCode, message) {
    res.status(statusCode)
    throw message
}