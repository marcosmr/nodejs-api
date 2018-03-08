function get(config, errors, logger)
{
	var component = {};

	var apikey = config.apikey;
	var accountId = config.accountId;
	var isProduction = config.production;
	var currency = config.currency;

	var values = {
		cobro: {
			comision_transferencia: 8.0,
			comision_cobro: 2.5,
			porcentaje_gateway: 2.9,
			iva: 16.0
		}
	}


	if(!apikey)
	{
		logger.error("openpay api key not found");
		process.exit(1);
	}

	if(!accountId)
	{
		logger.error("openpay account id not found");
		process.exit(1);
	}

	if(!currency)
	{
		logger.error("openpay currency not specified");
		process.exit(1);
	}

	//class
	var Openpay = require('openpay');
	//instantiation
	var openpay = new Openpay(accountId, apikey);


	if(isProduction){
		openpay.setProductionReady(true);
	}



	var createAccount = function(params, res, callback, callback_error)
	{
		var customerRequest =
		{
			requires_account: params.requires_account,
			name: params.name,
			email: params.email
		};

		if(params.lastname) {
			customerRequest.lastname = params.lastname;
		}

		openpay.customers.create(customerRequest, function(error, customer) {
		  if(error) {
				if(callback_error) { // llamamos callback de error o respondemos
					callback_error(error);
				} else {

					var response = {
						code: error.http_code,
						msg: error.description + ' ( ' + error.error_code + ' )'
					};

					if(res) res.status(error.http_code).send(response);
					return error;
				}

		  } else {
		  	callback(customer);
		  }
		});
	}

	var saveCard = function (params, res, callback, callback_error){

		var cardRequest = {
			'token_id': params.token_id,
			'device_session_id': params.device_session_id,
		}
		//console.log(cardRequest);
		openpay.customers.cards.create(params.clienteid, cardRequest, function (error, card) {
			if (error) {
				if(callback_error) { // llamamos callback de error o respondemos
					callback_error(error);
				} else {

					var response = {
						code: error.http_code,
						msg: error.description + ' ( ' + error.error_code + ' )'
					};

					if(res) res.status(error.http_code).send(response);
				}
				return error;
			}
			callback(card)
		});
	}

	var deleteCard = function (params, res, callback, callback_error){

		openpay.customers.cards.delete(params.clienteId, params.cardId, function (error, response) {
			if (error) {
				if(callback_error) { // llamamos callback de error o respondemos
					callback_error(error);
				} else {

					var response = {
						code: error.http_code,
						msg: error.description + ' ( ' + error.error_code + ' )'
					};

					if(res) res.status(error.http_code).send(response);
				}
				return error;
			}
			callback(response);
		});

	}

	var listCardsByUser = function (params, res, callback, callback_error){

		//console.log(cardRequest);
		openpay.customers.cards.list(params.clienteid, function (error, list) {
			if (error) {
				if(callback_error) { // llamamos callback de error o respondemos
					callback_error(error);
				} else {

					var response = {
						code: error.http_code,
						msg: error.description + ' ( ' + error.error_code + ' )'
					};

					if(res) res.status(error.http_code).send(response);
				}
				return error;
			}

			callback(list) // exito devolvemos array de cards

		});
	}

	var processPaymentByUser = function (params, res, callback, callback_error){

		var chargeRequest = {
		   'source_id' : params.sourceId,
		   'method' : params.method,
		   'amount' : params.amount,
		   'currency' : currency,
		   'description' : params.description,
		   'device_session_id' : params.deviceId,
		}

		if(params.orderId) { chargeRequest.order_id = params.orderId; }

		if(params.method == 'card') { chargeRequest.cvv2 = params.cvv; }

		if(params.preauthorize) { chargeRequest.capture = false; } // preautorize

		//console.log("cargo:", chargeRequest);

		openpay.customers.charges.create(params.customerId, chargeRequest, function(error, charge) {

			if (error) {
				if(callback_error) { // llamamos callback de error o respondemos
					callback_error(error);
				} else {

					var response = {
						code: error.http_code,
						msg: error.description + ' ( ' + error.error_code + ' )'
					};

					if(res) res.status(error.http_code).send(response);
				}
				return error;
			}

			callback(charge) // exito devolvemos array de cards

		});
	}

	var getTotalAmount = function (presupuesto) {
		var total = 0; 
		var costo = parseFloat(presupuesto);
		var parcial1 = costo + values.cobro.comision_transferencia + values.cobro.comision_cobro; // costo enviar dinero + cobrado huixache y diseñador
		var impuesto_comercio = (parcial1 * values.cobro.iva) / 100; // impuesto de huixache 
		var comision_openpay = (((parcial1 + impuesto_comercio) * values.cobro.porcentaje_gateway) / 100) ;  // comisiones de openpay
		//comision_openpay += ((comision_openpay * values.cobro.porcentaje_gateway) / 100);  // comisiones de openpay (ajustando porcentaje)
		var impuesto_openpay = (comision_openpay * values.cobro.iva) / 100; // impuesto de openpay 
		
		//console.log('valores: ', costo, parcial1, impuesto_comercio, comision_openpay, impuesto_openpay)
		total = parcial1 + impuesto_comercio + comision_openpay + impuesto_openpay ;
		total = total * 1.0010959;
		total = Math.round(total*100)  / 100; // dos dígitos

		return total;
	}



	component.createAccount = createAccount;
	component.saveCard = saveCard;
	component.listCardsByUser = listCardsByUser;
	component.deleteCard = deleteCard;
	component.processPaymentByUser = processPaymentByUser;
	component.getTotalAmount = getTotalAmount;

	return component;
}

module.exports.get = get;
