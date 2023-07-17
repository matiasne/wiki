import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/createComment.dto';
import { Comment } from './entities/comment.entity';
import { IAuthUser } from 'src/auth/interfaces/auth.interfaces';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
  ) {}

  async create(user: IAuthUser, createCommentDto: CreateCommentDto) {}

  async findAllByChatterbox(chatterboxId: string): Promise<Comment[]> {
    const parameters = {
      chatterboxId: chatterboxId,
    };

    const data = await this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.chatterbox', 'chatterbox')
      .andWhere('chatterbox.id = :chatterboxId')
      .setParameters(parameters)
      .getMany();

    return data;
  }

  async remove(id: string) {
    return await this.commentsRepository.delete(id);
  }
}
