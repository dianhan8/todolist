import { NgModule } from "@angular/core";
import { ColumnSelectComponent } from "./column-select";
import { ColumnDateComponent } from "./column-date";
import { ColumnTextComponent } from "./column-text";
import { StatusPercentageComponent } from "./column-status-percentage";
import { ColumnNumberComponent } from "./column-number";
import { ColumnPersonComponent } from "./column-person";

@NgModule({
    imports: [
        StatusPercentageComponent,
        ColumnTextComponent,
        ColumnDateComponent,
        ColumnNumberComponent,
        ColumnSelectComponent,
        ColumnPersonComponent
    ],
    exports: [
        StatusPercentageComponent,
        ColumnTextComponent,
        ColumnDateComponent,
        ColumnNumberComponent,
        ColumnSelectComponent,
        ColumnPersonComponent
    ]
})
export class TablesModule {}