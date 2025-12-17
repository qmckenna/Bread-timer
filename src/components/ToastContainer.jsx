import { useState, useEffect } from 'react';

export default function ToastContainer({ notifications, onClose }) {
    if (!notifications || notifications.length === 0) return null;

    return (
        <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {notifications.map((n) => (
                <div
                    key={n.id}
                    style={{
                        background: 'rgba(30, 41, 59, 0.95)',
                        borderLeft: '4px solid var(--color-primary)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                        backdropFilter: 'blur(5px)',
                        color: 'white',
                        minWidth: '300px',
                        animation: 'slideIn 0.3s ease-out'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <strong style={{ display: 'block', fontSize: '1rem', marginBottom: '0.25rem' }}>{n.title}</strong>
                            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{n.message}</span>
                        </div>
                        <button onClick={() => onClose(n.id)} style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem', padding: '0 0.5rem' }}>&times;</button>
                    </div>
                </div>
            ))}
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
