import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CustomerRegisterDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
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
  address: string;
}
