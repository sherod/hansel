var hansel = exports;

hansel.uuid = require('node-uuid');

hansel.update = function(hitModel,hit) {
	console.log("updating");
	console.log(hit.hitId);
	console.log(hit.timeOnPage);
	hitModel.update({ 'hitId': hit.hitId }, { 'timeOnPage': hit.timeOnPage });
};

hansel.insert = function(hitModel,hit) {
	
	console.log("inserting");
    hit.save(function (err) {
		if (err != null)
		{
				throw err;
		}
	});


}

hansel.handle = function(mongoose,browserMessage,request) {

	mongoose.connect('mongodb://localhost/my_database');

	var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
	var insert = true;

	var hitSchema = new Schema({
	    id    : ObjectId
	  , sessionId : String
	  , hitId : String
	  , url     : String
	  , referer      : String
	  , date      : Date
	  , timeOnPage : String
	  , title : String
	});

	if (browserMessage.sessionId === null && browserMessage.hitId === null)
	{
		browserMessage.hitId = hansel.uuid();
		browserMessage.sessionId = hansel.uuid();
		insert = true;
	} else {
		insert = false;
	}


    mongoose.model('Hit', hitSchema);
    var hitModel = mongoose.model('Hit');
    hit = new hitModel();
    hit.sessionId = browserMessage.sessionId;
    hit.hitId = browserMessage.hitId;
    hit.url = request.headers.origin;
    hit.timeOnPage = browserMessage.top;
    hit.date = new Date();
    hit.referrer = request.headers.referer;
    hit.title = browserMessage.title;

    if (insert)
		hansel.insert(hitModel,hit);
	else
		hansel.update(hitModel,hit);
	

	return {
				'sessionId' : browserMessage.sessionId,       
                'hitId' : browserMessage.hitId,
                'count' : ++browserMessage.count,
                'nextUpdate' : 3001
	};
	
};
