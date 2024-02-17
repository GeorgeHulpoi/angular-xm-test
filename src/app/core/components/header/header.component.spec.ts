import {provideLocationMocks} from '@angular/common/testing';
import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {RouterTestingHarness} from '@angular/router/testing';

import {HeaderComponent} from './header.component';

@Component({
	selector: 'app-photos',
	template: '#photos',
	standalone: true,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
class PhotosComponentStub {}

@Component({
	selector: 'app-favorites',
	template: '#photos',
	standalone: true,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
class FavoritesComponentStub {}

describe('Header Component', () => {
	let component: HeaderComponent;
	let fixture: ComponentFixture<HeaderComponent>;
	let harness: RouterTestingHarness;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HeaderComponent],
			providers: [
				provideRouter([
					{
						path: '',
						pathMatch: 'full',
						component: PhotosComponentStub,
					},
					{
						path: 'favorites',
						pathMatch: 'full',
						component: FavoritesComponentStub,
					},
				]),
				provideLocationMocks(),
			],
		}).compileComponents();

		harness = await RouterTestingHarness.create();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(HeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeDefined();
	});

	it('photos button should have mat-primary class', async () => {
		await harness.navigateByUrl('/');

		// Manually trigger the change detection...
		fixture.detectChanges();

		const element: HTMLElement = fixture.nativeElement;
		const photosBtn = Array.from(element.querySelectorAll('button')).find((el) => el.textContent === 'Photos');
		const favoritesBtn = Array.from(element.querySelectorAll('button')).find(
			(el) => el.textContent === 'Favorites',
		);

		expect(photosBtn).toBeDefined();
		expect(photosBtn!.classList.contains('mat-primary')).toBeTruthy();

		expect(favoritesBtn).toBeDefined();
		expect(favoritesBtn!.classList.contains('mat-primary')).toBeFalsy();
	});

	it('favorites button should have mat-primary class', async () => {
		await harness.navigateByUrl('/favorites');

		// Manually trigger the change detection...
		fixture.detectChanges();

		const element: HTMLElement = fixture.nativeElement;
		const photosBtn = Array.from(element.querySelectorAll('button')).find((el) => el.textContent === 'Photos');
		const favoritesBtn = Array.from(element.querySelectorAll('button')).find(
			(el) => el.textContent === 'Favorites',
		);

		expect(photosBtn).toBeDefined();
		expect(photosBtn!.classList.contains('mat-primary')).toBeFalsy();

		expect(favoritesBtn).toBeDefined();
		expect(favoritesBtn!.classList.contains('mat-primary')).toBeTruthy();
	});
});
