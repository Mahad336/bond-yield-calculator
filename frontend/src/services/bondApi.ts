import axios from 'axios';
import type { BondInput, BondResult } from '../types/bond.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
