import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { HttpExceptionFilter } from 'src/shared/http-exceptions.filter';
import { AuthUser } from 'src/auth/auth.decorator';
import { IAuthUser } from 'src/auth/interfaces/auth.interfaces';
import { OpenAIService } from 'src/openai/openai.service';

@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard('jwt'))
@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly openaiService: OpenAIService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSufix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          let name = file.originalname.substring(
            0,
            file.originalname.lastIndexOf('.'),
          );
          const ext = extname(file.originalname);
          const filename = `${name}-${uniqueSufix}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async uploadFile(
    @AuthUser() user: IAuthUser,
    @UploadedFile() file: Express.Multer.File,
    @Body() createDocumentDto: CreateDocumentDto,
  ) {
    try {
      return await this.documentsService.upload(createDocumentDto, file, user);
    } catch (err) {
      throw err;
    }
  }

  @Post('upload/temp')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/temp',
        filename: (req, file, cb) => {
          const uniqueSufix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          let name = file.originalname.substring(
            0,
            file.originalname.lastIndexOf('.'),
          );
          const ext = extname(file.originalname);
          const filename = `${name}-${uniqueSufix}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async uploadTemporaryFile(
    @AuthUser() user: IAuthUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      let ngrokUrl = 'https://01b9-200-127-198-221.ngrok-free.app';
      return await this.openaiService.createCompletion(
        'About what is this image: ' + ngrokUrl + '/temp/' + file.filename,
      );
    } catch (err) {
      throw err;
    }
  }

  @Post()
  async create(
    @AuthUser() user: IAuthUser,
    @Body() creatDocumentDto: CreateDocumentDto,
  ) {
    return await this.documentsService.create(user, creatDocumentDto);
  }

  @Get()
  findAll() {
    return this.documentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsService.findByNodeId(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentsService.update(id, updateDocumentDto);
  }
}
