import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
import { User } from './entities/users.entity';

@Injectable()
export class UsersService {
  private userPool: CognitoUserPool;
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDTO: CreateUserDto) {
    try {
      let userExists = await this.usersRepository.findOne({
        where: { email: createUserDTO.email },
      });
      if (!userExists) return await this.usersRepository.save(createUserDTO);
      else throw new Error('User already exists');
    } catch (error) {
      throw new Error(error);
    }
  }

  async getById(id: string): Promise<User> {
    try {
      return await this.usersRepository.findOne({
        where: { id: id },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.usersRepository.find({
        relations: [
          'nodesRoles.node',
          'invitationsSent',
          'invitationsReceived',
          'notifications',
        ],
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async getMy(id: string): Promise<User> {
    try {
      let user = await this.usersRepository.findOne({
        where: { id: id },
        relations: [
          'nodesRoles.node',
          'invitationsSent',
          'invitationsReceived',
          'notifications',
        ],
      });

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOne({ where: { email: email } });
    } catch (error) {
      throw new Error(error);
    }
  }
}
