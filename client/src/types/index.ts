export interface SystemState {
  diskEncryption: boolean;
  osUpdates: {
    current: string;
    latest: string;
    needsUpdate: boolean;
  };
  antivirus: {
    present: boolean;
    status: string;
  };
  sleepSettings: {
    timeout: number;
    compliant: boolean;
  };
  timestamp: Date;
}

export interface SystemCheck {
    status: string;
    details?: string;
    name?: string;
    sleep_time_minutes?: number;
}

export interface SystemChecks {
    disk_encryption: SystemCheck;
    os_updates: SystemCheck;
    antivirus: SystemCheck;
    sleep_settings: SystemCheck;
}

export interface OS {
    system: string;
    version: string;
    release: string;
}

export interface Machine {
    machine_id: string;
    last_seen: string;
    os: OS;
    status: {
        disk_encryption: string;
        os_updates: string;
        antivirus: string;
        sleep_settings: string;
    };
}

export interface MachineDetails extends Machine {
    checks: SystemChecks;
}

export interface HistoryEntry {
    timestamp: string;
    checks: SystemChecks;
} 