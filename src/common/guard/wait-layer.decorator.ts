import { SetMetadata } from '@nestjs/common';

export const WaitLayerDecorator = () => SetMetadata('waitLayer', true);
