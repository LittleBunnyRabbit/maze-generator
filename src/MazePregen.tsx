import React, { ReactElement } from 'react';
import { ThemeProvider, CSSReset, Stack, Flex, Box, Tooltip, Button } from '@chakra-ui/core';
import { Cell, generateMaze } from './genMaze';
import { generateMaze2 } from './genMaze2';

export const MazePregen = () => {
    return (
        <Box>
            <Flex direction="column" justify="flex-start">
                {generateMaze2().map((row: any) => (
                    <Flex direction="row" justify="flex-start">
                        {row.map((cell: any) => {
                            let color = '';

                            switch (cell) {
                                case 0:
                                    color = 'white';
                                    break;
                                case 1:
                                    color = 'black';
                                    break;
                                case 3:
                                    color = 'green';
                                    break;
                                case 4:
                                    color = 'yellow';
                                    break;
                                default:
                                    color = 'white';
                                    break;
                            }

                            return <Box width="10px" height="10px" style={{ backgroundColor: color }} />;
                        })}
                    </Flex>
                ))}
            </Flex>
        </Box>
    );
};
