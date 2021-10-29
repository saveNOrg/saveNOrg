import { rejects } from "assert";
import { resolve } from "dns";
import * as fs from "fs";
import * as path from "path";

let getFileId = (): string => {
    let now = new Date();
    let id: string = now.getFullYear() + '' +
        now.getMonth() + '' +
        now.getDate() + '' +
        now.getHours() + '' +
        now.getMinutes() + '' +
        now.getSeconds();
    return id;
}

/*
***********************************
* Interfaces
***********************************
*/

interface Result {
    message: string;
    code: number;
    extra: any;
}

interface File {
    "id": string;
    "icon": string;
    "name": string;
    "files": File[];
}

interface Tab {
    "tabs": File[]
}

const INIT_METADATA: Tab = {
    "tabs": [
        {
            "id": getFileId(),
            "icon": "path to an image",
            "name": "Welcome",
            "files": []
        }
    ]
}


export let getNotes = (dir: string) => {
    if (fs.existsSync(dir)) {
        let files = fs.readdirSync(dir, { withFileTypes: true },);
        let notes = files.map(file => `${file.name}`);
        return notes;
    }
}

export let createNote = (id: string, data: string, metadata:any, dir: string) => {
    let result = {
        message: 'Note created',
        code: 0
    }
    return new Promise( (resolve, rejects) => {
        try{
            fs.writeFileSync(path.join(dir, 'metadata.json'), 
                              JSON.stringify(metadata, null, 2), 
                              'utf-8')
        }catch( error ){
            result['message'] = 'Could not update metadata.json in ' + dir + ' Error: ' + error;
            result['code'] = 1;
            rejects( result );
        }    
        let file_name = path.join(dir, 'data', id);
        
        try{
            fs.writeFileSync(file_name, JSON.stringify(data), 'utf-8')
            resolve(result);
        }catch( error ){
            result['message'] = 'Could not create file ' + id + ' in dir '+ dir +' Error: ' + error;
            result['code'] = 1;
            rejects( result );
        }        
    })

}

export let deleteNote = (note_name: string, dir: string) => {
    let file_name = path.join(dir, note_name);
    if (fs.existsSync(file_name)) {
        fs.unlinkSync(file_name);
    }
}

export let renameNote = (existing_note: string, note_name: string, dir: string) => {
    let existing_file_name = path.join(dir, existing_note);
    let file_name = path.join(dir, note_name);

    if (fs.existsSync(existing_file_name)) {
        fs.renameSync(existing_file_name, file_name);
    }
}

export let getData = (note_name: string, dir: string) => {
    let file_name = path.join(dir, note_name);
    if (fs.existsSync(file_name)) {
        try {
            const data = fs.readFileSync(file_name, 'utf-8');
            return data;
        } catch (err) {
            console.error(err)
        }
    } else {
        return null;
    }

}


export let search = (pattern: string, dir: string) => {
    let files = fs.readdirSync(dir, { withFileTypes: true },);
    let data: string[] = [];
    files.forEach(file => {
        if (file.isFile) {
            let note_data = fs.readFileSync(path.join(dir, file.name), 'utf-8');
            let matched = note_data.indexOf(pattern);
            if (matched >= 0) {
                data.push(file.name)
            }
        }
    });
    return data;
}

export let initDir = (dir: string) => {
    let result = {
        message: '',
        code: 0
    }

    //Create Base directory
    if (!fs.existsSync(dir)) {
        try {
            
            fs.mkdirSync(dir, { recursive: true })
            fs.mkdirSync(path.join(dir,'data'), { recursive: true })

        } catch (error) {
            console.error(error);
            result['message'] = 'Could not create directory ' + dir + ' Error: ' + error;
            result['code'] = 1;
            return result;
        }

    }

    return initMetadata(dir);
}

let initMetadata = (dir: string):Result => {
    let result = {
        message: '',
        code: 0,
        extra: {}
    }

    //Create base metadata.json file
    let init_metadata: Tab = Object.assign({}, INIT_METADATA)

    let file_name = path.join(dir, 'metadata.json');

    try{
        fs.writeFileSync(
            file_name, 
            JSON.stringify(init_metadata, null, 2), 
            'utf-8')
    }catch( error ){
        result['message'] = 'Could not create metadata.json file Error: ' + error;
        result['code'] = 1;       
    }
    return result;
}