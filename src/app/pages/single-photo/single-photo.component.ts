import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DestroyRef,
	Input,
	OnChanges,
	inject,
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {Subscription, skip} from 'rxjs';

import {FavoritesService} from '../../core/services/favorites.service';
import {ClickZonelessDirective} from '../../shared/directives/click-zoneless.directive';
import type {PicsumResource} from '../../types';

@Component({
	selector: 'app-single-photo',
	templateUrl: 'single-photo.component.html',
	styleUrl: 'single-photo.component.scss',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [MatButtonModule, MatIconModule, ClickZonelessDirective],
})
export class SinglePhotoComponent implements OnChanges {
	@Input({required: true}) data!: PicsumResource;

	private _isInFavorites: boolean = false;
	private favoritesChange$?: Subscription;
	private readonly favoritesService = inject(FavoritesService);
	private readonly cd = inject(ChangeDetectorRef);
	private readonly destroyRef = inject(DestroyRef);

	get isInFavorites(): boolean {
		return this._isInFavorites;
	}

	ngOnChanges(): void {
		this.favoritesChange$?.unsubscribe();

		this._isInFavorites = this.favoritesService.has(this.data.id);

		this.favoritesChange$ = this.favoritesService.changes$
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				skip(1), // This will emit on subscription because of BehaviourSubject
			)
			.subscribe(() => {
				const newValue = this.favoritesService.has(this.data.id);

				if (this.isInFavorites !== newValue) {
					this._isInFavorites = newValue;

					/**
					 * Because we are in OnPush Change Detection Strategy, this
					 * behaviour won't update the DOM, so we have to trigger change
					 * detection by ourselves.
					 */
					this.cd.detectChanges();
				}
			});
	}

	removeFromFavorites(): void {
		/**
		 * We're outside the NgZone right now, but favoritesChange$ will
		 * guarantee that the component will update the DOM
		 */
		this.favoritesService.remove(this.data.id);
	}
}
