
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

export interface DataState {
    "base_dir": string;
    "current_tab_id": string;
    "current_note_id": string;
    "tabs": Tab[];
    "current_tab_notes_metadata": NotesNode[];
}
