const formatDate = (startTime, endTime) => {
  const startDate = new Date(startTime * 1000);
  const endDate =  new Date(endTime * 1000);
  const dateStr = `${String(startDate.getMonth() + 1)}/${String(startDate.getDate())}/${startDate.getFullYear()} `;
  const timeStr = `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}:${String(startDate.getSeconds()).padStart(2, '0')} to ${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}:${String(endDate.getSeconds()).padStart(2, '0')}`;
  return `${dateStr} ${timeStr}`;
};

module.exports = formatDate;