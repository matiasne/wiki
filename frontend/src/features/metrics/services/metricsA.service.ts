import BaseCRUD from "../../../common/baseCRUD";
import http from "../../../common/http-common";
import { MetricA } from "../models/metric";
import { MetricDTO } from "../models/metric-dto";

class MetricsAService extends BaseCRUD {
  constructor() {
    super("/metricsA");
  }

  async getById(id?: any) {
    const resp = await http.get(`${this.urlBase}/${id}`);
    let metric: MetricDTO = resp.data;
    return MetricA.transformFromDTO("", metric);
  }

  async createNew(metricA: MetricA) {
    const resp = await http.post(`${this.urlBase}`, metricA);
    let metric: MetricDTO = resp.data;
    return MetricA.transformFromDTO("", metric);
  }

  async update(metric: MetricA) {
    const resp = await http.patch(`${this.urlBase}/${metric.id}`, metric);
    return resp.data;
  }

  async getAll() {
    const resp = await http.get(`${this.urlBase}`);
    return resp.data.map((metric: MetricDTO) => {
      return MetricA.transformFromDTO("", metric);
    });
  }

  async getResgitersBetweenDates(id: string, from: string, to: string) {
    const resp = await http.get(
      `${this.urlBase}/${id}/registers?from=${from}&to=${to}`
    );
    return resp.data;
  }
}

export default new MetricsAService();
