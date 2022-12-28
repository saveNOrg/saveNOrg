import express from "express";
import * as os from './library/filesystem.component';
import * as path from "path";
import * as CONSTANTS from './library/constants';

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
    let workspaceDir = req.body.workspaceDir
    let dir = path.join(__dirname,'specs', workspaceDir)
    console.log(dir)
    res.send(os.initProductDir(dir));
} );

app.post(`/${CONSTANTS.create_note_path}`, ( req, res ) => {
    res.send(os.createNote(
        req.body.id,
        req.body.data,
        req.body.metadata,
        req.body.groupDir));
} );

app.post(`/${CONSTANTS.save_note_data_path}`, ( req, res ) => {
    res.send(os.saveNote(
        req.body.id,
        req.body.data,
        req.body.groupDir));
} );

app.post(`/${CONSTANTS.open_note_path}`, ( req, res ) => {
    res.send(os.getData(
        req.body.id,
        req.body.groupDir));
} );

app.post(`/${CONSTANTS.delete_note_path}`, ( req, res ) => {
    res.send(os.deleteNote(
        req.body.id,
        req.body.groupDir,
       req.body.metadata));
} );

app.post(`/${CONSTANTS.rename_note_path}`, ( req, res ) => {
    res.send(os.updateMetadata(
        req.body.groupDir,
       req.body.metadata));
} );

app.post(`/${CONSTANTS.search_notes_path}`, ( req, res ) => {
    res.send(os.search(
       req.body.pattern,
       req.body.groupDir));
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