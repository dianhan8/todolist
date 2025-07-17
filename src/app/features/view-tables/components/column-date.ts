import { CommonModule } from "@angular/common";
import { Component, Input} from "@angular/core";
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'column-date',
    template: `
        <nz-date-picker [ngModel]="data" (ngModelChange)="onChangeDate($event)" nzFormat="dd/MM/yyyy"></nz-date-picker>
    `,
    imports: [CommonModule, NzDatePickerModule, FormsModule]
})
export class ColumnDateComponent {
    @Input('row') row: unknown;
    @Input('field') field: string;

    get data(): Date {
        return this.row ? (this.row as any)[this.field] : new Date();
    }

    onChangeDate(date: Event): void {
        (this.row as any)[this.field] = date;
    }
}