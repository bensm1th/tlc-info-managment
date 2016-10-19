$('.message .close').click(function() {
    $(this).closest('.message').fadeOut();
});
$('#date').combodate();
$('#date2').combodate();


$('#setPeriod').submit(function(e) {
    e.preventDefault();
    /*
    var formData = new FormData();
    formData.append('beginning', beginning);
    formData.append('end', end);
    */
    var formData = {};
    formData.beginning = $('#date').combodate('getValue');
    formData.end = $('#date2').combodate('getValue');
    console.log($('#date2').combodate('getValue'));
    //document.getElementById('setPeriod').reset();
    $.ajax({
            url: '/hours',
            dataType: 'json',
            processData: false, 
            contentType: 'application/json',
            data: JSON.stringify(formData),
            type: 'POST',
            success: function(response) {
                if (response.status == 'error') {
                    console.log(response.status);
                } else {
                    console.log(response);
                    $('#hoursTable').html('');
                    $('#formWrapper').hide();
                    $('#periodHeader').text('Preview Pay Period');
                    $('#hoursTable').append(buildTable(response));
                }
            }
    });
});

function buildTable(response) {
    //container div with table set up
    var html = '<div class="ui container"><table class="ui celled table"><thead><tr>';
    //headers, but add vars, for dates
    html += '<th>Employee Name</th>';
    for (var i = 0; i < response.dates.length; i++) {
        html += '<th>'+ response.dates[i] + '</th>';
    }
    html += '<th>Total</th>';
    //end headers
    html += '</tr></thead><tbody>';
    //start with the row headers
    for (var i = 0; i < response.data.length; i++) {
        var name = response.data[i].employee.firstName + ' ' + response.data[i].employee.lastName;
        html += '<tr><td><div>' + name + '</div></td>';
        var totalTime = 0;
        for (var j = 0; j < response.dates.length; j++) {
            var day = hoursMinutes(response.data[i].hours.allDates[response.dates[j]]);
            totalTime += response.data[i].hours.allDates[response.dates[j]];
            html += '<td>' + day + '</td>';
        }
        html += '<td>' + hoursMinutes(totalTime) + '</td>';
    }
    // then add the cell items, which will be the hours worked for each day
    // end the table
    html += '</tr></tbody></table></div>';
    return html;
}

function hoursMinutes(milliseconds) {
    var secondsTrimmed = (milliseconds -milliseconds%(1000))/1000;
    var seconds = secondsTrimmed%(60);
    var totalMinutes = (secondsTrimmed-seconds)/(60);
    var minutesRemainder = totalMinutes%60;
    var minutes = totalMinutes - minutesRemainder;
    var hours = (totalMinutes - minutesRemainder)/60;
    return hours + ":" + minutesRemainder;
    //return hours + " hours " + minutesRemainder + " minutes";
}


