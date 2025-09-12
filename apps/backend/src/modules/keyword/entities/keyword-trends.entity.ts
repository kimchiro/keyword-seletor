import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('keyword_trends_daily')
@Index(['keyword', 'date'], { unique: true })
export class KeywordTrendsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  keyword: string;

  @Column({ type: 'date' })
  date: string; // YYYY-MM-DD 형식

  @Column({ type: 'int', name: 'trend_value' })
  trendValue: number;

  @Column({ type: 'varchar', length: 50, default: 'naver-datalab' })
  source: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
