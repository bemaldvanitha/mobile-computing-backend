export function formatClock(date) {
  return date.toLocaleTimeString('en-LK', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatStamp(date) {
  return date.toLocaleString('en-LK', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });
}
