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

	it('should update columns on resize', () => {
		fixture.componentRef.setInput('items', []);
		const spy = spyOnProperty(window, 'innerWidth').and.returnValue(340);
		fixture.detectChanges();

		spy.and.returnValue(1280);
		window.dispatchEvent(new Event('resize'));

		expect(component.columns).toEqual(3);
	});
});
