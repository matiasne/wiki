import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/createComment.dto';
import { Comment } from './entities/comment.entity';
import { UsersService } from 'src/users/users.service';
import { ChatterboxService } from 'src/chatterbox/chatterbox.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    private readonly usersService: UsersService,
    private readonly chatterboxService: ChatterboxService,
  ) {}

  async create(user: any, createCommentDto: CreateCommentDto) {
    const owner = await this.usersService.getById(user.id);
    const chatterbox = await this.chatterboxService.findByNodeId(
      createCommentDto.chatterboxId,
    );

    const newComment: Comment =
      this.commentsRepository.create(createCommentDto);

    newComment.userCreator = owner;
    newComment.chatterbox = chatterbox;

    let comment: Comment = await this.commentsRepository.save(newComment);

    return comment;
  }

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
