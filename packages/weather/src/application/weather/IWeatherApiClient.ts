import type { Alert } from "../../domain/weather/entity/Alert";
import type { Forecast } from "../../domain/weather/entity/Forecast";
import type { Coordinate } from "../../domain/weather/vo/Coordinate";
import type { StateCode } from "../../domain/weather/vo/StateCode";

/**
 * 天気APIクライアントのインターフェース
 */
export interface IWeatherApiClient {
  /**
   * 指定した州のアラートを取得
   * @param stateCode 州コード値オブジェクト
   * @returns アラートエンティティの配列、取得失敗時はnull
   */
  getAlerts(stateCode: StateCode): Promise<Alert[] | null>;

  /**
   * 指定した座標の天気予報を取得
   * @param coordinate 座標値オブジェクト
   * @returns 予報エンティティ、取得失敗時はnull
   */
  getForecast(coordinate: Coordinate): Promise<Forecast | null>;
}
