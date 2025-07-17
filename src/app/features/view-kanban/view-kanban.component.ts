import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { BaseComponent } from "@app/core/base/base-component";
import { SelectOption, TableColumn, TableColumnDate, TableColumnNumber, TableColumnSelect, TableModel } from "@app/core/models/table.model";
import chroma from 'chroma-js';
import { NzAvatarModule } from "ng-zorro-antd/avatar";
import { NzFlexModule } from "ng-zorro-antd/flex";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
import { DndDropEvent, DndModule } from "ngx-drag-drop";

@Component({
    selector: 'kanban-column-select',
    template: `
        <div>
            <p class="options--item--tag"
                [style.background]="option.backgroundColor | async"
                [style.color]="option.color | async">
                    {{ option.label | async }}
            </p>
        </div>
    `,
    imports: [CommonModule, NzAvatarModule, NzFlexModule, NzToolTipModule]
})
export class KanbanColumnSelect {
    @Input('column') _column: TableColumn;
    @Input() row: any;

    get column(): TableColumnSelect {
        return this._column as TableColumnSelect;
    }

    get option(): SelectOption {
        const value = (this.row as any)[this.column.field];
        return (<SelectOption[]>this.column.options).find(option => option.label.value === value) as SelectOption;
    }
}

@Component({
    selector: 'kanban-column-number',
    template: `
        <div class="kanban-item--task--number">
            <p>{{ row[column.field] }} <span *ngIf="column.suffix">{{ column.suffix }}</span></p>
        </div>
    `,
    imports: [CommonModule]
})
export class KanbanColumnNumber {
    @Input('column') _column: TableColumn;
    @Input() row: any;

    get column(): TableColumnNumber {
        return this._column as TableColumnNumber;
    }
}

@Component({
    selector: 'kanban-column-date',
    template: `
        <div class="kanban-item--task--date">
            <p>{{ row[column.field] | date: column.format }}</p>
        </div>
    `,
    imports: [CommonModule]
})
export class KanbanColumnDate {
    @Input('column') _column: TableColumn;
    @Input() row: any;

    get column(): TableColumnDate{
        return this._column as TableColumnDate;
    }
}

@Component({
    selector: 'view-kanban',
    templateUrl: './view-kanban.component.html',
    styleUrls: ['./view-kanban.component.scss'],
    imports: [CommonModule, NzAvatarModule, NzFlexModule, NzToolTipModule, KanbanColumnSelect, KanbanColumnNumber, KanbanColumnDate, DndModule]
})
export class ViewKanbanComponent extends BaseComponent {
    @Input() table: TableModel<any>;
    @Input('column') _column: TableColumn;

    get column(): TableColumnSelect {
        return this._column as TableColumnSelect;
    }

    get options() {
        return (this._column as TableColumnSelect).options
            .map(option => ({
                ...option,
                bgColorLight: chroma(option.backgroundColor.value).brighten(0.25).hex(),
            }));
    }


    protected override onInit(): void { }

    getTotalCount(status: string): number {
        return this.table.data.filter(item => item[this.column.field] === status).length;
    }

    onDrop(event: DndDropEvent, status: string) {
        const targetIndex = this.table.data.findIndex(item => item.id === event.data.id);
        if (targetIndex !== -1) {
            const item = this.table.data[targetIndex];
            item[this.column.field] = status;
            this.table.data[targetIndex] = item;
            this.table.updateData(this.table.data);
        }
    }
}