import {TestBed} from '@angular/core/testing';
import {skip, take} from 'rxjs';

import {FavoritesService} from './favorites.service';

describe('Favorites Service', () => {
	let service: FavoritesService;

	beforeEach(() => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let store: any = {};
		const mockLocalStorage = {
			getItem: (key: string): string => {
				return key in store ? store[key] : null;
			},
			setItem: (key: string, value: string) => {
				store[key] = `${value}`;
			},
			removeItem: (key: string) => {
				delete store[key];
			},
			clear: () => {
				store = {};
			},
		};
		spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
		spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
		spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
		spyOn(localStorage, 'clear').and.callFake(mockLocalStorage.clear);

		TestBed.configureTestingModule({
			providers: [FavoritesService],
		});

		service = TestBed.inject(FavoritesService);
	});

	it('should have as default state an empty set', (done) => {
		const items = service.get();
		expect(Array.isArray(items)).toBeTrue();
		expect(items.length).toEqual(0);
		expect(localStorage.getItem(FavoritesService.STORAGE_KEY)).toEqual('[]');

		service.changes$.pipe(take(1)).subscribe((e) => {
			expect(Array.isArray(e)).toBeTrue();
			expect(e.length).toEqual(0);
			done();
		});
	});

	it('get should work', () => {
		service.add(5);
		service.add(3);
		service.add(2);

		const items = service.get();
		expect(Array.isArray(items)).toBeTrue();
		expect(items.length).toEqual(3);
		expect(items).toContain(5);
		expect(items).toContain(3);
		expect(items).toContain(2);
	});

	it('get should return an immutable array', () => {
		service.add(5);
		service.add(3);
		service.add(2);

		const oldItems = service.get();
		oldItems.push(9);

		const items = service.get();
		expect(Array.isArray(items)).toBeTrue();
		expect(items.length).toEqual(3);
		expect(items).toContain(5);
		expect(items).toContain(3);
		expect(items).toContain(2);
	});

	it('has should work', () => {
		service.add(5);
		service.add(3);

		expect(service.has(5)).toBeTrue();
		expect(service.has(3)).toBeTrue();
		expect(service.has(2)).toBeFalse();
	});

	it('should add and emit to existing subscription', (done) => {
		service.changes$.pipe(skip(1), take(1)).subscribe((e) => {
			expect(Array.isArray(e)).toBeTrue();
			expect(e.length).toEqual(1);
			expect(e).toContain(5);
			done();
		});

		service.add(5);

		const items = service.get();
		expect(Array.isArray(items)).toBeTrue();
		expect(items.length).toEqual(1);
		expect(items).toContain(5);
	});

	it('should add and emit to new subscribtion', (done) => {
		service.add(5);

		const items = service.get();
		expect(Array.isArray(items)).toBeTrue();
		expect(items.length).toEqual(1);
		expect(items).toContain(5);

		// last emitted value should be 5
		service.changes$.pipe(take(1)).subscribe((e) => {
			expect(Array.isArray(e)).toBeTrue();
			expect(e.length).toEqual(1);
			expect(e).toContain(5);
			done();
		});
	});

	it('should remove and emit to existing subscription', (done) => {
		service.changes$.pipe(skip(4), take(1)).subscribe((e) => {
			expect(Array.isArray(e)).toBeTrue();
			expect(e.length).toEqual(2);
			expect(e).toContain(3);
			expect(e).toContain(2);
			done();
		});

		service.add(5);
		service.add(3);
		service.add(2);
		service.remove(5);

		const items = service.get();
		expect(Array.isArray(items)).toBeTrue();
		expect(items.length).toEqual(2);
		expect(items).toContain(3);
		expect(items).toContain(2);
	});

	it('should remove and emit to new subscription', (done) => {
		service.add(5);
		service.add(3);
		service.add(2);
		service.remove(5);

		const items = service.get();
		expect(Array.isArray(items)).toBeTrue();
		expect(items.length).toEqual(2);
		expect(items).toContain(3);
		expect(items).toContain(2);

		service.changes$.pipe(take(1)).subscribe((e) => {
			expect(Array.isArray(e)).toBeTrue();
			expect(e.length).toEqual(2);
			expect(e).toContain(3);
			expect(e).toContain(2);
			done();
		});
	});

	it('should load the new value when storage event is emitted', (done) => {
		localStorage.setItem(FavoritesService.STORAGE_KEY, JSON.stringify([1, 2]));
		window.dispatchEvent(
			new StorageEvent('storage', {
				storageArea: localStorage,
				key: FavoritesService.STORAGE_KEY,
			}),
		);

		const items = service.get();
		expect(Array.isArray(items)).toBeTrue();
		expect(items.length).toEqual(2);
		expect(items).toContain(1);
		expect(items).toContain(2);

		service.changes$.pipe(take(1)).subscribe((e) => {
			expect(Array.isArray(e)).toBeTrue();
			expect(e.length).toEqual(2);
			expect(e).toContain(1);
			expect(e).toContain(2);
			done();
		});
	});

	it('invalid json syntax should reset the state', () => {
		localStorage.setItem(FavoritesService.STORAGE_KEY, '[1,2');
		window.dispatchEvent(
			new StorageEvent('storage', {
				storageArea: localStorage,
				key: FavoritesService.STORAGE_KEY,
			}),
		);

		const items = service.get();
		expect(Array.isArray(items)).toBeTrue();
		expect(items.length).toEqual(0);
	});
});
