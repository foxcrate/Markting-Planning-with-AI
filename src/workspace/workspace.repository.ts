import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { WorkspaceReturnDto } from './dtos/workspace-return.dto';
import { Pool } from 'mariadb';
import { DB_PROVIDER } from 'src/db/constants';
import { TemplateReturnDto } from 'src/template/dtos/template-return.dto';
import { TemplateType } from 'src/enums/template-type.enum';

@Injectable()
export class WorkspaceRepository {
  constructor(@Inject(DB_PROVIDER) private db: Pool) {}

  async create(
    workspaceObject: any,
    userId: number,
  ): Promise<WorkspaceReturnDto> {
    const query = `
      INSERT INTO workspaces (parameters , userId) VALUES ( ?, ?)
    `;
    const params = [workspaceObject, userId];

    const createdWorkspace = await this.db.query(query, params);
    return await this.findById(Number(createdWorkspace.insertId));
  }

  async updateFirstWorkspace(
    workspaceObject: any,
    userId: number,
  ): Promise<WorkspaceReturnDto> {
    // get user first workspace
    let userWorkspaces = await this.findAllUserWorkspaces(userId);

    if (userWorkspaces.length == 0) {
      throw new UnprocessableEntityException('User has no workspaces');
    }

    const query = `
      UPDATE workspaces
      SET
      parameters = IFNULL(?,workspaces.parameters),
      confirmed = true
      WHERE id = ?
    `;
    const params = [workspaceObject, userWorkspaces[0].id];
    await this.db.query(query, params);

    return this.findById(userWorkspaces[0].id);
  }

  async update(
    workspaceObject: any,
    workspaceId: number,
  ): Promise<WorkspaceReturnDto> {
    const query = `
      UPDATE workspaces
      SET
      parameters = IFNULL(?,workspaces.parameters),
      confirmed = true
      WHERE id = ?
    `;
    const params = [workspaceObject, workspaceId];
    await this.db.query(query, params);
    return await this.findById(workspaceId);
  }

  async confirmFirstWorkspace(userId: number) {
    // get user first workspace
    let userWorkspaces = await this.findUserUnConfirmedWorkspaces(userId);
    // console.log({ userWorkspaces });

    if (userWorkspaces.length == 0) {
      throw new UnprocessableEntityException(
        'User has no unconfirmed workspaces',
      );
    }
    const query = `
      UPDATE workspaces
      SET
      confirmed = true
      WHERE id = ?
    `;
    await this.db.query(query, [userWorkspaces[0].id]);
    return await this.findById(userWorkspaces[0].id);
  }

  async confirm(id: number) {
    const query = `
      UPDATE workspaces
      SET
      confirmed = true
      WHERE id = ?
    `;
    await this.db.query(query, [id]);
    return await this.findById(id);
  }

  async findById(id): Promise<WorkspaceReturnDto> {
    let query = `
    SELECT
      workspaces.id,
      workspaces.parameters,
      workspaces.userId
    FROM workspaces
    WHERE workspaces.id = ?
  `;

    const [theWorkspace] = await this.db.query(query, [id]);

    // theWorkspace.parameters = JSON.parse(theWorkspace.parameters);

    try {
      theWorkspace.parameters = eval(`(${theWorkspace.parameters})`);
      // console.log(arrayOfObjects);
    } catch (error) {
      console.error('Parsing error:', error);
    }

    return theWorkspace;
  }

  async findAllUserWorkspaces(userId): Promise<WorkspaceReturnDto[]> {
    let query = `
    SELECT
      workspaces.id,
      workspaces.parameters,
      workspaces.userId
    FROM workspaces
    WHERE workspaces.userId = ?
    ORDER BY workspaces.createdAt ASC
  `;

    const theWorkspaces = await this.db.query(query, [userId]);

    theWorkspaces.forEach((workspace) => {
      // workspace.parameters = JSON.parse(JSON.stringify(workspace.parameters));

      try {
        workspace.parameters = eval(`(${workspace.parameters})`);
        // console.log(arrayOfObjects);
      } catch (error) {
        console.error('Parsing error:', error);
      }
    });

    return theWorkspaces;
  }

  async findUserConfirmedWorkspaces(userId): Promise<WorkspaceReturnDto[]> {
    let query = `
    SELECT
      workspaces.id,
      workspaces.parameters,
      workspaces.userId
    FROM workspaces
    WHERE workspaces.userId = ?
    AND workspaces.confirmed = true
    ORDER BY workspaces.createdAt ASC
  `;

    const theWorkspaces = await this.db.query(query, [userId]);

    theWorkspaces.forEach((workspace) => {
      // workspace.parameters = JSON.parse(JSON.stringify(workspace.parameters));

      try {
        workspace.parameters = eval(`(${workspace.parameters})`);
        // console.log(arrayOfObjects);
      } catch (error) {
        console.error('Parsing error:', error);
      }
    });

    return theWorkspaces;
  }

  async findUserUnConfirmedWorkspaces(userId): Promise<WorkspaceReturnDto[]> {
    let query = `
    SELECT
      workspaces.id,
      workspaces.parameters,
      workspaces.userId
    FROM workspaces
    WHERE workspaces.userId = ?
    AND workspaces.confirmed = false
    ORDER BY workspaces.createdAt ASC
  `;

    const theWorkspaces = await this.db.query(query, [userId]);

    theWorkspaces.forEach((workspace) => {
      // workspace.parameters = JSON.parse(JSON.stringify(workspace.parameters));

      try {
        workspace.parameters = eval(`(${workspace.parameters})`);
        // console.log(arrayOfObjects);
      } catch (error) {
        console.error('Parsing error:', error);
      }
    });

    return theWorkspaces;
  }

  async getOnboardingTemplate(): Promise<TemplateReturnDto> {
    const query = `
    SELECT
      templates.id,
      templates.name,
      templates.type,
      templates.description,
      templates.parameters,
      templates.openaiAssistantId
    FROM templates
    WHERE templates.type = ?
   `;
    const templates = await this.db.query(query, [TemplateType.ONBOARDING]);

    if (templates.length === 0) {
      throw new UnprocessableEntityException('Template not found');
      // return null;
    }
    const template = templates[0];

    // template.parameters = JSON.parse(template.parameters);

    try {
      template.parameters = eval(`(${template.parameters})`);
      // console.log(arrayOfObjects);
    } catch (error) {
      console.error('Parsing error:', error);
    }

    // console.log(template);

    return template;
  }

  async getOnboardingParameters() {
    let onboardingTemplate = await this.getOnboardingTemplate();
    let onboardingParameters = onboardingTemplate.parameters;
    // console.log(onboardingParameters);

    let onboardingParametersNames = onboardingParameters.map(
      (parameter) => parameter.name,
    );
    return onboardingParametersNames;
  }
}
