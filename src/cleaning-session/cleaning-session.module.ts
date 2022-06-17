import { Module } from '@nestjs/common';
import { CleaningSessionController } from './cleaning-session.controller';
import { CleaningSessionService } from './cleaning-session.service';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [TaskModule],
  controllers: [CleaningSessionController],
  providers: [CleaningSessionService],
})
export class CleaningSessionkModule {}
