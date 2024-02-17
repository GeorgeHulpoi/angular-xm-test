import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, ResolveFn, Router} from '@angular/router';
import {concatMap, of} from 'rxjs';

import type {PicsumResource} from '../../types';
import {PicsumService} from '../services/picsum.service';

export const singlePhotoResolver: ResolveFn<PicsumResource | null> = (route: ActivatedRouteSnapshot) => {
	const picsumService = inject(PicsumService);
	const router = inject(Router);

	const idParam = route.paramMap.get('id');
	const id = parseInt(idParam || ''); // parseInt('') will produce NaN

	const notFound = () => {
		router.navigate(['/not-found'], {skipLocationChange: true});
		return of();
	};

	if (isNaN(id)) {
		return notFound();
	}

	return picsumService.getInfo(id).pipe(concatMap((res) => (res ? of(res) : notFound())));
};
