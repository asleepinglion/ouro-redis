module.exports = {

  class: "Redis",
  extends: "Adapter",
  description: "A Redis Adapter for SuperJS",

  methods: {

    get: {
      async: true
    },

    set: {
      async: true
    },

    del: {
      async: true
    },

    expire: {
      async: true
    }
  }

};
