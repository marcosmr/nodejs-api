function get(config, custom_errors)
{
	var default_lang = config.lang ? config.lang : "en";
	var default_error = "error";

	var languages = [ "en", "es" ];
	var errors =
	{
		bad_request:
		{
			code: 400,
			msg:
			{
				en: "bad request",
				es: "Solicitud incorrecta"
			}
		},
		unauthorized:
		{
			code: 401,
			msg:
			{
				en: "unauthorized",
				es: "No autorizado"
			}
		},
		forbidden:
		{
			code: 403,
			msg:
			{
				en: "forbidden",
				es: "Acceso prohibido"
			}
		},
		not_found:
		{
			code: 404,
			msg:
			{
				en: "not found",
				es: "Recurso no encontrado"
			}
		},
		method_not_allowed:
		{
			code: 405,
			msg:
			{
				en: "method not allowed",
				es: "Método no permitido"
			}
		},
		conflict:
		{
			code: 409,
			msg:
			{
				en: "conflict",
				es: "Ha ocurrido un conflicto con la petición"
			}
		},
		gone:
		{
			code: 410,
			msg:
			{
				en: "gone",
				es: "Recurso eliminado"
			}
		},
		unprocessable_entity:
		{
			code: 422,
			msg:
			{
				en: "unprocessable entity",
				es: "Entidad no procesable"
			}
		},
		internal_error:
		{
			code: 500,
			msg:
			{
				en: "internal error",
				es: "Error interno"
			}
		},
		service_unavailable:
		{
			code: 503,
			msg:
			{
				en: "service unavailable",
				es: "Servicio no disponible"
			}
		},
		params_required:
		{
			code: 400,
			msg:
			{
				en: "params required",
				es: "Los parámetros de entrada están incompletos"
			}
		},
		token_missing:
		{
			code: 401,
			msg:
			{
				en: "token missing",
				es: "No se encuentra el token de acceso"
			}
		},
		token_invalid:
		{
			code: 401,
			msg:
			{
				en: "token invalid",
				es: "El token de acceso no es válido"
			}
		},
		token_expired:
		{
			code: 401,
			msg:
			{
				en: "token expired",
				es: "El token de acceso ha expirado"
			}
		},
		operation_not_permitted:
		{
			code: 403,
			msg:
			{
				en: "operation not permitted",
				es: "Operación no permitida"
			}
		},
		database_error:
		{
			code: 500,
			msg:
			{
				en: "database error",
				es: "Ha ocurrido un error en la base de datos"
			}
		},
		mail_error:
		{
			code: 500,
			msg:
			{
				en: "mail error",
				es: "Ha ocurrido un error al enviar el correo"
			}
		},
		upload_error:
		{
			code: 500,
			msg:
			{
				en: "upload error",
				es: "Ha ocurrido un error al subir el recurso"
			}
		},
		conversion_error:
		{
			code: 500,
			msg:
			{
				en: "conversion error",
				es: "Ha ocurrido un error al convertir los datos"
			}
		},
		role_unauthorized:
		{
			code: 401,
			msg:
			{
				en: "role unauthorized",
				es: "Rol no autorizado"
			}
		},
		role_not_found:
		{
			code: 404,
			msg:
			{
				en: "role not found",
				es: "Rol no encontrado"
			}
		},
		user_unauthorized:
		{
			code: 401,
			msg:
			{
				en: "user unauthorized",
				es: "Usuario no autorizado"
			}
		},
		user_not_active:
		{
			code: 403,
			msg:
			{
				en: "user not active",
				es: "Usuario no activo"
			}
		},
		user_not_found:
		{
			code: 404,
			msg:
			{
				en: "user not found",
				es: "Usuario no encontrado"
			}
		},
		user_already_exists:
		{
			code: 409,
			msg:
			{
				en: "user already exists",
				es: "El usuario ya existe"
			}
		},
		user_not_created:
		{
			code: 500,
			msg:
			{
				en: "user not created",
				es: "El usuario no ha sido creado"
			}
		},
		user_not_saved:
		{
			code: 500,
			msg:
			{
				en: "user not saved",
				es: "El usuario no ha sido actualizado"
			}
		},
		user_not_deleted:
		{
			code: 500,
			msg:
			{
				en: "user not deleted",
				es: "El usuario no ha sido eliminado"
			}
		},
		object_not_found:
		{
			code: 404,
			msg:
			{
				en: "object not found",
				es: "Objeto no encontrado"
			}
		},
		object_already_exists:
		{
			code: 409,
			msg:
			{
				en: "object already exists",
				es: "El objeto ya existe"
			}
		},
		object_not_created:
		{
			code: 500,
			msg:
			{
				en: "object not created",
				es: "El objeto no ha sido creado"
			}
		},
		object_not_saved:
		{
			code: 500,
			msg:
			{
				en: "object not saved",
				es: "El objeto no ha sido actualizado"
			}
		},
		object_not_deleted:
		{
			code: 500,
			msg:
			{
				en: "object not deleted",
				es: "El objeto no ha sido eliminado"
			}
		},
		password_wrong:
		{
			code: 401,
			msg:
			{
				en: "password wrong",
				es: "Contraseña incorrecta"
			}
		},
		password_missing:
		{
			code: 422,
			msg:
			{
				en: "password missing",
				es: "Se requiere la contraseña"
			}
		},
		email_missing:
		{
			code: 422,
			msg:
			{
				en: "email missing",
				es: "Se require el correo"
			}
		},
		payment_card_declined:
		{
			code: 403,
			msg:
			{
				en: "card declined",
				es: "La tarjeta fue declinada"
			}
		},
		payment_expired_card:
		{
			code: 403,
			msg:
			{
				en: "expired card",
				es: "La tarjeta ha expirado"
			}
		},
		payment_insufficient_funds:
		{
			code: 403,
			msg:
			{
				en: "insufficient funds",
				es: "La tarjeta no tiene fondos suficientes"
			}
		},
		payment_suspected_fraud:
		{
			code: 403,
			msg:
			{
				en: "suspected fraud",
				es: "Se ha detectado un comportamiento sospechoso en la transacción"
			}
		},
		payment_invalid_number:
		{
			code: 403,
			msg:
			{
				en: "invalid number",
				es: "El número de tarjeta no es válido"
			}
		},
		payment_invalid_expiry_month:
		{
			code: 403,
			msg:
			{
				en: "invalid expiry month",
				es: "El mes de expiración no es válido"
			}
		},
		payment_invalid_expiry_year:
		{
			code: 403,
			msg:
			{
				en: "invalid expiry year",
				es: "El año de expiración no es válido"
			}
		},
		payment_invalid_cvc:
		{
			code: 403,
			msg:
			{
				en: "invalid cvc",
				es: "El CVC no es válido"
			}
		},
		payment_invalid_amount:
		{
			code: 403,
			msg:
			{
				en: "invalid amount",
				es: "La cantidad no es válida"
			}
		},
		payment_invalid_payment_type:
		{
			code: 403,
			msg:
			{
				en: "invalid payment type",
				es: "El tipo de pago no es válido"
			}
		},
		payment_unsupported_currency:
		{
			code: 403,
			msg:
			{
				en: "unsupported currency",
				es: "El tipo de divisa no es válido"
			}
		},
		payment_missing_description:
		{
			code: 403,
			msg:
			{
				en: "missing description",
				es: "No se ha proporcionado una descripción del cargo"
			}
		},
		payment_processing_error:
		{
			code: 403,
			msg:
			{
				en: "processing error",
				es: "Se ha detectado un comportamiento sospechoso en la cuenta"
			}
		},
		payment_not_found:
		{
			code: 404,
			msg:
			{
				en: "payment not found",
				es: "No se ha encontrado la cuenta de pago"
			}
		},
		payment_error:
		{
			code: 500,
			msg:
			{
				en: "payment error",
				es: "Ha ocurrido un error al procesar el pago"
			}
		},
		error:
		{
			code: 500,
			msg:
			{
				en: "error",
				es: "Ha ocurrido un error"
			}
		}
	}


	if(custom_errors)
	{
		for(e in custom_errors)
		{
			errors[e] = custom_errors[e];
		}
	}

	var errorResponse = function(res, e_type, e_lang, e_subs)
	{
		var language = e_lang ? e_lang : default_lang;
		if(languages.indexOf(language) < 0) language = default_lang;

		var type = e_type ? e_type : default_error;
		if(!errors[type]) type = default_error;

		var code = errors[type].code;
		var msg = errors[type].msg[language];

		if(e_subs)
		{
			for(sub in e_subs)
			{
				var value = e_subs[sub];
				msg = msg.replace(sub, value);
			}
		}

		var error =
		{
			code: code,
			msg: msg
		};

		if(res) res.status(code).send(error);

		return error;
	}

	return errorResponse;
}

module.exports.get = get;
