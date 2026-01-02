/**
 * NWS APIのレスポンス型定義
 * インフラ層でのみ使用される外部API固有の型
 */

export interface NWSAlertFeature {
  properties: {
    event?: string;
    areaDesc?: string;
    severity?: string;
    status?: string;
    headline?: string;
  };
}

export interface NWSAlertsResponse {
  features: NWSAlertFeature[];
}

export interface NWSPointsResponse {
  properties: {
    forecast?: string;
  };
}

export interface NWSForecastPeriod {
  name?: string;
  temperature?: number;
  temperatureUnit?: string;
  windSpeed?: string;
  windDirection?: string;
  shortForecast?: string;
}

export interface NWSForecastResponse {
  properties: {
    periods: NWSForecastPeriod[];
  };
}
