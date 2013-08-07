function showDocsPicker() {
  var app = UiApp.getActiveApplication();
  var panel = app.getElementById("panel");
  var spinner = app.getElementById("dialogspinner");
  var docsPicker = app.createDocsListDialog().addView(UiApp.FileType.DOCUMENTS).showDocsPicker();
  docsPicker.setHeight(200);
  var spinnerHandler = app.createClientHandler().forTargets(spinner).setVisible(true).forTargets(panel).setStyleAttribute('opacity', '0.5');
  var selectionHandler = app.createServerHandler('saveDocID');
  docsPicker.addSelectionHandler(selectionHandler).addSelectionHandler(spinnerHandler);
  return app;
}

function saveDocID(e){
    var app = UiApp.getActiveApplication();
    var theUrl = app.getElementById("theUrl");
    var doc = DocsList.getFileById(e.parameter.items[0].id);
    var fileUrl = doc.getUrl();
    theUrl.setValue(fileUrl);
    return app;
}

function doGet(e) {
  var page = SitesApp.getActivePage();
  if (page) {
    var pageUrl = page.getUrl();
  } else {
    pageUrl = "standalone";
  }
  // get all of the user calendars
  var calendars = CalendarApp.getAllCalendars();
  
  // create the UI app to access the calendars
  var app = UiApp.createApplication().setTitle("Add assignment to calendars");
  app.setStyleAttribute("padding", "10px");

  //var popUpPanel = app.createPopupPanel();
  var tabPanel = app.createTabPanel();
  tabPanel.setId("theForm");
  
  var dialogPanel = app.createFlowPanel();
  dialogPanel.setStyleAttribute("overflow", "scroll");
  dialogPanel.setStyleAttribute("width", "460px");
  dialogPanel.setStyleAttribute("height", "440px");
  
  var settingsPanel = app.createFlowPanel();
  settingsPanel.setStyleAttribute("overflow", "scroll");
  settingsPanel.setStyleAttribute("width", "460px");
  settingsPanel.setStyleAttribute("height", "440px");

  // add an invisible spinner to the page
  var spinner = app.createImage('https://5079980847011989849-a-1802744773732722657-s-sites.googlegroups.com/site/scriptsexamples/ProgressSpinner.gif');
  spinner.setStyleAttribute("opacity", "0");
  spinner.setStyleAttribute("position", "absolute");
  spinner.setStyleAttribute("top", "220px");
  spinner.setStyleAttribute("left", "220px");
  spinner.setId("dialogspinner");
  
  dialogPanel.add(spinner);
  
  var spinner = app.createImage('https://5079980847011989849-a-1802744773732722657-s-sites.googlegroups.com/site/scriptsexamples/ProgressSpinner.gif');
  spinner.setStyleAttribute("opacity", "0");
  spinner.setStyleAttribute("position", "absolute");
  spinner.setStyleAttribute("top", "220px");
  spinner.setStyleAttribute("left", "220px");
  spinner.setId("settingsspinner");
  
  settingsPanel.add(spinner);
  
  
  var helpLabel = app.createLabel("Enter the name of the assignment.");
  dialogPanel.add(helpLabel);
  
  var eventName = app.createTextBox();
  eventName.setStyleAttribute("width", "400px").setId("eventname").setName("eventname");
  dialogPanel.add(eventName);
  
  var helpLabel = app.createLabel("Enter a description of the assignment.");
  helpLabel.setId("firstLabel");
  dialogPanel.add(helpLabel);
  
  var eventDescription = app.createTextArea();
  eventDescription.setName("eventdescription");
  eventDescription.setId("eventdescription");
  eventDescription.setStyleAttribute("width", "400px");
  eventDescription.setStyleAttribute("height", "40px");
  dialogPanel.add(eventDescription);
  
  var helpLabel = app.createLabel("Enter the date of the assignment.");
  dialogPanel.add(helpLabel);
  
  var eventDate = app.createDateBox();
  //eventDate.setName("eventdate");
  eventDate.setId("eventdate");

  
  var tBoxHandler = app.createServerChangeHandler("setAllDatesInUI");
  tBoxHandler.addCallbackElement(dialogPanel);
  eventDate.addValueChangeHandler(tBoxHandler);
  dialogPanel.add(eventDate);
  
  var browseHandler = app.createServerHandler('showDocsPicker');
  var docsListButton = app.createButton("Browse my Drive").addClickHandler(browseHandler);
  
  var helpLabel = app.createLabel("Insert a link to a Google Doc to include with this assignment (optional)."); 
  dialogPanel.add(helpLabel);
  var docInsert = app.createTextBox().setId("theUrl").setName("theUrl");
  dialogPanel.add(docInsert);
  dialogPanel.add(docsListButton);
  
  var helpLabel = app.createLabel("Choose the calendars to which this assignment will be added."); 
  dialogPanel.add(helpLabel);
  
  var ssLabel = app.createLabel("Insert the Key for the spreadsheet in which you want to log assignments for this class.");
  var ssIdBox = app.createTextBox().setName("SSId").setId("SSId");
  var ssKey = UserProperties.getProperty(pageUrl+'-ssKey');
  if (ssKey) {
    ssIdBox.setValue(ssKey);
  }
  settingsPanel.add(ssLabel);
  settingsPanel.add(ssIdBox);
  
  var helpLabel = app.createLabel("Choose your default calendars. This setting will show up the next time you reload this page."); 
  settingsPanel.add(helpLabel);
  
 
  
  // keep track of the number of calendars
  var numCalendars = calendars.length;
  UserProperties.setProperty(pageUrl+"-numCalendars", numCalendars);
  
  var count = 0;
  
  var calendarSettings = UserProperties.getProperty(pageUrl+"-chosenCalendars");
  
  var o = false;
  
  if (calendarSettings) {
    var o = Utilities.jsonParse(calendarSettings);
  }
  
  if (o) {
    // if the default calendars are set, loop through them
    for (var i in o) {
      if (o[i]) {
        var calendar = calendars[i];
        var container = app.createHorizontalPanel();
    
        // use the user assigned color for the calendar
        //var Label = app.createSimplePanel();
        //Label.setStyleAttribute("background-color", o[i].color);
        //Label.setStyleAttribute("width", "12px");
        //Label.setStyleAttribute("height", "12px");
        //Label.setStyleAttribute("padding-bottom", "5px");
        //Label.setStyleAttribute("display", "inline-block");
        //container.add(Label);
    
        var eventDate = app.createDateBox();
        eventDate.setStyleAttribute("width", "70px");
        eventDate.setStyleAttribute("height", "20px");
        eventDate.setStyleAttribute("margin-left", "5px");
        eventDate.setId("eventdate-" + count);
        container.add(eventDate);
        
        var CheckBox = app.createCheckBox();
        CheckBox.setName("checkbox-" + count);
        CheckBox.setId("checkbox-" + count);
        CheckBox.setStyleAttribute("display", "inline-block");
        CheckBox.setText(o[i].name);
        container.add(CheckBox);
        
        dialogPanel.add(container);
      }
      
      count++;
    }
  } else {
    
    // otherwise loop through the other calendars
    for (var i in calendars) {
    
      var calendar = calendars[i];
      var container = app.createHorizontalPanel();
    
      // use the user assigned color for the calendar
      //var Label = app.createSimplePanel();
      //Label.setStyleAttribute("background-color", calendar.getColor());
      //Label.setStyleAttribute("width", "12px");
      //Label.setStyleAttribute("height", "12px");
      //Label.setStyleAttribute("padding-bottom", "5px");
      //Label.setStyleAttribute("display", "inline-block");
      //container.add(Label);
    
      var eventDate = app.createDateBox();
      eventDate.setStyleAttribute("width", "70px");
      eventDate.setStyleAttribute("height", "20px");
      eventDate.setStyleAttribute("margin-left", "5px");
      eventDate.setId("eventdate-" + count);
      container.add(eventDate);
        
      var CheckBox = app.createCheckBox();
      CheckBox.setName("checkbox-" + count);
      CheckBox.setId("checkbox-" + count);
      CheckBox.setStyleAttribute("display", "inline-block");
      CheckBox.setText(calendar.getName());
      container.add(CheckBox);
      
      dialogPanel.add(container);
    
      count++;
    }
  }
  
  var count = 0;
  // create the settings page
  for (var i in calendars) {
    var calendar = calendars[i];
    var container = app.createHorizontalPanel();
    
    //var Label = app.createSimplePanel();
    //Label.setStyleAttribute("background-color", calendar.getColor());
    //Label.setStyleAttribute("width", "12px");
    //Label.setStyleAttribute("height", "12px");
    //Label.setStyleAttribute("padding-bottom", "5px");
    //Label.setStyleAttribute("display", "inline-block");
    //container.add(Label);
                       
    // add the checkbox
    var CheckBox = app.createCheckBox();
    CheckBox.setName("settingscheckbox-" + count);
    CheckBox.setId("settingscheckbox-" + count);
    CheckBox.setStyleAttribute("display", "inline-block");
    CheckBox.setText(calendar.getName());
    
    if (o && o[i]) {
      CheckBox.setValue(true);
    }
    
    container.add(CheckBox);
    
    settingsPanel.add(container);
    
    count++;
  }

  
  
  // add the submit button
  var sendHandler = app.createServerClickHandler("saveData");
  var mousedownHandler = app.createServerMouseHandler("showDialogSpinner");
  var sendButton = app.createButton("Save assignment", sendHandler);
  sendButton.addMouseUpHandler(mousedownHandler);
  
  dialogPanel.add(sendButton);
  
  // make sure the save data function goes to the right handler
  sendHandler.addCallbackElement(dialogPanel);
  
  // add the submit button
  var sendHandler = app.createServerClickHandler("saveSettings");
  var mousedownHandler = app.createServerMouseHandler("showSettingsSpinner");
  var sendButton = app.createButton("Save settings", sendHandler);
  sendButton.addMouseUpHandler(mousedownHandler);
  settingsPanel.add(sendButton);
  
  // make sure the save data function goes to the right handler
  sendHandler.addCallbackElement(settingsPanel);
  
  tabPanel.add(dialogPanel, "Add assignment");
  tabPanel.add(settingsPanel, "Settings");
  
  tabPanel.selectTab(0);
  
  app.add(tabPanel);
  
  return app;
}

