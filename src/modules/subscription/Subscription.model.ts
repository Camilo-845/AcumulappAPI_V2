export interface ISubscription {
  id: number;
  idBusiness: number;
  idPlan: number;
  startDate: Date;
  endDate?: Date | null;
  creationDate: Date;
}
