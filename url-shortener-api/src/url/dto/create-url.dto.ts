import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

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
    customSlug?: string;

}
