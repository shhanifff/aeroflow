import React from 'react';

export interface NodeData {
  id: string;
  name: string;
  type: string;
  output: number;
  maxCapacity: number;
  status: 'optimal' | 'warning' | 'critical' | 'offline';
}

interface DetailsTableProps {
  nodes: NodeData[];
}

export const DetailsTable: React.FC<DetailsTableProps> = ({ nodes }) => {
  const getStatusBadgeClass = (status: NodeData['status']) => {
    switch (status) {
      case 'optimal': return 'status-badge optimal';
      case 'warning': return 'status-badge warning';
      case 'critical': return 'status-badge critical';
      default: return 'status-badge offline';
    }
  };

  return (
    <div className="table-card">
      <div className="table-header-container">
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Energy Source Registry</h3>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Status and operational efficiency per resource node</span>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Node Name</th>
              <th>Type</th>
              <th>Simulated Output</th>
              <th>Efficiency</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((node) => {
              const efficiency = node.maxCapacity > 0 
                ? ((node.output / node.maxCapacity) * 100).toFixed(0) 
                : 'N/A';
                
              return (
                <tr key={node.id}>
                  <td style={{ fontWeight: 600 }}>{node.name}</td>
                  <td style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{node.type}</td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-headings)', fontWeight: 600 }}>
                      {node.output.toFixed(1)}
                    </span>{' '}
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>MW</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '40px', textAlign: 'right', fontWeight: 500 }}>
                        {efficiency === 'N/A' ? '—' : `${efficiency}%`}
                      </span>
                      {efficiency !== 'N/A' && (
                        <div style={{ flexGrow: 1, height: '4px', background: 'var(--border-gray)', borderRadius: '2px', width: '60px', overflow: 'hidden' }}>
                          <div 
                            style={{ 
                              height: '100%', 
                              background: 'var(--emerald-green)', 
                              width: `${Math.min(100, parseFloat(efficiency))}%` 
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(node.status)}>
                      <span className="status-dot"></span>
                      {node.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
