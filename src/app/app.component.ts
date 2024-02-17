import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {FavoritesService} from './core/services/favorites.service';

@Component({
	selector: 'app-root',
	standalone: true,
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	imports: [RouterOutlet],
	providers: [FavoritesService],
})
export class AppComponent {}
