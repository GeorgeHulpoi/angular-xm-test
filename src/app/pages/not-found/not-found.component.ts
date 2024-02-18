import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'app-not-found',
	template: '<div class="container"><h1>Not found</h1></div>',
	styleUrl: 'not-found.component.scss',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}
