import {AsyncPipe} from '@angular/common';
import {ChangeDetectorRef, Component, DestroyRef, OnInit, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';
import {Observable, forkJoin, of, switchMap, tap} from 'rxjs';

import {FavoritesService} from '../../core/services/favorites.service';
import {PicsumService} from '../../core/services/picsum.service';
import {CardComponent} from '../../shared/components/card/card.component';
import {LoadingScreenComponent} from '../../shared/components/loading-screen/loading-screen.component';
import {VirtualListComponent} from '../../shared/components/virtual-list/virtual-list.component';
import type {PicsumResource, PicsumResourceIdType} from '../../types';

@Component({
	selector: 'app-favorites',
	templateUrl: 'favorites.component.html',
	styleUrl: 'favorites.component.scss',
	standalone: true,
	imports: [AsyncPipe, RouterLink, CardComponent, VirtualListComponent, LoadingScreenComponent],
})
export class FavoritesComponent implements OnInit {
	data: PicsumResource[] = [];

	private _initialized = false;
	private cache = new Map<PicsumResourceIdType, PicsumResource>();
	private readonly picsumService = inject(PicsumService);
	private readonly favoritesService = inject(FavoritesService);
	private readonly cd = inject(ChangeDetectorRef);
	private readonly destroyRef = inject(DestroyRef);

	get initialized(): boolean {
		return this._initialized;
	}

	ngOnInit(): void {
		/**
		 * Practically, I could render the cards only with the IDs.
		 * But for the sake of real-world API implementation, let's fetch data for these IDs.
		 * NOTE: The favorite photos can change from other tabs
		 */
		this.favoritesService.changes$
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				// switchMap will cancel previous requests
				switchMap((ids) =>
					ids.length > 0
						? forkJoin(ids.map((id) => (this.cache.has(id) ? of(this.cache.get(id)!) : this.getInfo(id))))
						: of([]),
				),
			)
			.subscribe((data) => {
				// data.filter will remove null values
				// READ: https://michaeluloth.com/javascript-filter-boolean/
				this.data = data.filter(Boolean) as PicsumResource[];

				this._initialized = true;
				/**
				 * favoritesService.changes$ will emit from the outside of NgZone,
				 * therefore the HTTP requests will be also executed outside the NgZone.
				 * So, when all the data has been fetched, we trigger only one change detection.
				 */
				this.cd.detectChanges();
			});
	}

	private getInfo(id: PicsumResourceIdType): Observable<PicsumResource | null> {
		return this.picsumService.getInfo(id).pipe(
			tap((res) => {
				if (res != null) {
					this.cache.set(id, res);
				} else {
					this.favoritesService.remove(id);
				}
			}),
		);
	}
}
