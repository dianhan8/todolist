import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { NzPopoverModule } from "ng-zorro-antd/popover";
import { SelectOption, TableColumn, TableColumnSelect } from "@app/core/models/table.model";

@Component({
    selector: 'column-select',
    template: `
        <div style="width: 100%;cursor: pointer;" nz-popover
                [nzPopoverContent]="edit"
                [nzPopoverVisible]="isVisible"
                nzPopoverTrigger="click"
                nzPopoverPlacement="bottomLeft"
                [nzPopoverOverlayClickable]="true"
                (nzPopoverVisibleChange)="isVisible = $event">
                
            <p class="options--item--tag"
                [style.background]="(colors[data]?.backgroundColor | async) ?? undefined"
                [style.color]="(colors[data]?.color | async) ?? undefined">
                    {{ data }}
            </p>
        </div>

        <ng-template #edit>
            <p class="popover-content--label">Select an option</p>
                @for (option of options; track $index) {
                    <div class="options popover-content">
                        <div class="options--item" role="button" (click)="onChangeSelect(option)">
                            <div class="options--item--label">
                                <p class="options--item--tag" [style.background]="option.backgroundColor | async"
                                    [style.color]="option.color | async">
                                        {{ option.label | async }}
                                </p>
                            </div>
                        </div>
                    </div>
                }
        </ng-template>
    `,
    imports: [CommonModule, NzPopoverModule]
})
export class ColumnSelectComponent implements OnInit {
    @Input('row') row: unknown;
    @Input('column') column: TableColumn;

    options: SelectOption[] = [];
    colors: Record<string, SelectOption> = {};

    isVisible = false;

    get data(): string {
        return this.row ? (this.row as any)[this.column.field] : '';
    }

    ngOnInit(): void {
        if (this.column) {
            this.options = this.column instanceof TableColumnSelect ? this.column.options : [];
            this.colors = this.options.reduce((acc, option) => {
                const label = option.label.value as string;
                acc[label] = {
                    label: option.label,
                    color: option.color,
                    backgroundColor: option.backgroundColor
                };
                return acc;
            }, {} as Record<string, SelectOption>)
        }
    }

    onChangeSelect(option: SelectOption): void {
        const newValue = option.label.value as string;
        (this.row as any)[this.column.field] = newValue;
        this.isVisible = false;
    }
}