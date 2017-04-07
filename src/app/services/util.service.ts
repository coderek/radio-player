export function trim(s, target) {
	let l = 0;
	let r = s.length;
	for (let i = 0; i < s.length; i++) {
		if (target.indexOf(s.charAt(i)) !== -1) {
			l++;
		} else {
			break;
		}
	}
	for (let i = 0; i < s.length; i++) {
		if (target.indexOf(s.charAt(s.length - i - 1)) !== -1) {
			r--;
		} else {
			break;
		}
	}

	if (l < r) {
		return s.substring(l, r);
	}
	return "";
}

export function deepCopy(a) {
	return JSON.parse(JSON.stringify(a));
}

export function isEmpty(s) {
	return s == null || s == '';
}