import {Injectable, NgZone, inject} from '@angular/core';
import {BehaviorSubject, Observable, filter, fromEvent} from 'rxjs';

import type {PicsumResourceIdType} from '../../types';

@Injectable()
export class FavoritesService {
	static readonly STORAGE_KEY = 'favorites';

	/**
	 * Because the application can be opened in multiple tabs, I decided to make this service reactive.
	 * Whenever this list is modified on any browser tab, the subscribers should be notified that it has been changed.
	 */
	changes$: Observable<PicsumResourceIdType[]>;
	/**
	 * This field will be defined by calling syncWithLocalStorage in constructor
	 */
	private items!: Set<PicsumResourceIdType>;
	/**
	 * Using BehaviourSubject I ensure that each subscriber will have always the latest items
	 */
	private changesSubject: BehaviorSubject<PicsumResourceIdType[]>;
	private ngZone = inject(NgZone);

	constructor() {
		// For this project, we won't support SSR to meet the deadline

		this.syncWithLocalStorage();

		/**
		 * Emit a immutable array of the items
		 */
		this.changesSubject = new BehaviorSubject(this.toImmutableArray());
		this.changes$ = this.changesSubject.asObservable();

		/**
		 * Prevent a change detection by this listener
		 */
		this.ngZone.runOutsideAngular(() => {
			/**
			 * This event will be fired only when other page except itself modify the storage
			 * Read more: https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event
			 */
			fromEvent<StorageEvent>(window, 'storage')
				.pipe(filter((e) => e.key === FavoritesService.STORAGE_KEY))
				.subscribe(() => {
					this.syncWithLocalStorage();
					this.changesSubject.next(this.toImmutableArray());
				});
		});
	}

	/**
	 * Add a picture to favorites.
	 *
	 * @param id The Picsum Id
	 */
	add(id: PicsumResourceIdType): void {
		this.items.add(id);
		this.syncToLocalStorage();
		this.changesSubject.next(this.toImmutableArray());
	}

	/**
	 * Remove a picture from favorites.
	 *
	 * @param id The Picsum Id
	 */
	remove(id: PicsumResourceIdType): void {
		this.items.delete(id);
		this.syncToLocalStorage();
		this.changesSubject.next(this.toImmutableArray());
	}

	/**
	 * Get a immutable list of favorites
	 */
	get(): PicsumResourceIdType[] {
		return this.toImmutableArray();
	}

	/**
	 * This photos is in favorites?
	 *
	 * @param id The Picsum Id
	 * @returns
	 */
	has(id: PicsumResourceIdType): boolean {
		return this.items.has(id);
	}

	/**
	 * Used for syncing the service state with the local storage
	 */
	private syncWithLocalStorage(): void {
		const favoritesJson = localStorage.getItem(FavoritesService.STORAGE_KEY);

		if (favoritesJson) {
			try {
				this.items = new Set(JSON.parse(favoritesJson));
			} catch (e) {
				console.error(e);
				console.warn(
					`An error has been thrown while parsing the JSON of the ${FavoritesService.STORAGE_KEY} from local storage.`,
				);
				console.warn('For prevent this behaviour, I reinitialized the default state of it.');

				this.items = new Set();
				this.syncToLocalStorage();
			}
		} else {
			this.items = new Set();
			this.syncToLocalStorage();
		}
	}

	/**
	 * Used for syncing the service state to the local storage.
	 */
	private syncToLocalStorage(): void {
		localStorage.setItem(FavoritesService.STORAGE_KEY, JSON.stringify(this.toImmutableArray()));
	}

	/**
	 * Get a immutable array of the items
	 */
	private toImmutableArray(): PicsumResourceIdType[] {
		return Array.from(this.items.values());
	}
}
