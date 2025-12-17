import { createContext, useContext, useState, useEffect } from 'react';

const RecipeContext = createContext();

export function useRecipes() {
    return useContext(RecipeContext);
}

export function RecipeProvider({ children }) {
    const [recipes, setRecipes] = useState(() => {
        const saved = localStorage.getItem('bread_timer_recipes');
        return saved ? JSON.parse(saved) : [];
    });

    const [activeTimers, setActiveTimers] = useState([]);

    useEffect(() => {
        localStorage.setItem('bread_timer_recipes', JSON.stringify(recipes));
    }, [recipes]);

    const addRecipe = (recipe) => {
        setRecipes([...recipes, { ...recipe, id: crypto.randomUUID() }]);
    };

    const deleteRecipe = (id) => {
        setRecipes(recipes.filter(r => r.id !== id));
    };

    const updateRecipe = (id, updatedRecipe) => {
        setRecipes(recipes.map(r => r.id === id ? { ...updatedRecipe, id } : r));
    };

    const value = {
        recipes,
        addRecipe,
        deleteRecipe,
        updateRecipe,
        activeTimers,
        setActiveTimers
    };

    return (
        <RecipeContext.Provider value={value}>
            {children}
        </RecipeContext.Provider>
    );
}
