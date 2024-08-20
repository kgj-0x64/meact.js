import { validateUserId } from "../../app/utils/validation/user";

export class UserModel {
  public readonly id: string;

  public readonly about: string;

  public readonly creationTime: number;

  public readonly dateOfBirth: number | null;

  public readonly email: string | null;

  public readonly firstName: string | null;

  public readonly hides;

  public readonly karma: number;

  public readonly lastName: string | null;

  public readonly likes;

  public readonly posts;

  public readonly hashedPassword: string | undefined;

  public readonly passwordSalt: string | undefined;

  constructor(fields: any) {
    if (!fields.id) {
      throw new Error(`Error instantiating User, id invalid: ${fields.id}`);
    }

    validateUserId(fields.id);

    this.id = fields.id;
    this.about = fields.about || "";
    this.creationTime = fields.creationTime || +new Date();
    this.dateOfBirth = fields.dateOfBirth || null;
    this.email = fields.email || null;
    this.firstName = fields.firstName || null;
    this.hides = fields.hides || [];
    this.karma = fields.karma || 1;
    this.lastName = fields.lastName || null;
    this.likes = fields.likes || [];
    this.posts = fields.posts || [];
    this.hashedPassword = fields.hashedPassword || undefined;
    this.passwordSalt = fields.passwordSalt || undefined;
  }
}
