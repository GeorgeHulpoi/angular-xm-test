import {Routes} from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		loadComponent: () => import('./pages/photos/photos.component').then((m) => m.PhotosComponent),
		title: 'Photos',
	},
	{
		path: 'favorites',
		pathMatch: 'full',
		loadComponent: () => import('./pages/favorites/favorites.component').then((m) => m.FavoritesComponent),
		title: 'Favorites',
	},
	{
		path: 'photos/:id',
		pathMatch: 'full',
		loadComponent: () => import('./pages/single-photo/single-photo.component').then((m) => m.SinglePhotoComponent),
	},
];
