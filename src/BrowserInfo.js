function userAgent(pattern) {
	return !!navigator.userAgent.match(pattern);
}

const IE11OrLess = /*@__PURE__*/userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i);
const Edge = /*@__PURE__*/userAgent(/Edge/i);
const FireFox = /*@__PURE__*/userAgent(/firefox/i);
const Safari = /*@__PURE__*/userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
const IOS = /*@__PURE__*/userAgent(/iP(ad|od|hone)/i);

export {
	IE11OrLess,
	Edge,
	FireFox,
	Safari,
	IOS
};
