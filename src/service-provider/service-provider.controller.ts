import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProviderRegisterDto } from './dtos/provider-register.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';
import { ServiceProviderService } from './providers/service-provider.service';
import { JwtAuthGuard } from './common/jwt-auth.guard';

@Controller('service-provider')
export class ServiceProviderController {
  constructor(
    private readonly serviceProviderService: ServiceProviderService,
  ) {}
  @Post('signup')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) {
          cb(null, true);
        } else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 5 * 1000 * 1000 },
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, Date.now() + file.originalname);
        },
      }),
    }),
  )
  signUp(
    @UploadedFile() file: Express.Multer.File,
    @Body() providerRegisterDto: ProviderRegisterDto,
  ) {
    const fullRegisterDto = {
      ...providerRegisterDto,
      profile_image_url: file.path,
    };
    return this.serviceProviderService.signUp(fullRegisterDto);
  }

  @Post('login')
  login(@Body() providerLoginDto: ProviderRegisterDto) {
    return this.serviceProviderService.login(providerLoginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/')
  profile(@Req() req: any) {
    return this.serviceProviderService.getProfile(req.process?.email);
  }
}
