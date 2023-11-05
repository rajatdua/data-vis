// db.js
import Papa from 'papaparse';
import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import {convertToTimestamp, saveToJsonFile} from "./server";

let dbInstance: null | Database = null;

const getDB = async () => {
    if (!dbInstance) {
        console.log('No Instance Found!');
        const SQL = await initSqlJs();
        const db = new SQL.Database();

        // Initialize your database schema and data here if needed
        db.run('CREATE TABLE users (id INT, name TEXT)');
        db.run(
            "INSERT INTO users VALUES (:id, :name)",
            { ':id' : 18, ':name' : 'John' }
        );

        const csvData = fs.readFileSync('pages/api/realdonaldtrump.csv', 'utf8');
        const parsedData = Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            transform(value: string, field: string | number): unknown {
                switch (field) {
                    case 'retweets':
                    case 'favorites':
                        return parseInt(value, 10);
                    case 'date':
                        return convertToTimestamp(value);
                    default:
                        return value;
                }
            }
        });

        const fields = parsedData?.meta?.fields || [];
        type Data = {
            default: string;
            retweets: string;
            date: string;
            favorites: string;
            [key: string]: string;
        };
        const DATA_TYPE_MAP: Data = {
            default: 'TEXT',
            retweets: 'INT',
            date: 'INT',
            favorites: 'INT',
        };
        let typeString = '';
        let insertColString = '';
        fields.forEach((field, index) => {
            const selectedDataType = DATA_TYPE_MAP[field] || DATA_TYPE_MAP.default;
            insertColString = insertColString + `:${field}${index !== fields.length - 1 ? ', ' : ''}`
            typeString = typeString + `${field} ${selectedDataType}${index !== fields.length - 1 ? ', ' : ''}`
        });
        const createTableQuery = `CREATE TABLE tweets (${typeString})`;
        db.run(createTableQuery);

        const allTweets: unknown[] = parsedData?.data || [];

        interface ITweet {
            id: string;
            link: string;
            content: string;
            date: number;
            retweets: number;
            favorites: number;
            mentions: string;
            hashtags: string;
        }

        allTweets.forEach((tweet) => {
            const {
                id = '',
                link = '',
                content = '',
                date = 0,
                retweets = 0,
                favorites = 0,
                mentions = '',
                hashtags = ''
            } = tweet as ITweet;
            db.run(
                `INSERT INTO tweets VALUES (${insertColString})`,
                {
                    ":id": id,
                    ":link": link,
                    ":content": content,
                    ":date": date,
                    ":retweets": retweets,
                    ":favorites": favorites,
                    ":mentions": mentions,
                    ":hashtags": hashtags
                }
            );
        });


        saveToJsonFile(parsedData, 'tweets.json');

        dbInstance = db;


    }
    return dbInstance;
};

export default getDB;
