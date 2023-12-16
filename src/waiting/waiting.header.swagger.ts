import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export function WaitingHeaderSwagger() {
  return applyDecorators(
    ApiHeader({
      name: 'waiting-token',
    }),
  );
}
