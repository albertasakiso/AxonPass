/* ===================================================================
   AXONPASS — Scalable AI Compute Cluster Management Component
   Full CRUD & Real-Time Health Pings for Local & Tailscale Ollama Nodes
   =================================================================== */

import { useState } from 'react';
import {
  getClusterMachines,
  upsertClusterMachine,
  deleteClusterMachine,
  setActiveMachine,
  pingClusterMachine,
  type AiClusterMachine,
} from '../../lib/ai/aiClusterStore';

export default function AiClusterConfigPanel() {
  const [machines, setMachines] = useState<AiClusterMachine[]>(getClusterMachines);
  const [editingMachine, setEditingMachine] = useState<Partial<AiClusterMachine> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pingingId, setPingingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const refreshList = () => {
    setMachines(getClusterMachines());
  };

  const handleSelectActive = (id: string) => {
    const selected = setActiveMachine(id);
    refreshList();
    if (selected) {
      setNotice({
        text: `✓ Active AI reasoning node switched to ${selected.name} (${selected.address}:${selected.port})`,
        type: 'success',
      });
      setTimeout(() => setNotice(null), 4000);
    }
  };

  const handleOpenAdd = () => {
    setEditingMachine({
      name: '',
      address: '',
      port: 11434,
      protocol: 'http',
      gpuCompute: '',
      osVersion: 'Windows 11 25H2',
      tailscaleVersion: '1.102.4',
      model: 'axonpass-mentor',
      isActive: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (machine: AiClusterMachine) => {
    setEditingMachine({ ...machine });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove compute node "${name}"?`)) {
      deleteClusterMachine(id);
      refreshList();
      setNotice({ text: `✓ Node "${name}" removed.`, type: 'success' });
      setTimeout(() => setNotice(null), 3000);
    }
  };

  const handlePing = async (machine: AiClusterMachine) => {
    setPingingId(machine.id);
    const res = await pingClusterMachine(machine);
    setPingingId(null);
    refreshList();

    if (res.ok) {
      setNotice({
        text: `✓ ${machine.name} responded in ${res.latencyMs}ms! Detected models: ${res.models.join(', ') || 'None'}`,
        type: 'success',
      });
    } else {
      setNotice({
        text: `✕ Connection failed to ${machine.name}: ${res.error}. Ensure OLLAMA_ORIGINS="*" is set on host.`,
        type: 'error',
      });
    }
    setTimeout(() => setNotice(null), 6000);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMachine?.name?.trim() || !editingMachine?.address?.trim()) {
      alert('Please provide both Machine Name and Address / IP.');
      return;
    }

    upsertClusterMachine({
      id: editingMachine.id,
      name: editingMachine.name,
      address: editingMachine.address,
      port: Number(editingMachine.port) || 11434,
      protocol: editingMachine.protocol || 'http',
      gpuCompute: editingMachine.gpuCompute,
      osVersion: editingMachine.osVersion,
      tailscaleVersion: editingMachine.tailscaleVersion,
      model: editingMachine.model || 'axonpass-mentor',
      isActive: editingMachine.isActive,
      notes: editingMachine.notes,
    });

    setIsModalOpen(false);
    setEditingMachine(null);
    refreshList();
    setNotice({ text: '✓ Machine configuration saved successfully.', type: 'success' });
    setTimeout(() => setNotice(null), 3000);
  };

  const activeNode = machines.find((m) => m.isActive) || machines[0];

  return (
    <div className="settings-section">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ margin: 0 }}>🧠 AI Compute Cluster &amp; Machine Nodes</h3>
          <p className="text-muted" style={{ fontSize: 'var(--text-xs)', margin: '2px 0 0 0' }}>
            Multi-node local LLM infrastructure via Tailscale &amp; LAN. Seamlessly switch reasoning workloads between workstations.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={handleOpenAdd}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <span>＋</span> Add Compute Machine
        </button>
      </div>

      {notice && (
        <div
          style={{
            padding: 'var(--space-3)',
            marginBottom: 'var(--space-3)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-xs)',
            backgroundColor: notice.type === 'success' ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
            color: notice.type === 'success' ? 'var(--color-success)' : 'var(--color-error)',
            border: `1px solid ${notice.type === 'success' ? 'var(--color-success-border)' : 'var(--color-error-border)'}`,
          }}
        >
          {notice.text}
        </div>
      )}

      {/* Cluster Status Summary Bar */}
      <div
        className="card"
        style={{
          padding: 'var(--space-3) var(--space-4)',
          marginBottom: 'var(--space-3)',
          backgroundColor: 'var(--color-primary-surface)',
          border: '1px solid var(--color-primary-200)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ fontSize: '1.6rem' }}>⚡</div>
          <div>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-primary)' }}>
              Active Routing Node: {activeNode?.name || 'None'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
              Target: <code>{activeNode ? `${activeNode.protocol}://${activeNode.address}:${activeNode.port}` : 'None'}</code> • Model: <strong>{activeNode?.model || 'axonpass-mentor'}</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span className="badge badge-primary" style={{ fontSize: '11px' }}>
            {machines.length} Total Nodes
          </span>
          {activeNode?.gpuCompute && (
            <span className="badge badge-success" style={{ fontSize: '11px' }}>
              🎮 {activeNode.gpuCompute.split('(')[0].trim()}
            </span>
          )}
        </div>
      </div>

      {/* Scalable Machines Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-3)' }}>
        {machines.map((machine) => {
          const isPinging = pingingId === machine.id;
          let badgeClass = 'badge-neutral';
          let statusText = 'Untested';

          if (machine.status === 'connected') {
            badgeClass = 'badge-success';
            statusText = machine.latencyMs ? `Connected (${machine.latencyMs}ms)` : 'Connected';
          } else if (machine.status === 'offline') {
            badgeClass = 'badge-error';
            statusText = 'Offline / Unreachable';
          }

          return (
            <div
              key={machine.id}
              className="card"
              style={{
                padding: 'var(--space-4)',
                border: machine.isActive ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                backgroundColor: machine.isActive ? 'var(--color-bg)' : 'var(--color-bg-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div>
                {/* Header with Active Radio and Status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
                    <input
                      type="radio"
                      name="active_machine"
                      checked={machine.isActive}
                      onChange={() => handleSelectActive(machine.id)}
                    />
                    <strong style={{ fontSize: 'var(--text-sm)', color: machine.isActive ? 'var(--color-primary)' : 'var(--color-ink)' }}>
                      {machine.name}
                    </strong>
                  </label>

                  <span className={`badge ${badgeClass}`} style={{ fontSize: '10px' }}>
                    {statusText}
                  </span>
                </div>

                {/* Machine Specs & Tailscale Address */}
                <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)', lineHeight: 1.6, marginBottom: 'var(--space-3)' }}>
                  <div>
                    🌐 <strong>Tailscale Address:</strong>{' '}
                    <code style={{ backgroundColor: 'rgba(0,0,0,0.06)', padding: '1px 4px', borderRadius: '3px' }}>
                      {machine.address}:{machine.port}
                    </code>
                  </div>
                  <div>
                    💻 <strong>OS &amp; Version:</strong> {machine.osVersion || 'Windows 11'} (Tailscale v{machine.tailscaleVersion || '1.102.4'})
                  </div>
                  {machine.gpuCompute && (
                    <div>
                      🎮 <strong>Compute Accelerator:</strong> {machine.gpuCompute}
                    </div>
                  )}
                  <div>
                    🧠 <strong>Active Model:</strong> <code>{machine.model}</code>
                  </div>
                  <div>
                    🕒 <strong>Last Seen:</strong> {machine.lastSeen || 'Recent'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: 'var(--space-2)',
                  borderTop: '1px solid var(--border-color)',
                  gap: 'var(--space-2)',
                }}
              >
                <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                  <button
                    type="button"
                    className="btn btn-xs btn-secondary"
                    onClick={() => handlePing(machine)}
                    disabled={isPinging}
                  >
                    {isPinging ? 'Pinging...' : '⚡ Ping Test'}
                  </button>

                  <button
                    type="button"
                    className="btn btn-xs btn-ghost"
                    onClick={() => handleOpenEdit(machine)}
                  >
                    ✏️ Edit
                  </button>
                </div>

                <div>
                  <button
                    type="button"
                    className="btn btn-xs btn-ghost"
                    style={{ color: 'var(--color-error)' }}
                    onClick={() => handleDelete(machine.id, machine.name)}
                    disabled={machines.length <= 1}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Creating / Editing Machine */}
      {isModalOpen && editingMachine && (
        <div className="reader-modal-overlay animate-fade-in" onClick={() => setIsModalOpen(false)}>
          <div
            className="card"
            style={{ maxWidth: '520px', width: '92%', margin: 'auto', padding: 'var(--space-5)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 var(--space-3) 0', fontSize: 'var(--text-base)' }}>
              {editingMachine.id ? '✏️ Edit Compute Machine' : '＋ Register AI Machine Node'}
            </h3>

            <form onSubmit={handleSaveModal} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '2px' }}>
                  Machine Identifier / Name:
                </label>
                <input
                  type="text"
                  className="input input-sm"
                  style={{ width: '100%' }}
                  value={editingMachine.name || ''}
                  onChange={(e) => setEditingMachine({ ...editingMachine, name: e.target.value })}
                  placeholder="e.g. desktop-vhje5q3"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-2)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '2px' }}>
                    Address / Tailscale IP:
                  </label>
                  <input
                    type="text"
                    className="input input-sm"
                    style={{ width: '100%' }}
                    value={editingMachine.address || ''}
                    onChange={(e) => setEditingMachine({ ...editingMachine, address: e.target.value })}
                    placeholder="100.98.49.117"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '2px' }}>
                    Port:
                  </label>
                  <input
                    type="number"
                    className="input input-sm"
                    style={{ width: '100%' }}
                    value={editingMachine.port || 11434}
                    onChange={(e) => setEditingMachine({ ...editingMachine, port: parseInt(e.target.value, 10) })}
                    placeholder="11434"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '2px' }}>
                  Preferred Reasoning Model:
                </label>
                <input
                  type="text"
                  className="input input-sm"
                  style={{ width: '100%' }}
                  value={editingMachine.model || 'axonpass-mentor'}
                  onChange={(e) => setEditingMachine({ ...editingMachine, model: e.target.value })}
                  placeholder="axonpass-mentor or deepseek-r1:8b"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '2px' }}>
                  Hardware / GPU Compute Specs:
                </label>
                <input
                  type="text"
                  className="input input-sm"
                  style={{ width: '100%' }}
                  value={editingMachine.gpuCompute || ''}
                  onChange={(e) => setEditingMachine({ ...editingMachine, gpuCompute: e.target.value })}
                  placeholder="e.g. NVIDIA GeForce RTX 4060 Laptop GPU (CUDA 8.9)"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '2px' }}>
                    OS Version:
                  </label>
                  <input
                    type="text"
                    className="input input-sm"
                    style={{ width: '100%' }}
                    value={editingMachine.osVersion || 'Windows 11 25H2'}
                    onChange={(e) => setEditingMachine({ ...editingMachine, osVersion: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '2px' }}>
                    Tailscale Version:
                  </label>
                  <input
                    type="text"
                    className="input input-sm"
                    style={{ width: '100%' }}
                    value={editingMachine.tailscaleVersion || '1.102.4'}
                    onChange={(e) => setEditingMachine({ ...editingMachine, tailscaleVersion: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Machine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
