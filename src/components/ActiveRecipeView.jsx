import { useState, useEffect } from 'react';
import { calculateStepTimes, formatTime, formatDuration } from '../utils/timeUtils';
import { useRecipes } from '../context/RecipeContext';

export default function ActiveRecipeView({ recipe, onBack }) {
    const { setActiveTimers, activeTimers } = useRecipes();
    // Default target time: now + total duration + 1 hour buffer, rounded to next 30 min
    const [targetTime, setTargetTime] = useState(() => {
        const now = new Date();
        now.setHours(now.getHours() + 4);
        now.setMinutes(0, 0, 0);
        // Format for datetime-local: YYYY-MM-DDTHH:mm
        const tzOffset = now.getTimezoneOffset() * 60000;
        return new Date(now - tzOffset).toISOString().slice(0, 16);
    });

    const [stepTimes, setStepTimes] = useState([]);

    useEffect(() => {
        if (recipe && targetTime) {
            const calculated = calculateStepTimes(recipe.steps, new Date(targetTime));
            setStepTimes(calculated);
        }
    }, [recipe, targetTime]);

    // Find the first step's start time to show "Start Baking At"
    const startTime = stepTimes.length > 0 ? stepTimes[0].startTime : null;

    return (
        <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <button
                    onClick={onBack}
                    className="btn"
                    style={{ paddingLeft: 0, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <span>←</span> Back to Recipes
                </button>

                <button
                    onClick={() => {
                        const newActiveTimer = {
                            id: crypto.randomUUID(),
                            recipeId: recipe.id,
                            recipeName: recipe.name,
                            targetTime,
                            steps: stepTimes
                        };
                        setActiveTimers([...activeTimers, newActiveTimer]);
                        onBack();
                    }}
                    className="btn btn-primary"
                    style={{ background: 'var(--color-secondary)' }}
                >
                    Start Timers
                </button>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{recipe.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
                            Target Completion Time
                        </label>
                        <input
                            type="datetime-local"
                            value={targetTime}
                            onChange={(e) => setTargetTime(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(0,0,0,0.2)',
                                color: 'white',
                                fontSize: '1.1rem'
                            }}
                        />
                    </div>

                    {startTime && (
                        <div style={{ padding: '1rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                            <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-primary)', marginBottom: '0.25rem' }}>Start First Step At</span>
                            <strong style={{ fontSize: '1.5rem', color: 'white' }}>{formatTime(startTime)}</strong>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ position: 'relative', marginTop: '3rem' }}>
                <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '24px', width: '2px', background: 'rgba(255,255,255,0.1)' }}></div>

                {stepTimes.map((step, index) => (
                    <div key={index} style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', position: 'relative' }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            background: 'var(--color-surface)',
                            border: '2px solid var(--color-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            zIndex: 1
                        }}>
                            {index + 1}
                        </div>

                        <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <h3 style={{ fontSize: '1.2rem', color: 'white' }}>{step.name}</h3>
                                <span style={{ padding: '0.25rem 0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem' }}>
                                    {formatDuration(step.duration.hours, step.duration.minutes)}
                                </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginTop: '1rem' }}>
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Start Time</span>
                                    <span style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--color-primary)' }}>{formatTime(step.startTime)}</span>
                                </div>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Finish Time</span>
                                    <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>{formatTime(step.endTime)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
