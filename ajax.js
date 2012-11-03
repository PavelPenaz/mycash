/**
 * @author I077445
 */

///<reference path="C:\Users\ppenaz\SourceSafe\SkynaxLocation-WebApp\Scripts\jquery-1.7.1-vsdoc.js" />

// Global configurable properties
var url = '/Skynax-WebService/SkynaxWebServiceJSON.asmx';   // Defines the URL of the Location Web Service (JSON)
var timer1;

function fusion() {
    var query = "SELECT * FROM " +
        '1pmTuw99m025LhvYdRxZGt4ZRy58FdFcEWaJoAzU';
    var encodedQuery = encodeURIComponent(query);

    // Construct the URL
    var url = ['https://www.googleapis.com/fusiontables/v1/query'];
    url.push('?sql=' + encodedQuery);
    url.push('&key=AIzaSyAm9yWCV7JPCTHCJut8whOjARd7pwROFDQ');
    url.push('&callback=?');

    // Send the JSONP request using jQuery
    $.ajax({
      url: url.join(''),
      dataType: 'jsonp',
      success: function (data) {
        var rows = data['rows'];
        var ftData = document.getElementById('ft-data');
        for (var i in rows) {
          var store = rows[i][0];
          var address = rows[i][1];
          var delivers = rows[i][2];
          var dataElement = document.createElement('div');
          var storeElement = document.createElement('p');
          storeElement.innerHTML = store;
          storeElement.className = 'store-name';
          var addressElement = document.createElement('p');
          addressElement.innerHTML = address;
          addressElement.className = 'address';
          var deliversElement = document.createElement('p');
          deliversElement.innerHTML = 'Delivers? ' + delivers;
          deliversElement.className = 'delivers';

          dataElement.appendChild(storeElement);
          dataElement.appendChild(addressElement);
          dataElement.appendChild(deliversElement);
          ftData.appendChild(dataElement);
        }
      }
    });
  }



function InitInterval() {
    var Seconds = 5;
    if (Seconds > 0) {
        clearTimeout(timer1);
        timer1 = window.setTimeout('Update()', Seconds * 1000);
    }
    else {
        clearTimeout(timer1);
    }
}

function GetLocations(MinDate, MaxDate, MinDatabaseID) {
    jQuery('#progressDialog').show();
    var options = {
        type: "POST",
        url: url + "/GetLocationByTimeRange",
        data: "{'MinDateTime': '" + ConvertDateToDateTime(MinDateTime) + "', 'MaxDateTime': '" + ConvertDateToDateTime(MaxDateTime) + "', 'minDatabaseID': " + MinDatabaseID + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            UpdateLocations(response.d);
            jQuery('#progressDialog').hide();
            jQuery("#Error").hide();
            InitInterval();
            WSCurrentRetryCount = 0;
        },

        error: function (response) {
            if (WSCurrentRetryCount < WSRetriesOnFail) {
                Update();
                WSCurrentRetryCount++;
            }
            else {
                jQuery('#progressDialog').hide();
                jQuery("#Error").show();
                $("#Error").show();
                $("#Error").text("Sorry, the update failed. \n\n Details follow: " + response.responseText);
                InitInterval();
                WSCurrentRetryCount = 0;
            }
        }
    };
    jQuery.ajax(options);
}

function GenerateLabels() {
    if (SystemCode == "") {
        $("#heading").text("Last known position of all System Codes");
        $("#Label17").text("Click any System Code below to show its location history.");
    }
    else {
        $("#heading").text("Skynax Location history for System Code: " + SystemCode);
        $("#Label17").text("Click or select multiple records to show the selected location history records.");
    }
}


function Initialize() {
	fusion();
}


$("#Button1").click(function () {
    Update();
});

$("#Button2").click(function () {
    SystemCode = "";
    GenerateLabels();
    Redraw();
    //    window.open('Default.aspx', '_self', false);
});

$("#Button3").click(function () {
    Redraw();
});

$("#DropDownList1").change(function () {
    Update();
});

$("#DropDownList2").change(function () {
    Redraw();
});


