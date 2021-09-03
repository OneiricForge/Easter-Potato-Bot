import mysql from "mysql"
import { database } from "../config.json"

let db = mysql.createConnection({
    database: database.database,
    host: database.host,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS
})

db.connect()

export const query = (query: any, fonction?: Function) => {
    return db.query(query, fonction)
}