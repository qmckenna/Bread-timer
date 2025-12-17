export const generateGoogleCalendarUrl = (stepName, recipeName, startTime, endTime) => {
    const formatToGCalDate = (date) => {
        return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    };

    const start = formatToGCalDate(new Date(startTime));
    const end = formatToGCalDate(new Date(endTime));

    const title = encodeURIComponent(`${recipeName}: ${stepName}`);
    const details = encodeURIComponent(`Step for ${recipeName}. Created by Bread Timer.`);

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}`;
};
