import { Module } from "@nestjs/common";
import { FileController } from "./file.controller";
import { FileService } from "./file.service";
import { Question } from "src/question/question.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  controllers: [FileController],
  providers: [ FileService], // 数组
  exports: [FileService], 
})
export class FileModule {}