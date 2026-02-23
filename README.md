# Bond Yield Calculator

A full-stack Bond Yield Calculator web application built with React, NestJS, and TypeScript.

## Tech Stack

- **Frontend**: React + TypeScript (Vite)
- **Backend**: NestJS + TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Validation**: class-validator + class-transformer (NestJS)

## Setup

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone <your-repo>
cd bond-calculator

# Install all dependencies (workspaces)
npm install
```

### Environment

Create a `.env` file in the `frontend` directory:

```
VITE_API_URL=http://localhost:3001
```

Or copy from the example:

```bash
cp frontend/.env.example frontend/.env
```

### Running the Application

**Terminal 1 - Backend (port 3001):**

```bash
cd backend && npm run start:dev
```

**Terminal 2 - Frontend (port 5173):**

```bash
cd frontend && npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Running Tests

```bash
cd backend && npm run test
```

Or from the root:

```bash
npm run test
```

## API

### POST /bond/calculate

**Request:**
```json
{
  "faceValue": 1000,
  "couponRate": 8,
  "marketPrice": 950,
  "yearsToMaturity": 5,
  "frequency": "semi-annual"
}
```

**Response:**
```json
{
  "currentYield": 8.42,
  "ytm": 9.19,
  "totalInterest": 450.00,
  "status": "DISCOUNT",
  "difference": -50,
  "cashFlows": [...]
}
```

## Reference Example

Inputs: Face Value $1,000, Coupon 8%, Market Price $950, 5 years, Semi-Annual

| Output | Expected |
|--------|----------|
| Current Yield | 8.42% |
| YTM | ~9.19% |
| Total Interest | $450.00 |
| Status | DISCOUNT |
| Difference | -$50.00 |

## Project Structure

```
bond-calculator/
├── backend/          # NestJS API
│   ├── src/bond/     # Bond module (controller, service, DTO, types)
│   └── test/        # Unit tests
├── frontend/        # React app
│   └── src/
│       ├── components/
│       ├── services/
│       └── types/
└── package.json     # Root with npm workspaces
```
