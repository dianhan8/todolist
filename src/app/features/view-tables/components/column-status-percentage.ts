import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { TableColumn, TableColumnSelect,TableModel } from "@app/core/models/table.model";

@Component({
    selector: 'status-percentage',
    template: `
        <div class="status-percentage">
            @for (item of status; track $index) {
                <div
                    class="status-percentage--item"
                    [style.background]="item.value | async"
                    [style.width.%]="item.length / data.length * 100">
                </div>
            }
        </div>
    `,
    imports: [CommonModule],
    styles: [`
        .status-percentage {
            display: flex;
            flex-direction: row;
            align-items: center;
        }

        .status-percentage--item {
            height: 32px;
        }
    `]
})
export class StatusPercentageComponent {
    @Input('column') column: TableColumn;
    @Input('table') table: TableModel<unknown>;

    get data(): string[] {
        return this.table ? this.table.getColumnData(this.column.field) : [];
    }

    get status(): { label: string, value: BehaviorSubject<string>, length: number }[] {
        const statusMap = this.data.reduce((acc, item) => {
            const status = String(item).trim();
            const colors = (this.column as TableColumnSelect).options.find(option => option.label.value === status)?.backgroundColor as BehaviorSubject<string>;

            if (!acc[status]) {
                acc[status] = { label: status, value: colors, length: 0 };
            }

            acc[status].length++;
            return acc;
        }, {} as Record<string, { label: string, value: BehaviorSubject<string>, length: number }>);

        return Object.values(statusMap);
    }
}