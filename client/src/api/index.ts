import { Machine, MachineDetails } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const fetchMachines = async (filters: any): Promise<Machine[]> => {
  const queryParams = new URLSearchParams();
  if (filters.limit) queryParams.append('limit', filters.limit.toString());

  const response = await fetch(`${API_URL}/machines?${queryParams}`, {
    headers: {
      'X-API-Key': 'system-monitor-secure-key-2024'
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch machines');
  }
  return response.json();
};

export const fetchMachineDetails = async (machineId: string): Promise<MachineDetails> => {
  const response = await fetch(`${API_URL}/machine/${machineId}`, {
    headers: {
      'X-API-Key': 'system-monitor-secure-key-2024'
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch machine details');
  }
  return response.json();
}; 