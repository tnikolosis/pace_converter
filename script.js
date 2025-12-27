const ONE_MILE_TO_KM = 1.60934;

$(document).ready(function() {
    $("input[type='number'], input[type='text']").val("");
});

$("input[type='number'], input[type='text']").focus((inpt) => {
    $(inpt.target).val("");
});

$("button.calculate.dist").click((e) => {
    var container = $(e.target).closest('.conversion-container');
    var parent = $(e.target).parent();
    var dist = $(parent.children()[0]);
    var targetBox = container.find(".converted-value").first();
    var fromUnit = container.attr('data-from-unit');
    var toMiles = fromUnit === "km";
    calculateDistance(dist, targetBox, toMiles);
});

$("button.calculate.pace").click((e) => {
    var container = $(e.target).closest('.conversion-container');
    var parent = $(e.target).parent();
    var mins = $(parent.children()[0]);
    var secs = $(parent.children()[1]);
    var targetBox = container.find(".converted-value").first();
    var fromUnit = container.attr('data-from-unit');
    var toMiles = fromUnit === "km";
    calculatePace(mins, secs, targetBox, toMiles);
});

$(".avg-calculate-btn").click((e) => {
    var container = $(e.target).closest('.averager-container');
    var mins1 = container.find('.avg-mins-1');
    var secs1 = container.find('.avg-secs-1');
    var mins2 = container.find('.avg-mins-2');
    var secs2 = container.find('.avg-secs-2');
    var targetBox = container.find(".avg-result-value");
    calculateAveragePace(mins1, secs1, mins2, secs2, targetBox);
});

$(".mins").keyup(function () {
    if (this.value.length == 2) {
        $(this).next('input').focus();
    }
});

$(".secs").keyup(function () {
    if (this.value.length == 2) {
        $(this).next('button').focus();
    }
});

// Auto-focus for pace averager inputs
$(".avg-mins-1").keyup(function () {
    if (this.value.length == 2) {
        var container = $(this).closest('.averager-container');
        container.find('.avg-secs-1').focus();
    }
});

$(".avg-secs-1").keyup(function () {
    if (this.value.length == 2) {
        var container = $(this).closest('.averager-container');
        container.find('.avg-mins-2').focus();
    }
});

$(".avg-mins-2").keyup(function () {
    if (this.value.length == 2) {
        var container = $(this).closest('.averager-container');
        container.find('.avg-secs-2').focus();
    }
});

$(".avg-secs-2").keyup(function () {
    if (this.value.length == 2) {
        var container = $(this).closest('.averager-container');
        container.find('.avg-calculate-btn').focus();
    }
});

$(".dist").keyup(function (e) {
    if (this.value.length > 0 && e.key == "Enter") {
        var container = $(this).closest('.conversion-container');
        var targetBox = container.find(".converted-value").first();
        var fromUnit = container.attr('data-from-unit');
        var toMiles = fromUnit === "km";
        calculateDistance($(this), targetBox, toMiles);
    }
});

function calculateDistance(distInpt, targetBox, toMiles = true) {
    if (distInpt.val() === "") {
        distInpt.val(0);
    }

    var distance = safeFloat(distInpt.val().replace(",", "."));
    var converted = 0.0;

    if (toMiles) {
        converted = distance / ONE_MILE_TO_KM;
    } else {
        converted = distance * ONE_MILE_TO_KM;
    }
    targetBox.text(`${converted.toFixed(2)}`);
}

function calculatePace(minsInpt, secsInpt, targetBox, toMiles = true) {
    setPaddedValue(minsInpt);
    setPaddedValue(secsInpt);

    var mins = safeInt(minsInpt.val());
    var secs = safeInt(secsInpt.val());

    var totalSecs = (secs + (mins * 60));
    var totalSecsConverted = toMiles ? (totalSecs * ONE_MILE_TO_KM) : (totalSecs / ONE_MILE_TO_KM);
    var minsConverted = Math.trunc(totalSecsConverted / 60);
    var secsConverted = Math.round(totalSecsConverted % 60);

    if (secsConverted == 60) {
        minsConverted++;
        secsConverted = 0;
    }

    targetBox.text(`${padValue(minsConverted)}:${padValue(secsConverted)}`);
}

