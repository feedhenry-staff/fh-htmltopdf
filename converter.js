module.exports = convert;
var crypto = require('crypto');
var Transform = require("stream").Transform;
var util = require("util");
var fs = require("fs");
var os = require("os");
var spawn = require("child_process").spawn;
var phantomjsPath = __dirname + "/vendors/phantomjs/";
var pBin = phantomjsPath + "phantomjs_" + os.type().toLowerCase(); //just assume all use amd64.. add arch type if needed.
var pScript = phantomjsPath + "rasterize.js";
//convert from input stream and write pdf to output stream
function convert(is, os, args) {
  var t = function(args) {
    Transform.call(this);
    this.name = getTmpName();
    this.htmlPath = getFileFullPath(this.name + ".html");
    this.htmlWS = fs.createWriteStream(this.htmlPath);
    this.pdfPath = getFileFullPath(this.name + ".pdf");
    this.params = args;
  }
  util.inherits(t, Transform);
  t.prototype._transform = _transform;
  t.prototype._flush = _flush;
  t.prototype.clear = clear;
  t.prototype.run = runPhantomCli;
  is.pipe(new t(args)).pipe(os);
}

function getFileFullPath(fn) {
  return __dirname + "/" + fn;
}

function _transform(b, e, cb) {
  this.htmlWS.write(b.toString("utf8"));
  cb();
}

function _flush(cb) {
  var self = this;
  this.run(function() {
    self.clear(cb);
  })
}

function getTmpName() {
  return md5(new Date().getTime().toString() + Math.random() * 100000);
}

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

function runPhantomCli(cb) {
  var params=[pScript, this.htmlPath, this.pdfPath];
  if (this.params.pageSize){
    params.push(this.params.pageSize);
  }
  if (this.params.zoom){
    params.push(this.params.zoom);
  }
  var c = spawn(pBin,params); 
  var self=this;
  c.on("close", function() {
    var rs = fs.createReadStream(self.pdfPath);
    rs.on("data", function(d, e) {
      self.push(d, e);
    });
    rs.on("end", function() {
      cb();
    });
  });
}

function clear(cb) {
  fs.unlinkSync(this.htmlPath);
  fs.unlinkSync(this.pdfPath);
  cb();
}
