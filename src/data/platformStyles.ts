import type { StreamingService } from '../types'

export const PLATFORM_STYLE: Record<
  StreamingService,
  { bg: string; fg: string; label: string }
> = {
  Netflix: { bg: '#000000', fg: '#E50914', label: 'N' },
  'HBO Max': { bg: '#000000', fg: '#FFFFFF', label: 'max' },
  'Disney+': { bg: '#0e1a3d', fg: '#FFFFFF', label: 'D+' },
  'Prime Video': { bg: '#00A8E1', fg: '#0F171E', label: 'prime' },
  Hulu: { bg: '#1CE783', fg: '#0B0B0B', label: 'hulu' },
  'Apple TV+': { bg: '#000000', fg: '#FFFFFF', label: '' },
  'Paramount+': { bg: '#0064FF', fg: '#FFFFFF', label: 'P+' },
  YouTube: { bg: '#FF0000', fg: '#FFFFFF', label: '▶' },
}
