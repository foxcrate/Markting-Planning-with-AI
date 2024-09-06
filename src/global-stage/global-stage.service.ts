import { Injectable } from '@nestjs/common';
import { GlobalStageUpdateDto } from './dtos/global-stage-update.dto';
import { GlobalStageCreateDto } from './dtos/global-stage-create.dto';
import { GlobalStageRepository } from './global-stage.repository';
import { GlobalStageReturnDto } from './dtos/global-stage-return.dto';
import { GlobalStagesEnum } from 'src/enums/global-stages.enum';

@Injectable()
export class GlobalStageService {
  constructor(private readonly globalStageRepository: GlobalStageRepository) {}

  readonly globalStagesArray = [
    'Awareness',
    'Consideration',
    'Conversion',
    'Loyalty',
  ];
  async create(
    globalStageBody: GlobalStageCreateDto,
  ): Promise<GlobalStageReturnDto> {
    return await this.globalStageRepository.create(globalStageBody);
  }

  async update(updateBody: GlobalStageUpdateDto, globalStageId: number) {
    await this.globalStageRepository.update(updateBody, globalStageId);
    return await this.globalStageRepository.findById(globalStageId);
  }

  //get one globalStage
  async getOne(globalStageId: number): Promise<GlobalStageReturnDto> {
    return await this.globalStageRepository.findById(globalStageId);
  }

  async getOneByName(globalStageName: string): Promise<GlobalStageReturnDto> {
    return await this.globalStageRepository.findByName(globalStageName);
  }

  //get all globalStages
  async getAll() {
    return await this.globalStageRepository.findAll();
  }

  async delete(globalStageId: number) {
    let deletedGlobalStage =
      await this.globalStageRepository.findById(globalStageId);
    await this.globalStageRepository.delete(deletedGlobalStage.id);
    return deletedGlobalStage;
  }
}
