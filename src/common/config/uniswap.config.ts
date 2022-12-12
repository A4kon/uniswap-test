import { registerAs } from '@nestjs/config';
import { UniswapConfigInterface } from '../interfaces';

export default registerAs<UniswapConfigInterface>('uniswap', () => ({
  api_url: process.env.UNISWAP_API_URL,
}));
