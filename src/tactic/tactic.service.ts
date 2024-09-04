import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { TacticRepository } from './tactic.repository';
import { TacticCreateDto } from './dtos/tactic-create.dto';
import { TacticUpdateDto } from './dtos/tactic-update.dto';
import { TacticReturnDto } from './dtos/tactic-return.dto';
import { GetMineFilterDto } from './dtos/get-mine-filter.dto';
import { GetAllFilterDto } from './dtos/get-all-filter.dto';
import { TacticKpiEntryCreateDto } from './dtos/tactic-kpi-entry-create.dto';
import { KpiService } from 'src/kpi/kpi.service';
import { TacticKpiEntryUpdateDto } from './dtos/tactic-kpi-entry-update.dto';
import { TacticKpiEntryDeleteDto } from './dtos/tactic-kpi-entry-delete.dto';
import { KpiCreateDto } from 'src/kpi/dtos/create.dto';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { LogService } from 'src/log/log.service';
import { LogEntityEnum } from 'src/enums/log-entity.enum';
import { LogOperationEnum } from 'src/enums/log-operation.enum';
import { TacticCreateForAdminDto } from './dtos/admin/tactic-create-for-admin.dto';
import { TacticUpdateForAdminDto } from './dtos/admin/tactic-update-for-admin.dto';
import { UserRoleEnum } from 'src/enums/user-roles.enum';

@Injectable()
export class TacticService {
  constructor(
    private readonly tacticRepository: TacticRepository,
    private readonly kpiService: KpiService,
    private readonly logService: LogService,
  ) {}
  async create(
    tacticCreateBody: TacticCreateDto,
    userId: number,
  ): Promise<TacticReturnDto> {
    return await this.tacticRepository.create(tacticCreateBody, userId);
  }

  async update(
    updateBody: TacticUpdateDto,
    tacticId: number,
    userId: number,
  ): Promise<TacticReturnDto> {
    await this.isOwner(tacticId, userId);
    await this.tacticRepository.update(updateBody, tacticId);
    return await this.tacticRepository.findById(tacticId);
  }

  //get one tactic
  async getOne(tacticId: number, userId: number): Promise<TacticReturnDto> {
    if (userId !== 0) {
      await this.isOwner(tacticId, userId);
    }
    return await this.tacticRepository.findById(tacticId);
  }

  async getMyTactics(
    userId: number,
    filter: GetMineFilterDto,
  ): Promise<TacticReturnDto[]> {
    return await this.tacticRepository.getTacticsByUserId(userId, filter);
  }

  //get all tactics
  async getAll(
    filter: GetAllFilterDto,
    pagination: PaginationDto,
  ): Promise<TacticReturnDto[]> {
    return await this.tacticRepository.findAll(filter, pagination);
  }

  async delete(tacticId: number, userId: number): Promise<TacticReturnDto> {
    if (userId !== 0) {
      await this.isOwner(tacticId, userId);
    }
    let deletedTactic = await this.tacticRepository.findById(tacticId);
    await this.tacticRepository.delete(tacticId);
    return deletedTactic;
  }

  async createKpiEntry(
    userId: number,
    tacticId: number,
    kpiId: number,
    tacticKpiEntryBody: TacticKpiEntryCreateDto,
  ): Promise<TacticReturnDto> {
    await this.isOwner(tacticId, userId);

    let theTactic = await this.tacticRepository.findById(tacticId);

    if (theTactic.private === false) {
      throw new UnprocessableEntityException(
        "Public tactic don't have kpi entries",
      );
    }

    await this.validateKpiBelongToTactic(tacticId, kpiId);

    await this.kpiService.createKpiEntry(kpiId, tacticKpiEntryBody);

    return await this.tacticRepository.findById(tacticId);
  }

  async createKpi(
    userId: number,
    tacticId: number,
    kpiCreateBody: KpiCreateDto,
  ): Promise<TacticReturnDto> {
    await this.isOwner(tacticId, userId);

    await this.tacticRepository.addKpi(tacticId, kpiCreateBody);

    return await this.tacticRepository.findById(tacticId);
  }

  async updateKpiEntry(
    userId: number,
    tacticId: number,
    kpiId: number,
    tacticKpiEntryBody: TacticKpiEntryUpdateDto,
  ): Promise<TacticReturnDto> {
    await this.isOwner(tacticId, userId);

    let theTactic = await this.tacticRepository.findById(tacticId);

    if (theTactic.private === false) {
      throw new UnprocessableEntityException(
        "Public tactic don't have kpi entries",
      );
    }

    await this.validateKpiBelongToTactic(tacticId, kpiId);

    await this.validateKpiEntryBelongToKpi(
      kpiId,
      tacticKpiEntryBody.kpiEntryId,
    );

    await this.kpiService.updateKpiEntry(
      tacticKpiEntryBody.kpiEntryId,
      tacticKpiEntryBody,
    );

    return await this.tacticRepository.findById(tacticId);
  }

  async deleteKpiEntry(
    userId: number,
    tacticId: number,
    kpiId: number,
    tacticKpiEntryBody: TacticKpiEntryDeleteDto,
  ): Promise<TacticReturnDto> {
    await this.isOwner(tacticId, userId);

    let theTactic = await this.tacticRepository.findById(tacticId);

    if (theTactic.private === false) {
      throw new UnprocessableEntityException(
        "Public tactic don't have kpi entries",
      );
    }

    await this.validateKpiBelongToTactic(tacticId, kpiId);

    await this.validateKpiEntryBelongToKpi(
      kpiId,
      tacticKpiEntryBody.kpiEntryId,
    );

    await this.kpiService.deleteKpiEntry(tacticKpiEntryBody.kpiEntryId);

    return await this.tacticRepository.findById(tacticId);
  }

