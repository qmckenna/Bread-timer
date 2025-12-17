import { useState, useEffect, useCallback } from 'react';
import { useRecipes } from '../context/RecipeContext';

export default function useNotificationSystem() {
    const { activeTimers } = useRecipes();
    const [permission, setPermission] = useState(Notification.permission);

    const requestPermission = useCallback(async () => {
        const result = await Notification.requestPermission();
        setPermission(result);
    }, []);

    useEffect(() => {
        // Check permission on mount
        setPermission(Notification.permission);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();

            activeTimers.forEach(timer => {
                timer.steps.forEach(step => {
                    // Check if start time is within the last 15 seconds (widened window)
                    if (step.startTime > now - 15000 && step.startTime <= now) {
                        if (Notification.permission === 'granted') {
                            new Notification(`Time to ${step.name}`, {
                                body: `${timer.recipeName}: It's time to start this step.`,
                                icon: '/vite.svg'
                            });
                        } else {
                            console.log('Notification triggered but permission not granted');
                        }
                    }
                });
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [activeTimers]);

    return { permission, requestPermission };
}
