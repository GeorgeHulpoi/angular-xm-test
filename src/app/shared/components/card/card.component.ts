import {NgOptimizedImage} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import type {PicsumResourceIdType} from '../../../types';

@Component({
	selector: 'app-card',
	templateUrl: 'card.component.html',
	styleUrl: 'card.component.scss',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgOptimizedImage],
})
export class CardComponent {
	@Input({required: true}) id!: PicsumResourceIdType;

	getImageSrc(): string {
		// The image will be rendered at 300x300, but because usually
		// pixel density is 2, we multiply the image size with 2
		return `https://picsum.photos/id/${this.id}/600/600`;
	}
}
