export const getRandomWordFromList = (list: string[]) => {
	return list[Math.floor(Math.random() * list.length)];
};

export const getMode = (arr: number[]): number => {
	const modeMap: { [key: number]: number } = {};
	let maxEl = arr[0],
		maxCount = 1;
	for (let i = 0; i < arr.length; i++) {
		const el = arr[i];
		if (modeMap[el] == null) modeMap[el] = 1;
		else modeMap[el]++;
		if (modeMap[el] > maxCount) {
			maxEl = el;
			maxCount = modeMap[el];
		}
	}
	return maxEl;
};

export const toWordList = (items: { [key: string]: string }[], attr: string) => {
	const mode = getMode(items.map((word) => word[attr]?.length || 0).filter(Boolean));
	return items.filter((item) => item[attr]?.length === mode).map((item) => item[attr]) || [];
};
