import { rejects } from "assert";
import { resolve } from "dns";
import * as fs from "fs";
import * as path from "path";
import { Result, File, Tab } from './interfaces';

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


const INIT_METADATA_TAB: Tab[] = [
        {
            "id": '',
            "icon": "path to an image",
            "name": "Welcome",
            "order": 0
        }
    ];

const INIT_METADATA_FILE: File[] = [
        {
            "id": '',
            "icon": "path to an image",
            "name": "Welcome",
            "order": 0,
            'files':[]
        }
    ];


export let getNotes = (dir: string) => {
    if (fs.existsSync(dir)) {
        let files = fs.readdirSync(dir, { withFileTypes: true },);
        let notes = files.map(file => `${file.name}`);
        return notes;
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

/**
 * Creates a new note
 * @param id string name of the file
 * @param data string data to be written in the file
 * @param metadata File[] that holds metadata of the file
 * @param groupDir string parent directory of the file
 * @returns Promise<Result>
 */
export let createNote = (id: string, data: string, metadata:File[], groupDir: string) => {
    let result:Result = {
        message: 'Note created',
        code: 0,
        extra: {}
    }
    return new Promise<Result>( (resolve, rejects) => {
        writeMetadata(groupDir, metadata, result, rejects);
        saveNoteData(groupDir, id, data, resolve, result, rejects);        
    })

}

/**
 * Saves data in a note
 * @param id string name of the file
 * @param data string data to be saved
 * @param groupDir string parent directory
 * @returns Promise<Result>
 */
export let saveNote = (id: string, data: string, groupDir: string) => {
    let result:Result = {
        message: 'Note created',
        code: 0,
        extra: {}
    }
    return new Promise<Result>( (resolve, rejects) => {
        saveNoteData(groupDir, id, data, resolve, result, rejects);
    })
}

/**
 * deletes an existing note
 * @param id string id from the metadata.json file
 * @param groupDir string parent directory of the file
 * @param metadataFile File[] metadata.json describing the group
 * @returns Promise<Result>
 */
export let deleteNote = (id: string, groupDir: string, metadataFile:File[]) => {
    let result:Result = {
        message: 'Note deleted',
        code: 0,
        extra:{}
    }
    return new Promise<Result>( (resolve, rejects) => {
        writeMetadata(groupDir, metadataFile, result, rejects);
        
        let file_name = path.join(groupDir, id);
        if (fs.existsSync(file_name)) {
            try{
                fs.unlinkSync(file_name);
                resolve(result)
            }catch( error ){
                result['message'] = 'Could not delete file ' + id + ' in dir '+ groupDir +' Error: ' + error;
                result['code'] = 1;
                console.error(result['message'])
                rejects( result );
            }

        }
    });
}

/**
 * Update the metadata file (rename, reorder notes)
 * @param groupDir string parent directory
 * @param metadataFile File[] with the update
 * @returns 
 */
export let updateMetadata = (groupDir:string, metadataFile:File[]) => {
    let result:Result = {
        message: 'Metadata updated',
        code: 0,
        extra:{}
    }
    return new Promise<Result>( (resolve, rejects) => {
        writeMetadata(groupDir, metadataFile, result, rejects);
    })
}

function saveNoteData(groupDir: string, id: string, data: string, resolve: (value: Result | PromiseLike<Result>) => void, result: Result, rejects: (reason?: any) => void) {
    let file_name = path.join(groupDir, id);

    try {
        fs.writeFileSync(file_name, JSON.stringify(data), 'utf-8');
        resolve(result);
    } catch (error) {
        result['message'] = 'Could not create file ' + id + ' in dir ' + groupDir + ' Error: ' + error;
        result['code'] = 1;
        console.error(result['message']);
        rejects(result);
    }
}

/**
 * Overwrites the metadata.json file
 * @param dir string parent directory of the metadata.json file
 * @param metadata File[] data to be written
 * @param result success callback function from a promise 
 * @param rejects failure callback function from a promise 
 */
 function writeMetadata(dir: string, metadata: File[], result: { message: string; code: number; }, rejects: (reason?: any) => void) {
    try {
        fs.writeFileSync(path.join(dir, 'metadata.json'),
            JSON.stringify(metadata, null, 2),
            'utf-8');
    } catch (error) {
        result['message'] = 'Could not update metadata.json in ' + dir + ' Error: ' + error;
        result['code'] = 1;
        console.error(result['message'])
        rejects(result);
    }
}

export let renameNote = (existing_note: string, note_name: string, dir: string) => {
    let existing_file_name = path.join(dir, existing_note);
    let file_name = path.join(dir, note_name);

    if (fs.existsSync(existing_file_name)) {
        fs.renameSync(existing_file_name, file_name);
    }
}

/**
 * Returns the data contained in a file
 * @param id string name of the file
 * @param groupDir string parent directory of the file
 * @returns Promise<Result> the data is inside extra
 */
export let getData = (id: string, groupDir: string) => {
    let result:Result = {
        message: 'Note read',
        code: 0,
        extra:{}
    }
    return new Promise<Result>( (resolve, rejects) => {
        let file_name = path.join(groupDir, id);
        if (fs.existsSync(file_name)) {
            try {
                const data = fs.readFileSync(file_name, 'utf-8');
                result['extra'] = {'data':data}
                resolve(result);
            } catch (err) {
                result.message = 'Could not read file '+ id +' in dir '+ groupDir
                result.code=1
                console.error(result['message'])
                rejects(result)
            }
        } else {
            return null;
        }
    });
}


/**
 * Initializes the product directory structure.
 * - Creates the initial folder if it doesn exit.
 * - Creates the welcome folder
 * - Creates the metadata file in the base and inside the welcome folder
 * @param dir string directory path 
 * @returns 
 */
export let initProductDir = (dir: string) => {
    let result = {
        message: '',
        code: 0
    }

    let welcomeTabId = getFileId();

    let welcomeFileId = getFileId();

    //Create Base directory
    try {
        if (!fs.existsSync(dir)) {            
            fs.mkdirSync(dir, { recursive: true })
        }
        fs.mkdirSync(path.join(dir,welcomeTabId), { recursive: true })

    } catch (error) {
        result['message'] = 'Could not create directory ' + dir + ' Error: ' + error;
        result['code'] = 1;
        console.error(result['message'])
        return result;
    }

    
    //Create the tab metadata.json 
    let init_metadata_tab: Tab[] = Object.assign([], INIT_METADATA_TAB)
    init_metadata_tab[0].id = welcomeTabId;
    let rootResult = initMetadata(dir,init_metadata_tab);
    rootResult.extra= {"tabs": init_metadata_tab};
    rootResult.extra['baseDir'] = dir;


    if( rootResult.code == 0 ){
        //Create the file metadata.json
        let init_metadata_file: File[] = []
        let groupDir = path.join(dir, welcomeTabId);
        let welcome_note_result =  initMetadata(groupDir, null, init_metadata_file);
        rootResult.extra['note'] = welcome_note_result
    }
    return rootResult;
}

/**
 * Writes the first metadata.json file 
 * 
 * @param dir string parent directory of the metadata.json  
 * @param tab Tab[] | null 
 * @param file File[] | null
 * @returns Result code=0 and success message if the file was written
 */
let initMetadata = (dir: string, tab?:Tab[], file?:File[]):Result => {
    let result = {
        message: '',
        code: 0,
        extra: {}
    }
     let fileData = tab? tab:file
    try{
        fs.writeFileSync(
            path.join(dir,'metadata.json'), 
            JSON.stringify(fileData, null, 2), 
            'utf-8')
    }catch( error ){
        result['message'] = 'Could not create metadata.json file Error: ' + error;
        result['code'] = 1;
        console.error(result['message'])       
    }
    return result;
}

