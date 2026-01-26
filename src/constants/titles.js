export const LEVEL_TITLES = [
  { minLevel: 6, title: 'Sleep Master' },
  { minLevel: 4, title: 'Deep Sleeper' },
  { minLevel: 2, title: 'Early Riser' },
  { minLevel: 1, title: 'Sleepy Head' }
]

export function titleFromLevel(level = 1) {
  return LEVEL_TITLES.find(t => level >= t.minLevel)?.title || 'Sleepy Head'
}
