function BlueDart(){
	this.dataToCarry = {};
}

BlueDart.prototype.setData = function(data){
	this.dataToCarry.data = data;
};

BlueDart.prototype.setMessage = function(message){
	this.dataToCarry.message = message;
};

BlueDart.prototype.setStatus = function(status){
	this.dataToCarry.status = status;
};

BlueDart.prototype.getData = function(){
	return this.dataToCarry.data;
};

BlueDart.prototype.getMessage = function(){
	return this.dataToCarry.message;
};

BlueDart.prototype.getStatus = function(){
	return this.dataToCarry.status;
};

module.exports = BlueDart;