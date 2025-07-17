import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { TableColumn, TableColumnNumber } from "@app/core/models/table.model";
import { NzInputModule } from "ng-zorro-antd/input";

@Component({
    selector: 'column-number',
    template: `
        <div style="display: flex;flex-direction: row; align-items: center;">
            <input class="column-number-input" type="number" [value]="data" (change)="onChangeNumber($event)" /> <span *ngIf="col.suffix">{{ col.suffix }}</span>
        </div>
    `,
    imports: [CommonModule, NzInputModule],
    styles: [`
        .column-number-input {
            all: unset;
            min-width: 20px;
            font-size: 14px;
        }
        .column-number-input::-webkit-inner-spin-button,
        .column-number-input::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        /* Hide arrows in Firefox */
        .column-number-input {
            -moz-appearance: textfield;
        }
    `]
})
export class ColumnNumberComponent {
    @Input('row') row: unknown;
    @Input('col') _col: TableColumn;

    get col(): TableColumnNumber {
        return this._col as TableColumnNumber;
    }

    get data(): number {
        return this.row ? (this.row as any)[this.col.field] : 0;
    }

    onChangeNumber(event: Event): void {
        const target = event.target as HTMLInputElement;
        const newValue = parseFloat(target.value);
        (this.row as any)[this.col.field] = isNaN(newValue) ? 0 : newValue;
    }
}