import {Routes} from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		loadComponent: () => import('./pages/photos/photos.component').then((m) => m.PhotosComponent),
		title: 'Photos',
	},
];
