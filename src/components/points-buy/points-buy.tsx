import { useCallback, useState } from 'react'
import type { Ability, OnStatChange, Stats } from './types'

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

  const [inputs, setInputs] = useState<Record<Ability, string>>({
    STR: String(baseStat),
    DEX: String(baseStat),
    CON: String(baseStat),
    INT: String(baseStat),
    WIS: String(baseStat),
    CHA: String(baseStat),
  })
  
  const costFor = useCallback((val: number) => {
    const base = Math.max(0, Math.min(val, 14) - 8)
    const premium = Math.max(0, val - 14) * 2
    return base + premium
  }, [])

  const commitStat = useCallback((stat: Ability, raw: number) => {
    const newValue = Math.max(minStat, Math.min(maxStat, raw))

    setStats((prev) => {
      const remaining = prev.left - (costFor(newValue) - costFor(prev[stat]))

      if (remaining < 0) {
        setInputs((curr) => ({ ...curr, [stat]: String(prev[stat]) }))
        return prev
      }

      setInputs((curr) => ({ ...curr, [stat]: String(newValue) }))
      return {
        ...prev,
        [stat]: newValue,
        left: remaining,
      }
    })
  }, [costFor])

  const handleStatChange = useCallback<OnStatChange>((stat) => ({ target: { value }}) => {
    setInputs((curr) => ({ ...curr, [stat]: value }))

    const numeric = Math.floor(Number(value))
    if (Number.isNaN(numeric)) return

    if (Math.abs(numeric - stats[stat]) === 1) {
      commitStat(stat, numeric)
    }
  }, [commitStat, stats])

  const handleStatBlur = useCallback((stat: Ability) => () => {
    const numeric = Math.floor(Number(inputs[stat]))
    if (Number.isNaN(numeric)) {
      setInputs((curr) => ({ ...curr, [stat]: String(stats[stat]) }))
      return
    }
    commitStat(stat, numeric)
  }, [commitStat, inputs, stats])

  return (
    <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-6 lg:text-left">
      <p className="text-4xl font-bold lg:col-span-6 pb-2">Points Buy - {stats.left} points left</p>
      {abilities.map((ability) => (
        <div className="lg:col-span-1 pr-2" key={ability}>
          <p className="text-3xl font-bold">{ability}</p>
          <input
            type="number"
            className="w-1/2 min-w-36 text-2xl font-bold text-left rounded-lg bg-transparent border border-solid pl-1"
            value={inputs[ability]}
            max={maxStat}
            min={minStat}
            onChange={handleStatChange(ability)}
            onBlur={handleStatBlur(ability)}
          />
        </div>
      ))}
    </div>
  )
}