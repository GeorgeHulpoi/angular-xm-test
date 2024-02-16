import {HttpClient} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {Observable, delay, map} from 'rxjs';

import type {PicsumList, PicsumResource, PicsumResourceIdType} from '../../types';

interface PicsumResourceResponse {
	id: string;
	author: string;
	width: number;
	height: number;
	url: string;
	download_url: string;
}

type PicsumListResponse = PicsumResourceResponse[];

@Injectable()
export class PicsumService {
	private readonly httpClient = inject(HttpClient);

	/**
	 * Get a paginated list of photos
	 *
	 * @param page
	 * @param limit
	 */
	getList(page: number, limit: number = 12): Observable<PicsumList> {
		const queryParams = new URLSearchParams();

		queryParams.set('page', page.toString());
		queryParams.set('limit', limit.toString());

		return this.httpClient
			.get<PicsumListResponse>(`https://picsum.photos/v2/list?${queryParams.toString()}`, {observe: 'response'})
			.pipe(
				delay(200 + Math.random() * 100),
				map((response) => {
					const result: PicsumList = {
						items: (response.body || []).map((item) => ({
							...item,
							id: parseInt(item.id),
						})),
					};

					const link = response.headers.get('link');

					if (link) {
						link.split(',').forEach((item) => {
							// eslint-disable-next-line @typescript-eslint/no-unused-vars
							const [link, rel] = item.trim().split(' ');

							if (rel === 'rel="prev"') {
								result['hasPrev'] = true;
							} else if (rel === 'rel="next"') {
								result['hasNext'] = true;
							}
						});
					}

					return result;
				}),
			);
	}

	/**
	 * Get information about a photo by id
	 *
	 * @param id
	 */
	getInfo(id: PicsumResourceIdType): Observable<PicsumResource> {
		return this.httpClient.get<PicsumResourceResponse>(`https://picsum.photos/id/${id.toString()}/info`).pipe(
			map((item) => ({
				...item,
				id: parseInt(item.id),
			})),
		);
	}
}
