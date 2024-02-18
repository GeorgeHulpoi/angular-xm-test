import {ScrollingModule} from '@angular/cdk/scrolling';
import {AsyncPipe} from '@angular/common';
import {Component, NgZone, inject} from '@angular/core';
import {BehaviorSubject, Observable, concatMap, scan, tap} from 'rxjs';

import {FavoritesService} from '../../core/services/favorites.service';
import {PicsumService} from '../../core/services/picsum.service';
import {CardComponent} from '../../shared/components/card/card.component';
import {LoadingScreenComponent} from '../../shared/components/loading-screen/loading-screen.component';
import {ClickZonelessDirective} from '../../shared/directives/click-zoneless.directive';
import type {PicsumList} from '../../types';
import {LoaderComponent} from './loader/loader.component';
import {VirtualListComponent} from './virtual-list/virtual-list.component';

@Component({
	selector: 'app-photos',
	templateUrl: './photos.component.html',
	styleUrl: './photos.component.scss',
	standalone: true,
	imports: [
		AsyncPipe,
		LoaderComponent,
		ScrollingModule,
		VirtualListComponent,
		CardComponent,
		ClickZonelessDirective,
		LoadingScreenComponent,
	],
})
export class PhotosComponent {
	data$: Observable<PicsumList>;

	private _page = 1;
	private pageSubject = new BehaviorSubject(this.page);
	private isFetching = false;

	readonly favoritesService = inject(FavoritesService);
	private readonly picsumService = inject(PicsumService);
	private readonly ngZone = inject(NgZone);

	get page(): number {
		return this._page;
	}

	set page(value: number) {
		this._page = value;
		this.isFetching = true;
		this.pageSubject.next(value);
	}

	constructor() {
		this.data$ = this.pageSubject.asObservable().pipe(
			// I use concatMap to preserve the order
			concatMap((page) => this.picsumService.getList(page)),
			// Append the new page
			scan((previousResponse, currentResponse) => {
				return {
					items: [...(previousResponse?.items || []), ...currentResponse.items],
					hasNext: currentResponse.hasNext,
				};
			}),
			tap(() => (this.isFetching = false)),
		);
	}

	appendNextPage(): void {
		if (this.isFetching) {
			return;
		}

		/**
		 * The loader runs outside NgZone to prevent additional change detections
		 * The loader doesn't modify the DOM in any way, it just announce the parent
		 * component that it has been reached.
		 *
		 * So when this method is called, we're outside NgZone, but we still need to render
		 * when the HTTP request finish, that will mark this component as marked for check
		 * and will start an application tick. To be able to do this, we run the following
		 * code inside NgZone
		 */
		this.ngZone.run(() => {
			this.page++;
		});
	}
}
