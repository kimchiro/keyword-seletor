import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('keywords')
export class KeywordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  keyword: string;

  @Column({ type: 'datetime', name: 'first_searched_at' })
  firstSearchedAt: Date;

  @Column({ type: 'datetime', name: 'last_searched_at' })
  lastSearchedAt: Date;

  @Column({ type: 'int', default: 0, name: 'search_count' })
  searchCount: number;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
