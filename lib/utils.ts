export function formatCurrency(priceCents: number) {
  return (Math.round(priceCents) / 100).toFixed(2);
}

export function formatShortDate(dateValue: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric'
  }).format(new Date(dateValue));
}

export function formatLongDate(dateValue: string) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).format(new Date(dateValue));
}

export function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

export function getDeliveryProgress(orderTime: string, estimatedDeliveryTime: string) {
  const start = new Date(orderTime).getTime();
  const end = new Date(estimatedDeliveryTime).getTime();
  const now = Date.now();

  if (end <= start) {
    return 100;
  }

  const progress = ((now - start) / (end - start)) * 100;
  return Math.min(100, Math.max(0, progress));
}

export function getDeliveryStatus(orderTime: string, estimatedDeliveryTime: string) {
  const progress = getDeliveryProgress(orderTime, estimatedDeliveryTime);

  if (progress >= 100) {
    return 'Delivered';
  }

  if (progress >= 50) {
    return 'Shipped';
  }

  return 'Preparing';
}
