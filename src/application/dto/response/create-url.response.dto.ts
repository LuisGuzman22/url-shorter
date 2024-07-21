export class CreateUrlResponseDto {
  shortList: ShortUrl[];
}

export class ShortUrl {
  shortUrl: string;
  longUrl: string;
}
