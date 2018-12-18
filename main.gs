/**
 * @fileoverview Connector for Jira cloud plataform. Analyze the issues of a JQL
 *
 */

/** define namespace */
var connector = connector || {};

/** @const */
connector.defaultPackage = 'googleapis';

/** @const dictionary for fields */
var fieldsDictionary = {
  'keys' : 'key',
  'summary': 'summary',
  'issuetype': 'issuetype',
  'creator': 'creator',
  'assignee': 'assignee',
  'reporter': 'reporter',
  'priority': 'priority',
  'status': 'status',
  'statusName': 'status',
  'created': 'created',
  'duedate': 'duedate',
  'resolutiondate': 'resolutiondate',
  'component': 'components',
  'label': 'labels',
  'epic': '',
  'project': 'project',
  'satisfaction': 'customfield_10204',
  'timespent': 'aggregatetimespent',
  'issues': '',
  'timeFirstResponse': 'customfield_10208',
  'breachedFirstResponse': 'customfield_10208',
  'timeResolution': 'customfield_10207',
  'breachedtimeResolution': 'customfield_10207',
  'changeSatartDate': 'customfield_10214',
  'changeCompletionDate': 'customfield_10215',
  'createdDayOfWeek': 'created',
  'createdHour': 'created',
  'resolutiondateDayOfWeek': 'resolutiondate',
  'resolutiondateHour': 'resolutiondate'
}

/**
 * Returns the authentication method required by the connector to authorize the
 * third-party service.
 *
 * @returns {Object} `AuthType` used by the connector.
 */
function getAuthType() {
  return { type: 'NONE' };
}

/**
 * Returns the user configurable options for the connector.
 *
 * @param {Object} request Config request parameters.
 * @returns {Object} Connector configuration to be displayed to the user.
 */
function getConfig() {
  var cc = DataStudioApp.createCommunityConnector();
  var config = cc.getConfig();

  config.newInfo()
    .setId('Auth')
    .setText('Enter your credentials for the REST API of Jira Cloud Plataform');

  config.newTextInput()
    .setId('User')
    .setName('User')
    .setPlaceholder('e.g. email@domain.com')
    .setHelpText('The user must have permissions to see the project');

  config.newTextInput()
    .setId('Token')
    .setName('API Token')
    .setHelpText('Go to API tokens in manage your account in Jira');
  
  config.newTextInput()
    .setId('Subdomain')
    .setName('Subdomain Jira Cloud')
    .setHelpText('https:// + subdomain + .atlassian.net');

  config.newInfo()
    .setId('Filter')
    .setText('Master filter to define projects');

  config.newTextInput()
    .setId('JQL')
    .setName('Jira Query Language (JQL)')
    .setPlaceholder('project = NAME');

  config.newInfo()
    .setId('moreInfo')
    .setText('For more information consult https://github.com/AlchimiaMx/jira-connectors/tree/master#readme')

  config.setDateRangeRequired(true);

  return config.build();
}

/**
 * Returns the fields for the connector.
 *
 * @returns {Object} The fields for the connector.
 */