function showDialogSpinner(e) {
  var app = UiApp.getActiveApplication();
  
  app.getElementById("dialogspinner").setStyleAttribute("opacity", "1");
  
  return app;
}

function showSettingsSpinner(e) {
  var app = UiApp.getActiveApplication();
  
  app.getElementById("settingsspinner").setStyleAttribute("opacity", "1");
  
  return app;
}

function saveSettings(e) {
  var app = UiApp.getActiveApplication();
  var page = SitesApp.getActivePage();
  if (page) {
    var pageUrl = SitesApp.getActivePage().getUrl();
  } else {
    pageUrl = "standalone";
  }
  var calendars = CalendarApp.getAllCalendars();
  UserProperties.setProperty(pageUrl+"-ssKey", e.parameter.SSId);
  
  // this is just so we know how many calendars to examine
  var count = UserProperties.getProperty(pageUrl+"-numCalendars")*1;
  
  var numEvents = 0;
  
  var o = new Array();
  
  // loop through all of the calendars
  for (var i = 0; i < count; i++) {
      
    // make sure the calender has been chosen and the event has a date associated with it
    if (e.parameter["settingscheckbox-" + i] == "true") {
      o[i] = {color: calendars[i].getColor(), name: calendars[i].getName()};
    } else {
      o[i] = false; 
    }
  }
  
  // store the user defined calendars
  UserProperties.setProperty(pageUrl+"-chosenCalendars", Utilities.jsonStringify(o));
  
  app.getElementById("settingsspinner").setStyleAttribute("opacity", "0");
  
  return app;
}



