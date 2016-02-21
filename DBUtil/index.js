/**
 * Created by harman on 08/02/2016.
 */

var config = require('./conf/config.json');
var couchbase = require('couchbase');


//DBUtil



var DbUtil = {

    bucket : (new couchbase.Cluster(config.couchbase.server)).openBucket(config.couchbase.bucket),
    couchbaseObj : couchbase,
    N1qlQuery : require('couchbase').N1qlQuery,
    ViewQuery:require('couchbase').ViewQuery
}

module.exports = DbUtil;