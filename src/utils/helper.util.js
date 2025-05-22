

// format  createTime: '1716944551873' to '2024-06-25 10:49:11'
 function formatTime(time) {
    const date = new Date(parseInt(time));
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dt = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${dt} ${hours}:${minutes}:${seconds}`;
}



module.exports = {
    formatTime
}

