import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';

import {PicsumService} from './picsum.service';

describe('Picsum Service', () => {
	let service: PicsumService;
	let httpTesting: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideHttpClient(), provideHttpClientTesting(), PicsumService],
		});

		service = TestBed.inject(PicsumService);
		httpTesting = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		// Verify that none of the tests make any extra HTTP requests.
		TestBed.inject(HttpTestingController).verify();
	});

	describe('getList', () => {
		it('should get empty list', (done) => {
			service.getList(1, 2).subscribe((res) => {
				expect(res).toBeDefined();
				expect(res.hasNext).toBeFalsy();
				expect(res.hasPrev).toBeFalsy();
				expect(Array.isArray(res.items)).toBeTrue();
				expect(res.items.length).toEqual(0);
				done();
			});

			const queryParams = new URLSearchParams();

			queryParams.set('page', '1');
			queryParams.set('limit', '2');

			const req = httpTesting.expectOne(`https://picsum.photos/v2/list?${queryParams.toString()}`);
			req.flush([]);
		});

		it('should get a page', (done) => {
			service.getList(1, 2).subscribe((res) => {
				expect(res).toBeDefined();
				expect(res.hasNext).toBeFalsy();
				expect(res.hasPrev).toBeFalsy();
				expect(Array.isArray(res.items)).toBeTrue();
				expect(res.items.length).toEqual(2);
				expect(res.items).toContain(
					jasmine.objectContaining({
						id: 0,
						author: 'Alejandro Escamilla',
						width: 5000,
						height: 3333,
						url: 'https://unsplash.com/photos/yC-Yzbqy7PY',
						download_url: 'https://picsum.photos/id/0/5000/3333',
					}),
				);
				expect(res.items).toContain(
					jasmine.objectContaining({
						id: 1,
						author: 'Alejandro Escamilla',
						width: 5000,
						height: 3333,
						url: 'https://unsplash.com/photos/LNRyGwIJr5c',
						download_url: 'https://picsum.photos/id/1/5000/3333',
					}),
				);
				done();
			});

			const queryParams = new URLSearchParams();

			queryParams.set('page', '1');
			queryParams.set('limit', '2');

			const req = httpTesting.expectOne(`https://picsum.photos/v2/list?${queryParams.toString()}`);
			req.flush([
				{
					id: '0',
					author: 'Alejandro Escamilla',
					width: 5000,
					height: 3333,
					url: 'https://unsplash.com/photos/yC-Yzbqy7PY',
					download_url: 'https://picsum.photos/id/0/5000/3333',
				},
				{
					id: '1',
					author: 'Alejandro Escamilla',
					width: 5000,
					height: 3333,
					url: 'https://unsplash.com/photos/LNRyGwIJr5c',
					download_url: 'https://picsum.photos/id/1/5000/3333',
				},
			]);
		});

		it('should include hasPrev', (done) => {
			service.getList(2, 1).subscribe((res) => {
				expect(res).toBeDefined();
				expect(res.hasNext).toBeFalsy();
				expect(res.hasPrev).toBeTrue();
				done();
			});

			const queryParams = new URLSearchParams();

			queryParams.set('page', '2');
			queryParams.set('limit', '1');

			const req = httpTesting.expectOne(`https://picsum.photos/v2/list?${queryParams.toString()}`);
			req.flush(
				[
					{
						id: '0',
						author: 'Alejandro Escamilla',
						width: 5000,
						height: 3333,
						url: 'https://unsplash.com/photos/yC-Yzbqy7PY',
						download_url: 'https://picsum.photos/id/0/5000/3333',
					},
				],
				{
					headers: {
						link: '<https://picsum.photos/v2/list?page=1&limit=1>; rel="prev"',
					},
				},
			);
		});
		it('should include hasNext', (done) => {
			service.getList(1, 1).subscribe((res) => {
				expect(res).toBeDefined();
				expect(res.hasNext).toBeTrue();
				expect(res.hasPrev).toBeFalsy();
				done();
			});

			const queryParams = new URLSearchParams();

			queryParams.set('page', '1');
			queryParams.set('limit', '1');

			const req = httpTesting.expectOne(`https://picsum.photos/v2/list?${queryParams.toString()}`);
			req.flush(
				[
					{
						id: '0',
						author: 'Alejandro Escamilla',
						width: 5000,
						height: 3333,
						url: 'https://unsplash.com/photos/yC-Yzbqy7PY',
						download_url: 'https://picsum.photos/id/0/5000/3333',
					},
				],
				{
					headers: {
						link: '<https://picsum.photos/v2/list?page=2&limit=1>; rel="next"',
					},
				},
			);
		});

		it('should include hasPrev & hasNext', (done) => {
			service.getList(2, 1).subscribe((res) => {
				expect(res).toBeDefined();
				expect(res.hasNext).toBeTrue();
				expect(res.hasPrev).toBeTrue();
				done();
			});

			const queryParams = new URLSearchParams();

			queryParams.set('page', '2');
			queryParams.set('limit', '1');

			const req = httpTesting.expectOne(`https://picsum.photos/v2/list?${queryParams.toString()}`);
			req.flush(
				[
					{
						id: '0',
						author: 'Alejandro Escamilla',
						width: 5000,
						height: 3333,
						url: 'https://unsplash.com/photos/yC-Yzbqy7PY',
						download_url: 'https://picsum.photos/id/0/5000/3333',
					},
				],
				{
					headers: {
						link: '<https://picsum.photos/v2/list?page=1&limit=1>; rel="prev", <https://picsum.photos/v2/list?page=3&limit=1>; rel="next"',
					},
				},
			);
		});
	});

	describe('getInfo', () => {
		it('should get info', (done) => {
			service.getInfo(0).subscribe((res) => {
				expect(res).toBeDefined();
				expect(res).toEqual(
					jasmine.objectContaining({
						id: 0,
						author: 'Alejandro Escamilla',
						width: 5000,
						height: 3333,
						url: 'https://unsplash.com/photos/yC-Yzbqy7PY',
						download_url: 'https://picsum.photos/id/0/5000/3333',
					}),
				);
				done();
			});

			const req = httpTesting.expectOne('https://picsum.photos/id/0/info');
			req.flush({
				id: '0',
				author: 'Alejandro Escamilla',
				width: 5000,
				height: 3333,
				url: 'https://unsplash.com/photos/yC-Yzbqy7PY',
				download_url: 'https://picsum.photos/id/0/5000/3333',
			});
		});

		it('should return null when the response is 404', (done) => {
			service.getInfo(0).subscribe((res) => {
				expect(res).toBeNull();
				done();
			});

			const req = httpTesting.expectOne('https://picsum.photos/id/0/info');
			req.flush('Not Found', {status: 404, statusText: 'Not Found'});
		});
	});
});
