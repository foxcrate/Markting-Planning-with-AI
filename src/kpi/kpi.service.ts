import { Injectable } from '@nestjs/common';
import { KpiRepository } from './kpi.repository';

@Injectable()
export class KpiService {
  constructor(private readonly kpiRepository: KpiRepository) {}
}
