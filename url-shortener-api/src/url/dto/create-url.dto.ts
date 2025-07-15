import { IsString, IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';

/**
 * Custom slug validator to prevent forbidden slugs
 * For now, we're preventing the use of the words "admin" and "auth"
 * TODO This will be solved if we keep admin and auth under other subdomains (e.g. admin.urlshortener.com, auth.urlshortener.com)
 */
@ValidatorConstraint({ async: false })
class IsNotForbiddenSlugConstraint implements ValidatorConstraintInterface {
  validate(slug: any, args: ValidationArguments) {
    if (typeof slug !== 'string') return true;
    const forbidden = ['admin', 'auth'];
    return !forbidden.includes(slug.toLowerCase());
  }
  defaultMessage(args: ValidationArguments) {
    return 'This slug is not allowed.';
  }
}

export function IsNotForbiddenSlug(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNotForbiddenSlugConstraint,
    });
  };
}

export class CreateUrlDto {

    @IsString()
    @IsNotEmpty({ message: 'URL is required' })
    @Transform(({ value }) => {
      // Normalize the URL by ensuring it has a protocol
      if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
        return `https://${value}`;
      }
      return value;
    })
    url: string;

    /**
     * Optional custom slug for the shortened URL. If provided, the service will use this slug if available.
     */
    @IsOptional()
    @IsString({ message: 'Custom slug must be a string' })
    @IsNotForbiddenSlug({ message: 'This slug is not allowed.' })
    slug?: string;

}
