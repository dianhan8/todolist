import { nanoid } from "nanoid";
import { TaskDto, TaskResponseDto } from "../dtos/task.dto";

export class TaskModel {
    id: string;
    task: string;
    developer: string[];
    status: string;
    priority: string;
    type: string;
    createdAt: Date;
    estimatedSp: number;
    actualSp: number;

    constructor(
        id: string,
        task: string,
        developer: string[],
        status: string,
        priority: string,
        type: string,
        createdAt: Date,
        estimatedSp: number,
        actualSp: number
    ) {
        this.id = id;
        this.task = task;
        this.developer = developer;
        this.status = status;
        this.priority = priority;
        this.type = type;
        this.createdAt = createdAt;
        this.estimatedSp = estimatedSp;
        this.actualSp = actualSp;
    }

    static fromJson(dto: TaskDto): TaskModel {
        const developers = dto.developer ? dto.developer.split(',').map(dev => dev.trim()) : [];
        return new TaskModel(
            nanoid(6), // Assuming ID is generated later
            dto.title,
            developers,
            dto.status,
            dto.priority,
            dto.type,
            new Date(), // Assuming current date for createdAt
            dto['Estimated SP'],
            dto['Actual SP']
        );
    }

    static create(dto: TaskResponseDto): TaskModel[] {
        if (!dto.response || !dto.data) {
            return [];
        }

        return dto.data.map(taskDto => this.fromJson(taskDto));
    }
}