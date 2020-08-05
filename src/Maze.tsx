import React, { ReactElement } from 'react';
import { ThemeProvider, CSSReset, Stack, Flex, Box, Tooltip, Button } from '@chakra-ui/core';
import { group } from 'console';
import { finished } from 'stream';
import { setTimeout } from 'timers';

class Cell {
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

export const Maze = () => {
    const [grid, setGrid] = React.useState<Cell[][]>([]);
    const [position, setPosition] = React.useState<number[]>([1, 1]);
    const [empty_cells, setEmptyCells] = React.useState<number>(-1);
    const [done, setDone] = React.useState<boolean>(false);
    
    const x_cells = 15;
    const y_cells = 15;

    const maze_height = y_cells * 2 + 1;
    const maze_width = x_cells * 2 + 1;
    const directions = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1]
    ];

    React.useEffect(() => {
        const new_grid = new Array(maze_height).fill(0).map((a, j) => new Array(maze_width).fill(0).map((b, i) => {
            if(j % 2 == 0) return new Cell(i, j, "WALL");
            else {
                if(i % 2 !== 0) return new Cell(i, j, "EMPTY");
                else return new Cell(i, j, "WALL");
            }
        }));

        new_grid[position[0]][position[1]].setType("CURRENT");
        setGrid(new_grid);
        setEmptyCells(x_cells * y_cells - 1);
    }, []); 

    function move(): any {
        if(done) return;
        const new_directions = randomizeArray(directions);
        let moved = false;
        for (const direction of new_directions) {
            const new_position = [
                position[0] + direction[0] * 2,
                position[1] + direction[1] * 2
            ];
            if (isValidPosition(new_position)) {
                const wall_position = [
                    position[0] + direction[0],
                    position[1] + direction[1]
                ];

                const updated_grid = grid;
    
                updated_grid[position[0]][position[1]].setType("VISITED");
                updated_grid[wall_position[0]][wall_position[1]].setType("VISITED").setPrevious(grid[position[0]][position[1]]);
                updated_grid[new_position[0]][new_position[1]].setType("CURRENT").setPrevious(grid[wall_position[0]][wall_position[1]]);

                setEmptyCells(empty_cells - 1);
                setGrid(updated_grid);
                setPosition(new_position);
                moved = true;
                break;
            } else continue;
        }
        
        if(empty_cells == 0) return finish();
        if(!moved) return backUp();
    }

    function finish() {
        const finished_grid: Cell[][] = grid.map((row: Cell[]) => {
            return row.map((cell: Cell) => {
                if(cell.type !== "WALL") cell.type = "EMPTY";
                return cell;
            })
        });   
        
        finished_grid[0][1].setType("EMPTY");
        finished_grid[maze_height - 1][maze_width - 2].setType("EMPTY");

        setGrid(finished_grid);
        setDone(true);
        console.log("FINISH");
    }

    function isValidPosition(new_position: number[]) {
        const y = new_position[0];
        const x = new_position[1];
    
        if (outsideBorder(x, y)) return false;
        switch (grid[y][x].type) {
            case "VISITED": return false;
            case "CLEARED": return false;
            case "START": return false;
        }
    
        return true;
    }

    function outsideBorder(xx: number, yy: number) {
        if (xx < 0 || yy < 0) return true;
        if (xx > maze_width - 1 || yy > maze_height - 1) return true;
        return false;
    }

    function backUp() {
        const x = position[1];
        const y = position[0];
        let cell = grid[y][x];
    
        recursiveBack(cell);
        function recursiveBack(current_cell: Cell): any {
            const neighbour_cells = getEmptyNeighbours(current_cell.x, current_cell.y);
            if(neighbour_cells && neighbour_cells.length > 0) {
                current_cell.setType("CURRENT");
                setPosition([
                    current_cell.y,
                    current_cell.x
                ])
                return;
            }
    
            if(current_cell.previous) {
                current_cell.setType("CLEARED");
                current_cell.previous.setType("CURRENT");
                setPosition([
                    current_cell.previous.y,
                    current_cell.previous.x
                ]);
                return recursiveBack(current_cell.previous);
            }
        }
    
        function getEmptyNeighbours(x: number, y: number) {
            const neighbour_cells = [];
    
            for (const direction of directions) {
                const new_position = [
                    y + direction[0] * 2,
                    x + direction[1] * 2
                ];
    
                if(outsideBorder(new_position[1], new_position[0])) continue;
                if(grid[new_position[0]][new_position[1]].type === "EMPTY") neighbour_cells.push(grid[new_position[0]][new_position[1]]);
            }
    
            return neighbour_cells;
        }
    } 

    function randomizeArray(array: any[]) {
        let oArray = [...array];
        let newArray = [];
        while (oArray.length > 0) {
            const elPos = Math.floor(Math.random() * oArray.length);
            const el = oArray[elPos];
            newArray.push(el);
            oArray.splice(elPos, 1);
        }
        return newArray;
    }

    return (
        <Box>
            <Flex direction="column" justify="flex-start">
                { grid.map((row: any) => (
                    <Flex direction="row" justify="flex-start">
                        { row.map((cell: any) => {
                            const data = `${cell.x} ${cell.y} ${cell.type}`;
                            let color = "";

                            switch (cell.type) {
                                case "EMPTY":
                                    color = "white";
                                    break;
                                case "START":
                                    color = "yellow";
                                    break;
                                case "WALL":
                                    color = "black";
                                    break;
                                case "VISITED":
                                    color = "green";
                                    break;
                                case "CURRENT":
                                    color = "red";
                                    break;
                                case "CLEARED":
                                    color = "blue";
                                    break;
                                default:
                                    color = "white";
                                    break;
                            }

                            return (
                                <Tooltip 
                                    label={data}
                                    aria-label=""
                                    placement="top"
                                >
                                    <Box
                                        width="20px"
                                        height="20px"
                                        style={{ backgroundColor: color }}
                                        // border={`1px solid ${color}`}
                                        // margin="1px"
                                    />
                                </Tooltip>

                            )
                        })}
                    </Flex>
                ))}
            </Flex>
            { !done && <Button mt="10px" onClick={move}>{ empty_cells }</Button> }
        </Box>
    );
}


function generateMaze() {
    
}