import { useCallback, useState } from 'react'
import type { Ability, OnStatChange, Stats,  } from './types'

const abilities: Ability[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']
const baseStat = 9
const maxPoints = 27
const minStat = 8
const maxStat = 17

export function PointsBuy() {
  const [stats, setStats] = useState<Stats>({
    STR: baseStat,
    DEX: baseStat,
    CON: baseStat,
    INT: baseStat,
    WIS: baseStat,
    CHA: baseStat,
    left: maxPoints,
  })
  
  const costFor = useCallback((val: number) => {
    const base = Math.max(0, Math.min(val, 14) - 8)
    const premium = Math.max(0, val - 14) * 2
    return base + premium
  }, [])

  const handleStatChange = useCallback<OnStatChange>((stat) => ({ target: { value }}) => {
    const newValue = Math.floor(Number(value))
    if (newValue < minStat || newValue > maxStat) return

    setStats((prev) => {
      const remaining = prev.left - (costFor(newValue) - costFor(prev[stat]))

      if (remaining < 0) return prev

      return {
        ...prev,
        [stat]: newValue,
        left: remaining,
      }
    })
  }, [costFor])

  return (
    <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-6 lg:text-left">
      <p className="text-4xl font-bold lg:col-span-6 pb-2">Points Buy - {stats.left} points left</p>
      {abilities.map((ability) => (
        <div className="lg:col-span-1 pr-2" key={ability}>
          <p className="text-3xl font-bold">{ability}</p>
          <input
            type="number"
            className="w-1/2 min-w-36 text-2xl font-bold text-left rounded-lg bg-transparent border border-solid pl-1"
            value={stats[ability]}
            max={maxStat}
            min={minStat}
            onChange={handleStatChange(ability)}
            />
        </div>
      ))}
    </div>
  )
}