function calculateAveragePace(mins1Inpt, secs1Inpt, mins2Inpt, secs2Inpt, targetBox) {
    setPaddedValue(mins1Inpt);
    setPaddedValue(secs1Inpt);
    setPaddedValue(mins2Inpt);
    setPaddedValue(secs2Inpt);

    var mins1 = safeInt(mins1Inpt.val());
    var secs1 = safeInt(secs1Inpt.val());
    var mins2 = safeInt(mins2Inpt.val());
    var secs2 = safeInt(secs2Inpt.val());

    var totalSecs1 = (secs1 + (mins1 * 60));
    var totalSecs2 = (secs2 + (mins2 * 60));

    var averageSecs = (totalSecs1 + totalSecs2) / 2;
    var minsAvg = Math.floor(averageSecs / 60);
    var secsAvg = Math.round(averageSecs % 60);

    if (secsAvg == 60) {
        minsAvg++;
        secsAvg = 0;
    }

    targetBox.text(`${padValue(minsAvg)}:${padValue(secsAvg)}`);
}

function safeFloat(val) {
    var valf = parseFloat(val);
    return isNaN(valf) ? 0.0 : valf;
}

function safeInt(val) {
    var vali = parseInt(val);
    return isNaN(vali) ? 0 : vali;
}

function setPaddedValue(inpt) {
    inpt.val(padValue(inpt.val()));
}

function padValue(val) {
    return String(val).padStart(2, '0');
}

// Pace Calculator Helper Functions
// Format total seconds to HH:MM:SS
function formatTimeOutput(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.round(totalSeconds % 60);
    return `${padValue(hours)}:${padValue(minutes)}:${padValue(seconds)}`;
}

// Format total seconds to MM:SS for pace
function formatPaceOutput(totalSeconds) {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.round(totalSeconds % 60);
    if (seconds === 60) {
        minutes++;
        seconds = 0;
    }
    return `${padValue(minutes)}:${padValue(seconds)}`;
}

// Pace Calculator Calculation Functions
// Calculate Time from Distance and Pace
// Formula: time = distance × pace
function calculateTime() {
    const distance = safeFloat($('#distance-input').val());
    const paceMinutes = safeInt($('#pace-mins').val());
    const paceSeconds = safeInt($('#pace-secs').val());
    const paceInSeconds = (paceMinutes * 60) + paceSeconds;

    if (distance <= 0 || paceInSeconds <= 0) {
        return 'Invalid input';
    }

    const totalTimeSeconds = distance * paceInSeconds;
    return formatTimeOutput(totalTimeSeconds);
}

// Calculate Distance from Time and Pace
// Formula: distance = time ÷ pace
function calculateDistanceFromPace() {
    const hours = safeInt($('#time-hours').val());
    const minutes = safeInt($('#time-mins').val());
    const seconds = safeInt($('#time-secs').val());
    const totalTimeSeconds = (hours * 3600) + (minutes * 60) + seconds;

    const paceMinutes = safeInt($('#pace-mins').val());
    const paceSeconds = safeInt($('#pace-secs').val());
    const paceInSeconds = (paceMinutes * 60) + paceSeconds;

    if (totalTimeSeconds <= 0 || paceInSeconds <= 0) {
        return 'Invalid input';
    }

    const distance = totalTimeSeconds / paceInSeconds;
    const unit = $('input[name="distance-unit"]:checked').val() || 'metric';
    const unitLabel = unit === 'metric' ? 'km' : 'miles';

    return `${distance.toFixed(2)} ${unitLabel}`;
}

// Calculate Pace from Time and Distance
// Formula: pace = time ÷ distance
function calculatePaceFromTime() {
    const hours = safeInt($('#time-hours').val());
    const minutes = safeInt($('#time-mins').val());
    const seconds = safeInt($('#time-secs').val());
    const totalTimeSeconds = (hours * 3600) + (minutes * 60) + seconds;

    const distance = safeFloat($('#distance-input').val());

    if (totalTimeSeconds <= 0 || distance <= 0) {
        return 'Invalid input';
    }

    const paceInSeconds = totalTimeSeconds / distance;
    const unit = $('input[name="distance-unit"]:checked').val() || 'metric';
    const unitLabel = unit === 'metric' ? 'min/km' : 'min/mile';

    return `${formatPaceOutput(paceInSeconds)} ${unitLabel}`;
}

// Main calculation orchestrator
function performCalculation() {
    const mode = $('#calc-mode').val();
    const resultBox = $('.calculator-container .result-value');

    let result;
    switch(mode) {
        case 'time':
            result = calculateTime();
            break;
        case 'distance':
            result = calculateDistanceFromPace();
            break;
        case 'pace':
            result = calculatePaceFromTime();
            break;
    }

    resultBox.text(result);
}

// Pace Calculator UI Functions
// Show/hide input fields based on dropdown selection
function updateInputFields() {
    const mode = $('#calc-mode').val();

    // Hide all groups
    $('.time-input-group, .distance-input-group, .pace-input-group').addClass('hidden');

    // Show relevant groups based on mode
    switch(mode) {
        case 'time':
            // Show distance and pace inputs
            $('.distance-input-group, .pace-input-group').removeClass('hidden');
            updatePaceUnitLabel();
            break;
        case 'distance':
            // Show time and pace inputs
            $('.time-input-group, .pace-input-group').removeClass('hidden');
            updatePaceUnitLabel();
            break;
        case 'pace':
            // Show time and distance inputs
            $('.time-input-group, .distance-input-group').removeClass('hidden');
            break;
    }
}

