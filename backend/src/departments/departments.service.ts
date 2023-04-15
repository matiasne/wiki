import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthUser } from 'src/auth/interfaces/auth.interfaces';
import { UserDepartmentRolService } from 'src/user-department-rol/user-department-rol.service';

import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentsRepository: Repository<Department>,
    private usersService: UsersService,
    private userDepartmentRolService: UserDepartmentRolService,
  ) {}

  async create(user: any, createDepartmentDto: CreateDepartmentDto) {
    if (await this.checkIfDEpartmentExists(createDepartmentDto)) {
      throw new ConflictException();
    }

    const owner = await this.usersService.getById(user.id);

    const newDepartment: Department =
      this.departmentsRepository.create(createDepartmentDto);

    if (createDepartmentDto.parentId != '0') {
      const parentDepartment = await this.findOne(createDepartmentDto.parentId);
      newDepartment.parent = parentDepartment;
    }

    let dept: Department = await this.departmentsRepository.save(newDepartment);

    this.userDepartmentRolService.addUserAsOwner(owner, dept);

    return dept;
  }

  async findAll() {
    return await this.departmentsRepository.find();
  }

  async findAllByUser(user: IAuthUser): Promise<Department[]> {
    const parameters = {
      userId: user.id,
    };

    const data = await this.departmentsRepository
      .createQueryBuilder('department')
      .leftJoinAndSelect('department.usersRoles', 'userDepartmentRol')
      .leftJoinAndSelect('userDepartmentRol.user', 'user')
      .andWhere('user.id = :userId')
      .setParameters(parameters)
      .getMany();

    return data;
  }

  async findOne(id: string) {
    const departments = await this.departmentsRepository.findOne({
      where: { id: id },
      relations: [
        'children',
        'parent',
        'metrics',
        'metrics.usersRoles',
        'usersRoles.user',
        'metrics.fields',
        'metrics.fields.registers',
      ],
    });

    return departments;
  }

  async getById(id: string): Promise<Department> {
    try {
      return await this.departmentsRepository.findOne({
        where: { id: id },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    const updateDepartment: Department =
      this.departmentsRepository.create(updateDepartmentDto);

    if (updateDepartmentDto.parentId != '0') {
      const parentDepartment = await this.findOne(updateDepartmentDto.parentId);
      updateDepartment.parent = parentDepartment;
    }

    return await this.departmentsRepository.update(id, updateDepartment);
  }

  async remove(id: string) {
    return await this.departmentsRepository.delete(id);
  }

  async checkIfDEpartmentExists(createDepartmentDto: CreateDepartmentDto) {
    const filters = {
      name: createDepartmentDto.name,
      parentId: createDepartmentDto.parentId,
    };

    if (filters.parentId != '0') {
      const data = await this.departmentsRepository
        .createQueryBuilder('department')
        .andWhere('department.name = :name')
        .andWhere('department.parentId = :parentId')
        .setParameters(filters)
        .getMany();

      return data.length > 0;
    }
    return false;
  }
}
