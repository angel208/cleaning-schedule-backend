import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop()
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @Prop()
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  priority: number;

  @Prop()
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  frequency_deep: number;

  @Prop()
  frequency_light: number;

  @Prop()
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  duration_deep: number;

  @Prop()
  duration_light: number;

  @Prop()
  @ApiProperty()
  last_executed_deep: Date;

  @Prop()
  last_executed_light: Date;

  @Prop()
  score: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
