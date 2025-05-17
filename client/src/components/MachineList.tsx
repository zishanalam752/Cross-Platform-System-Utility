import React from 'react';
import {
    Paper,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
    Box,
    Chip,
    Divider,
    useTheme
} from '@mui/material';
import { Machine, SystemCheck } from '../types';

interface MachineListProps {
    machines: Machine[];
    onSelect: (machineId: string) => void;
    selectedId?: string;
}

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

const MachineList: React.FC<MachineListProps> = ({ machines, onSelect, selectedId }) => {
    const theme = useTheme();

    return (
        <Paper 
            elevation={3}
            sx={{ 
                p: 3,
                height: '100%',
                background: 'linear-gradient(145deg, rgba(25, 25, 35, 0.95) 0%, rgba(35, 35, 45, 0.95) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
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
                System Health Dashboard
            </Typography>
            <List sx={{ 
                width: '100%',
                bgcolor: 'transparent',
                '& .MuiListItem-root': {
                    mb: 1,
                    borderRadius: '8px',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        background: 'linear-gradient(145deg, rgba(40, 40, 50, 0.8) 0%, rgba(50, 50, 60, 0.8) 100%)',
                        boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.2)'
                    }
                }
            }}>
                {machines.map((machine) => (
                    <ListItem
                        key={machine.machine_id}
                        button
                        selected={selectedId === machine.machine_id}
                        onClick={() => onSelect(machine.machine_id)}
                        sx={{
                            background: selectedId === machine.machine_id 
                                ? 'linear-gradient(145deg, rgba(40, 40, 50, 0.8) 0%, rgba(50, 50, 60, 0.8) 100%)'
                                : 'linear-gradient(145deg, rgba(30, 30, 40, 0.8) 0%, rgba(40, 40, 50, 0.8) 100%)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.2)',
                            '&.Mui-selected': {
                                background: 'linear-gradient(145deg, rgba(40, 40, 50, 0.8) 0%, rgba(50, 50, 60, 0.8) 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(145deg, rgba(45, 45, 55, 0.8) 0%, rgba(55, 55, 65, 0.8) 100%)'
                                }
                            }
                        }}
                    >
                        <ListItemText
                            primary={
                                <Typography 
                                    variant="subtitle1" 
                                    sx={{ 
                                        color: '#E0E0E0',
                                        fontWeight: 500,
                                        mb: 1
                                    }}
                                >
                                    {machine.machine_id}
                                </Typography>
                            }
                            secondary={
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    <Chip 
                                        label={`Disk: ${machine.status.disk_encryption.status}`}
                                        color={getStatusColor(machine.status.disk_encryption) as any}
                                        size="small"
                                        sx={{ 
                                            minWidth: '100px',
                                            borderRadius: '12px',
                                            fontWeight: 500,
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                    />
                                    <Chip 
                                        label={`Updates: ${machine.status.os_updates.status}`}
                                        color={getStatusColor(machine.status.os_updates) as any}
                                        size="small"
                                        sx={{ 
                                            minWidth: '100px',
                                            borderRadius: '12px',
                                            fontWeight: 500,
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                    />
                                    <Chip 
                                        label={`AV: ${machine.status.antivirus.status}`}
                                        color={getStatusColor(machine.status.antivirus) as any}
                                        size="small"
                                        sx={{ 
                                            minWidth: '100px',
                                            borderRadius: '12px',
                                            fontWeight: 500,
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                    />
                                </Box>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default MachineList; 