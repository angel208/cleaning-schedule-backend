import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop()
  name: string;

  @Prop()
  priority: number;

  @Prop()
  frequency_deep: number;

  @Prop()
  frequency_light: number;

  @Prop()
  duration_deep: number;

  @Prop()
  duration_light: number;

  @Prop()
  last_executed_deep: Date;

  @Prop()
  last_executed_light: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
