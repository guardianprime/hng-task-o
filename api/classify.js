export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      status: "error",
      message: "Method not allowed",
    });
  }

  const { name } = req.query;

  if (name === undefined || name === "") {
    return res.status(400).json({
      status: "error",
      message: "Missing or empty name parameter",
    });
  }

  if (typeof name !== "string") {
    return res.status(422).json({
      status: "error",
      message: "name must be a string",
    });
  }

  let apiData;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      `https://api.genderize.io/?name=${encodeURIComponent(name)}`,
      { signal: controller.signal },
    );

    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(502).json({
        status: "error",
        message: `Upstream API error: ${response.status} ${response.statusText}`,
      });
    }

    apiData = await response.json();
  } catch (err) {
    if (err.name === "AbortError") {
      return res.status(502).json({
        status: "error",
        message: "Upstream API request timed out",
      });
    }

    return res.status(502).json({
      status: "error",
      message: "Failed to reach upstream API",
    });
  }

  if (apiData.gender === null || apiData.count === 0) {
    return res.status(200).json({
      status: "error",
      message: "No prediction available for the provided name",
    });
  }

  const probability = apiData.probability;
  const sample_size = apiData.count;

  const is_confident = probability >= 0.7 && sample_size >= 100;

  return res.status(200).json({
    status: "success",
    data: {
      name: apiData.name,
      gender: apiData.gender,
      probability,
      sample_size,
      is_confident,
      processed_at: new Date().toISOString(),
    },
  });
}
