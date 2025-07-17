import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { NzAvatarModule } from "ng-zorro-antd/avatar";
import { NzPopoverModule } from "ng-zorro-antd/popover";
import { TableColumn, TableColumnPerson } from "@app/core/models/table.model";
import { FormsModule } from "@angular/forms";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";

@Component({
    selector: 'column-person',
    template: `
        <div style="width: 100%;cursor: pointer;" nz-popover
                [nzPopoverContent]="edit"
                [nzPopoverVisible]="isVisible"
                nzPopoverTrigger="click"
                nzPopoverPlacement="bottomLeft"
                [nzPopoverOverlayClickable]="true"
                (nzPopoverVisibleChange)="isVisible = $event">
            
            <nz-avatar-group>
                @for (developer of data; track $index) {
                    <nz-avatar [nzText]="developer.at(0)"  nz-tooltip [nzTooltipTitle]="developer"></nz-avatar>
                }
            </nz-avatar-group>
        </div>

        <ng-template #edit>
            <div class="popover-content">
                <p class="popover-content--label">Select a person</p>

                <nz-select 
                    [ngModel]="data" 
                    (ngModelChange)="onSelectionChange($event)"
                    nzMode="multiple"
                    nzPlaceHolder="Select developers"
                    style="width: 100%;">
                    @for (developer of options; track $index) {
                        <nz-option [nzValue]="developer" [nzLabel]="developer">
                            <nz-avatar [nzText]="developer.at(0)"></nz-avatar>
                            <span style="margin-left: 8px;">{{ developer }}</span>
                        </nz-option>
                    }
                </nz-select>
            </div>
        </ng-template>
    `,
    imports: [CommonModule, NzAvatarModule, NzPopoverModule, NzSelectModule, FormsModule, NzToolTipModule]
})
export class ColumnPersonComponent {
    @Input('row') item: any;
    @Input('col') col: TableColumn;

    isVisible = false;

    get options(): string[] {
        return this.col instanceof TableColumnPerson ? this.col.options : [];
    }

    get data(): string[] {
        return this.item ? (this.item as any)[this.col.field] : [];
    }

    onSelectionChange(selectedValues: string[]): void {
        (this.item as any)[this.col.field] = selectedValues;
    }
}