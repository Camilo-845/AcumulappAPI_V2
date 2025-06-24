export interface ICardState {
  id: number;
  name: string;
}

export interface ICreateCardStateData {
  name: string;
}

export interface IUpdateCardStateData {
  name?: string;
}
