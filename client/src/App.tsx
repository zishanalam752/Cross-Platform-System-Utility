import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Box,
    CssBaseline,
    ThemeProvider,
    createTheme,
    useMediaQuery
} from '@mui/material';
import MachineList from './components/MachineList';
import MachineDetails from './components/MachineDetails';
import { Machine, MachineDetails as MachineDetailsType } from './types';
import * as api from './api';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#2196F3',
            light: '#64B5F6',
            dark: '#1976D2'
        },
        background: {
            default: '#121212',
            paper: 'rgba(25, 25, 35, 0.95)'
        }
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h5: {
            fontWeight: 700,
            letterSpacing: '0.5px'
        },
        h6: {
            fontWeight: 600,
            letterSpacing: '0.3px'
        }
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backdropFilter: 'blur(10px)'
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: 'linear-gradient(90deg, rgba(25, 25, 35, 0.95) 0%, rgba(35, 35, 45, 0.95) 100%)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }
            }
        }
    }
});

function App() {
    const [machines, setMachines] = useState<Machine[]>([]);
    const [selectedMachine, setSelectedMachine] = useState<MachineDetailsType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        fetchMachines();
        const interval = setInterval(fetchMachines, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchMachines = async () => {
        try {
            const data = await api.fetchMachines({ limit: 10 });
            setMachines(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch machines');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectMachine = async (machineId: string) => {
        try {
            const data = await api.fetchMachineDetails(machineId);
            setSelectedMachine(data);
        } catch (err) {
            setError('Failed to fetch machine details');
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ 
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <AppBar position="fixed" elevation={0}>
                    <Toolbar sx={{ 
                        display: 'flex', 
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '64px',
                        pt: 1,
                        pb: 1
                    }}>
                        <Typography 
                            variant="h5" 
                            component="div" 
                            sx={{ 
                                background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 50%, #00BCD4 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 700,
                                letterSpacing: '0.5px',
                                textAlign: 'center',
                                position: 'relative',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: -8,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '60%',
                                    height: '2px',
                                    background: 'linear-gradient(90deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 203, 243, 0.5) 50%, rgba(0, 188, 212, 0.1) 100%)',
                                    borderRadius: '2px'
                                }
                            }}
                        >
                            System Health Dashboard
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Toolbar /> {/* Spacer for fixed AppBar */}
                <Container 
                    maxWidth="xl" 
                    sx={{ 
                        flex: 1,
                        py: 3,
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: 3,
                        height: 'calc(100vh - 88px)',
                        overflow: 'hidden'
                    }}
                >
                    <Box 
                        sx={{ 
                            width: isMobile ? '100%' : '350px',
                            flexShrink: 0,
                            position: isMobile ? 'static' : 'sticky',
                            top: 0,
                            height: isMobile ? 'auto' : 'calc(100vh - 88px)',
                            overflow: 'auto'
                        }}
                    >
                        <MachineList 
                            machines={machines}
                            onSelect={handleSelectMachine}
                            selectedId={selectedMachine?.machine_id}
                        />
                    </Box>
                    <Box 
                        sx={{ 
                            flex: 1,
                            overflow: 'auto',
                            height: isMobile ? 'auto' : 'calc(100vh - 88px)'
                        }}
                    >
                        {selectedMachine && (
                            <MachineDetails machine={selectedMachine} />
                        )}
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default App; 