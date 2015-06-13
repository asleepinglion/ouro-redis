"use strict";

var Ouro = require('ouro');
Ouro.Api = require('ouro-api');
var redis = require('redis');

module.exports = Ouro.Api.Adapter.extend({

  _metaFile: function() {
    this._loadMeta(__filename);
  },

  init: function(app, config) {

    //execute parent class' constructor
    this._super();

    //localize dependent modules
    this.app = app;

    //localize the configuraiton
    this.config = config || {};

    //maintain a list of connections
    this.connections = {};

    //establish redis connections
    this.connect();

  },

  connect: function() {

    this.log.debug('loading redis connections:', Object.keys(this.config.connections));

    for( var connectionName in this.config.connections ) {

      var connection = this.config.connections[connectionName];

      connection.port = connection.port || 6379;
      connection.host = connection.host || '127.0.0.1';
      connection.options = connection.options || {};

      this.connections[connectionName] = redis.createClient(connection.port, connection.host, connection.options);

    }

  },

  set: function(resolve, reject, key, value, connectionName) {

    connectionName = connectionName || this.config.default || 'default';

    var client = this.connections[connectionName];

    client.set(key, value, function(err, reply) {

      if( err ) {
        reject(new Ouro.Error('redis_error', 'An error occurred saving data to the `' + connectionName + '` connection.'));
      } else {
        resolve(reply);
      }

    });

  },

  get: function(resolve, reject, key, connectionName) {

    connectionName = connectionName || this.config.default || 'default';

    var client = this.connections[connectionName];

    client.get(key, function(err, reply) {

      if( err ) {
        reject(new Ouro.Error('redis_error', 'An error occurred retreiving data from the `' + connectionName + '` connection.', err));
      } else {
        resolve(reply);
      }

    });

  },

  del: function(resolve, reject, key, connectionName) {

    connectionName = connectionName || this.config.default || 'default';

    var client = this.connections[connectionName];

    client.del(key, function(err, reply) {

      if( err ) {
        reject(new Ouro.Error('redis_error', 'An error occurred deleting data from the `' + connectionName + '` connection.', err));
      } else {
        resolve(reply);
      }

    });

  },

  expire: function(resolve, reject, key, seconds, connectionName) {

    connectionName = connectionName || this.config.default || 'default';

    var client = this.connections[connectionName];

    client.expire(key, seconds, function(err, reply) {

      if( err ) {
        reject(new Ouro.Error('redis_error', 'An error occurred setting the expiration of `' + key + '` on the `' + connectionName + '` connection.', err));
      } else {
        resolve(reply);
      }

    });

  }

});
