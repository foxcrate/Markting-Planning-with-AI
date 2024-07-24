import { Inject, Injectable } from '@nestjs/common';
import { DB_PROVIDER } from 'src/db/constants';
import { Pool } from 'mariadb';

@Injectable()
export class KpiRepository {
  constructor(@Inject(DB_PROVIDER) private db: Pool) {}
}
