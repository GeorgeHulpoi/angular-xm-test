import {ScrollingModule} from '@angular/cdk/scrolling';
import {NgTemplateOutlet} from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ContentChild,
	Input,
	NgZone,
	OnChanges,
	TemplateRef,
	inject,
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {animationFrameScheduler, fromEvent, throttleTime} from 'rxjs';

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
	imports: [ScrollingModule, NgTemplateOutlet],
})
export class VirtualListComponent implements OnChanges {
	@Input({required: true}) items!: PicsumResource[];
	@ContentChild(TemplateRef, {static: true}) template!: TemplateRef<TemplateContext>;

	/**
	 * The current Angular CDK Virtual Scroll strategy uses fixed size.
	 * I had to choose between implementing my strategy and using a fixed size.
	 * The fastest was to use a fixed height. Therefore this value should
	 * change if you change the gap or the card size.
	 */
	readonly itemSize = 350;
	/**
	 * READ: https://material.angular.io/cdk/scrolling/overview#scrolling-over-fixed-size-items
	 * TLTR: Always render 4 rows in both directions.
	 */
	readonly bufferPx = this.itemSize * 4;
	collections!: PicsumResource[][];
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
						this.collections = this.generateCollections();
						this.cd.detectChanges();
					}
				});
		});
	}

	ngOnChanges(): void {
		this.collections = this.generateCollections();
	}

	generateCollections(): PicsumResource[][] {
		return [...this.chunks(this.items, this.columns)];
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
