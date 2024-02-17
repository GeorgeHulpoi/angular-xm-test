import {Component} from '@angular/core';

@Component({
	selector: 'app-collection',
	template: '<ng-content></ng-content>',
	styleUrl: 'collection.component.scss',
	standalone: true,
})
export class CollectionComponent {}
