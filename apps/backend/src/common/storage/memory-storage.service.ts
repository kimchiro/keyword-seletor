import { Injectable } from '@nestjs/common';

@Injectable()
export class MemoryStorageService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private storage = new Map<string, any[]>();
  private idCounters = new Map<string, number>();

  // 데이터 저장
  save<T extends { id?: number; createdAt?: Date; updatedAt?: Date }>(
    collection: string, 
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): T {
    if (!this.storage.has(collection)) {
      this.storage.set(collection, []);
      this.idCounters.set(collection, 1);
    }

    const id = this.idCounters.get(collection)!;
    this.idCounters.set(collection, id + 1);

    const newItem = {
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as T;

    this.storage.get(collection)!.push(newItem);
    return newItem;
  }

  // 데이터 조회 (전체)
  findAll<T>(collection: string): T[] {
    return (this.storage.get(collection) || []) as T[];
  }

  // 데이터 조회 (조건부)
  find<T>(collection: string, predicate: (item: T) => boolean): T[] {
    const items = (this.storage.get(collection) || []) as T[];
    return items.filter(predicate);
  }

  // 데이터 조회 (단일)
  findOne<T>(collection: string, predicate: (item: T) => boolean): T | undefined {
    const items = (this.storage.get(collection) || []) as T[];
    return items.find(predicate);
  }

  // 데이터 업데이트
  update<T extends { id: number }>(
    collection: string,
    id: number,
    updateData: Partial<T>,
  ): T | undefined {
    const items = this.storage.get(collection) || [];
    const index = items.findIndex((item: T) => item.id === id);
    
    if (index === -1) return undefined;

    const updatedItem = {
      ...items[index],
      ...updateData,
      updatedAt: new Date(),
    } as T;

    items[index] = updatedItem;
    return updatedItem;
  }

  // 데이터 삭제
  delete(collection: string, id: number): boolean {
    const items = this.storage.get(collection) || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const index = items.findIndex((item: any) => item.id === id);
    
    if (index === -1) return false;

    items.splice(index, 1);
    return true;
  }

  // 컬렉션 초기화
  clear(collection: string): void {
    this.storage.set(collection, []);
    this.idCounters.set(collection, 1);
  }

  // 전체 스토리지 초기화
  clearAll(): void {
    this.storage.clear();
    this.idCounters.clear();
  }

  // 데이터 존재 여부 확인
  exists<T>(collection: string, predicate: (item: T) => boolean): boolean {
    const items = (this.storage.get(collection) || []) as T[];
    return items.some(predicate);
  }

  // 데이터 개수 조회
  count<T>(collection: string, predicate?: (item: T) => boolean): number {
    const items = (this.storage.get(collection) || []) as T[];
    return predicate ? items.filter(predicate).length : items.length;
  }
}
