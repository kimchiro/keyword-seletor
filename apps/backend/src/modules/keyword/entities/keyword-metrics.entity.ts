import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('keyword_metrics_monthly')
@Index(['keyword', 'yearMonth'], { unique: true })
export class KeywordMetricsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  keyword: string;

  @Column({ type: 'varchar', length: 7, name: 'year_month' }) // YYYY-MM 형식
  yearMonth: string;

  @Column({ type: 'bigint', nullable: true, name: 'search_volume' })
  searchVolume: number | null;

  @Column({
    type: 'enum',
    enum: ['HIGH', 'MEDIUM', 'LOW'],
    nullable: true,
  })
  competition: 'HIGH' | 'MEDIUM' | 'LOW' | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'competition_index' })
  competitionIndex: number | null;

  @Column({ type: 'varchar', length: 50, default: 'naver-ads-api' })
  source: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
