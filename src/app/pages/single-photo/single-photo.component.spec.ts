/// <reference types="jasmine" />

import {ComponentFixture, TestBed, fakeAsync, flush, waitForAsync} from '@angular/core/testing';

import {FavoritesService} from '../../core/services/favorites.service';
import {SinglePhotoComponent} from './single-photo.component';

describe('Single Photo Component', () => {
	let component: SinglePhotoComponent;
	let service: FavoritesService;
	let fixture: ComponentFixture<SinglePhotoComponent>;

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
			imports: [SinglePhotoComponent],
			providers: [FavoritesService],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SinglePhotoComponent);
		component = fixture.componentInstance;
		service = TestBed.inject(FavoritesService);
	});

	it('should create', () => {
		fixture.componentRef.setInput('data', {
			id: 12,
			author: 'Paul Jarvis',
			width: 2500,
			height: 1667,
			url: 'https://unsplash.com/photos/I_9ILwtsl_k',
			download_url: 'https://picsum.photos/id/12/2500/1667',
		});
		fixture.detectChanges();
		expect(component).toBeDefined();
	});

	it("should doesn't have remove from favorites by default", () => {
		fixture.componentRef.setInput('data', {
			id: 12,
			author: 'Paul Jarvis',
			width: 2500,
			height: 1667,
			url: 'https://unsplash.com/photos/I_9ILwtsl_k',
			download_url: 'https://picsum.photos/id/12/2500/1667',
		});
		fixture.detectChanges();

		const element: HTMLElement = fixture.nativeElement;
		const removeDiv = element.querySelector('.remove');

		expect(removeDiv).toBeFalsy();
	});

	it('should have remove from favorites by default', () => {
		service.add(12);

		fixture.componentRef.setInput('data', {
			id: 12,
			author: 'Paul Jarvis',
			width: 2500,
			height: 1667,
			url: 'https://unsplash.com/photos/I_9ILwtsl_k',
			download_url: 'https://picsum.photos/id/12/2500/1667',
		});

		fixture.detectChanges();

		const element: HTMLElement = fixture.nativeElement;
		const removeDiv = element.querySelector('.remove');

		expect(removeDiv).toBeTruthy();
	});

	it('should update remove button when favorites changes', () => {
		fixture.componentRef.setInput('data', {
			id: 12,
			author: 'Paul Jarvis',
			width: 2500,
			height: 1667,
			url: 'https://unsplash.com/photos/I_9ILwtsl_k',
			download_url: 'https://picsum.photos/id/12/2500/1667',
		});

		fixture.detectChanges();

		service.add(12);

		const element: HTMLElement = fixture.nativeElement;
		const removeDiv = element.querySelector('.remove');

		expect(removeDiv).toBeTruthy();
	});

	it('should render correct image', () => {
		fixture.componentRef.setInput('data', {
			id: 12,
			author: 'Paul Jarvis',
			width: 2500,
			height: 1667,
			url: 'https://unsplash.com/photos/I_9ILwtsl_k',
			download_url: 'https://picsum.photos/id/12/2500/1667',
		});

		fixture.detectChanges();

		const element: HTMLElement = fixture.nativeElement;
		const img = element.querySelector('img');

		expect(img).toBeDefined();
		const src = img!.getAttribute('src');
		expect(src).toBeDefined();
		expect(src).toEqual('https://picsum.photos/id/12/2500/1667');
	});

	it('should remove from favorites and update the DOM', fakeAsync(() => {
		service.add(12);

		fixture.componentRef.setInput('data', {
			id: 12,
			author: 'Paul Jarvis',
			width: 2500,
			height: 1667,
			url: 'https://unsplash.com/photos/I_9ILwtsl_k',
			download_url: 'https://picsum.photos/id/12/2500/1667',
		});

		fixture.detectChanges();

		const element: HTMLElement = fixture.nativeElement;
		const removeBtn = element.querySelector<HTMLButtonElement>('.remove button');

		removeBtn!.click();

		flush();

		expect(service.has(12)).toBeFalse();

		const removeDiv = element.querySelector('.remove');
		expect(removeDiv).toBeFalsy();
	}));
});
