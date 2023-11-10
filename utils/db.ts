// db.js
import Papa from 'papaparse';
import initSqlJs, {Database} from 'sql.js';
import fs from 'fs';
import path from 'path';
import {convertToTimestamp/*, saveToJsonFile */} from "./server";

let dbInstance: null | Database = null;

// const wasmUrl = path.resolve('node_modules', 'sql.js', 'dist', 'sql-wasm.wasm');
const wasmUrl = 'https://sql.js.org/dist/sql-wasm.wasm';

const getDB = async () => {
    if (!dbInstance) {
        console.log('No DB Instance Found: Creating DB Instance');
        const response = await fetch(wasmUrl);
        const wasmBinary = await response.arrayBuffer();
        const SQL = await initSqlJs({
            locateFile: () => wasmUrl,
            wasmBinary,
        });
        const db = new SQL.Database();

        const filePath = path.resolve(process.cwd(), 'pages/api/realdonaldtrump.csv');
        console.time('read-file');
        const csvData = fs.readFileSync(filePath, 'utf8');
        console.timeEnd('read-file');
        console.time('parse-file');
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
        console.timeEnd('parse-file');
        console.time('table-created');

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
        console.timeEnd('table-created');
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

        console.time('inserted-rows');

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

        console.timeEnd('inserted-rows');
        // saveToJsonFile(parsedData, 'tweets.json');

        dbInstance = db;


    }
    return dbInstance;
};

export default getDB;
