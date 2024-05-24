import UserRepo from "../database/repository/UserRepo";
import Logger from "../core/Logger";
import ApiRepo from "../database/repository/ApiKeyRepo";
import RoleRepo from "../database/repository/RoleRepo";


export default class Seeders {

  public static async init(): Promise<void> {

    await ApiRepo.seed();
    await RoleRepo.seed();
    // await CategoryRepo.seed()

    console.log("Initialized.")
  }

}