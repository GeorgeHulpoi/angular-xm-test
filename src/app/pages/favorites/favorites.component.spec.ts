/// <reference types="jasmine" />

import {Injectable} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {Observable, of} from 'rxjs';

import {FavoritesService} from '../../core/services/favorites.service';
import {PicsumService} from '../../core/services/picsum.service';
import {PicsumResource, PicsumResourceIdType} from '../../types';
import {FavoritesComponent} from './favorites.component';

@Injectable()
class PicsumServiceMock {
	getInfo(id: PicsumResourceIdType): Observable<PicsumResource | null> {
		if (id === 1) {
			return of({
				id: 1,
				author: 'Alejandro Escamilla',
				width: 5000,
				height: 3333,
				url: 'https://unsplash.com/photos/yC-Yzbqy7PY',
				download_url: 'https://picsum.photos/id/0/5000/3333',
			});
		} else if (id === 2) {
			return of({
				id: 2,
				author: 'Alejandro Escamilla',
				width: 5000,
				height: 3333,
				url: 'https://unsplash.com/photos/N7XodRrbzS0',
				download_url: 'https://picsum.photos/id/2/5000/3333',
			});
		} else {
			return of(null);
		}
	}
}

describe('Favorites Component', () => {
	let component: FavoritesComponent;
	let fixture: ComponentFixture<FavoritesComponent>;
	let favoritesService: FavoritesService;
	let picsumService: PicsumServiceMock;

	beforeEach(waitForAsync(() => {
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
			imports: [FavoritesComponent],
			providers: [provideRouter([]), {provide: PicsumService, useClass: PicsumServiceMock}, FavoritesService],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FavoritesComponent);
		component = fixture.componentInstance;
		favoritesService = TestBed.inject(FavoritesService);
		picsumService = TestBed.inject(PicsumService);
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeDefined();
	});

	it('should show empty paragraph when list is empty', () => {
		fixture.detectChanges();

		const element: HTMLElement = fixture.nativeElement;
		const empty = element.querySelector('.empty');

		expect(empty).toBeDefined();
	});

	it('should cache', () => {
		const getInfoSpy = spyOn(picsumService, 'getInfo').and.callThrough();
		favoritesService.add(1);
		fixture.detectChanges();

		favoritesService.add(2);

		expect(getInfoSpy).toHaveBeenCalledTimes(2);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const cache: Map<any, any> = (component as any).cache;

		expect(cache.size).toEqual(2);

		expect(cache.has(1)).toBeTrue();
		expect(cache.get(1)).toEqual(
			jasmine.objectContaining({
				id: 1,
				author: 'Alejandro Escamilla',
				width: 5000,
				height: 3333,
				url: 'https://unsplash.com/photos/yC-Yzbqy7PY',
				download_url: 'https://picsum.photos/id/0/5000/3333',
			}),
		);

		expect(cache.has(2)).toBeTrue();
		expect(cache.get(2)).toEqual(
			jasmine.objectContaining({
				id: 2,
				author: 'Alejandro Escamilla',
				width: 5000,
				height: 3333,
				url: 'https://unsplash.com/photos/N7XodRrbzS0',
				download_url: 'https://picsum.photos/id/2/5000/3333',
			}),
		);
	});

	it('not found resource should remove from favorites', () => {
		favoritesService.add(1);
		favoritesService.add(-1);
		fixture.detectChanges();

		expect(favoritesService.has(-1)).toBeFalse();
	});
});
