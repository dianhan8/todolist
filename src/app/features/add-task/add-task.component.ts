import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { BaseComponent } from "@app/core/base/base-component";
import { TableColumn, TableColumnSelect, TableModel } from "@app/core/models/table.model";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzInputNumberModule } from "ng-zorro-antd/input-number";
import { NZ_MODAL_DATA, NzModalRef } from "ng-zorro-antd/modal";
import { NzSelectModule } from "ng-zorro-antd/select";

@Component({
    templateUrl: './add-task.component.html',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, NzFormModule, NzInputModule, NzDatePickerModule, NzSelectModule, NzInputNumberModule, NzButtonModule]
})
export class AddTaskComponent extends BaseComponent {
    private fb = inject(FormBuilder)

    readonly modalRef = inject(NzModalRef);
    readonly modalData = inject(NZ_MODAL_DATA);

    formGroup: FormGroup;
    columns = (this.modalData.table.columns as any[])
        .filter(column => column.field !== 'createdAt');

    protected override onInit(): void {
        const columns = this.columns
            .reduce((acc, column) => {
                if (column.field && column.type !== 'person' && column.field !== 'createdAt') {
                    acc[column.field] = ['', [Validators.required]];
                }
                if (column.type === 'person') {
                    acc[column.field] = [[], [Validators.required]];
                }
                if (column.field === 'createdAt') {
                    acc[column.field] = [new Date(), [Validators.required]];
                }
                return acc;
            }, {} as Record<string, any>);

        this.formGroup = this.fb.group(columns);
    }

    private validate() {
        Object.values(this.formGroup.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }

    protected onSubmit(): void {
        this.validate();

        if (this.formGroup.valid) {
            this.setLoading()
            const formData = this.formGroup.value;
            (this.modalData.table as TableModel<any>).addData(formData);
            this.modalRef.close(formData);
            this.setReady()
        }
    }
}