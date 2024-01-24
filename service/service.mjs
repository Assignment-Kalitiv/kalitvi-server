import SQLConnection from "../domain/SQLConnection.mjs";
import UserService from "./UserService.mjs";

export const service = new UserService(new SQLConnection(process.env.SQL_HOST, process.env.SQL_USER, process.env.SQL_PASSWORD, process.env.SQL_DATABASE));