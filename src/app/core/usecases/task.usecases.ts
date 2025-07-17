import { inject, Injectable } from "@angular/core";
import { TaskService } from "../services/task.service";
import { catchError, map } from "rxjs";
import { TaskModel } from "../models/task.model";

@Injectable({
    providedIn: 'root'
})
export class TaskUseCases {
    private taskService: TaskService = inject(TaskService);

    getTasks() {
        return this.taskService.getTasks().pipe(
            map(response => TaskModel.create(response)),
        );
    }
}