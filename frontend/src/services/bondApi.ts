import axios from 'axios';
import type { BondInput, BondResult } from '../types/bond.types';

// Empty string = same-origin (for deployed app). Undefined = local dev.
const API_URL =
  import.meta.env.VITE_API_URL !== undefined
    ? import.meta.env.VITE_API_URL
    : 'http://localhost:3001';

export async function calculateBond(inputs: BondInput): Promise<BondResult> {
  const { data } = await axios.post<BondResult>(
    `${API_URL}/bond/calculate`,
    inputs,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return data;
}
