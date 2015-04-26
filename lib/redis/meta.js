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

    expire: {
      async: true
    }
  }

};
