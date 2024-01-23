import { AppDataSource } from '../db/data-source';
import { User } from '../db/entity/User';
import { logger } from '../utils/logger/logger';

class UserService {
  private userServiceRepository = AppDataSource.getRepository(User);

  async createUser(userName: string): Promise<string> {
    const candidate = await this.userServiceRepository.existsBy({
      userName,
    });
    if (candidate) {
      const alreadyExistMessage = `Welcome back ${userName}`;
      logger.info(alreadyExistMessage);
      return alreadyExistMessage;
    }
    const user = this.userServiceRepository.create({
      userName,
    });
    await this.userServiceRepository.insert(user);
    const resultMessage = `Hello ${userName}, where do you want to start?`;
    logger.info(resultMessage);
    return resultMessage;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userServiceRepository.find();
  }

  async getOneUser(userName: string): Promise<User | string> {
    const user = await this.userServiceRepository.findOneBy({
      userName,
    });
    if (user === null) {
      const doesNotExist = `User: "${userName}" does not exist\nRestart bot: /start`;
      logger.info(doesNotExist);
      return doesNotExist;
    }
    return user;
  }
}

export const userService = new UserService();
