import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'column-text',
    template: `
        <p contenteditable="true" (input)="onChangeText($event)">{{ data }}</p>
    `,
    styles: ``
})
export class ColumnTextComponent {
    @Input('row') row: unknown;
    @Input('field') field: string;

    @Output('onChange') didChange = new EventEmitter<string>();

    get data(): string {
        return this.row ? (this.row as any)[this.field] : '';
    }

    onChangeText(event: Event): void {
        const target = event.target as HTMLParagraphElement;
        const newValue = target.textContent || '';
        (this.row as any)[this.field] = newValue;
        this.didChange.emit(newValue);
    }
}