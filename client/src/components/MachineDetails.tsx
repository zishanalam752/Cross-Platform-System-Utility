import React, { useState, useEffect } from 'react';
import {
    Paper,
    Typography,
    Box,
    Grid,
    Chip,
    Card,
    CardContent,
    CircularProgress,
    useTheme
} from '@mui/material';
import { MachineDetails as MachineDetailsType, HistoryEntry, SystemCheck } from '../types';
import api from '../api/api';

interface Props {
    machine: MachineDetailsType;
}

const MachineDetails: React.FC<Props> = ({ machine }) => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const theme = useTheme();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await api.getMachineHistory(machine.machine_id);
                setHistory(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch machine history');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [machine.machine_id]);

    const getStatusColor = (check: SystemCheck) => {
        if (!check || !check.status) return 'default';
        switch (check.status.toLowerCase()) {
            case 'encrypted':
            case 'up_to_date':
            case 'active':
            case 'ok':
                return 'success';
            case 'unencrypted':
            case 'updates_available':
            case 'inactive':
            case 'too_long':
                return 'error';
            default:
                return 'warning';
        }
    };

    if (!machine || !machine.checks || !machine.status) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography>No machine details available</Typography>
            </Box>
        );
    }

    return (
        <Paper 
            elevation={3} 
            sx={{ 
                p: 3,
                height: '100%',
                minHeight: '800px',
                maxHeight: 'none',
                overflow: 'auto',
                background: 'rgba(25, 25, 35, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                '&::-webkit-scrollbar': {
                    width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    '&:hover': {
                        background: 'rgba(255, 255, 255, 0.3)',
                    },
                },
            }}
        >
            <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 50%, #00BCD4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 4,
                    position: 'relative',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -8,
                        left: 0,
                        width: '100%',
                        height: '2px',
                        background: 'linear-gradient(90deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 203, 243, 0.5) 50%, rgba(0, 188, 212, 0.1) 100%)',
                        borderRadius: '2px'
                    }
                }}
            >
                {machine.machine_id}
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Paper 
                        elevation={0}
                        sx={{ 
                            p: 3,
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 2,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                background: 'rgba(255, 255, 255, 0.08)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.2)'
                            }
                        }}
                    >
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                mb: 2,
                                color: '#E0E0E0',
                                fontWeight: 600
                            }}
                        >
                            System Information
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Typography 
                                    variant="subtitle2" 
                                    sx={{ 
                                        color: '#90CAF9',
                                        mb: 1
                                    }}
                                >
                                    Operating System
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        color: '#E0E0E0',
                                        wordBreak: 'break-word'
                                    }}
                                >
                                    {machine.os?.system} {machine.os?.release}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography 
                                    variant="subtitle2" 
                                    sx={{ 
                                        color: '#90CAF9',
                                        mb: 1
                                    }}
                                >
                                    Last Seen
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        color: '#E0E0E0',
                                        wordBreak: 'break-word'
                                    }}
                                >
                                    {machine.last_seen ? new Date(machine.last_seen).toLocaleString() : 'N/A'}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper 
                        elevation={0}
                        sx={{ 
                            p: 3,
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 2,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                background: 'rgba(255, 255, 255, 0.08)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.2)'
                            }
                        }}
                    >
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                mb: 2,
                                color: '#E0E0E0',
                                fontWeight: 600
                            }}
                        >
                            Security Status
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper 
                                    elevation={0}
                                    sx={{ 
                                        p: 2,
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: 2,
                                        textAlign: 'center'
                                    }}
                                >
                                    <Typography 
                                        variant="subtitle2" 
                                        sx={{ 
                                            color: '#90CAF9',
                                            mb: 1
                                        }}
                                    >
                                        Disk Encryption
                                    </Typography>
                                    <Chip
                                        label={machine.status.disk_encryption?.status || 'Unknown'}
                                        color={getStatusColor(machine.status.disk_encryption) as any}
                                        sx={{ 
                                            minWidth: '100px',
                                            borderRadius: '12px',
                                            fontWeight: 500,
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                    />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper 
                                    elevation={0}
                                    sx={{ 
                                        p: 2,
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: 2,
                                        textAlign: 'center'
                                    }}
                                >
                                    <Typography 
                                        variant="subtitle2" 
                                        sx={{ 
                                            color: '#90CAF9',
                                            mb: 1
                                        }}
                                    >
                                        OS Updates
                                    </Typography>
                                    <Chip
                                        label={machine.status.os_updates?.status || 'Unknown'}
                                        color={getStatusColor(machine.status.os_updates) as any}
                                        sx={{ 
                                            minWidth: '100px',
                                            borderRadius: '12px',
                                            fontWeight: 500,
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                    />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper 
                                    elevation={0}
                                    sx={{ 
                                        p: 2,
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: 2,
                                        textAlign: 'center'
                                    }}
                                >
                                    <Typography 
                                        variant="subtitle2" 
                                        sx={{ 
                                            color: '#90CAF9',
                                            mb: 1
                                        }}
                                    >
                                        Antivirus
                                    </Typography>
                                    <Chip
                                        label={machine.status.antivirus?.status || 'Unknown'}
                                        color={getStatusColor(machine.status.antivirus) as any}
                                        sx={{ 
                                            minWidth: '100px',
                                            borderRadius: '12px',
                                            fontWeight: 500,
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                    />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper 
                                    elevation={0}
                                    sx={{ 
                                        p: 2,
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: 2,
                                        textAlign: 'center'
                                    }}
                                >
                                    <Typography 
                                        variant="subtitle2" 
                                        sx={{ 
                                            color: '#90CAF9',
                                            mb: 1
                                        }}
                                    >
                                        Sleep Settings
                                    </Typography>
                                    <Chip
                                        label={machine.status.sleep_settings?.status || 'Unknown'}
                                        color={getStatusColor(machine.status.sleep_settings) as any}
                                        sx={{ 
                                            minWidth: '100px',
                                            borderRadius: '12px',
                                            fontWeight: 500,
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                    />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper 
                        elevation={0}
                        sx={{ 
                            p: 3,
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 2,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                background: 'rgba(255, 255, 255, 0.08)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.2)'
                            }
                        }}
                    >
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                mb: 2,
                                color: '#E0E0E0',
                                fontWeight: 600
                            }}
                        >
                            History
                        </Typography>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                <CircularProgress color="primary" />
                            </Box>
                        ) : error ? (
                            <Typography color="error">{error}</Typography>
                        ) : (
                            <Box sx={{ maxHeight: 'none', overflow: 'visible' }}>
                                {history.map((entry, index) => (
                                    <Paper 
                                        key={index}
                                        elevation={0}
                                        sx={{ 
                                            p: 2,
                                            mb: 2,
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: 2,
                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': {
                                                background: 'rgba(255, 255, 255, 0.08)',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.2)'
                                            }
                                        }}
                                    >
                                        <Typography 
                                            variant="subtitle2" 
                                            sx={{ 
                                                color: '#90CAF9',
                                                mb: 1
                                            }}
                                        >
                                            {new Date(entry.timestamp).toLocaleString()}
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Chip 
                                                    label={`Disk: ${entry.checks.disk_encryption.status}`}
                                                    color={getStatusColor(entry.checks.disk_encryption) as any}
                                                    size="small"
                                                    sx={{ 
                                                        minWidth: '100px',
                                                        borderRadius: '12px',
                                                        fontWeight: 500,
                                                        background: 'rgba(255, 255, 255, 0.1)',
                                                        backdropFilter: 'blur(10px)'
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Chip 
                                                    label={`Updates: ${entry.checks.os_updates.status}`}
                                                    color={getStatusColor(entry.checks.os_updates) as any}
                                                    size="small"
                                                    sx={{ 
                                                        minWidth: '100px',
                                                        borderRadius: '12px',
                                                        fontWeight: 500,
                                                        background: 'rgba(255, 255, 255, 0.1)',
                                                        backdropFilter: 'blur(10px)'
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Chip 
                                                    label={`AV: ${entry.checks.antivirus.status}`}
                                                    color={getStatusColor(entry.checks.antivirus) as any}
                                                    size="small"
                                                    sx={{ 
                                                        minWidth: '100px',
                                                        borderRadius: '12px',
                                                        fontWeight: 500,
                                                        background: 'rgba(255, 255, 255, 0.1)',
                                                        backdropFilter: 'blur(10px)'
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Chip 
                                                    label={`Sleep: ${entry.checks.sleep_settings.status}`}
                                                    color={getStatusColor(entry.checks.sleep_settings) as any}
                                                    size="small"
                                                    sx={{ 
                                                        minWidth: '100px',
                                                        borderRadius: '12px',
                                                        fontWeight: 500,
                                                        background: 'rgba(255, 255, 255, 0.1)',
                                                        backdropFilter: 'blur(10px)'
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                ))}
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default MachineDetails; 