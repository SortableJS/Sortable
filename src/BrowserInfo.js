function userAgent(pattern) {
	return !!navigator.userAgent.match(pattern);
}

var IE11OrLess = userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile)/i);
var Edge = userAgent(/Edge/i);
var FireFox = userAgent(/firefox/i);
var Safari = userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
var IOS = userAgent(/iP(ad|od|hone)/i);


export {
	IE11OrLess,
	Edge,
	FireFox,
	Safari,
	IOS
};
