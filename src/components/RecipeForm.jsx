import { useState } from 'react';
import { useRecipes } from '../context/RecipeContext';

const MAX_STEPS = 10;

export default function RecipeForm({ onClose }) {
    const { addRecipe } = useRecipes();
    const [name, setName] = useState('');
    const [steps, setSteps] = useState([
        { id: crypto.randomUUID(), name: '', duration: { hours: 0, minutes: 0 } }
    ]);

    const addStep = () => {
        if (steps.length < MAX_STEPS) {
            setSteps([...steps, { id: crypto.randomUUID(), name: '', duration: { hours: 0, minutes: 0 } }]);
        }
    };

    const removeStep = (id) => {
        if (steps.length > 1) {
            setSteps(steps.filter(step => step.id !== id));
        }
    };

    const updateStep = (id, field, value) => {
        setSteps(steps.map(step => {
            if (step.id === id) {
                if (field === 'hours' || field === 'minutes') {
                    return { ...step, duration: { ...step.duration, [field]: parseInt(value) || 0 } };
                }
                return { ...step, [field]: value };
            }
            return step;
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        // Filter out empty steps if any, or validate
        const validSteps = steps.filter(s => s.name.trim());
        if (validSteps.length === 0) return;

        addRecipe({ name, steps: validSteps });
        onClose();
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Create New Recipe</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Recipe Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(0,0,0,0.2)',
                            color: 'white'
                        }}
                        placeholder="e.g. Sourdough Bread"
                        required
                    />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.1rem' }}>Steps ({steps.length}/{MAX_STEPS})</h3>
                        <button
                            type="button"
                            onClick={addStep}
                            disabled={steps.length >= MAX_STEPS}
                            className="btn btn-primary"
                            style={{ fontSize: '0.9rem' }}
                        >
                            + Add Step
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {steps.map((step, index) => (
                            <div key={step.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                                <span style={{ paddingTop: '0.75rem', color: 'var(--color-text-muted)', width: '2rem' }}>{index + 1}.</span>

                                <div style={{ flex: 1 }}>
                                    <input
                                        type="text"
                                        value={step.name}
                                        onChange={(e) => updateStep(step.id, 'name', e.target.value)}
                                        placeholder="Step description (e.g. Mix dough)"
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            background: 'rgba(0,0,0,0.2)',
                                            color: 'white',
                                            marginBottom: '0.5rem'
                                        }}
                                        required
                                    />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <input
                                            type="number"
                                            min="0"
                                            value={step.duration.hours}
                                            onChange={(e) => updateStep(step.id, 'hours', e.target.value)}
                                            style={{ width: '60px', padding: '0.25rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 'var(--radius-md)' }}
                                        />
                                        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>hr</span>
                                        <input
                                            type="number"
                                            min="0"
                                            max="59"
                                            value={step.duration.minutes}
                                            onChange={(e) => updateStep(step.id, 'minutes', e.target.value)}
                                            style={{ width: '60px', padding: '0.25rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 'var(--radius-md)' }}
                                        />
                                        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>min</span>
                                    </div>
                                </div>

                                {steps.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeStep(step.id)}
                                        className="btn-icon"
                                        style={{ color: 'var(--color-danger)' }}
                                        title="Remove step"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={onClose} className="btn" style={{ color: 'var(--color-text-muted)' }}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Recipe</button>
                </div>
            </form>
        </div>
    );
}
