import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('tag_suggestions')
@Index(['rootKeyword', 'tag'], { unique: true })
export class TagSuggestionsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, name: 'root_keyword' })
  rootKeyword: string;

  @Column({ type: 'varchar', length: 100 })
  tag: string;

  @Column({ type: 'int', default: 1 })
  frequency: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  category: string | null;

  @Column({ type: 'varchar', length: 50, default: 'blog-crawling' })
  source: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
