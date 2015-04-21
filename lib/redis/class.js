"use strict";

var SuperJS = require('superjs');
SuperJS.Api = require('superjs-api');
var redis = require('redis');

module.exports = SuperJS.Api.Adapter.extend({

  _metaFile: function() {
    this._loadMeta(__filename);
  },

  init: function(app) {

    //execute parent class' constructor
    this._super();

    //localize dependent modules
    this.app = app;

    //localize the configuraiton
    this.config = this.app.config.data.adapters.redis;

    //maintain a list of connections
    this.connections = {};

    //establish redis connections
    this.connect();

  },

  connect: function() {

    for( var connectionName in this.config.connections ) {

      this.log.info('redis connection:',connectionName);

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
        reject(new SuperJS.Error('redis_error', 'An error occured saving data to the `' + connectionName + '` connection.'));
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
        reject(new SuperJS.Error('redis_error', 'An error occured retreiving data from the `' + connectionName + '` connection.', err));
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
        reject(new SuperJS.Error('redis_error', 'An error occured setting the expiration of `' + key + '` on the `' + connectionName + '` connection.', err));
      } else {
        resolve(reply);
      }

    });

  }

});
