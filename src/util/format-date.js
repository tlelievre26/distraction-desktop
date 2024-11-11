const formatDate = (startTime, endTime) => {
  const startDate = new Date(startTime * 1000);
  const endDate =  new Date(endTime * 1000);
  const dateStr = `${String(startDate.getUTCMonth() + 1)}/${String(startDate.getUTCDate())}/${startDate.getUTCFullYear()} `;
  const timeStr = `${String(startDate.getUTCHours())}:${String(startDate.getUTCMinutes())}:${String(startDate.getUTCSeconds())} to ${String(endDate.getUTCHours())}:${String(endDate.getUTCMinutes())}:${String(endDate.getUTCSeconds())}`;
  return `${dateStr} ${timeStr}`;
};

module.exports = formatDate;