import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from 'src/departments/entities/department.entity';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import {
  CreateUserDepartmentRolDto,
  Rol,
} from './dto/create-user-department-rol.dto';
import { UpdateUserDepartmentRolDto } from './dto/update-user-department-rol.dto';
import { UserDepartmentRol } from './entities/user-department-rol.entity';

@Injectable()
export class UserDepartmentRolService {
  constructor(
    @InjectRepository(UserDepartmentRol)
    private readonly userDepartmentRolRepository: Repository<UserDepartmentRol>,
  ) {}

  create(createUserDepartmentRolDto: CreateUserDepartmentRolDto) {
    let newUserDepartmentRol = this.userDepartmentRolRepository.create(
      createUserDepartmentRolDto,
    );
    this.userDepartmentRolRepository.save(newUserDepartmentRol);
  }

  async findAll() {
    return `This action returns all userDepartmentRol`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userDepartmentRol`;
  }

  update(id: number, updateUserDepartmentRolDto: UpdateUserDepartmentRolDto) {
    return `This action updates a #${id} userDepartmentRol`;
  }

  /*async remove(departmentId: string, userId: string) {
    const parameters = {
      userId: userId,
      departmentId: departmentId,
    };

    let userDepartmentRol = await this.userDepartmentRolRepository
      .createQueryBuilder('userDEpartmentRol')
      .leftJoinAndSelect('userDEpartmentRol.user', 'user')
      .leftJoinAndSelect('userDEpartmentRol.department', 'department')
      .andWhere('user.id = :userId')
      .andWhere('department.id = :departmentId')
      .setParameters(parameters)
      .getOne();

    return await this.userDepartmentRolRepository.delete(userDepartmentRol.id);
  }*/

  async addUserAsOwner(user: User, department: Department) {
    const newUserDepartmentRolDTO: CreateUserDepartmentRolDto = {
      rol: Rol.OWNER,
      department: department,
      user: user,
    };

    this.create(newUserDepartmentRolDTO);
  }

  async checkIfUserIsOwner(userId: string, departmentId: string) {
    const parameters = {
      userId: userId,
      departmentId: departmentId,
      rol: Rol.OWNER,
    };

    let res = await this.userDepartmentRolRepository
      .createQueryBuilder('userDEpartmentRol')
      .leftJoinAndSelect('userDEpartmentRol.user', 'user')
      .leftJoinAndSelect('userDEpartmentRol.department', 'department')
      .andWhere('user.id = :userId')
      .andWhere('department.id = :departmentId')
      .andWhere('userDEpartmentRol.rol = :rol')
      .setParameters(parameters)
      .getMany();

    return res != null;
  }

  async remove(id: string) {
    //aca remover la notificacion??

    return await this.userDepartmentRolRepository.delete(id);
  }
}
