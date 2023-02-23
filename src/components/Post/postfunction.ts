export function getTimeElapsed(timestamp: number) {
  const date = new Date(timestamp * 1000);
  const now = new Date();

  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) {
    return diff + ' 초전';
  } else if (diff < 60 * 60) {
    const minutes = Math.floor(diff / 60);
    return minutes + ' 분전';
  } else if (diff < 60 * 60 * 24) {
    const hours = Math.floor(diff / (60 * 60));
    return hours + ' 시간전';
  } else if (diff < 60 * 60 * 24 * 30) {
    const days = Math.floor(diff / (60 * 60 * 24));
    return days + ' 일전';
  } else if (diff < 60 * 60 * 24 * 30 * 12) {
    const months = Math.floor(diff / (60 * 60 * 24 * 30));
    return months + ' 달전';
  } else {
    const years = Math.floor(diff / (60 * 60 * 24 * 30 * 12));
    return years + ' 년전';
  }
}
