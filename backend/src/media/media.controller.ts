import {
  Controller, Get, Post, Delete, Patch,
  Param, UseGuards, UseInterceptors,
  UploadedFile, ParseFilePipe, MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { multerConfig } from './media.config';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('media')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Get()
  findAll(@CurrentUser() user: { role: string }) {
    const isAdmin = user.role === Role.ADMIN;
    return this.mediaService.findAll(!isAdmin);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  upload(
    @CurrentUser() user: { sub: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.mediaService.upload(user.sub, file);
  }

  @Patch(':id/approve')
  @Roles(Role.ADMIN)
  approve(@Param('id') id: string) {
    return this.mediaService.approve(id);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { sub: string; role: string },
  ) {
    return this.mediaService.remove(id, user.sub, user.role === Role.ADMIN);
  }
}