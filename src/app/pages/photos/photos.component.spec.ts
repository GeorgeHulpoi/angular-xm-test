import {Injectable} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Observable, of, skip, take} from 'rxjs';

import {FavoritesService} from '../../core/services/favorites.service';
import {PicsumService} from '../../core/services/picsum.service';
import type {PicsumList} from '../../types';
import {PhotosComponent} from './photos.component';

const items = [
	{
		id: 0,
		author: 'Alejandro Escamilla',
		width: 5000,
		height: 3333,
		url: 'https://unsplash.com/photos/yC-Yzbqy7PY',
		download_url: 'https://picsum.photos/id/0/5000/3333',
	},
	{
		id: 1,
		author: 'Alejandro Escamilla',
		width: 5000,
		height: 3333,
		url: 'https://unsplash.com/photos/LNRyGwIJr5c',
		download_url: 'https://picsum.photos/id/1/5000/3333',
	},
	{
		id: 2,
		author: 'Alejandro Escamilla',
		width: 5000,
		height: 3333,
		url: 'https://unsplash.com/photos/N7XodRrbzS0',
		download_url: 'https://picsum.photos/id/2/5000/3333',
	},
	{
		id: 3,
		author: 'Alejandro Escamilla',
		width: 5000,
		height: 3333,
		url: 'https://unsplash.com/photos/Dl6jeyfihLk',
		download_url: 'https://picsum.photos/id/3/5000/3333',
	},
	{
		id: 4,
		author: 'Alejandro Escamilla',
		width: 5000,
		height: 3333,
		url: 'https://unsplash.com/photos/y83Je1OC6Wc',
		download_url: 'https://picsum.photos/id/4/5000/3333',
	},
];

@Injectable()
class FavoritesServiceMock {
	add() {}
}

@Injectable()
class PicsumServiceMock {
	getList(page: number): Observable<PicsumList> {
		if (page === 1) {
			return of({
				items: [items[0], items[1]],
				hasNext: true,
			});
		} else if (page === 2) {
			return of({
				items: [items[2], items[3]],
				hasNext: true,
			});
		} else if (page === 3) {
			return of({
				items: [items[4]],
			});
		} else {
			return of({
				items: [],
			});
		}
	}
}

describe('Single Photo Component', () => {
	let component: PhotosComponent;
	let fixture: ComponentFixture<PhotosComponent>;

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
			imports: [PhotosComponent],
			providers: [
				{provide: FavoritesService, useClass: FavoritesServiceMock},
				{provide: PicsumService, useClass: PicsumServiceMock},
			],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PhotosComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeDefined();
	});

	it('data$ should emit first page', (done) => {
		fixture.detectChanges();

		component.data$.pipe(take(1)).subscribe((data) => {
			expect(data.hasNext).toBeTrue();
			expect(data.items.length).toEqual(2);
			expect(data.items).toContain(jasmine.objectContaining(items[0]));
			expect(data.items).toContain(jasmine.objectContaining(items[1]));

			done();
		});
	});

	it('data$ should append the second page', (done) => {
		fixture.detectChanges();

		component.data$.pipe(skip(1)).subscribe((data) => {
			expect(data.hasNext).toBeTrue();
			expect(data.items.length).toEqual(4);
			expect(data.items).toContain(jasmine.objectContaining(items[0]));
			expect(data.items).toContain(jasmine.objectContaining(items[1]));
			expect(data.items).toContain(jasmine.objectContaining(items[2]));
			expect(data.items).toContain(jasmine.objectContaining(items[3]));
			done();
		});

		component.page++;
	});

	it('data$ should append the third page', (done) => {
		fixture.detectChanges();

		component.data$.pipe(skip(2)).subscribe((data) => {
			expect(data.hasNext).toBeUndefined();
			expect(data.items.length).toEqual(5);
			expect(data.items).toContain(jasmine.objectContaining(items[0]));
			expect(data.items).toContain(jasmine.objectContaining(items[1]));
			expect(data.items).toContain(jasmine.objectContaining(items[2]));
			expect(data.items).toContain(jasmine.objectContaining(items[3]));
			expect(data.items).toContain(jasmine.objectContaining(items[4]));
			done();
		});

		component.page++;
		component.page++;
	});
});
