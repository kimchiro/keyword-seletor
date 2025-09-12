import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('related_terms')
@Index(['rootKeyword', 'relatedTerm'], { unique: true })
export class RelatedTermsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, name: 'root_keyword' })
  rootKeyword: string;

  @Column({ type: 'varchar', length: 255, name: 'related_term' })
  relatedTerm: string;

  @Column({ type: 'decimal', precision: 5, scale: 4, default: 0 })
  relevance: number;

  @Column({ type: 'bigint', nullable: true, name: 'search_volume' })
  searchVolume: number | null;

  @Column({ type: 'varchar', length: 50, default: 'naver-autocomplete' })
  source: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
