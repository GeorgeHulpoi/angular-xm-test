/// <reference types="jasmine" />

import {Component, DoCheck} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {ClickZonelessDirective} from './click-zoneless.directive';

@Component({
	standalone: true,
	template: `<button (clickZoneless)="onClick()">Click me</button>`,
	imports: [ClickZonelessDirective],
})
class TestComponent implements DoCheck {
	onClick(): void {}
	// can spy directly on ngDoCheck
	ngDoCheck(): void {
		this.doCheck();
	}
	doCheck(): void {}
}

describe('Click Zoneless Directive', () => {
	let fixture: ComponentFixture<TestComponent>;
	let component: TestComponent;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TestComponent],
			teardown: {destroyAfterEach: true},
		});
		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
	});

	it('it should call onClick', () => {
		fixture.detectChanges();

		const onClickSpy = spyOn(component, 'onClick').and.callThrough();
		const doCheckSpy = spyOn(component, 'doCheck').and.callThrough();

		const btn = fixture.debugElement.query(By.css('button'));
		btn.nativeElement.click();

		expect(onClickSpy).toHaveBeenCalledTimes(1);
		expect(doCheckSpy).toHaveBeenCalledTimes(0);
	});
});
