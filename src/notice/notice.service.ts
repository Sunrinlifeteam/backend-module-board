import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NoticeEntity } from 'shared/lib/access/notice.dao';
import { GetNoticeListRequest } from 'shared/lib/transfer/board.dto';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(NoticeEntity)
    private readonly noticeRepository: Repository<NoticeEntity>,
  ) {}

  async getNoticeList(options: GetNoticeListRequest): Promise<NoticeEntity[]> {
    return this.noticeRepository.find({
      where: {
        title: options.search && Like(`%${options.search}%`),
      },
      skip: (options.page - 1) * options.pageSize,
      take: options.pageSize,
    });
  }

  async getNotice(id: number): Promise<NoticeEntity> {
    return this.noticeRepository.findOneBy({ id });
  }

  async getCount(options: GetNoticeListRequest): Promise<number> {
    return this.noticeRepository.count({
      where: {
        title: options.search && Like(`%${options.search}%`),
      },
    });
  }

  async createNotice(content: Partial<NoticeEntity>): Promise<NoticeEntity> {
    const notice = this.noticeRepository.create(content);
    return this.noticeRepository.save(notice);
  }

  async updateNotice(
    id: number,
    content: Partial<NoticeEntity>,
  ): Promise<UpdateResult> {
    return this.noticeRepository.update(
      {
        id: id,
      },
      content,
    );
  }

  async deleteNotice(id: number): Promise<DeleteResult> {
    return this.noticeRepository.delete(id);
  }
}
