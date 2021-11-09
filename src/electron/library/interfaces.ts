/*
***********************************
* Interfaces
***********************************
*/

export interface Result {
    message: string;
    code: number;
    extra: any;
}

export interface File {
    "id": string;
    "icon": string;
    "name": string;
    "order": number,
    "files": File[];
}

export interface Tab {
    "id": string;
    "icon": string;
    "name": string;
    "order": number;
}
