/**
 * Created by harman on 08/02/2016.
 */

var config = require('./conf/config.json');
var couchbase = require('couchbase');

var bucket;


var DbUtil = {
    bucket:init(),
    couchbaseObj: couchbase,
    N1qlQuery: require('couchbase').N1qlQuery,
    ViewQuery: require('couchbase').ViewQuery
}

function init(){

    var obj =(new couchbase.Cluster(config.couchbase.server)).openBucket(config.couchbase.bucket);
    obj.operationTimeout = 120 * 1000;
    return obj;
}

module.exports = DbUtil;