import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	EventEmitter,
	NgZone,
	OnDestroy,
	Output,
	inject,
} from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
	selector: 'app-loader',
	template: '<mat-spinner diameter="48" strokeWidth="8"></mat-spinner>',
	styleUrl: 'loader.component.scss',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [MatProgressSpinnerModule],
})
export class LoaderComponent implements OnDestroy {
	@Output() reached = new EventEmitter();

	private intersectionObserver!: IntersectionObserver;

	private readonly ref = inject(ElementRef);
	private readonly ngZone = inject(NgZone);

	constructor() {
		this.ngZone.runOutsideAngular(() => {
			this.intersectionObserver = new IntersectionObserver(this.intersectionObserverCallback.bind(this));
			this.intersectionObserver.observe(this.ref.nativeElement);
		});
	}

	ngOnDestroy(): void {
		this.intersectionObserver.disconnect();
	}

	private intersectionObserverCallback(entries: IntersectionObserverEntry[]): void {
		const [first] = entries;

		if (first.isIntersecting) {
			this.reached.emit();
		}
	}
}
