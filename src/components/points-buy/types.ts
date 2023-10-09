import type { ChangeEvent } from "react";

export type Ability = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA'

export type Stats = {
  [key in Ability]: number;
} & { left: number; }


export type OnStatChange = (ability: Ability) => (event: ChangeEvent<HTMLInputElement>) => void