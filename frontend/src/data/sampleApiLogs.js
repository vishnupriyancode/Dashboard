export const sampleApiLogs = [
  {
    id: 1,
    domain_id: "domain1",
    model: "GPT-4",
    status: "success",
    endpoint: "/api/v1/chat",
    time: "2024-04-08 10:00:00",
    value: "Response successful",
    state: "Completed"
  },
  {
    id: 2,
    domain_id: "domain2",
    model: "GPT-3.5",
    status: "error",
    endpoint: "/api/v1/completion",
    time: "2024-04-08 10:05:00",
    value: "Failed to process request",
    state: "Failed"
  },
  {
    id: 3,
    domain_id: "domain1",
    model: "DALL-E",
    status: "success",
    endpoint: "/api/v1/images",
    time: "2024-04-08 10:10:00",
    value: "Image generated",
    state: "Completed"
  }
]; 