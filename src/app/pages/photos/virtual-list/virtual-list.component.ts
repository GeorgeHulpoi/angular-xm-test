import {ScrollingModule} from '@angular/cdk/scrolling';
import {NgTemplateOutlet} from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ContentChild,
	Input,
	NgZone,
	TemplateRef,
	inject,
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {animationFrameScheduler, fromEvent, throttleTime} from 'rxjs';

import {CollectionComponent} from '../../../shared/components/collection/collection.component';
import type {PicsumResource} from '../../../types';

interface TemplateContext {
	$implicit: PicsumResource;
}

@Component({
	selector: 'app-virtual-list',
	templateUrl: 'virtual-list.component.html',
	styleUrl: 'virtual-list.component.scss',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ScrollingModule, CollectionComponent, NgTemplateOutlet],
})
export class VirtualListComponent {
	@Input({required: true}) items!: PicsumResource[];
	@ContentChild(TemplateRef, {static: true}) template!: TemplateRef<TemplateContext>;

	private readonly ngZone = inject(NgZone);
	private readonly cd = inject(ChangeDetectorRef);

	private _columns;

	public get columns(): number {
		return this._columns;
	}

	constructor() {
		this._columns = this.getColumnsValueByWindowWidth();

		this.ngZone.runOutsideAngular(() => {
			fromEvent(window, 'resize')
				.pipe(
					takeUntilDestroyed(),
					throttleTime(0, animationFrameScheduler, {
						trailing: true,
						leading: true,
					}),
				)
				.subscribe(() => {
					const newColumns = this.getColumnsValueByWindowWidth();

					if (this.columns !== newColumns) {
						this._columns = newColumns;
						this.cd.detectChanges();
					}
				});
		});
	}

	chunks = function* <T>(arr: T[], n: number): Generator<T[], void> {
		for (let i = 0; i < arr.length; i += n) {
			yield arr.slice(i, i + n);
		}
	};

	getColumnsValueByWindowWidth(): number {
		const w = window.innerWidth;

		if (w >= 1280) {
			return 3;
		} else if (w >= 768 && w < 1280) {
			return 2;
		} else {
			return 1;
		}
	}
}
