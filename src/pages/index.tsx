import { Inter } from 'next/font/google'
import { ChangeEvent, useCallback, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

type Ability = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA'
type Stats = {
  [key in Ability]: number;
} & { left: number; }

const abilities: Ability[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']
const baseStat = 9
const maxPoints = 27
const minStat = 8
const maxStat = 17

export default function Home() {
  const [stats, setStats] = useState<Stats>({
    STR: baseStat,
    DEX: baseStat,
    CON: baseStat,
    INT: baseStat,
    WIS: baseStat,
    CHA: baseStat,
    left: maxPoints,
  })

  const handleStatChange = useCallback((stat: Ability) => ({ target: { value }}: ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.floor(Number(value))
    const multiplier = newValue > 15 ? 2 : 1

    setStats((prev) => {
      const remaining = prev.left - ((newValue - prev[stat]) * multiplier)

      if (remaining < 0) return prev

      return {
        ...prev,
        [stat]: newValue,
        left: remaining,
      }
  })
  }, [])

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}>
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
    </main>
  )
}
