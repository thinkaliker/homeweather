units = 'F';

//celsius
COLD_LIMIT = 15.5;
HOT_LIMIT = 26.6;

KEY_LOOKUP = {
    temp_kitchen : 'kitchen',
    temp_downstairs : 'downstairs',
    temp_outside : 'outside'
}

//celsius
var temp = {
    temp_kitchen: 0,
    temp_downstairs: 0,
    temp_outside: 0
}

var hum = {
    hum_kitchen: 0,
    hum_downstairs: 0,
    hum_outside: 0
}

var bat = {
    bat_kitchen: 0,
    bat_downstairs: 0,
    bat_outside: 0
}

function f2c(f) {
    return ((f - 32.0) * (5.0 / 9.0)).toFixed(2);
}

function c2f(c) {
    return ((c * 9.0 / 5.0) + 32.0).toFixed(2);
}

function setBattery() {
    for (var key in bat) {
        var val = bat[key];
        if (val == '0') {
            $('#' + key).attr('hidden','');
        } else {
            $('#' + key).removeAttr('hidden');
        }
    }
}

function setDegrees() {
    for (var key in temp) {
        var val = temp[key];
        if (units == 'F') {
            $('#' + key).text(c2f(val));
        } else {
            $('#' + key).text(val);
        }
        if (val > HOT_LIMIT) {
            $('#' + KEY_LOOKUP[key]).addClass('hot');
            $('#' + KEY_LOOKUP[key]).removeClass('cold');
        } else if (val < COLD_LIMIT) {
            $('#' + KEY_LOOKUP[key]).addClass('cold');
            $('#' + KEY_LOOKUP[key]).removeClass('hot');
        } else {
            $('#' + KEY_LOOKUP[key]).removeClass('cold');
            $('#' + KEY_LOOKUP[key]).removeClass('hot');
        }
    }
}

function setHumidity() {
    for (var key in hum) {
        var val = hum[key];
        $('#' + key).text(val);
    }
}

function setUnits() {
    if (units == 'F') {
        $('#f_btn').addClass('btn-primary');
        $('#c_btn').removeClass('btn-primary');
    } else if (units == 'C') {
        $('#c_btn').addClass('btn-primary');
        $('#f_btn').removeClass('btn-primary');
    }
    $('.units').text(units);
    setDegrees();
}

function setAll() {
    setUnits();
    setDegrees();
    setHumidity();
    setBattery();
}

function updateAllValues(values) {
    //console.log(values)
    for (var key in values) {
        temp['temp_'+key] = values[key].temp;
        hum['hum_'+key] = values[key].hum;
        bat['bat_'+key] = values[key].bat;
    }
    setAll()
}

$(document).ready(function () {
    $('#f_btn').click(function () {
        units = 'F';
        setUnits();
    });
    $('#c_btn').click(function () {
        units = 'C';
        setUnits();
    });
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    var database = firebase.database();
    var db_ref = database.ref('/');
    db_ref.on('value', function(snapshot) {
        updateAllValues(snapshot.val());
        setAll();
    })
});