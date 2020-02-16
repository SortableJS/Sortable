var example1 = document.getElementById('example1'),
	example2Left = document.getElementById('example2-left'),
	example2Right = document.getElementById('example2-right'),
	example3Left = document.getElementById('example3-left'),
	example3Right = document.getElementById('example3-right'),
	example4Left = document.getElementById('example4-left'),
	example4Right = document.getElementById('example4-right'),
	example5 = document.getElementById('example5'),
	example6 = document.getElementById('example6'),
	example7 = document.getElementById('example7'),
	gridDemo = document.getElementById('gridDemo'),
	multiDragDemo = document.getElementById('multiDragDemo'),
	swapDemo = document.getElementById('swapDemo');

// Example 1 - Simple list
new Sortable(example1, {
	animation: 150,
	ghostClass: 'blue-background-class'
});


// Example 2 - Shared lists
new Sortable(example2Left, {
	group: 'shared', // set both lists to same group
	animation: 150
});

new Sortable(example2Right, {
	group: 'shared',
	animation: 150
});

// Example 3 - Cloning
new Sortable(example3Left, {
	group: {
		name: 'shared',
		pull: 'clone' // To clone: set pull to 'clone'
	},
	animation: 150
});

new Sortable(example3Right, {
	group: {
		name: 'shared',
		pull: 'clone'
	},
	animation: 150
});


// Example 4 - No Sorting
new Sortable(example4Left, {
	group: {
		name: 'shared',
		pull: 'clone',
		put: false // Do not allow items to be put into this list
	},
	animation: 150,
	sort: false // To disable sorting: set sort to false
});

new Sortable(example4Right, {
	group: 'shared',
	animation: 150
});


// Example 5 - Handle
new Sortable(example5, {
    handle: '.handle', // handle class
    animation: 150
});

// Example 6 - Filter
new Sortable(example6, {
    filter: '.filtered',
    animation: 150
});

// Example 7 - Thresholds
var example7Sortable = new Sortable(example7, {
    animation: 150
});


var example7SwapThreshold = 1;
var example7SwapThresholdInput = document.getElementById('example7SwapThresholdInput');
var example7SwapThresholdCode = document.getElementById('example7SwapThresholdCode');
var example7SwapThresholdIndicators = [].slice.call(document.querySelectorAll('.swap-threshold-indicator'));

var example7InvertSwapInput = document.getElementById('example7InvertSwapInput');
var example7InvertSwapCode = document.getElementById('example7InvertSwapCode');
var example7InvertedSwapThresholdIndicators = [].slice.call(document.querySelectorAll('.inverted-swap-threshold-indicator'));

var example7Squares = [].slice.call(document.querySelectorAll('.square'));

var activeIndicators = example7SwapThresholdIndicators;

var example7DirectionInput = document.getElementById('example7DirectionInput');
var example7SizeProperty = 'width';


function renderThresholdWidth(evt) {
	example7SwapThreshold = Number(evt.target.value);
	example7SwapThresholdCode.innerHTML = evt.target.value.indexOf('.') > -1 ? (evt.target.value + '0000').slice(0, 4) : evt.target.value;

	for (var i = 0; i < activeIndicators.length; i++) {
		activeIndicators[i].style[example7SizeProperty] = (evt.target.value * 100) /
			(activeIndicators == example7SwapThresholdIndicators ? 1 : 2) + '%';
	}

	example7Sortable.option('swapThreshold', example7SwapThreshold);
}

example7SwapThresholdInput.addEventListener('input', renderThresholdWidth);
example7SwapThresholdInput.addEventListener('change', renderThresholdWidth);

example7InvertSwapInput.addEventListener('change', function(evt) {
	example7Sortable.option('invertSwap', evt.target.checked);


	for (var i = 0; i < activeIndicators.length; i++) {
		activeIndicators[i].style.display = 'none';
	}

	if (evt.target.checked) {

		example7InvertSwapCode.style.display = '';

		activeIndicators = example7InvertedSwapThresholdIndicators;
	} else {
		example7InvertSwapCode.style.display = 'none';
		activeIndicators = example7SwapThresholdIndicators;
	}

	renderThresholdWidth({
		target: example7SwapThresholdInput
	});

	for (i = 0; i < activeIndicators.length; i++) {
		activeIndicators[i].style.display = '';
	}
});

function renderDirection(evt) {
	for (var i = 0; i < example7Squares.length; i++) {
		example7Squares[i].style.display = evt.target.value === 'h' ? 'inline-block' : 'block';
	}

	for (i = 0; i < example7InvertedSwapThresholdIndicators.length; i++) {
		/* jshint expr:true */
		evt.target.value === 'h' && (example7InvertedSwapThresholdIndicators[i].style.height = '100%');
		evt.target.value === 'v' && (example7InvertedSwapThresholdIndicators[i].style.width = '100%');
	}

	for (i = 0; i < example7SwapThresholdIndicators.length; i++) {
		if (evt.target.value === 'h') {
			example7SwapThresholdIndicators[i].style.height = '100%';
			example7SwapThresholdIndicators[i].style.marginLeft = '50%';
			example7SwapThresholdIndicators[i].style.transform = 'translateX(-50%)';

			example7SwapThresholdIndicators[i].style.marginTop = '0';
		} else {
			example7SwapThresholdIndicators[i].style.width = '100%';
			example7SwapThresholdIndicators[i].style.marginTop = '50%';
			example7SwapThresholdIndicators[i].style.transform = 'translateY(-50%)';

			example7SwapThresholdIndicators[i].style.marginLeft = '0';
		}
	}

	if (evt.target.value === 'h') {
		example7SizeProperty = 'width';
		example7Sortable.option('direction', 'horizontal');
	} else {
		example7SizeProperty = 'height';
		example7Sortable.option('direction', 'vertical');
	}

	renderThresholdWidth({
		target: example7SwapThresholdInput
	});
}
example7DirectionInput.addEventListener('change', renderDirection);

renderDirection({
	target: example7DirectionInput
});


// Grid demo
new Sortable(gridDemo, {
	animation: 150,
	ghostClass: 'blue-background-class'
});

// Nested demo
var nestedSortables = [].slice.call(document.querySelectorAll('.nested-sortable'));

// Loop through each nested sortable element
for (var i = 0; i < nestedSortables.length; i++) {
	new Sortable(nestedSortables[i], {
		group: 'nested',
		animation: 150,
		fallbackOnBody: true,
		swapThreshold: 0.65
	});
}

// MultiDrag demo
new Sortable(multiDragDemo, {
	multiDrag: true,
	selectedClass: 'selected',
	fallbackTolerance: 3, // So that we can select items on mobile
	animation: 150
});


// Swap demo
new Sortable(swapDemo, {
	swap: true,
	swapClass: 'highlight',
	animation: 150
});
