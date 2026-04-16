# Genderize API

A single-endpoint REST API that wraps [Genderize.io](https://genderize.io) and returns enriched gender classification data.

## Requirements

- Node.js >= 14
- npm

## Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Start the server (default port: 3000)
npm start

# Or with live-reload during development
npm run dev
```

## Endpoint

### `GET /api/classify?name={name}`

Classifies the likely gender of a given first name.

**Query Parameters**

| Parameter | Type   | Required | Description        |
|-----------|--------|----------|--------------------|
| `name`    | string | Yes      | A first name to classify |

**Success Response — 200 OK**

```json
{
  "status": "success",
  "data": {
    "name": "john",
    "gender": "male",
    "probability": 0.99,
    "sample_size": 1234,
    "is_confident": true,
    "processed_at": "2026-04-16T10:30:00.000Z"
  }
}
```

**`is_confident` logic:** `true` only when `probability >= 0.7` **AND** `sample_size >= 100`. Both conditions must hold.

**Error Responses**

| Status | Condition |
|--------|-----------|
| 400    | `name` parameter is missing or empty |
| 422    | `name` is not a string (e.g. array param) |
| 502    | Upstream Genderize API unreachable or returned an error |
| 500    | Unexpected server error |

All errors follow:
```json
{ "status": "error", "message": "<description>" }
```

**Edge Case — No prediction available:**
```json
{ "status": "error", "message": "No prediction available for the provided name" }
```

## Example Requests

```bash
# Success
curl "http://localhost:3000/api/classify?name=john"

# Missing name → 400
curl "http://localhost:3000/api/classify"

# Empty name → 400
curl "http://localhost:3000/api/classify?name="

# Array param → 422
curl "http://localhost:3000/api/classify?name[]=john"
```

## Notes

- Response includes `Access-Control-Allow-Origin: *` header on every response
- External API calls have a 5-second timeout to prevent hanging requests
- `processed_at` is generated fresh per request in UTC ISO 8601 format