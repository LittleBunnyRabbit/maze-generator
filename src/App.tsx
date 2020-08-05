import React, { ReactElement } from 'react';
import { ThemeProvider, CSSReset, Box } from '@chakra-ui/core';
import { Maze } from './Maze';
import { MazePregen } from './MazePregen';

function AppBase(): ReactElement {
    return (
        <Box padding={0}>
            <Maze />
            {/* <MazePregen /> */}
        </Box>
    );
}

function App() {
    return (
        <ThemeProvider>
            <CSSReset />
            <AppBase />
        </ThemeProvider>
    );
}

export default App;
