import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { NzTableModule } from "ng-zorro-antd/table";
import { BaseComponent } from "@core/base/base-component";
import { NzAvatarModule } from "ng-zorro-antd/avatar";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzPopoverModule } from "ng-zorro-antd/popover";
import { NzColorPickerModule } from "ng-zorro-antd/color-picker";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzTagModule } from "ng-zorro-antd/tag";
import { TableColumnSort, TableModel } from "@app/core/models/table.model";
import { FormsModule } from "@angular/forms";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzFlexModule } from "ng-zorro-antd/flex";
import { NzSelectModule } from "ng-zorro-antd/select";
import { TablesModule } from "./components/view-tables.module";

@Component({
    selector: 'view-tables',
    templateUrl: './view-tables.component.html',
    styleUrl: './view-tables.component.scss',
    imports: [CommonModule, FormsModule, NzTableModule, NzAvatarModule, NzDropDownModule, NzPopoverModule, NzColorPickerModule, NzSelectModule, NzIconModule, NzTagModule, NzFlexModule, TablesModule, NzButtonModule]
})
export class ViewTableComponent extends BaseComponent {

    @Input() table: TableModel<unknown>

    newSort: TableColumnSort = new TableColumnSort('', 'asc');

    override onInit(): void {}
}