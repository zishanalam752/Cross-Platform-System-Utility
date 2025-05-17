export interface SystemCheck {
    status: string;
    details?: string;
}

export interface Machine {
    machine_id: string;
    os: {
        system: string;
        release: string;
    };
    last_seen: string;
    status: {
        disk_encryption: SystemCheck;
        os_updates: SystemCheck;
        antivirus: SystemCheck;
        sleep_settings: SystemCheck;
    };
}

export interface MachineDetails extends Machine {
    checks: {
        disk_encryption: SystemCheck;
        os_updates: SystemCheck;
        antivirus: SystemCheck;
        sleep_settings: SystemCheck;
    };
}

export interface HistoryEntry {
    timestamp: string;
    checks: {
        disk_encryption: SystemCheck;
        os_updates: SystemCheck;
        antivirus: SystemCheck;
        sleep_settings: SystemCheck;
    };
} 