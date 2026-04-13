const mongoose = require('mongoose');

const uri = "mongodb://ashwinchandrasekar655_db_user:j0mDcO3BJfpWPMnd@ac-vlgwibu-shard-00-00.9amhtom.mongodb.net:27017,ac-vlgwibu-shard-00-01.9amhtom.mongodb.net:27017,ac-vlgwibu-shard-00-02.9amhtom.mongodb.net:27017/lost_found?ssl=true&replicaSet=atlas-vlgwibu-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => {
    console.log("SUCCESSFULLY CONNECTED");
    process.exit(0);
  })
  .catch(err => {
    console.error("FAILED TO CONNECT", err);
    process.exit(1);
  });