function getFields() {
  var cc = DataStudioApp.createCommunityConnector();
  var fields = cc.getFields();
  var types = cc.FieldType;
  var aggregations = cc.AggregationType;

  fields.newDimension()
    .setId('keys')
    .setName('Keys')
    .setType(types.TEXT);

  fields.newDimension()
    .setId('summary')
    .setName('Summary')
    .setType(types.TEXT);

  fields.newDimension()
    .setId('issuetype')
    .setName('Issuetype')
    .setType(types.TEXT);

  fields.newDimension()
    .setId('creator')
    .setName('Creator')
    .setType(types.TEXT);
  
  fields.newDimension()
    .setId('assignee')
    .setName('Assignee')
    .setType(types.TEXT);

  fields.newDimension()
    .setId('reporter')
    .setName('Reporter')
    .setType(types.TEXT);
  
  fields.newDimension()
    .setId('priority')
    .setName('Priority')
    .setType(types.TEXT);

  fields.newDimension()
    .setId('status')
    .setName('Status')
    .setType(types.TEXT);
  
  fields.newDimension()
    .setId('statusName')
    .setName('Status Name')
    .setType(types.TEXT);
  
  fields.newDimension()
    .setId('created')
    .setName('Created')
    .setType(types.YEAR_MONTH_DAY);
  
  fields.newDimension()
    .setId('createdDayOfWeek')
    .setName('Created (day of week)')
    .setType(types.DAY_OF_WEEK);
  
  fields.newDimension()
    .setId('createdHour')
    .setName('Created (hour)')
    .setType(types.HOUR);
  
  fields.newDimension()
    .setId('duedate')
    .setName('Due Date')
    .setType(types.YEAR_MONTH_DAY);
  
  fields.newDimension()
    .setId('resolutiondate')
    .setName('Resolution Date')
    .setType(types.YEAR_MONTH_DAY);
  
  fields.newDimension()
    .setId('resolutiondateDayOfWeek')
    .setName('Resolution Date (day of week)')
    .setType(types.DAY_OF_WEEK);
  
  fields.newDimension()
    .setId('resolutiondateHour')
    .setName('Resolution Date (hour)')
    .setType(types.HOUR);
  

  fields.newDimension()
    .setId('changeSatartDate')
    .setName('Change Start Date')
    .setType(types.YEAR_MONTH_DAY);

  fields.newDimension()
    .setId('changeCompletionDate')
    .setName('Change Completion Date')
    .setType(types.YEAR_MONTH_DAY);

  fields.newDimension()
    .setId('component')
    .setName('Component')
    .setType(types.TEXT);

  fields.newDimension()
    .setId('label')
    .setName('Label')
    .setType(types.TEXT);

  // fields.newDimension()
  //   .setId('epic')
  //   .setName('Epic')
  //   .setType(types.TEXT);
  
  fields.newDimension()
    .setId('project')
    .setName('Project')
    .setType(types.TEXT);

  fields.newMetric()
    .setId('satisfaction')
    .setName('Satisfaction')
    .setType(types.NUMBER)
    .setAggregation(aggregations.AVG);

  fields.newMetric()
    .setId('timespent')
    .setName('Time Spent (s)')
    .setType(types.DURATION)
    .setAggregation(aggregations.SUM);

  fields.newMetric()
    .setId('timeFirstResponse')
    .setName('Time to First Response (s)')
    .setType(types.DURATION)
    .setAggregation(aggregations.AVG);

  fields.newMetric()
    .setId('timeResolution')
    .setName('Time to Resolution (s)')
    .setType(types.DURATION)
    .setAggregation(aggregations.AVG);

  fields.newDimension()
    .setId('breachedFirstResponse')
    .setName('Breached First Response')
    .setType(types.BOOLEAN);

  fields.newDimension()
    .setId('breachedtimeResolution')
    .setName('Breached Time Resolution')
    .setType(types.BOOLEAN);

  fields.newMetric()
    .setId('issues')
    .setName('Issues')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  return fields;
}

/**
 * Returns the schema for the given request.
 *
 * @param {Object} request Schema request parameters.
 * @returns {Object} Schema for the given request.
 */
function getSchema(request) {
  return { schema: getFields().build() };
}

/**
 * Returns Date format according to the Time Zone Script
 *
 * @param {String} date date in UTC
 * @param {String} format desired date format
 * @returns {String} date in new format
 */
function formatTypeDate(data, format) {
  var result = Utilities.formatDate(new Date(data), Session.getScriptTimeZone(), format || "yyyyMMdd")
  return ( format == 'u' && result == '7' ) ? '0': result
}

/**
 * Formats a single row of data into the required format.
 *
 * @param {Object} requestedFields Fields requested in the getData request.
 * @param {Object} response Contains the response data for jira cloud.
 * @returns {Array} Rows values for requested fields in predefined format.
 */
function responseToRows(requestedFields, issues) {
  return issues.map(function(issue) {
    var row = [];
    requestedFields.asArray().forEach(function (field) {
      switch (field.getId()) {
        case 'keys':
          row.push(issue.key || undefined);
          break;
        case 'summary':
          row.push(issue.fields.summary || undefined);
          break;
        case 'issuetype':
          row.push(issue.fields.issuetype? issue.fields.issuetype.name : undefined);
          break;
        case 'creator':
          row.push(issue.fields.creator? issue.fields.creator.displayName : undefined);
          break;
        case 'assignee':
          row.push(issue.fields.assignee? issue.fields.assignee.displayName : undefined);
          break;
        case 'reporter':
          row.push(issue.fields.reporter? issue.fields.reporter.displayName : undefined);
          break;
        case 'priority':
          row.push(issue.fields.priority? issue.fields.priority.name : undefined);
          break;
        case 'status':
          row.push(issue.fields.status? issue.fields.status.statusCategory.name : undefined);
          break;
        case 'statusName':
          row.push(issue.fields.status? issue.fields.status.name : undefined);
          break;
        case 'created':
          row.push(issue.fields.created? formatTypeDate(issue.fields.created) : undefined);
          break;
        case 'createdDayOfWeek':
          row.push(issue.fields.created? formatTypeDate(issue.fields.created, 'u') : undefined);
          break;
        case 'createdHour':
          row.push(issue.fields.created? formatTypeDate(issue.fields.created, 'HH') : undefined);
          break;
        case 'duedate':
          row.push(issue.fields.duedate? formatTypeDate(issue.fields.duedate) : undefined);
          break;
        case 'resolutiondate':
          row.push(issue.fields.resolutiondate? formatTypeDate(issue.fields.resolutiondate) : undefined);
          break;
        case 'resolutiondateDayOfWeek':
          row.push(issue.fields.resolutiondate? formatTypeDate(issue.fields.resolutiondate, 'u') : undefined);
          break;
        case 'resolutiondateHour':
          row.push(issue.fields.resolutiondate? formatTypeDate(issue.fields.resolutiondate, 'HH') : undefined);
          break;
        case 'component':
          row.push(issue.fields.components[0]? issue.fields.components[0].name: '');
          break;
        case 'label':
          row.push(issue.fields.labels[0]? issue.fields.labels[0]: '');
          break;
        // case 'epic':
        //   row.push(issue.fields.labels[0]? issue.fields.labels[0]: '');
        //   break;
        case 'project':
          row.push(issue.fields.project? issue.fields.project.key : undefined);
          break;
        case 'satisfaction':
          row.push(issue.fields.customfield_10204? issue.fields.customfield_10204.rating : undefined);
          break;
        case 'timespent':
          row.push(issue.fields.aggregatetimespent? issue.fields.aggregatetimespent + '': undefined);
          break;
        case 'issues':
          row.push(1);
          break;
        case 'timeFirstResponse':
          row.push(issue.fields.customfield_10208? issue.fields.customfield_10208.completedCycles[0]?  (Math.round(issue.fields.customfield_10208.completedCycles[0].elapsedTime.millis/1000)) +'': undefined: undefined );
          break;
        case 'breachedFirstResponse':
          row.push(issue.fields.customfield_10208? issue.fields.customfield_10208.completedCycles[0]?  issue.fields.customfield_10208.completedCycles[0].breached: undefined: undefined );
          break;
        case 'timeResolution':
          row.push(issue.fields.customfield_10207? issue.fields.customfield_10207.completedCycles[0]?  (Math.round(issue.fields.customfield_10207.completedCycles[0].elapsedTime.millis/1000)) +'' : undefined: undefined );
          break;
        case 'changeSatartDate':
          row.push(issue.fields.customfield_10214? formatTypeDate(issue.fields.customfield_10214): undefined);
          break;
        case 'changeCompletionDate':
          row.push(issue.fields.customfield_10215? formatTypeDate(issue.fields.customfield_10215): undefined);
          break;
        case 'breachedtimeResolution':
          row.push(issue.fields.customfield_10207? issue.fields.customfield_10207.completedCycles[0]?  issue.fields.customfield_10207.completedCycles[0].breached: undefined: undefined );
          break;
        default:
          row.push('');
      }
    });
    return { values: row };
  });
}

