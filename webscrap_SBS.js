
    var request = require("request");
    var cheerio = require("cheerio");

    var URL_TARGET = "http://www.sbs.gob.pe/app/stats/tc-cv.asp";

    function parseDom( html , cb ) {
        try {
            var $     = cheerio.load(html);
            var table = $("table.APLI_tabla").first().children("tr")
            var data  = table.map(function ( index ) {
                var wat = $(this).children();
                if ( index != 0 ) {
                    return {
                        nombre : wat.eq(0).text().trim() ,
                        compra : wat.eq(1).text().trim() ,
                        venta : wat.eq(2).text().trim()
                    };
                }
            }).get();
            return cb(null , data);
        } catch ( e ) {
            return cb(e);
        }
    }

    function getTipoCambio( date , cb ) {
        if ( typeof date === "function" ) {
            cb = date;
            request(URL_TARGET , function ( err , res , body ) {
                if ( err ) {
                    return cb(err);
                } else {
                    parseDom(body , function ( err , data ) {
                        if ( err ) {
                            return cb(err);
                        } else {
                            return cb(null , data);
                        }

                    })
                }
            });
        } else {
            request.post({
                url : URL_TARGET ,
                form : {
                    "FECHA_CONSULTA" : date ,
                    "button22" : "Consultar"
                }
            } , function ( err , res , body ) {
                if ( err ) {
                    return cb(err);
                } else {
                    parseDom(body , function ( err , data ) {
                        if ( err ) {
                            return cb(err);
                        } else {
                            return cb(null , data);
                        }

                    })
                }
            });
        }


    }

    // Para sacar los datos vigentes..
    //getTipoCambio(function(err,data){})...
    getTipoCambio("10/05/2016" , function ( err , data ) {
        if ( err ) {
            console.error(err);
        } else {
            console.log(data);
            /*
            [ { nombre: 'Dólar de N.A.', compra: '3.333', venta: '3.338' },
            { nombre: 'Dólar australiano', compra: '2.417', venta: '2.507' },
            { nombre: 'Dólar canadiense', compra: '2.445', venta: '2.702' },
            { nombre: 'Libra Esterlina', compra: '4.562', venta: '5.065' },
            { nombre: 'Yen japonés', compra: '', venta: '0.033' },
            { nombre: 'Nuevo Peso mexicano', compra: '', venta: '0.196' },
            { nombre: 'Franco suizo', compra: '3.241', venta: '3.564' },
            { nombre: 'Euro', compra: '3.694', venta: '3.890' } ]
            */
        }
    }) 