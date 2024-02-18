import {NgOptimizedImage} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';

import type {PicsumResourceIdType} from '../../../types';

@Component({
	selector: 'app-card',
	templateUrl: 'card.component.html',
	styleUrl: 'card.component.scss',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgOptimizedImage],
})
export class CardComponent implements OnChanges {
	@Input({required: true}) id!: PicsumResourceIdType;

	src!: string;

	ngOnChanges(): void {
		// The image will be rendered at 300x300, but because usually
		// pixel density is 2, we multiply the image size with 2
		this.src = `https://picsum.photos/id/${this.id}/600/600`;
	}
}
