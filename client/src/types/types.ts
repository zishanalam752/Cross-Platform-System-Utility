export interface Process {
    pid: number;
    name: string;
    cpu_percent: number;
    memory_percent: number;
    status: string;
    create_time: number;
}

export interface SystemInfo {
    cpu_percent: number;
    memory_percent: number;
    disk_percent: number;
    boot_time: number;
}

export interface ProcessListResponse {
    processes: Process[];
    system_info: SystemInfo;
}

export interface KillProcessResponse {
    success: boolean;
    message: string;
} 