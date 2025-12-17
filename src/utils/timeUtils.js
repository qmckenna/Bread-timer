export const calculateStepTimes = (steps, targetDate) => {
    // Deep copy steps to avoid mutation and reverse to calculate backwards
    const reversedSteps = [...steps].reverse();
    const stepTimes = [];

    let currentTime = new Date(targetDate).getTime();

    reversedSteps.forEach(step => {
        const durationMs = (step.duration.hours * 60 * 60 * 1000) + (step.duration.minutes * 60 * 1000);
        const startTime = currentTime - durationMs;

        stepTimes.unshift({
            ...step,
            endTime: currentTime,
            startTime: startTime
        });

        // The start of this step is the end of the previous one (in chronological order)
        // So for the next iteration (which is the previous step in timeline), currentTime becomes this step's startTime
        currentTime = startTime;
    });

    return stepTimes;
};

export const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatDuration = (hours, minutes) => {
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    return parts.join(' ') || '0m';
};
