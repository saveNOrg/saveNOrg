import express from "express";
import * as os from './library/filesystem.component';
import * as path from "path";

var bodyParser = require('body-parser') 
const app = express();
const port = 8080; // default port to listen


app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json())
// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

app.post('/initProject', ( req, res ) => {
    let groupDir = req.body.groupDir
    let dir = path.join(__dirname,'specs', groupDir)
    console.log(dir)
    res.send(os.initProductDir(dir));
} );

app.post('/test', ( req, res ) => {
    let groupDir = req.body.groupDir
    let dir = path.join(__dirname,'specs', groupDir)
    console.log(dir)
    os.initProductDir(dir);
    res.send("done")
} );

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
//npx ts-node -P src/electron/tsconfig.json src/electron/server.ts