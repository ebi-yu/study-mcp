import { type Result, ResultHelper } from "../../../../../shared";
import { Coordinate } from "../../domain/weather/vo/Coordinate";
import { StateCode } from "../../domain/weather/vo/StateCode";
import type { IWeatherApiClient } from "./IWeatherApiClient";

/**
 * 天気アプリケーションサービス
 */
export class WeatherApplicationService {
  constructor(private readonly weatherApiClient: IWeatherApiClient) {}

  /**
   * 指定した州のアラートを取得するユースケース
   */
  async getAlerts(stateInput: string): Promise<Result<string>> {
    // 値オブジェクトを生成（バリデーション）
    let stateCode: StateCode;
    try {
      stateCode = StateCode.create(stateInput);
    } catch (error) {
      return ResultHelper.fromError(error, "Invalid state code provided");
    }

    // APIクライアント経由でアラートを取得
    const alerts = await this.weatherApiClient.getAlerts(stateCode);

    if (alerts === null) {
      return ResultHelper.fail("Failed to retrieve alerts data");
    }

    if (alerts.length === 0) {
      return ResultHelper.ok(`No active alerts for ${stateCode.value}`);
    }

    const formattedAlerts = alerts.map((alert) => alert.format());
    const alertsText = `Active alerts for ${
      stateCode.value
    }:\n\n${formattedAlerts.join("\n")}`;

    // フォーマットして返却
    return ResultHelper.ok(alertsText);
  }

  /**
   * 指定した座標の天気予報を取得するユースケース
   */
  async getForecast(
    latitude: number,
    longitude: number
  ): Promise<Result<string>> {
    // 値オブジェクトを生成（バリデーション）
    let coordinate: Coordinate;
    try {
      coordinate = Coordinate.create(latitude, longitude);
    } catch (error) {
      return ResultHelper.fromError(error, "Invalid coordinates provided");
    }

    // APIクライアント経由で予報を取得
    const forecast = await this.weatherApiClient.getForecast(coordinate);

    if (forecast === null) {
      return ResultHelper.fail(
        `Failed to retrieve forecast data for coordinates: ${latitude}, ${longitude}. This location may not be supported by the NWS API (only US locations are supported).`
      );
    }

    if (!forecast.hasPeriods()) {
      return ResultHelper.ok("No forecast periods available");
    }

    // 予報をフォーマットして返却
    return ResultHelper.ok(forecast.format());
  }
}
