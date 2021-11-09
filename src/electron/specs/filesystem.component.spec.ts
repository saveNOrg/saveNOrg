//import { TestBed } from '@angular/core/testing';

import * as os from '../library/filesystem.component'
import { File } from '../library/interfaces'
import * as fs from "fs";
import * as path from "path";
import { assert } from 'console';
//var os = require('../library/filesystem.component')

const baseDir = path.join(__dirname, 'resources')

function initProductTest(dir: string) {
  let product_dir = path.join(baseDir, dir);
  if (fs.existsSync(product_dir)) {
    fs.rmdirSync(product_dir, { recursive: true });
  }
  let result = os.initProductDir(product_dir);
  expect(fs.existsSync(product_dir)).toBe(true)
  expect(fs.existsSync(path.join(product_dir, 'metadata.json'))).toBe(true);

  return product_dir;
}

function getGroupDir(product_dir: string) {
  return new Promise<string>( (resolve, rejects) => {
    os.getData('metadata.json', product_dir).then( result =>{
      let tabs = JSON.parse(result.extra.data);
      let groupDir = path.join(product_dir, tabs[0].id);
      resolve(groupDir);
    }).catch( error =>{
      fail('Failure to get data '+ error)
      rejects('Failure to get data '+ error)
    });
  });
  
}

function createNote(groupDir: string) {
  let now = new Date();
  let id: string = now.getFullYear() + '' +
    now.getMonth() + '' +
    now.getDate() + '' +
    now.getHours() + '' +
    now.getMinutes() + '' +
    now.getSeconds();

  let emptyFiles: File[] = null;
  let note = {
    "id": id,
    "icon": "path to an image",
    "name": "Note name",
    "order": 0,
    'files': emptyFiles
  };
  let note_data = '{"name":"value"}';
  return new Promise<File>( (resolve, rejects) => {
    os.createNote(id, note_data, [note], groupDir).then((result) => {
      let actual = os.getData(id, groupDir).then( result =>{
        expect(result.extra.data).toBe(JSON.stringify(note_data))
        resolve(note)
      }).catch( error =>{
        fail('Failure to get data '+ error)
        rejects(error)
      });
      
    }).catch(error => {
      fail('Could not create a note' + error);
      rejects(error)
    });
  });
}


fdescribe('Interaction with the OS', () => {

  beforeEach(() => {
    //TestBed.configureTestingModule({});
  });

  it('No permission to create a directory should return an error', async () => {
    let data_dir = path.join(baseDir, 'noPermision', 'noDir');
    let result = os.initProductDir(data_dir);
    expect(fs.existsSync(data_dir)).toBe(false)
    expect(result.message.indexOf('Could not create directory')).toBe(0);
  });

  it('No permission to write the metadata.json file should return an error', async () => {
    let data_dir = path.join(baseDir, 'permissionNoFile');
    let result = os.initProductDir(data_dir);
    expect(fs.existsSync(data_dir)).toBe(true)
    expect(result.message.indexOf('Could not create metadata.json file Error')).toBe(0);
  });

  it('A valid directory should init the product', async () => {
    let product_dir = initProductTest('new_dir');
    getGroupDir(product_dir).then( groupDir =>{
      expect(fs.existsSync(groupDir)).toBe(true)
      expect(fs.existsSync(path.join(groupDir, 'metadata.json'))).toBe(true)
    });
  });


  it('Adding a note should add create a file', async () => {
    let product_dir = initProductTest('new_note');
    let groupDir = getGroupDir(product_dir).then( groupDir =>{
      createNote(groupDir);
    });
    
  });

  it('Delete a note should add delete the note and update the metadata.json', async () => {
    let product_dir = initProductTest('new_note');
    let groupDir = getGroupDir(product_dir).then( groupDir =>{
      createNote(groupDir).then( theNote =>{
        let emptyMetadataFile:File[]=[]
        os.deleteNote(theNote['id'], groupDir, emptyMetadataFile).then( () =>{
          expect(fs.existsSync(path.join(groupDir,theNote['id']))).toBe(false);
          os.getData('metadata.json', groupDir).then( result =>{
            expect(result.extra.data).toBe(JSON.stringify(emptyMetadataFile))
          }).catch( error =>{
            fail('Failure to get data '+ error)
          });
          
        })
      });
    });
  });


});




