import { IsEnum, ValidateIf } from 'class-validator';
import { HouseholdServicesEnum } from '../enums/household-services.enum';
import { MainCategoryEnum } from '../enums/main-category.enum';
import { TechnologyServicesEnum } from '../enums/technology-services.enum';
import { VehicleServicesEnum } from '../enums/vehicle-services.enum';

export class UpdateProviderCategoryDto {
  @IsEnum(MainCategoryEnum)
  category: MainCategoryEnum;

  @ValidateIf((o) => o.category === MainCategoryEnum.HOUSEHOLD)
  @IsEnum(HouseholdServicesEnum)
  householdService: HouseholdServicesEnum;

  @ValidateIf((o) => o.category === MainCategoryEnum.TECHNOLOGY)
  @IsEnum(TechnologyServicesEnum)
  technologyService: TechnologyServicesEnum;

  @ValidateIf((o) => o.category === VehicleServicesEnum)
  @IsEnum(VehicleServicesEnum)
  vehicleService: VehicleServicesEnum;
}
