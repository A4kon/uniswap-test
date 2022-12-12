import fetch from 'node-fetch';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UniswapConfigInterface } from 'src/common/interfaces';
import { createClient } from 'urql';
import { InjectRepository } from '@nestjs/typeorm';
import { UniswapV2PairsEntity } from 'src/common/entities/uniswap.v2.pairs.entity';
import { Repository } from 'typeorm';
import { createUniswapV2PairDto } from 'src/common/dto/uniswapv2';
import * as dayjs from 'dayjs';

@Injectable()
export class UniswapCronService {
  private uniswapConfig: UniswapConfigInterface;
  private readonly logger = new Logger(UniswapCronService.name);
  constructor(
    @InjectRepository(UniswapV2PairsEntity)
    private uniswapRepository: Repository<UniswapV2PairsEntity>,
    private readonly configService: ConfigService,
  ) {
    const uniswapConfig =
      this.configService.get<UniswapConfigInterface>('uniswap');
    if (!uniswapConfig) {
      throw new NotFoundException('Uniswap Config Not Found');
    } else {
      this.uniswapConfig = uniswapConfig;
    }
  }
  async handleCronUniswapQuery() {
    // Optionally I would use Apollo Client
    const lastImported = await this.uniswapRepository.findOne({
      order: {
        uniswapCreatedAtTimeStamp: 'DESC',
      },
    });
    // add optional pagination
    let tokensQuery: string;
    if (!lastImported) {
      tokensQuery = `
      query {
        pairs {
          id, token0:id,token1:id,createdAtTimestamp
        }
      }
    `;
    } else {
      tokensQuery = `
      query {
        pairs(where:{
    createdAtTimestamp_gt: ${dayjs(
      lastImported.uniswapCreatedAtTimeStamp,
    ).unix()}
  }) {
          id, token0:id,token1:id,createdAtTimestamp
        }
      }
    `;
    }

    const client = createClient({
      url: this.uniswapConfig.api_url,
      fetch,
    });
    try {
      const data = await (
        await client.query(tokensQuery, null).toPromise()
      ).data.pairs;
      for (let a = 0; a < data.length; a++) {
        const ifExists = await this.uniswapRepository.findOne({
          pairId: data[a].id as string,
        });
        if (!ifExists) {
          const saveObj: createUniswapV2PairDto = {
            pairId: data[a].id as string,
            token0Id: data[a].token0 as string,
            token1Id: data[a].token1 as string,
            uniswapCreatedAtTimeStamp: dayjs(
              parseInt(data[a].createdAtTimestamp) * 1000,
            ).toDate(),
          };
          await this.uniswapRepository.save(saveObj);
        }
      }
    } catch (e) {
      console.log(e);
      this.logger.error('Unable to fetch data');
    }
  }
}
