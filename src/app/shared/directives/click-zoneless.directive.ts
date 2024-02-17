import {Directive, ElementRef, EventEmitter, NgZone, Output, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {fromEvent} from 'rxjs';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[clickZoneless]',
	standalone: true,
})
export class ClickZonelessDirective {
	@Output() clickZoneless = new EventEmitter<MouseEvent>();

	private readonly ngZone = inject(NgZone);
	private readonly ref = inject(ElementRef);

	constructor() {
		this.ngZone.runOutsideAngular(() => {
			fromEvent<MouseEvent>(this.ref.nativeElement, 'click')
				.pipe(takeUntilDestroyed())
				.subscribe((e) => this.clickZoneless.emit(e));
		});
	}
}
