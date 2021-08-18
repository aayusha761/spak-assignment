import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as Bcrypt from 'bcryptjs';

@Entity()
class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column()
  address: string;

  @Column({ unique: true })
  contact: string;

  @Column()
  gender: string;

  @Column({ default: 0 })
  access: number;

  @BeforeInsert()
  public async beforeInsertHooks() {
    this.password = Bcrypt.hashSync(this.password, 10); // Hash password
  }

  public static async findById(id: number): Promise<UserEntity> {
    return await UserEntity.findOne({
      select: ['name', 'email', 'address', 'contact'],
      where: { id },
    });
  }

  public static async getUserByName(name: string): Promise<UserEntity[]> {
    return await UserEntity.find({
      select: ['name', 'email', 'address', 'contact'],
      where: { name },
    });
  }

  public static async getUserByEmail(email: string): Promise<UserEntity> {
    return await UserEntity.findOne({
      where: { email },
    });
  }

  public static async getUserByContact(contact: string): Promise<UserEntity> {
    return await UserEntity.findOne({
      select: ['name', 'email', 'address', 'contact'],
      where: { contact },
    });
  }

  public static async removeUser(email: string): Promise<UserEntity> {
    return await UserEntity.remove(
      await UserEntity.findOne({ where: { email } }),
    );
  }
}

export default UserEntity;
