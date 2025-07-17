import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ViewTableComponent } from './features/view-tables/view-tables.component';
import { SelectOption, TableColumn, TableColumnDate, TableColumnNumber, TableColumnPerson, TableColumnSelect, TableColumnType, TableModel } from './core/models/table.model';
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
import { BehaviorSubject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ViewKanbanComponent } from './features/view-kanban/view-kanban.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AddTaskComponent } from './features/add-task/add-task.component';
import { StatusPercentageComponent } from './features/view-tables/components/column-status-percentage';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.less',
  imports: [CommonModule, ViewTableComponent, ViewKanbanComponent, StatusPercentageComponent, FormsModule, NzTabsModule, NzInputModule, NzDropDownModule, NzPopoverModule, NzSelectModule, NzIconModule, NzFlexModule, NzButtonModule],
  providers: [NzModalService]
})
export class App extends BaseComponent {
  private taskUsecase: TaskUseCases = inject(TaskUseCases);
  private modalService = inject(NzModalService);

  view = ViewType.Table;
  table = new TableModel<unknown>();

  showAddSort = false
  showSort = false;
  showAddFilter = false;
  showFilter: Record<number, boolean> = {}

  showSearch = false;
  searchValue = new BehaviorSubject<string>('');

  readonly statusOptions: SelectOption[] = [
    new SelectOption('Ready to start', '#004085', Colors.colors[1].value),
    new SelectOption('In Progress', '#5d1715', Colors.colors[0].value),
    new SelectOption('Waiting for review', '#0f5132', Colors.colors[2].value),
    new SelectOption('Stuck', '#4f1552', Colors.colors[4].value),
    new SelectOption('Pending Deploy', '#7a2e0b', Colors.colors[5].value),
    new SelectOption('Done', '#664d03', Colors.colors[3].value)
  ]

  readonly typeOptions: SelectOption[] = [
    new SelectOption('Feature Enhancements', '#004085', Colors.colors[1].value),
    new SelectOption('Other', '#0f5132', Colors.colors[2].value),
    new SelectOption('Bug', '#664d03', Colors.colors[3].value),
  ]

  readonly priorityOptions: SelectOption[] = [
    new SelectOption('Low', '#0f5132', Colors.colors[4].value),
    new SelectOption('Medium', '#0f5132', Colors.colors[2].value),
    new SelectOption('High', '#004085', Colors.colors[1].value),
    new SelectOption('Critical', '#5d1715', Colors.colors[0].value),
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
      new TableColumnDate('Created At', 'createdAt', true, 'dd MMM yyyy'),
      new TableColumnNumber('Estimated SP', 'estimatedSp', true, 'SP'),
      new TableColumnNumber('Actual SP', 'actualSp', true, 'SP'),
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
    this.setLoading();
    this.taskUsecase.getTasks()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
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
    this.modalService.create({
      nzTitle: 'Add Task',
      nzContent: AddTaskComponent,
      nzFooter: null,
      nzWidth: '600px',
      nzData: {
        table: this.table
      },
    })
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

  onAddSort(): void {
    this.showAddSort = false;
    this.showSort = true;
  }

  onAddFilter(index: number): void {
    this.showAddFilter = false;
    this.showFilter[index] = true;
  }
}
