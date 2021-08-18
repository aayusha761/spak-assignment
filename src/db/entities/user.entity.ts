import {
  BaseEntity,
  BeforeInsert,
  Column, Entity,
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

  @BeforeInsert()
  public async beforeInsertHooks() {
    this.password = Bcrypt.hashSync(this.password, 10); // Hash password
  }

  public static async findById(id: number): Promise<UserEntity> {
    return await UserEntity.findOne({ where: { id } });
  }

  public static async getUserByName(name: string): Promise<UserEntity[]> {
    return await UserEntity.find({ where: { name } });
  }

  public static async getUserByEmail(email: string): Promise<UserEntity> {
    return await UserEntity.findOne({ where: { email } });
  }

  public static async getUserByContact(name: string): Promise<UserEntity> {
    return await UserEntity.findOne({ where: { name } });
  }

  public static async removeUser(email: string): Promise<UserEntity> {
    return await UserEntity.remove(
      await UserEntity.findOne({ where: { email } }),
    );
  }
}

export default UserEntity;
