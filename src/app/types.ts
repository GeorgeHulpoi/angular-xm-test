export interface PicsumResource {
	id: number;
	author: string;
	width: number;
	height: number;
	url: string;
	download_url: string;
}

export interface PicsumList {
	items: PicsumResource[];
	hasNext?: true;
	hasPrev?: true;
}

export type PicsumResourceIdType = PicsumResource['id'];
