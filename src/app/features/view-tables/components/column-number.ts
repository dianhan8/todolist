import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { NzInputModule } from "ng-zorro-antd/input";

@Component({
    selector: 'column-number',
    template: `
        <input nz-input type="number" [value]="data" (change)="onChangeNumber($event)" />
    `,
    imports: [CommonModule, NzInputModule],
})
export class ColumnNumberComponent {
    @Input('row') row: unknown;
    @Input('field') field: string;

    get data(): number {
        return this.row ? (this.row as any)[this.field] : 0;
    }

    onChangeNumber(event: Event): void {
        const target = event.target as HTMLInputElement;
        const newValue = parseFloat(target.value);
        (this.row as any)[this.field] = isNaN(newValue) ? 0 : newValue;
    }
}