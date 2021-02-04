export function* range(start, end) {
  for (let i = start; i <= end; i++) {
    yield i
  }
}

// export const RECCURENCE_UNITS = {
//   HOURLY: [...range(0, 59)],
//   DAILY: [...range(0, 23)],
//   MONTHLY: [...range(1, 28)],
// }

export const RECCURENCE_UNITS = {
  HOURS: [...range(0, 23)],
  DAYS: [...range(1, 28)],
}
