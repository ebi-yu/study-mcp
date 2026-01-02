import type { IWeatherApiClient } from "../../application/weather/IWeatherApiClient";
import { Alert } from "../../domain/weather/entity/Alert";
import { Forecast, ForecastPeriod } from "../../domain/weather/entity/Forecast";
import type { Coordinate } from "../../domain/weather/vo/Coordinate";
import type { StateCode } from "../../domain/weather/vo/StateCode";
import type {
  NWSAlertsResponse,
  NWSForecastResponse,
  NWSPointsResponse,
} from "./NWSApiTypes";

const NWS_API_BASE = "https://api.weather.gov";
const USER_AGENT = "weather-app/1.0";

/**
 * NWS（National Weather Service）API クライアント
 * IWeatherApiClient インターフェースの具体的な実装
 */
export class NWSApiClient implements IWeatherApiClient {
  /**
   * HTTP リクエストを実行
   */
  private async request<T>(url: string): Promise<T | null> {
    const headers = {
      "User-Agent": USER_AGENT,
      Accept: "application/geo+json",
    };

    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return (await response.json()) as T;
    } catch (error) {
      console.error("Error making NWS request:", error);
      return null;
    }
  }

  /**
   * 指定した州のアラートを取得
   */
  async getAlerts(stateCode: StateCode): Promise<Alert[] | null> {
    const url = `${NWS_API_BASE}/alerts?area=${stateCode.value}`;
    const response = await this.request<NWSAlertsResponse>(url);

    if (!response) {
      return null;
    }

    const features = response.features || [];
    return features.map(
      (feature) =>
        new Alert(
          feature.properties.event || "Unknown",
          feature.properties.areaDesc || "Unknown",
          feature.properties.severity || "Unknown",
          feature.properties.status || "Unknown",
          feature.properties.headline || "No headline"
        )
    );
  }

  /**
   * 指定した座標の天気予報を取得
   */
  async getForecast(coordinate: Coordinate): Promise<Forecast | null> {
    // まずグリッドポイントデータを取得
    const pointsUrl = `${NWS_API_BASE}/points/${coordinate.format()}`;
    const pointsData = await this.request<NWSPointsResponse>(pointsUrl);

    if (!pointsData) {
      return null;
    }

    const forecastUrl = pointsData.properties?.forecast;
    if (!forecastUrl) {
      return null;
    }

    // 予報データを取得
    const forecastData = await this.request<NWSForecastResponse>(forecastUrl);
    if (!forecastData) {
      return null;
    }

    const periods = (forecastData.properties?.periods || []).map(
      (period) =>
        new ForecastPeriod(
          period.name || "Unknown",
          period.temperature ?? 0,
          period.temperatureUnit || "F",
          period.windSpeed || "Unknown",
          period.windDirection || "",
          period.shortForecast || "No forecast available"
        )
    );

    return new Forecast(coordinate.latitude, coordinate.longitude, periods);
  }
}
