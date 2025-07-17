import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { TaskResponseDto } from "../dtos/task.dto";

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private http: HttpClient = inject(HttpClient);

    getTasks() {
        const url = 'https://mocki.io/v1/61c56458-2b07-44e2-9ec9-c7df98ccbe9f'
        return this.http.get<TaskResponseDto>(url)
    }
}