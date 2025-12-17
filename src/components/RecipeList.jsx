import { useRecipes } from '../context/RecipeContext';
import { formatDuration } from '../utils/timeUtils';

export default function RecipeList({ onSelectRecipe }) {
    const { recipes, deleteRecipe } = useRecipes();

    if (recipes.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                <p>No recipes yet. Create one to get started!</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {recipes.map(recipe => (
                <div key={recipe.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{recipe.name}</h3>
                        <button
                            onClick={(e) => { e.stopPropagation(); deleteRecipe(recipe.id); }}
                            className="btn-icon"
                            style={{ color: 'var(--color-danger)' }}
                            title="Delete recipe"
                        >
                            ✕
                        </button>
                    </div>

                    <div style={{ flex: 1 }}>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            {recipe.steps.length} Steps
                        </p>
                        <ul style={{ listStyle: 'none', marginLeft: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                            {recipe.steps.slice(0, 3).map((step, i) => (
                                <li key={i} style={{ marginBottom: '0.25rem' }}>
                                    • {step.name} <span style={{ opacity: 0.6 }}>({formatDuration(step.duration.hours, step.duration.minutes)})</span>
                                </li>
                            ))}
                            {recipe.steps.length > 3 && <li>...</li>}
                        </ul>
                    </div>

                    <div style={{ marginTop: '1.5rem' }}>
                        <button
                            onClick={() => onSelectRecipe(recipe)}
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                        >
                            Plan Bake
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
