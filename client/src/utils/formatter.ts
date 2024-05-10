export const getBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
  });
};

export const distanceToNow = (date: string) => {
  const now = Date.now();

  // Mendapatkan timestamp dari waktu tertentu, misalnya "2024-04-18T04:26:45.000Z"
  const past = new Date(date).getTime();

  // Menghitung selisih waktu dalam milidetik
  const elapsedMilliseconds = now - past;
  const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  const elapsedDays = Math.floor(elapsedHours / 24);
  if (elapsedSeconds <= 60) {
    return `${elapsedSeconds} seconds ago`;
  } else if (elapsedMinutes <= 60) {
    return `${elapsedMinutes} minutes ago`;
  } else if (elapsedHours <= 24) {
    return `${elapsedHours} hours ago`;
  } else {
    return `${elapsedDays} days ago`;
  }
};

export function debounce<F extends (...args: any[]) => void>(
  func: F,
  waitFor: number
): (this: ThisParameterType<F>, ...args: Parameters<F>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func.apply(this, args), waitFor);
  };
}
