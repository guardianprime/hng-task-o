# Gender Prediction API (Serverless Endpoint)

This project is a simple serverless API endpoint that accepts a name as a query parameter, fetches gender prediction data from the [Genderize API](https://genderize.io), and returns a processed response with additional confidence logic.

---

## 🚀 Features

- Accepts a `name` via query parameters
- Calls external Genderize API
- Adds confidence scoring logic
- Handles timeouts and upstream failures
- Supports CORS (ready for frontend use)
- Returns structured JSON responses

---

## 📦 API Endpoint

### GET `/api/classify`

#### Query Parameters

| Parameter | Type   | Required | Description            |
| --------- | ------ | -------- | ---------------------- |
| name      | string | Yes      | Name to predict gender |

---
