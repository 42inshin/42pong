import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

@Injectable()
export class CustomValidation implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException("Validation failed");
    }
    let haha = String(value.type);
    if (haha == "public" || haha == "private") return value;
    else throw new BadRequestException("type is only public | private ");
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String];
    return !types.includes(metatype);
  }
}
