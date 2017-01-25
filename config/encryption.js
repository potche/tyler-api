/**
 * Utilidades de seguridad y criptografía
 *
 * @author Julio Bravo <jbravo@clb.unoi.com>
 * @version 1.0.0.
 * @module config/encryption
 */
    var crypto = require('crypto');

    var encryption = {

        /**
         *
         * Función que cifra un texto enviado como parámetro con el esquema AES-256
         *
         * @function encrypt
         * @param text Texto a cifrar
         * @returns {Progress|Query|*} Devuelve la cadena de texto cifrada
         * @see https://es.wikipedia.org/wiki/Advanced_Encryption_Standard
         */

        encrypt: function(text){

            var cipher = crypto.createCipher('aes-256-cbc',encryption.getSecret());
            var encrypted = cipher.update(text,'utf-8','hex');
            encrypted += cipher.final('hex');

            return encrypted;

        },

        /**
         *
         * Función que descifra un texto enviado como parámetro con el esquema AES-256
         *
         * @function decrypt
         * @param text Texto a descifrar
         * @returns {Progress|Query|*} Devuelve la cadena de texto sin cifrar
         * @see https://es.wikipedia.org/wiki/Advanced_Encryption_Standard
         */

        decrypt: function(text){

            var decipher = crypto.createDecipher('aes-256-cbc',encryption.getSecret());
            var decrypted = decipher.update(text,'hex','utf-8');
            decrypted += decipher.final('utf-8');

            return decrypted;

        },

        /**
         *
         * Función que devuelve una cadena aleatoria de caracteres de acuerdo a la longitud especificada como parámetro
         *
         * @function getRandomToken
         * @param length longitud deseada para la cadena a devolver
         * @returns {String|string|*} Devuelve una cadena aleatoria de caracteres hexadecimales
         */

        getRandomToken: function(length){

            return crypto.randomBytes(length).toString('hex');
        },

        /**
         *
         * Función que devuelve la clave secreta para descifrar texto con el esquema AES-256.
         * Leyendo un hilo en Reddit, encontré una serie de videos un poco bizarros, de ahí la clave secreta que estamos ocupando.
         *
         * @returns {string} Devuelve la cadena de caracteres que conforma la clave de cifrado
         * @see https://www.youtube.com/watch?v=jVe6XdYuT-I Video freak
         */

        getSecret: function(){

            return '3r1CkH4rr15r0ck5myw0r1d101';
        }
    };

    module.exports = encryption;