// Update pace unit label based on distance unit selection
function updatePaceUnitLabel() {
    const unit = $('input[name="distance-unit"]:checked').val() || 'metric';
    const label = unit === 'metric' ? 'min/km' : 'min/mile';
    $('#pace-unit-label').text(label);
}


// Clear averager inputs on focus
$('.averager-inputs input').focus(function() {
    $(this).val("");
});

// Enter key triggers calculation for averager
$('.averager-inputs input').keyup(function(e) {
    if (e.key === "Enter") {
        $('.avg-calculate-btn').click();
    }
});

// Clear button click for averager
$('.avg-clear-btn').click(function() {
    // Clear all averager inputs
    $('.avg-mins-1, .avg-secs-1, .avg-mins-2, .avg-secs-2').val('');
    // Reset result
    $('.avg-result-value').text('-');
});

// Initialize calculator on page load
$(document).ready(function() {
    updateInputFields();

    // Pace Calculator Event Handlers
    // Dropdown change handler
    $('#calc-mode').change(function() {
        updateInputFields();
        $('.calculator-container .result-value').text('-');
    });

    // Unit change handler
    $('input[name="distance-unit"]').change(function() {
        updatePaceUnitLabel();
        // Clear result
        $('.calculator-container .result-value').text('-');
        // Auto-recalculate if we have inputs (so user sees the unit change take effect)
        const mode = $('#calc-mode').val();
        let hasInputs = false;
        if (mode === 'time') {
            hasInputs = $('#distance-input').val() && $('#pace-mins').val();
        } else if (mode === 'distance') {
            hasInputs = $('#time-hours').val() && $('#pace-mins').val();
        } else if (mode === 'pace') {
            hasInputs = $('#time-hours').val() && $('#distance-input').val();
        }
        if (hasInputs) {
            performCalculation();
        }
    });

    // Calculate button click
    $('.calculator-container .calculate-btn').click(performCalculation);

    // Clear button click
    $('.calculator-container .clear-btn').click(function() {
        // Clear all calculator inputs
        $('#time-hours, #time-mins, #time-secs').val('');
        $('#distance-input').val('');
        $('#pace-mins, #pace-secs').val('');
        // Reset result
        $('.result-value').text('-');
    });

    // Enter key triggers calculation
    $('.calculator-inputs input').keyup(function(e) {
        if (e.key === "Enter") {
            performCalculation();
        }
    });

    // Auto-focus behavior for time inputs
    $('#time-hours').keyup(function() {
        if (this.value.length == 2) {
            $('#time-mins').focus();
        }
    });

    $('#time-mins').keyup(function() {
        if (this.value.length == 2) {
            $('#time-secs').focus();
        }
    });

    $('#time-secs').keyup(function() {
        if (this.value.length == 2) {
            $('.calculate-btn').focus();
        }
    });

    // Auto-focus behavior for pace inputs
    $('#pace-mins').keyup(function() {
        if (this.value.length == 2) {
            $('#pace-secs').focus();
        }
    });

    $('#pace-secs').keyup(function() {
        if (this.value.length == 2) {
            $('.calculate-btn').focus();
        }
    });

    // Clear inputs on focus (consistent with existing behavior) - but not radio buttons
    $('.calculator-inputs input[type="number"]').focus(function() {
        $(this).val("");
    });
});

// Swap button handler for simple converters
$('.swap-btn').click(function() {
    var container = $(this).closest('.conversion-container');
    var currentUnit = container.attr('data-from-unit');
    var fromLabel = container.find('.from-unit-label');
    var toLabel = container.find('.to-unit-label');
    var isPaceConverter = container.find('.mins').length > 0;

    // Toggle the unit
    var newUnit = currentUnit === 'km' ? 'mi' : 'km';
    container.attr('data-from-unit', newUnit);

    // Update labels
    if (isPaceConverter) {
        if (newUnit === 'km') {
            fromLabel.text('km/min');
            toLabel.text('miles/min');
        } else {
            fromLabel.text('miles/min');
            toLabel.text('km/min');
        }
    } else {
        if (newUnit === 'km') {
            fromLabel.text('km');
            toLabel.text('miles');
        } else {
            fromLabel.text('miles');
            toLabel.text('km');
        }
    }

    // Clear result
    container.find('.converted-value').text('-');
});

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to dark theme
const currentTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

// Toggle theme when button is clicked
themeToggle.addEventListener('click', function() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// Update the icon based on theme
function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
}
