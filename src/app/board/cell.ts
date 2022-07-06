export class Cell {
    id: number = -1;
    isMarked: boolean = false;
    isActive: boolean = true;
    value: string = ''

    constructor(id: number) { this.id = id }
}