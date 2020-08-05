export class Cell {
    public x: number;
    public y: number;
    public type: string;
    public previous: Cell | undefined;

    constructor(x: number, y: number, type: string) {
        this.x = x;
        this.y = y;
        this.type = type;
    }

    setType(type: string): Cell {
        this.type = type;
        return this;
    }

    setPrevious(previous: Cell): Cell {
        this.previous = previous;
        return this;
    }
}

export function generateMaze2(): number[][] {
    const x_cells = 10;
    const y_cells = 30;
 
    const maze_height = y_cells * 2 + 1;
    const maze_width = x_cells * 2 + 1;
    const directions = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
    ];

    let position = [1, 1];
    let empty_cells = x_cells * y_cells - 1;
    let done = false;

    let grid = new Array(maze_height).fill(0).map((a, j) =>
        new Array(maze_width).fill(0).map((b, i) => {
            if (j % 2 == 0) return new Cell(i, j, 'WALL');
            else {
                if (i % 2 !== 0) return new Cell(i, j, 'EMPTY');
                else return new Cell(i, j, 'WALL');
            }
        })
    );
    grid[position[0]][position[1]].setType('CURRENT');

    return (() => {
        let finished_grid: number[][] | undefined;
        while (!finished_grid) finished_grid = move();
        return finished_grid;
    })();

    function move(): number[][] | undefined {
        if (done) return;
        const new_directions: number[][] = randomizeArray(directions);
        let moved: boolean = false;
        for (const direction of new_directions) {
            const new_position: number[] = [position[0] + direction[0] * 2, position[1] + direction[1] * 2];
            if (isValidPosition(new_position)) {
                const wall_position: number[] = [position[0] + direction[0], position[1] + direction[1]];

                grid[position[0]][position[1]].setType('VISITED');
                grid[wall_position[0]][wall_position[1]].setType('VISITED').setPrevious(grid[position[0]][position[1]]);
                grid[new_position[0]][new_position[1]]
                    .setType('CURRENT')
                    .setPrevious(grid[wall_position[0]][wall_position[1]]);

                empty_cells--;
                position = new_position;
                moved = true;
                break;
            } else continue;
        }

        if (empty_cells == 0) return finish();
        if (!moved) moveBack();
        return;
    }

    function finish(): number[][] {
        const finished_grid: number[][] = grid.map((row: Cell[]) =>
            row.map((cell: Cell) => (cell.type === 'WALL' ? 1 : 0))
        );

        finished_grid[0][1] = 3;
        finished_grid[maze_height - 1][maze_width - 2] = 4;

        done = true;
        console.log({ finished_grid });

        return finished_grid;
    }

    function isValidPosition(new_position: number[]): boolean {
        const y: number = new_position[0];
        const x: number = new_position[1];

        if (outsideBorder(x, y)) return false;
        switch (grid[y][x].type) {
            case 'VISITED':
                return false;
            case 'CLEARED':
                return false;
            case 'START':
                return false;
        }

        return true;
    }

    function outsideBorder(xx: number, yy: number): boolean {
        if (xx < 0 || yy < 0) return true;
        if (xx > maze_width - 1 || yy > maze_height - 1) return true;
        return false;
    }

    function moveBack(): void {
        const x: number = position[1];
        const y: number = position[0];
        let cell = grid[y][x];

        findLastValidCell(cell);
        function findLastValidCell(current_cell: Cell): void {
            const neighbour_cells: Cell[] = getEmptyNeighbours(current_cell.x, current_cell.y);
            if (neighbour_cells && neighbour_cells.length > 0) {
                current_cell.setType('CURRENT');
                position = [current_cell.y, current_cell.x];
                return;
            }

            if (current_cell.previous) {
                current_cell.setType('CLEARED');
                current_cell.previous.setType('CURRENT');
                position = [current_cell.previous.y, current_cell.previous.x];
                return findLastValidCell(current_cell.previous);
            }
        }

        function getEmptyNeighbours(x: number, y: number): Cell[] {
            const neighbour_cells: Cell[] = [];

            for (const direction of directions) {
                const new_position: number[] = [y + direction[0] * 2, x + direction[1] * 2];

                if (outsideBorder(new_position[1], new_position[0])) continue;
                if (grid[new_position[0]][new_position[1]].type === 'EMPTY') {
                    neighbour_cells.push(grid[new_position[0]][new_position[1]]);
                }
            }

            return neighbour_cells;
        }
    }

    function randomizeArray(array: any[]): any[] {
        let oArray: any[] = [...array];
        let newArray: any[] = [];
        while (oArray.length > 0) {
            const elPos: any = Math.floor(Math.random() * oArray.length);
            const el: any = oArray[elPos];
            newArray.push(el);
            oArray.splice(elPos, 1);
        }
        return newArray;
    }
}
