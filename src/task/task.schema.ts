import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsInt, IsNotEmpty } from 'class-validator';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop()
  @IsNotEmpty()
  name: string;

  @Prop()
  @IsInt()
  @IsNotEmpty()
  priority: number;

  @Prop()
  @IsInt()
  @IsNotEmpty()
  frequency_deep: number;

  @Prop()
  frequency_light: number;

  @Prop()
  @IsInt()
  @IsNotEmpty()
  duration_deep: number;

  @Prop()
  duration_light: number;

  @Prop()
  last_executed_deep: Date;

  @Prop()
  last_executed_light: Date;

  @Prop()
  score: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
