import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { NoticeEntity } from 'src/shared/access/notice.dao';
import {
  DeleteNoticeRequest,
  GetNoticeListRequest,
  GetNoticeListResponse,
  GetNoticeRequest,
  Notice,
  PartialNotice,
  UpdateNoticeRequest,
} from 'src/shared/transfer/board.dto';
import { NoticeService } from './notice.service';

@Controller()
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  private noticeEntityToNotice(noticeEntity: NoticeEntity): Notice {
    return {
      id: noticeEntity.id,
      type: noticeEntity.type,
      title: noticeEntity.title,
      content: noticeEntity.content,
      createdAt: noticeEntity.created_at,
      updatedAt: noticeEntity.updated_at,
      attachments: noticeEntity.attachments,
    };
  }

  @GrpcMethod('NoticeService', 'getNotice')
  async getNotice(payload: GetNoticeRequest): Promise<Notice> {
    const notice = await this.noticeService.getNotice(payload.id);
    return this.noticeEntityToNotice(notice);
  }

  @GrpcMethod('NoticeService', 'getNoticeList')
  async getNoticeList(
    payload: GetNoticeListRequest,
  ): Promise<GetNoticeListResponse> {
    const noticeList = await this.noticeService.getNoticeList(payload);
    return {
      totalCount: noticeList.length,
      notice: noticeList.map(this.noticeEntityToNotice),
    };
  }

  @GrpcMethod('NoticeService', 'createNotice')
  async createNotice(payload: PartialNotice): Promise<Notice> {
    if (payload.type !== 'school' && payload.type !== 'intranet') {
      return null;
    }
    const notice = await this.noticeService.createNotice(payload);
    return this.noticeEntityToNotice(notice);
  }

  @GrpcMethod('NoticeService', 'updateNotice')
  async updateNotice(payload: UpdateNoticeRequest): Promise<void> {
    console.log(payload);
    await this.noticeService.updateNotice(payload.id, payload.notice);
  }

  @GrpcMethod('NoticeService', 'deleteNotice')
  async deleteNotice(payload: DeleteNoticeRequest): Promise<void> {
    await this.noticeService.deleteNotice(payload.id);
  }
}
