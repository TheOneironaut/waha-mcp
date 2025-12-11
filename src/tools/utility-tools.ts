/**
 * Utility Tools for WAHA MCP Server
 * General utility functions that don't require WAHA API calls
 */

export const utilityTools = [
  {
    name: "sleep",
    description:
      "Pause execution for a specified duration. Useful for rate limiting, waiting between operations, or implementing delays in automation workflows.",
    inputSchema: {
      type: "object",
      properties: {
        duration: {
          type: "number",
          description:
            "Duration to sleep in milliseconds (e.g., 1000 = 1 second, 5000 = 5 seconds, 60000 = 1 minute)",
          minimum: 0,
          maximum: 300000, // Max 5 minutes
        },
        seconds: {
          type: "number",
          description:
            "Alternative: Duration to sleep in seconds (e.g., 1 = 1 second, 5 = 5 seconds, 60 = 1 minute). Overrides 'duration' if provided.",
          minimum: 0,
          maximum: 300, // Max 5 minutes
        },
        message: {
          type: "string",
          description:
            "Optional message to display while sleeping (e.g., 'Waiting for rate limit...', 'Cooling down...')",
        },
      },
      required: [],
    },
  },
  {
    name: "wait",
    description:
      "Wait for a specified number of seconds. Alias for 'sleep' with seconds parameter. Useful for implementing delays between API calls or waiting for external processes.",
    inputSchema: {
      type: "object",
      properties: {
        seconds: {
          type: "number",
          description:
            "Number of seconds to wait (e.g., 1 = 1 second, 5 = 5 seconds, 60 = 1 minute)",
          minimum: 0,
          maximum: 300, // Max 5 minutes
        },
        message: {
          type: "string",
          description:
            "Optional message to display while waiting (e.g., 'Waiting for user response...', 'Pausing between operations...')",
        },
      },
      required: ["seconds"],
    },
  },
];
