export class TaskDto {
    title: string;
    developer: string;
    status: string;
    priority: string;
    type: string;
    'Estimated SP': number;
    'Actual SP': number;
}

export class TaskResponseDto {
    response: boolean;
    data: TaskDto[];
}