import { createContext } from "@meact";

export interface ICurrentLoggedInUser {
  id: string;
  karma: number;
}

export const MeContext = createContext<ICurrentLoggedInUser | undefined>(
  undefined
);
