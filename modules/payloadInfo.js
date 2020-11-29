class PayloadInfo {

  constructor(payload) {
    this.payload = payload;
  }
  id() {
    if (this.payload === undefined) {
      return;
    }
    let result = Buffer.from(this.payload, 'base64').toString('utf-8')
    let resultJson = JSON.parse(result)
    let id = resultJson.userId;
    return id;
  }
}



module.exports = PayloadInfo;