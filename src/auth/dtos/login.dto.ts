import { OmitType } from '@nestjs/mapped-types';
import { SignUpDto } from './signup.dto';

export class LoginDto extends OmitType(SignUpDto, ['name']) {}
