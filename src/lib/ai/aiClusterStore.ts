/* ===================================================================
   AXONPASS — Scalable AI Compute Cluster & Machine Management Store
   Supports Multi-Machine Ollama Topologies via LAN & Tailscale
   =================================================================== */

import { saveOllamaSettings } from './ollamaService';

export interface AiClusterMachine {
  id: string;
  name: string; // e.g., 'desktop-vhje5q3'
  address: string; // e.g., '100.98.49.117'
  port: number; // e.g., 11434
  protocol: 'http' | 'https';
  gpuCompute?: string; // e.g., 'NVIDIA GeForce RTX 4060 Laptop GPU (CUDA 8.9)'
  osVersion?: string; // e.g., 'Windows 11 25H2'
  tailscaleVersion?: string; // '1.102.4'
  lastSeen?: string; // 'Connected' or timestamp
  model: string; // 'axonpass-mentor' | 'deepseek-r1:8b'
  isActive: boolean;
  status: 'connected' | 'offline' | 'untested';
  latencyMs?: number;
  availableModels?: string[];
  notes?: string;
}

const STORAGE_KEY = 'axonpass_ai_cluster_machines';

export const INITIAL_MACHINES: AiClusterMachine[] = [
  {
    id: 'node-desktop-vhje5q3',
    name: 'desktop-vhje5q3 (Primary GPU Node)',
    address: '100.98.49.117',
    port: 11434,
    protocol: 'http',
    gpuCompute: 'NVIDIA GeForce RTX 4060 Laptop GPU (8GB VRAM, CUDA 8.9)',
    osVersion: 'Windows 11 25H2',
    tailscaleVersion: '1.102.4',
    lastSeen: 'Connected (Live Ollama Server)',
    model: 'axonpass-mentor',
    isActive: true,
    status: 'connected',
    notes: 'Primary reasoning workstation running ollama serve on port 11434 with OLLAMA_ORIGINS=*',
  },
  {
    id: 'node-desktop-uk9f5m4',
    name: 'desktop-uk9f5m4 (Secondary Node)',
    address: '100.107.250.3',
    port: 11434,
    protocol: 'http',
    gpuCompute: 'Secondary Compute Node',
    osVersion: 'Windows 11 25H2',
    tailscaleVersion: '1.102.4',
    lastSeen: 'Sep 28, 4:17 PM GMT',
    model: 'deepseek-r1:8b',
    isActive: false,
    status: 'untested',
    notes: 'Secondary Tailscale compute machine for backup inference or distributed workloads',
  },
];

export function getClusterMachines(): AiClusterMachine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MACHINES));
      return INITIAL_MACHINES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MACHINES;
  } catch {
    return INITIAL_MACHINES;
  }
}

export function saveClusterMachines(machines: AiClusterMachine[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(machines));
}

export function getActiveMachine(): AiClusterMachine {
  const machines = getClusterMachines();
  return machines.find((m) => m.isActive) || machines[0] || INITIAL_MACHINES[0];
}

export function setActiveMachine(id: string): AiClusterMachine | null {
  const machines = getClusterMachines();
  const found = machines.find((m) => m.id === id);
  if (!found) return null;

  const updated = machines.map((m) => ({
    ...m,
    isActive: m.id === id,
  }));

  saveClusterMachines(updated);

  const targetUrl = `${found.protocol}://${found.address}:${found.port}`;
  saveOllamaSettings({
    endpoint: targetUrl,
    model: found.model,
    enabled: true,
  });

  return { ...found, isActive: true };
}

export function upsertClusterMachine(machine: Partial<AiClusterMachine> & { name: string; address: string }): AiClusterMachine {
  const machines = getClusterMachines();
  const id = machine.id || `node-${Date.now()}`;

  const fullMachine: AiClusterMachine = {
    id,
    name: machine.name.trim(),
    address: machine.address.trim(),
    port: machine.port || 11434,
    protocol: machine.protocol || 'http',
    gpuCompute: machine.gpuCompute || 'Standard CPU/GPU',
    osVersion: machine.osVersion || 'Windows 11',
    tailscaleVersion: machine.tailscaleVersion || '1.102.4',
    lastSeen: machine.lastSeen || new Date().toLocaleString(),
    model: machine.model || 'axonpass-mentor',
    isActive: machine.isActive ?? false,
    status: machine.status || 'untested',
    notes: machine.notes || '',
  };

  const existingIdx = machines.findIndex((m) => m.id === id);
  let updated: AiClusterMachine[];

  if (existingIdx >= 0) {
    updated = [...machines];
    updated[existingIdx] = { ...updated[existingIdx], ...fullMachine };
  } else {
    updated = [...machines, fullMachine];
  }

  // If this machine was marked active, deactivate others
  if (fullMachine.isActive) {
    updated = updated.map((m) => ({ ...m, isActive: m.id === id }));
    const targetUrl = `${fullMachine.protocol}://${fullMachine.address}:${fullMachine.port}`;
    saveOllamaSettings({
      endpoint: targetUrl,
      model: fullMachine.model,
    });
  }

  saveClusterMachines(updated);
  return fullMachine;
}

export function deleteClusterMachine(id: string): void {
  const machines = getClusterMachines();
  const filtered = machines.filter((m) => m.id !== id);

  // If deleting the active machine, make the first remaining machine active
  if (filtered.length > 0 && !filtered.some((m) => m.isActive)) {
    filtered[0].isActive = true;
    const targetUrl = `${filtered[0].protocol}://${filtered[0].address}:${filtered[0].port}`;
    saveOllamaSettings({
      endpoint: targetUrl,
      model: filtered[0].model,
    });
  }

  saveClusterMachines(filtered);
}

export async function pingClusterMachine(machine: AiClusterMachine): Promise<{
  ok: boolean;
  latencyMs: number;
  models: string[];
  error?: string;
}> {
  const base = `${machine.protocol}://${machine.address}:${machine.port}`;
  const startTime = performance.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${base}/api/tags`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);
    const latencyMs = Math.round(performance.now() - startTime);

    if (!res.ok) {
      return {
        ok: false,
        latencyMs,
        models: [],
        error: `HTTP ${res.status}: ${res.statusText}`,
      };
    }

    const data = await res.json();
    const models = Array.isArray(data.models) ? data.models.map((m: { name: string }) => m.name) : [];

    // Update machine status in store
    const machines = getClusterMachines();
    const updated = machines.map((m) => {
      if (m.id === machine.id) {
        return {
          ...m,
          status: 'connected' as const,
          latencyMs,
          availableModels: models,
          lastSeen: 'Connected (Live)',
        };
      }
      return m;
    });
    saveClusterMachines(updated);

    return {
      ok: true,
      latencyMs,
      models,
    };
  } catch (err: unknown) {
    const latencyMs = Math.round(performance.now() - startTime);
    const msg = err instanceof Error ? err.message : String(err);

    // Update machine status to offline in store
    const machines = getClusterMachines();
    const updated = machines.map((m) => {
      if (m.id === machine.id) {
        return {
          ...m,
          status: 'offline' as const,
          latencyMs,
          lastSeen: `Offline check: ${new Date().toLocaleTimeString()}`,
        };
      }
      return m;
    });
    saveClusterMachines(updated);

    return {
      ok: false,
      latencyMs,
      models: [],
      error: msg,
    };
  }
}
