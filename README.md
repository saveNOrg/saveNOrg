# Save and Organize

The goal of this project is to create a Notes-application with features that solve basic problems. For example, an application that can store short pieces of unrelated data, which in turn can be searchable.  There are a few nice notes applications out there, all those a very capable of what I want to do here. However, each one of them have also features that are not appealing (e.g. complexity, cost, lack of support, etc). This is an attempt to create something that is close to my needs and that can be augmented overtime.

This project uses the following technologies and since it is being update, there are probably a few more not listed:
- Angular 
- FlexBox
- Quill (ngx-quill)
- Electron
- Electon-forge

This is to say that it is more of a compilation of technologies rather than building from scratch. To see all the technologies used look at the package.json file.

The icon came from: https://www.1001freedownloads.com/free-icon/blank-catalog (Blank-Catalog, Free Icon by LazyCrazy, free for comercial use)
The font came from: https://www.1001fonts.com/otto-font.html

## Development 

The directory structure right now follows this convention:

Everything related to the backend (interaction with the OS) is under the `src/electron` directory. 
Everything related to the frontend (interaction with the user) is undere the `src/app` directory.

### Algorithms

There are two main concepts being managed in this application: 
- Notes - the presentation of data.
- Tabs/groups - groups of notes.
 
 This is provides a good way to manage data (create, update, group, search, etc). 

 Data is stored in JSON format used by the Quill library to present data. The application so far does not alter the JSON in anyway. 
 Data is grouped using metadata.json files. This provides a good way to abstract the presentation of data. 

### Backend

The backend is pretty lean right now. The basic infrastructure is derived from the `Electron` and `Nodejs` libraries.

The `src/electrong/app.ts` file has been commented with information about special features (e.g. show development tools, hide the menu bar, etc)

### Frontend

The frontend does most of the work. When the application starts, the code reads the names of the files in the data directory. Each label gets translated into a Object and displayed into various widgets. 

### Build

Run `npm install` to install all the dependencies. 

The command `npm run electron` will build and start the application. 

Another possibility is `npm start`, this will only build the `Electron` portion of the application and will use the existing compiled portion of the Angular app. 

To run the application in client-server mode, start the server `npm run server:def` and in another terminal, run the command `npx ng serve --proxy-config src/proxy.conf.json`. This speeds up the development, but you still need to test the application using `Electron`.

### Test

The backend has been split into modules. The `filesystem.component.ts` module does most of the backend work and has `*.spec.ts` file. 

# Featues

Right now the application is very simple. It is able to create, delete, rename notes as well as search through existing notes. 
The next features:
- Search through names of notes only. 
- Highlight keywords being searched. 
- Duplication of note (templates)
- Organize note names - keep a subset on the top, others towards the bottom. 