/**
 * iterates to evade the query limit
 *
 * @param {Array} fieldsToRequest array of fields for consultation 
 * @param {Object} configParams config request parameters
 * @param {Number} startIssues start of issues to consult
 * @param {Array} accumulated cumulative issues of the query
 * @returns {Array} accumulated all issues of the query
 */
function getFullIssuesByAPI(fieldsToRequest, request, startIssues, accumulated){
  var maxResults = 100;
  var data = {
    'jql': 'created >= "' + request.dateRange.startDate + '" AND created <= "' + request.dateRange.endDate + ' 23:59" AND ' + request.configParams.JQL,
    'maxResults': maxResults,
    'startAt': startIssues,
    'fields': fieldsToRequest
  };
  var auth = Utilities.base64Encode(request.configParams.User + ':' + request.configParams.Token);
  var opts = {
    'method': 'post',
    'contentType': 'application/json',
    'headers': {
      'Accept': 'application/json',
      'Authorization': 'Basic ' + auth,
      'cache-control': 'no-cache'
    },
    'payload': JSON.stringify(data),
    'muteHttpExceptions': true
  };
  var url = 'https://' + request.configParams.Subdomain + '.atlassian.net/rest/api/2/search';

  try {
    var response = UrlFetchApp.fetch(url, opts);
    var parsedResponse = JSON.parse(response);
    accumulated = accumulated.concat(parsedResponse.issues);
    if (parsedResponse.total - (startIssues + maxResults) > 0 ){
      return getFullIssuesByAPI(fieldsToRequest, request, startIssues + maxResults, accumulated );
    } else {
      return accumulated;
    }
  } catch (e) {
    connector.throwError(e, true);
  }
}

/**
 * Returns the tabular data for the given request.
 *
 * @param {Object} request Data request parameters.
 * @returns {Object} Contains the schema and data for the given request.
 */
function getData(request) {
  var requestedFieldIds = request.fields.map(function(field) {
    return field.name;
  });
  var requestedFields = getFields().forIds(requestedFieldIds);
  var fieldsToRequest = []
  requestedFields.asArray().forEach(function (field) {
    if ( fieldsToRequest.indexOf( fieldsDictionary[field.getId()] == -1 ) ) {
      fieldsToRequest.push(fieldsDictionary[field.getId()])
    }
  })

  try {
    var responseFullIssues = getFullIssuesByAPI(fieldsToRequest, request, 0, []);
  } catch (e) {
    connector.throwError(e, true);
  }

  try{
    var rows = responseToRows(requestedFields, responseFullIssues);
  } catch (e) {
    connector.throwError(e, true);
  }

  return {
    schema: requestedFields.build(),
    rows: rows
  };
}

function isAdminUser() {
  return true;
}

connector.throwError = function(message, userSafe) {
  console.log(message)
  if (userSafe) {
    message = 'DS_USER:' + message;
  }
  throw new Error(message);
};
