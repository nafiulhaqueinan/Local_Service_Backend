import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { MainCategoryEnum } from '../enums/main-category.enum';
import { HouseholdServicesEnum } from '../enums/household-services.enum';
import { TechnologyServicesEnum } from '../enums/technology-services.enum';
import { VehicleServicesEnum } from '../enums/vehicle-services.enum';

export class ProviderRegisterDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z]+(?:[ .'\-][A-Za-z]+)*$/, {
    message:
      'fullName must contain only letters, spaces, apostrophes, hyphens or dots.',
  })
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/, {
    message:
      'password must contain uppercase, lowercase, number and special character.',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?:\+?88)?01[3-9]\d{8}$/, {
    message: 'phone must be a valid Bangladeshi phone number.',
  })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 120)
  address: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(20, {
    message: 'description must be at least 20 characters long.',
  })
  @MaxLength(512, {
    message: 'description must not exceed 500 characters.',
  })
  description: string;

  @IsNotEmpty()
  @IsEnum(MainCategoryEnum)
  category: MainCategoryEnum;

  @ValidateIf((o) => o.category === MainCategoryEnum.HOUSEHOLD)
  @IsEnum(HouseholdServicesEnum)
  @IsNotEmpty()
  householdService: HouseholdServicesEnum;

  @ValidateIf((o) => o.category === MainCategoryEnum.TECHNOLOGY)
  @IsEnum(TechnologyServicesEnum)
  @IsNotEmpty()
  technologyService: TechnologyServicesEnum;

  @ValidateIf((o) => o.category === MainCategoryEnum.VEHICLE)
  @IsEnum(VehicleServicesEnum)
  @IsNotEmpty()
  vehicleService: VehicleServicesEnum;

  @IsNumber()
  @Min(1, {
    message: 'price must be at least 1',
  })
  @IsNotEmpty()
  price: number;

  @IsOptional()
  @IsString()
  profile_image_url?: string;
}
