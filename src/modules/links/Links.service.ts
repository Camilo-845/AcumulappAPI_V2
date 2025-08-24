import { ILink } from "./Links.model";
import { LinksRepository } from "./Links.repository";

export class LinksService {
  private linksRepository: LinksRepository;

  constructor() {
    this.linksRepository = new LinksRepository();
  }

  public async getAllLinks(): Promise<ILink[]> {
    return await this.linksRepository.findAll();
  }
}
