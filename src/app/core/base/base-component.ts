import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";

@Component({
    template: ''
})
export abstract class BaseComponent implements OnInit, OnDestroy {
    destroyed$ = new Subject<void>();

    isLoading = false;

    protected abstract onInit(): void;
    onDestroy?(): void;

    ngOnInit(): void {
        this.onInit();
    }

    setLoading(loading: boolean): void {
        this.isLoading = loading;
    }

    setReady(): void {
        this.isLoading = false;
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
        if (this.onDestroy) {
            this.onDestroy();
        }
    }
}