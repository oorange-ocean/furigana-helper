export function timeToSeconds(time: string): number {
  const [minutes, seconds] = time.split(':').map(parseFloat);
  return minutes * 60 + seconds;
}