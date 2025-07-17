import { CommonModule } from "@angular/common";
import { Component, Input} from "@angular/core";
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";
import { FormsModule } from "@angular/forms";
import { TableColumn, TableColumnDate } from "@app/core/models/table.model";

@Component({
    selector: 'column-date',
    template: `
        <nz-date-picker [ngModel]="data" (ngModelChange)="onChangeDate($event)" [nzFormat]="col.format"></nz-date-picker>
    `,
    imports: [CommonModule, NzDatePickerModule, FormsModule]
})
export class ColumnDateComponent {
    @Input('row') row: unknown;
    @Input('col') _col: TableColumn;

    get col(): TableColumnDate {
        return this._col as TableColumnDate;
    }

    get data(): Date {
        return this.row ? (this.row as any)[this.col.field] : new Date();
    }

    onChangeDate(date: Event): void {
        (this.row as any)[this.col.field] = date;
    }
}