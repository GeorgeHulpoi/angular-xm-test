/// <reference types="jasmine" />

import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {VirtualListComponent} from './virtual-list.component';

describe('Virtual List Component', () => {
	let component: VirtualListComponent;
	let fixture: ComponentFixture<VirtualListComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [VirtualListComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(VirtualListComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		fixture.componentRef.setInput('items', []);
		fixture.detectChanges();
		expect(component).toBeDefined();
	});

	describe('chunks function', () => {
		it('chunks should return correct array', () => {
			const arr = [1, 2, 3, 4, 5];
			const chunks = [...component.chunks(arr, 2)];

			expect(chunks.length).toEqual(3);

			expect(chunks[0].length).toEqual(2);
			expect(chunks[0]).toContain(1);
			expect(chunks[0]).toContain(2);

			expect(chunks[1].length).toEqual(2);
			expect(chunks[1]).toContain(3);
			expect(chunks[1]).toContain(4);

			expect(chunks[2].length).toEqual(1);
			expect(chunks[2]).toContain(5);
		});
	});

	describe('getColumnsValueByWindowWidth', () => {
		it('should return 1 when width is 340', () => {
			spyOnProperty(window, 'innerWidth').and.returnValue(340);
			expect(component.getColumnsValueByWindowWidth()).toEqual(1);
		});

		it('should return 2 when width is 768', () => {
			spyOnProperty(window, 'innerWidth').and.returnValue(768);
			expect(component.getColumnsValueByWindowWidth()).toEqual(2);
		});

		it('should return 2 when width is 1279', () => {
			spyOnProperty(window, 'innerWidth').and.returnValue(1279);
			expect(component.getColumnsValueByWindowWidth()).toEqual(2);
		});

		it('should return 3 when width is 1280', () => {
			spyOnProperty(window, 'innerWidth').and.returnValue(1280);
			expect(component.getColumnsValueByWindowWidth()).toEqual(3);
		});
	});

	describe('generateCollections', () => {
		it('should return correct array', () => {
			spyOnProperty(window, 'innerWidth').and.returnValue(320);
			fixture.componentRef.setInput('items', [
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
			]);
			// Seems like it has been already constructed, so
			// I will dispatch a resize event to update based on the new innerWidth
			window.dispatchEvent(new Event('resize'));
			fixture.detectChanges();

			const collections = component.generateCollections();

			expect(Array.isArray(collections)).toBeTrue();
			expect(collections.length).toEqual(2);
			expect(collections[0].length).toEqual(1);
			expect(collections[1].length).toEqual(1);
		});
	});

	it('should update columns on resize', () => {
		fixture.componentRef.setInput('items', []);
		const spy = spyOnProperty(window, 'innerWidth').and.returnValue(340);
		fixture.detectChanges();

		spy.and.returnValue(1280);
		window.dispatchEvent(new Event('resize'));

		expect(component.columns).toEqual(3);
	});

	/**
	 * Normally I should check if there is rendered the given template,
	 * but cdk-virtual-scroll-viewport doesn't render in this testing environment.
	 * This test should be done as a E2E in Cypress.
	 */
});
