export interface ManageUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  admin: boolean;
  issuer: string;
  selected: boolean;
}
