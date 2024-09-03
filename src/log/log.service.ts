import { Injectable } from '@nestjs/common';
import { LogRepository } from './log.repository';
import { LogCreateDto } from './dtos/log-create.dto';
import { PaginationDto } from 'src/dtos/pagination.dto';

@Injectable()
export class LogService {
  constructor(private readonly LogRepository: LogRepository) {}
  async create(reqBody: LogCreateDto, adminId: number) {
    await this.LogRepository.create(reqBody, adminId);
  }

  async getAll(pagination: PaginationDto, adminId: number) {
    return await this.LogRepository.findAll(pagination);
  }

  async getOne(logId: number, adminId: number) {
    return await this.LogRepository.findById(logId);
  }
}
