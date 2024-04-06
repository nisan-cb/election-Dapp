export const formatTime = (ms: number) => {
    // Convert milliseconds to seconds
    let totalSeconds = Math.floor(ms / 1000);

    // Calculate hours, minutes, and seconds
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    // Format the time string
    let formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    return formattedTime;
}

const padZero = (num: number) => {
    return (num < 10 ? '0' : '') + num;
}