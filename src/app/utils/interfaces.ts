
export interface NotesNode {
    name: string;
    level: number;
    label?: string;
    selected?: boolean;
    children?: NotesNode[];
}

export interface Tab {
    "id": string;
    "icon": string;
    "name": string;
    "order": number;
}
