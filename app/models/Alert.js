var http        = require('http'),
	parseString = require('xml2js').parseString,
	alertKeys   = require('../resources/alertKeys');

//Attributes
function Alert(callback) {
	this.id      = null;
	this.host    = 'vigilance.meteofrance.com';
	this.path    = '/data/NXFR49_LFPW_.xml?9327548';

	this.init(callback);
};
//Non-statics methods
Alert.prototype = {
	init: function(callback)
	{
		this.getInfos(callback);
	},
	getInfos: function(callback)
	{
		var object   = this,
			response = '';

		var req = http.request({
			host  : object.host,
			port  : 80,
			path  : object.path,
			method: 'GET',
		}, function(res) {
			console.log(`STATUS: ${res.statusCode}`);
			console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

			res.setEncoding('utf8');

			res.on('data', (chunk) => {
				response = response + chunk;
			});
			res.on('end', () => {
				parseString(response, function (err, result) {
					var datas = result['SIV_MENHIR']['PHENOMENE'],
						list  = [];

					Object.keys(datas).map(function(key, index) {
						if (datas[key]['$']['departement'] == 44 && datas[key]['$']['couleur'] > 1) {
							var risk = {
								departement   : alertKeys.depts[datas[key]['$']['departement']],
								phenomenon    : alertKeys.risks[parseInt(datas[key]['$']['phenomene'])],
								couleur       : alertKeys.colors[datas[key]['$']['couleur']],
								dateDebutEvtTU: datas[key]['$']['dateDebutEvtTU'],
								dateFinEvtTU  : datas[key]['$']['dateFinEvtTU']
							};

							list.push(risk);
						}
					});

					callback(list);
				});
			});
		});

		req.on('error', (e) => {
			console.log(`problem with request: ${e.message}`);
		});

		req.end();
	},
};
//Statics methods
Alert.getAlert = function(callback)
{
	var warning = new Alert(callback);
};

module.exports = Alert;

