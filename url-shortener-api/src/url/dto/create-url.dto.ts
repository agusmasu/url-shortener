import { IsString, IsNotEmpty } from 'class-validator';
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

}
