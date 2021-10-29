//import { TestBed } from '@angular/core/testing';

import * as os from '../library/filesystem.component'
import * as fs from "fs";
import * as path from "path";
import { assert } from 'console';
//var os = require('../library/filesystem.component')

const baseDir = path.join(__dirname, 'resources')
let metadata = {
  "tabs": [
    {
      "id": "1234",
      "icon": "this could be an id and have a prefix list of icons instead of the icon being a path to an image",
      "name": "Welcome",
      "files": [
        {
          "id": "9876",
          "icon": "",
          "name": "Welcome",
          "files": [
            {
              "id": "8765",
              "icon": "",
              "name": "What can MyNotesKeeper do",
              "files": [
                {
                  "id": '',
                  "icon": "",
                  "name": "MyNotesKeeper Features",
                  "files": [{}]
                }
              ]
            },
            {
              "id": "7654",
              "icon": "",
              "name": "Registration",
              "files": [{}]
            }
          ]
        }
      ]
    }
  ]
}

fdescribe('Interaction with the OS', () => {

  beforeEach(() => {
    //TestBed.configureTestingModule({});
  });

  it('should return an error', async () => {
    let data_dir = path.join(baseDir, 'noPermision', 'noDir');
    let result = await os.initDir(data_dir);
    expect(fs.existsSync(data_dir)).toBe(false)
    expect(result.message.indexOf('Could not create directory')).toBe(0);
  });

  it('should return an error', async () => {
    let data_dir = path.join(baseDir, 'permissionNoFile');
    let result = os.initDir(data_dir);
    expect(fs.existsSync(data_dir)).toBe(true)
    expect(result.message.indexOf('Could not create metadata.json file Error')).toBe(0);
  });

  it('should create the metadata file', async () => {
    let data_dir = path.join(baseDir, 'new_dir');
    if (fs.existsSync(data_dir)) {
      fs.rmdirSync(data_dir, { recursive: true })
    }
    let result = os.initDir(data_dir);
    expect(fs.existsSync(data_dir)).toBe(true)
    expect(fs.existsSync(path.join(data_dir, 'metadata.json'))).toBe(true);
  });


  it('should add a note', async () => {
    let data_dir = path.join(baseDir,'new_note');
    if (fs.existsSync(data_dir)) {
      fs.rmdirSync(data_dir, { recursive: true })
    }
    let result = os.initDir(data_dir);

    let now = new Date();
    let id: string = now.getFullYear() + '' +
      now.getMonth() + '' +
      now.getDate() + '' +
      now.getHours() + '' +
      now.getMinutes() + '' +
      now.getSeconds();

    metadata["tabs"][0]['files'][0]['files'][0]['id'] = id;
    let note_data = '{"name":"value"}'
    os.createNote(id, note_data, metadata, data_dir).then((result) => {
      let actual = os.getData(id, path.join(data_dir, 'data') )
      expect(JSON.stringify(note_data)).toEqual(actual);
      
    }).catch( error =>{
      fail( 'Could not create note' + error)
    })
  });

  it('should delete a note', async () => {
    // let data_dir = path.join(baseDir,'new_note');
    // if (fs.existsSync(data_dir)) {
    //   fs.rmdirSync(data_dir, { recursive: true })
    // }
    // let result = os.initDir(data_dir);

    // let now = new Date();
    // let id: string = now.getFullYear() + '' +
    //   now.getMonth() + '' +
    //   now.getDate() + '' +
    //   now.getHours() + '' +
    //   now.getMinutes() + '' +
    //   now.getSeconds();

    
    // let note_data = '{"name":"value"}'
    // os.createNote(id, note_data, metadata, data_dir).then((result) => {
    //   let actual = os.getData(id, path.join(data_dir, 'data') )
    //   expect(JSON.stringify(note_data)).toEqual(actual);
      
    // }).catch( error =>{
    //   fail( 'Could not create note' + error)
    // })
  });

});
