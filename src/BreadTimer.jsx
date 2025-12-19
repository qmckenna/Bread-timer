import { useState } from 'react';
import { RecipeProvider } from './context/RecipeContext';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import ActiveRecipeView from './components/ActiveRecipeView';
import ActiveTimersDashboard from './components/ActiveTimersDashboard';
import ToastContainer from './components/ToastContainer';
import useNotificationSystem from './hooks/useNotificationSystem';
import './App.css';

function BreadTimerApp() {
  const { toasts, removeToast } = useNotificationSystem();
  const [showForm, setShowForm] = useState(false);
  const [activeView, setActiveView] = useState('list'); // 'list', 'plan'
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setActiveView('plan');
  };

  return (
    <div className="container">
      <ToastContainer notifications={toasts} onClose={removeToast} />

      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', letterSpacing: '-0.05em', marginBottom: '0.5rem', background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Bread Timer
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Master your baking schedule</p>
      </header>

      <main>
        {activeView === 'list' && (
          <>
            <ActiveTimersDashboard />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem' }}>My Recipes</h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="btn btn-primary"
              >
                {showForm ? 'Cancel' : 'New Recipe'}
              </button>
            </div>

            {showForm && (
              <RecipeForm onClose={() => setShowForm(false)} />
            )}

            <RecipeList onSelectRecipe={handleSelectRecipe} />
          </>
        )}

        {/* Planning View */}
        {activeView === 'plan' && selectedRecipe && (
          <ActiveRecipeView
            recipe={selectedRecipe}
            onBack={() => setActiveView('list')}
          />
        )}
      </main>
    </div>
  );
}

// Wrapper component that provides the context
export default function BreadTimer() {
  return (
    <RecipeProvider>
      <BreadTimerApp />
    </RecipeProvider>
  );
}
