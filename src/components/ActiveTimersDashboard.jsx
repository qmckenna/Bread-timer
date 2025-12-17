import { useState, useEffect } from 'react';
import { useRecipes } from '../context/RecipeContext';
import { formatTime } from '../utils/timeUtils';
import { generateGoogleCalendarUrl } from '../utils/calendarUtils';

export default function ActiveTimersDashboard() {
    const { activeTimers, setActiveTimers } = useRecipes();
    const [_, setTick] = useState(0); // Force re-render

    useEffect(() => {
        const interval = setInterval(() => {
            setTick(t => t + 1);
        }, 10000); // Re-render every 10 seconds to update UI highlights
        return () => clearInterval(interval);
    }, []);

    // Track added calendar events (persist key: "{timerId}-{stepIndex}")
    const [addedEvents, setAddedEvents] = useState(() => {
        const saved = localStorage.getItem('breadTimer_addedEvents');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('breadTimer_addedEvents', JSON.stringify(addedEvents));
    }, [addedEvents]);

    const handleCalendarClick = (timerId, stepIndex) => {
        const key = `${timerId}-${stepIndex}`;
        if (!addedEvents.includes(key)) {
            setAddedEvents(prev => [...prev, key]);
        }
    };

    const removeTimer = (id) => {
        setActiveTimers(activeTimers.filter(t => t.id !== id));
    };

    if (activeTimers.length === 0) return null;

    return (
        <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ display: 'block', width: '10px', height: '10px', background: 'var(--color-primary)', borderRadius: '50%', boxShadow: '0 0 10px var(--color-primary)' }}></span>
                    Active Timers
                </h2>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {activeTimers.map(timer => (
                    <div key={timer.id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-primary)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{timer.recipeName}</h3>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Target: {new Date(timer.targetTime).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <button onClick={() => removeTimer(timer.id)} className="btn-icon" title="Stop Timer">✕</button>
                        </div>

                        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                            {timer.steps.map((step, i) => {
                                const isPast = Date.now() > step.endTime;
                                const isCurrent = Date.now() >= step.startTime && Date.now() <= step.endTime;

                                return (
                                    <div key={i} style={{
                                        minWidth: '120px',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius-md)',
                                        background: isCurrent ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255,255,255,0.05)',
                                        border: isCurrent ? '1px solid var(--color-primary)' : '1px solid transparent',
                                        boxShadow: isCurrent ? '0 0 15px rgba(56, 189, 248, 0.3)' : 'none',
                                        transform: isCurrent ? 'scale(1.05)' : 'scale(1)',
                                        transition: 'all 0.3s ease',
                                        opacity: isPast ? 0.5 : 1
                                    }}>
                                        <span style={{ fontSize: '0.8rem', color: isCurrent ? 'var(--color-primary)' : 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                                            {formatTime(step.startTime)}
                                        </span>
                                        <strong style={{ fontSize: '0.9rem', display: 'block' }}>{step.name}</strong>

                                        <div style={{ marginTop: '0.5rem' }}>
                                            {addedEvents.includes(`${timer.id}-${i}`) ? (
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem',
                                                    fontSize: '0.7rem',
                                                    color: 'var(--color-primary)',
                                                    padding: '0.1rem 0.4rem',
                                                }}>
                                                    ✓ Added
                                                </span>
                                            ) : (
                                                <a
                                                    href={generateGoogleCalendarUrl(step.name, timer.recipeName, step.startTime, step.endTime)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title="Add to Google Calendar"
                                                    onClick={() => handleCalendarClick(timer.id, i)}
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.25rem',
                                                        fontSize: '0.7rem',
                                                        color: isCurrent ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                                        textDecoration: 'none',
                                                        border: isCurrent ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.2)',
                                                        padding: '0.1rem 0.4rem',
                                                        borderRadius: 'var(--radius-md)',
                                                        background: isCurrent ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <span>📅</span> Add
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
