import { IBusinessCategory } from "../businessCategories/BusinessCategories.model";
import { ILink } from "../links/Links.model";

export interface IBusinessLink extends ILink {
  value: string;
}

export interface IBusiness {
  id: number;
  name?: string | null;
  description?: string | null;
  email?: string | null;
  logoImage?: string | null;
  bannerImage?: string | null;
  address?: string | null;
  fullInformation: boolean;
  rating_average: number;
  rating_count: number;
  location_latitude?: number | null;
  location_longitude?: number | null;
  createdAt: Date;
  categories?: IBusinessCategory[] | null;
  links?: IBusinessLink[] | null;
}

export interface ICreateBusinessData {
  name?: string;
  description?: string;
  email?: string;
  logoImage?: string;
  bannerImage?: string;
  address?: string;
  location_latitude?: number;
  location_longitude?: number;
}
