
export interface NotesNode {
    name: string;
    level: number;
    label?: string;
    selected?: boolean;
    children?: NotesNode[];
}