  //authenticate tactic owner

  async isOwner(tacticId: number, userId: number) {
    // return true;
    const tactic = await this.tacticRepository.findById(tacticId);

    if (!tactic) {
      throw new UnprocessableEntityException('Tactic not found');
    }
    if (tactic.userId == null || tactic.private == false) {
      return true;
    }
    if (tactic.userId !== userId) {
      throw new ForbiddenException('You are not the owner of this tactic');
    }
  }

  async validateKpiBelongToTactic(tacticId: number, kpiId: number) {
    const tactic = await this.tacticRepository.findById(tacticId);

    if (!tactic) {
      throw new UnprocessableEntityException('Tactic not found');
    }
    const kpi = await this.kpiService.getOne(kpiId);
    if (!kpi) {
      throw new UnprocessableEntityException('Kpi not found');
    }
    if (kpi.tacticId !== tactic.id) {
      throw new UnprocessableEntityException('Kpi not belong to tactic');
    }
  }

  async validateKpiEntryBelongToKpi(kpiId: number, kpiEntryId: number) {
    const kpi = await this.kpiService.getOne(kpiId);
    if (!kpi) {
      throw new UnprocessableEntityException('Kpi not found');
    }

    const kpiEntry = await this.kpiService.getOneKpiEntry(kpiEntryId);
    if (!kpi) {
      throw new UnprocessableEntityException('KpiEntry not found');
    }

    if (kpi.id !== kpiEntry.kpiId) {
      throw new UnprocessableEntityException('KpiEntry not belong to kpi');
    }
  }

  async adminCreate(
    reqBody: TacticCreateForAdminDto,
    adminId: number,
  ): Promise<TacticReturnDto> {
    let createdTactic = await this.tacticRepository.create(reqBody, adminId);

    await this.logService.create(
      {
        entity: LogEntityEnum.TACTIC,
        entityId: createdTactic.id,
        operation: LogOperationEnum.CREATE,
        oldObject: null,
        newObject: createdTactic,
        changesObject: null,
      },
      adminId,
    );

    return createdTactic;
  }

  async adminUpdate(
    tacticId: number,
    reqBody: TacticUpdateForAdminDto,
    adminId: number,
  ): Promise<TacticReturnDto> {
    let theChangedTactic = await this.tacticRepository.findById(tacticId);

    // console.log(theChangedTactic);

    if (
      theChangedTactic.user &&
      theChangedTactic.user.type === UserRoleEnum.CUSTOMER
    ) {
      throw new UnauthorizedException('Tactic belong to a customer');
    }

    let updatedTactic = await this.tacticRepository.update(reqBody, tacticId);

    await this.logService.create(
      {
        entity: LogEntityEnum.TACTIC,
        entityId: tacticId,
        operation: LogOperationEnum.UPDATE,
        oldObject: theChangedTactic,
        newObject: updatedTactic,
        changesObject: reqBody,
      },
      adminId,
    );

    return updatedTactic;
  }

  async adminDelete(
    tacticId: number,
    adminId: number,
  ): Promise<TacticReturnDto> {
    let theChangedTactic = await this.tacticRepository.findById(tacticId);

    if (
      theChangedTactic.user &&
      theChangedTactic.user.type === UserRoleEnum.CUSTOMER
    ) {
      throw new UnauthorizedException('Tactic belong to a customer');
    }

    let deletedTactic = await this.tacticRepository.findById(tacticId);

    await this.tacticRepository.delete(tacticId);

    await this.logService.create(
      {
        entity: LogEntityEnum.TACTIC,
        entityId: deletedTactic.id,
        operation: LogOperationEnum.DELETE,
        oldObject: deletedTactic,
        newObject: null,
        changesObject: null,
      },
      adminId,
    );

    return deletedTactic;
  }

  async adminGetOne(tacticId: number, adminId: number): Promise<any> {
    let theDesiredTactic = await this.tacticRepository.findById(tacticId);
    if (theDesiredTactic.private == true) {
      throw new ForbiddenException('Tactic is private');
    }

    return theDesiredTactic;
  }

  async adminGetAll(
    filter: GetAllFilterDto,
    pagination: PaginationDto,
    adminId: number,
  ): Promise<any[]> {
    let allTactics = await this.tacticRepository.findAll(filter, pagination);

    return allTactics;
  }

  async adminHide(tacticId: number, adminId: number): Promise<any> {
    let theDesiredTactic = await this.tacticRepository.findById(tacticId);
    if (theDesiredTactic.private == true) {
      throw new ForbiddenException('Tactic is private');
    }

    let changedHidden: boolean;

    if (theDesiredTactic.hidden == true) {
      await this.tacticRepository.update({ hidden: false }, tacticId);
      changedHidden = false;
    } else if (theDesiredTactic.hidden == false) {
      await this.tacticRepository.update({ hidden: true }, tacticId);
      changedHidden = true;
    }

    let theUpdatedTactic = await this.tacticRepository.findById(tacticId);

    await this.logService.create(
      {
        entity: LogEntityEnum.USER,
        entityId: theUpdatedTactic.id,
        operation: LogOperationEnum.UPDATE,
        oldObject: theDesiredTactic,
        newObject: theUpdatedTactic,
        changesObject: { hidden: changedHidden },
      },
      adminId,
    );

    return theUpdatedTactic;
  }
}
