import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { McpResponse } from "../../../shared";
import { WeatherApplicationService } from "./application/weather/WeatherApplicationService";
import { NWSApiClient } from "./infrastructure/api/NWSApiClient";

// Create server instance
const server = new McpServer({
  name: "weather",
  version: "1.0.0",
});

const weatherApiClient = new NWSApiClient();
const weatherService = new WeatherApplicationService(weatherApiClient);

// Register weather tools

server.registerTool(
  "get_alerts",
  {
    description: "Get weather alerts for a state",
    inputSchema: {
      state: z
        .string()
        .length(2)
        .describe("Two-letter state code (e.g. CA, NY)"),
    },
  },
  async ({ state }) => {
    const result = await weatherService.getAlerts(state);
    return McpResponse.fromStringResult(result);
  }
);

server.registerTool(
  "get_forecast",
  {
    description: "Get weather forecast for a location",
    inputSchema: {
      latitude: z
        .number()
        .min(-90)
        .max(90)
        .describe("Latitude of the location"),
      longitude: z
        .number()
        .min(-180)
        .max(180)
        .describe("Longitude of the location"),
    },
  },
  async ({ latitude, longitude }) => {
    const result = await weatherService.getForecast(latitude, longitude);
    return McpResponse.fromStringResult(result);
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Weather MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
