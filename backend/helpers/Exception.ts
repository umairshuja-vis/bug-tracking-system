export class Exception extends Error {
  code: number;
  meta: any;

  constructor (message: any, code = 500, meta = {}) {

    super(message);
    this.code = code;
    this.meta = meta;

  }


  toJson () {

    const json = JSON.parse(JSON.stringify(this.meta || {}));

    json.code = this.code;
    json.message = this.message;

    return json;

  }

}

