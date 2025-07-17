import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ViewTableComponent } from './features/view-tables/view-tables.component';
import { SelectOption, TableColumn, TableColumnPerson, TableColumnSelect, TableColumnType, TableModel } from './core/models/table.model';
import { Colors } from './core/constants/colors';
import { BaseComponent } from './core/base/base-component';
import { TaskUseCases } from './core/usecases/task.usecases';
import { ViewType } from './core/constants/view-type';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.less',
  imports: [CommonModule, ViewTableComponent, FormsModule, NzInputModule, NzDropDownModule, NzPopoverModule, NzSelectModule, NzIconModule, NzFlexModule, NzButtonModule],
})
export class App extends BaseComponent {
  private taskUsecase: TaskUseCases = inject(TaskUseCases);

  view = ViewType.Table;
  table = new TableModel<unknown>();

  showSearch = false;
  searchValue = new BehaviorSubject<string>('');

  readonly statusOptions: SelectOption[] = [
    new SelectOption('In Progress', '#5d1715', Colors.colors[0].value),
    new SelectOption('Ready to start', '#004085', Colors.colors[1].value),
    new SelectOption('Waiting for review', '#0f5132', Colors.colors[2].value),
    new SelectOption('Done', '#664d03', Colors.colors[3].value),
    new SelectOption('Stuck', '#4f1552', Colors.colors[4].value),
    new SelectOption('Pending Deploy', '#7a2e0b', Colors.colors[5].value)
  ]

  readonly typeOptions: SelectOption[] = [
    new SelectOption('Feature Enhancements', '#004085', Colors.colors[1].value),
    new SelectOption('Other', '#0f5132', Colors.colors[2].value),
    new SelectOption('Bug', '#664d03', Colors.colors[3].value),
  ]

  readonly priorityOptions: SelectOption[] = [
    new SelectOption('Critical', '#5d1715', Colors.colors[0].value),
    new SelectOption('High', '#004085', Colors.colors[1].value),
    new SelectOption('Medium', '#0f5132', Colors.colors[2].value),
    new SelectOption('Low', '#0f5132', Colors.colors[4].value),
    new SelectOption('Best Effort', '#664d03', Colors.colors[5].value),
  ]

  readonly person = [
    'Alice',
    'Bob',
    'Charlie',
  ]

  protected override onInit(): void {
    this.table.setColumns([
      new TableColumn('Task', 'task', TableColumnType.Text, true),
      new TableColumnPerson('Developer', 'developer', this.person, true),
      new TableColumnSelect('Status', 'status', this.statusOptions, true),
      new TableColumnSelect('Priority', 'priority', this.priorityOptions, true),
      new TableColumnSelect('Type', 'type', this.typeOptions, true),
      new TableColumn('Created At', 'createdAt', TableColumnType.Date, true),
      new TableColumn('Estimated SP', 'estimatedSp', TableColumnType.Number, true),
      new TableColumn('Actual SP', 'actualSp', TableColumnType.Number, true),
    ])

    this.getTasks();

    this.searchValue.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.table.search(value, 'task');
    });
  }

  getTasks(): void {
    this.setLoading(true);
    this.taskUsecase.getTasks().subscribe({
      next: (tasks) => {
        this.table.setData(tasks);
        this.setReady();
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
      }
    });
  }


  addTask(): void {
    const newTask = {
      task: 'New Task',
      developer: [],
      status: '',
      priority: '',
      type: 'Feature Enhancements',
      createdAt: new Date(),
      estimatedSp: 0,
      actualSp: 0
    };

    this.table.addData(newTask);
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
    if (this.showSearch) {
      this.searchValue.next('');
    }
  }

  search(value: Event): void {
    const input = value.target as HTMLInputElement;
    this.searchValue.next(input.value);
  }
}
