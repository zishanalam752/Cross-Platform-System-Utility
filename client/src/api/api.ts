import axios from 'axios';
import { Machine, MachineDetails, HistoryEntry } from '../types';

const API_BASE_URL = 'http://localhost:5000';
const API_KEY = 'system-monitor-secure-key-2024';

// Create axios instance with default headers
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
    }
});

const api = {
    async getMachines(): Promise<Machine[]> {
        const response = await axiosInstance.get('/machines');
        return response.data;
    },

    async getMachineDetails(machineId: string): Promise<MachineDetails> {
        const response = await axiosInstance.get(`/machine/${machineId}`);
        return response.data;
    },

    async getMachineHistory(machineId: string, limit: number = 10): Promise<HistoryEntry[]> {
        const response = await axiosInstance.get(`/machine/${machineId}/history`, {
            params: { limit }
        });
        return response.data;
    }
};

export default api; 