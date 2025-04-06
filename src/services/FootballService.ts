import { Service } from '../decorators/service.decorator';

export interface IFootballService {
  getTeamInfo(teamId: string): Promise<string>;
  getPlayerStats(playerId: string): Promise<{ goals: number; assists: number }>;
}

@Service()
export class FootballService implements IFootballService {
  async getTeamInfo(teamId: string): Promise<string> {
    // 실제 구현에서는 API 호출 등을 할 수 있습니다
    return `Team ${teamId} information`;
  }

  async getPlayerStats(playerId: string): Promise<{ goals: number; assists: number }> {
    // 실제 구현에서는 API 호출 등을 할 수 있습니다
    return {
      goals: 15,
      assists: 8,
    };
  }
}