function setAllDatesInUI(e) {
  var app = UiApp.getActiveApplication();
    var page = SitesApp.getActivePage();
  if (page) {
    var pageUrl = page.getUrl();
  } else {
    pageUrl = "standalone";
  }
  var date = e.parameter.eventdate;
  var count = UserProperties.getProperty(pageUrl+"-numCalendars")*1;
  
  var calendarSettings = UserProperties.getProperty(pageUrl+"-chosenCalendars");
  
  var o = false;
  
  if (calendarSettings) {
    var o = Utilities.jsonParse(calendarSettings);
  }
  
  for (var i = 0; i < count; i++) {
    
    if (o && o[i]) {
      var dateElement = app.getElementById('eventdate-' + i);
      if (dateElement) {
        dateElement.setValue(date);
      }
    }
  }
  
  return app;
}

function saveData(e) {
  var app = UiApp.getActiveApplication();
  var page = SitesApp.getActivePage();
  if (page) {
    var pageUrl = page.getUrl();
  } else {
    pageUrl = "standalone";
  }
  var calendars = CalendarApp.getAllCalendars();
  var count = UserProperties.getProperty(pageUrl+"-numCalendars")*1;
  
  var numEvents = 0;
  
  // don't bother saving any information if the name of the event isn't set
  if (e.parameter["eventname"]) {
    var calendarNames = [];
    var dueDates = [];
    // loop through the calendars
    for (var i = 0; i < count; i++) {
      
      // make sure the calender has been chosen and the event has a date associated with it
      if (e.parameter["checkbox-" + i] && e.parameter["checkbox-" + i] == "true" && (e.parameter["eventdate-" + i] || e.parameter["eventdate"])) {
        
        // skip making the event for calendars the user can't add to
        if (!calendars[i].isOwnedByMe()) {
          continue;
        }
        
        // check to see if the dates entered are the same, if not, use the "local" date
        if (e.parameter["eventdate-" + i] == e.parameter["eventdate"]) {
          var date = e.parameter["eventdate"];
        } else {
          var date = e.parameter["eventdate-" + i];
        }
        
        // now make sure date is actually a date
        var eventDate = new Date(date);
        if (eventDate.getDate()) {
          // add the event to this calendar
          var theUrl = e.parameter.theUrl;
          var assignment = ""
          
          if (theUrl) {
            var payload = Utilities.jsonStringify({'longUrl': theUrl, 'key' : 'AIzaSyD3D1T92js61_y1pspP6rGRHXdVJY3WV_Y' });

            var urloptions = {
              'method' : 'post',
              'contentType' : 'application/json',
              'payload' : payload
            };
            
            var result = UrlFetchApp.fetch("https://www.googleapis.com/urlshortener/v1/url", urloptions);
            var o  = Utilities.jsonParse(result.getContentText());
            var link = '<a href="' + o.id + '">' + o.id + '</a>';
            
            assignment = "\n" + "Assignment: " + link;
          }
          
          
          var options = {
            "description" : e.parameter["eventdescription"] + assignment
          };
              
          var event = calendars[i].createAllDayEvent(e.parameter["eventname"], eventDate, options);
          calendarNames.push(calendars[i].getName());
          dueDates.push(eventDate);
          numEvents++;
        }
      }
    }
    var ssKey = UserProperties.getProperty(pageUrl+'-ssKey');
    var ss = SpreadsheetApp.openById(ssKey);
    var sheet = ss.getSheets()[0];
    sheet.getRange(1, 1, 1, 3).setValues([['Assignment Title','Description','Resource Url']]);
    sheet.getRange(sheet.getLastRow()+1, 1, 1, 3).setValues([[e.parameter.eventname,e.parameter.eventdescription,e.parameter.theUrl]]);
    var headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
    for (var i=0; i<calendarNames.length; i++) {
      for (var j=0; j<headers.length; j++) {
        if (headers.indexOf(calendarNames[i])==-1) {
          sheet.insertColumnAfter(sheet.getLastColumn());
          sheet.getRange(1, sheet.getLastColumn()+1).setValue(calendarNames[i]);
        }
      var headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
      sheet.getRange(sheet.getLastRow(), headers.indexOf(calendarNames[i])+1).setValue(dueDates[i]).setNumberFormat("MM/dd/yy"); 
      }
    } 
  }
  
  // inform users of the events
  if (numEvents > 0) {
    app.getElementById('theForm').setVisible(false);
    
    if (numEvents == 1) {
      var resultLabel = app.createLabel().setText("You added an assignment to 1 calendar. Refresh your Google calendar to see assignments.");
    } else {
      var resultLabel = app.createLabel().setText("You added an assignment to " + numEvents + " calendars. Refresh this page to see assignments in calendars.");
    }
  }
  // let them know that there was an error
  else {
    var resultLabel = app.createLabel().setText("There was an error of some sort.");
  }
  
// add the submit button
  var sendHandler = app.createServerClickHandler("resetForm");  
  var button = app.createButton("Add another assignment", sendHandler);
  
  var panel = app.createFlowPanel();
  panel.add(button);
  panel.add(resultLabel);
  panel.setStyleAttribute('width', '500px');
  panel.setStyleAttribute('height', '500px');
  panel.setStyleAttribute('position', 'absolute');
  panel.setStyleAttribute('background-color', 'white');
  panel.setStyleAttribute('z-index', '10');
  panel.setStyleAttribute('top', '0px');
  panel.setStyleAttribute('left', '0px');
  panel.setId("calendarPanel");
  
  app.getElementById("dialogspinner").setStyleAttribute("opacity", "0");

  app.add(panel);
  
  return app;
}

function resetForm() {
  var app = UiApp.getActiveApplication();
  app.getElementById("calendarPanel").setVisible(false);
  app.getElementById('theForm').setVisible(true);
  
  return app;
}

function getUser() {
  var currentUser = Session.getActiveUser();
  return currentUser;
  }
