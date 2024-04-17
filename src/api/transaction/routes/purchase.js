module.exports = {
    "routes": [
      {
        "method": "POST",
        "path": "/purchase",
        "handler": "transaction.customAction",
        "config": {
          "policies": [],
          "auth": false
        }
      }
    ]
  }
  
  