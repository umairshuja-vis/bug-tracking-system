import { UserType } from "../types"


export class Validators {

  static isValidStr( str: string ): boolean {
    if ( !str ) {
      return false;
    }
    return Boolean( str && typeof str === 'string' && str.trim() && str !== '' );
  }

  static isValidDate( date: Date ): boolean {

    const valid: boolean = ( new Date( date ) ).getTime() > 0;

    return valid;

  }

  static isValidSSN( ssn: any ) {

    const re = /^\d{3}-?\d{2}-?\d{4}$/;

    return re.test( ssn );

  }

  static isValidFloat( number: string ): boolean {

    const valid = /^-?\d*(\.\d+)?$/;

    return valid.test( number );

  }

  static isValidateEmail( email: string ): boolean {

    const re = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/im;

    return re.test( String( email ).toLowerCase() );

  }

  static isValidLength( val: string, minLength: number ): boolean {

    const valid: boolean = val.length >= minLength;

    return valid;

  }


  static isValidJSON( str: string ) {

    if ( !str ) {

      return false;

    }

    if ( typeof str === 'string' ) {

      try {

        str = JSON.parse( str );

      } catch ( e ) {

        return false;

      }

    }

    return ( !!Object.keys( str ).length );

  }

  // static isValidPassword (pPassword) {
  //
  //   if (config.activatePasswordStrength) {
  //
  //     if (/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(pPassword)) {
  //
  //       return true
  //
  //     }
  //
  //     return false
  //
  //   }
  //
  //   return Validators.isValidStr(pPassword)
  //
  // }

  static isValidPassword( password: string ): boolean {

    if ( Validators.isValidStr( password ) && password.length >= 8 ) {

      return true;

    }

    return false;

  }

  static getParsedJson( data: any ): any {

    if ( !data ) {

      return null;

    }

    if ( typeof data === 'string' ) {

      try {

        return JSON.parse( data );

      } catch ( e ) {

        console.log( e.message );

        return null;

      }

    } else if ( Object.keys( data ).length ) {

      return data;

    }

  }

  static propExists( key: string, obj: any ) {

    return ( Object.prototype.hasOwnProperty.call( obj, key ) && ( key in obj ) );

  }

  static isArray( variable: string ) {

    return ( variable && ( Object.prototype.toString.call( variable ) === '[object Array]' ) && Array.isArray( variable ) );

  }

  static parseInteger( value: string, defaultValue: number ) {

    try {

      const parsed = parseInt( value, 10 );

      return Number.isNaN( parsed ) ? defaultValue : parsed;

    } catch ( ex ) {

      return defaultValue;

    }

  }

  static validateCode( code: number, defaultCode: any ) {

    if ( code >= 400 && code < 500 ) {

      return code;

    }

    return defaultCode;

  }

  static isPNG( fileName: string ) {

    if ( !fileName || !fileName.length || fileName.lastIndexOf( '.' ) === -1 ) {

      return false;

    }

    return fileName.substring( fileName.lastIndexOf( '.' ) + 1 ) === 'png';

  }

  static isObject( value: any ): boolean {

    return value && typeof value === 'object' && value.constructor === Object;

  }

  static isString( value: any ): boolean {

    if ( !value ) {

      return false;

    }

    return ( value && typeof ( value ) === 'string' && value.trim().length > 0 );

  }

  static isBoolean( value: any ) {

    try {

      return typeof JSON.parse( value ) === 'boolean';

    } catch ( err ) {

      return false;

    }

  }

  static isValidDomain( email: string, domain: string ) {

    if ( this.isValidStr( email ) && this.isValidStr( domain ) ) {

      const pattern = new RegExp( `@?(${domain})$`, 'i' );

      return pattern.test( email );

    }

    return false;

  }

  // static isFunction (fn) {

  //   return fn && typeof fn === 'function';

  // }

  // static isUndefined (obj) {

  //   return typeof obj === 'undefined';

  // }

  static isNumber( value: any ) {

    return typeof value === 'number';

  }

  static isNaN( value: any ) {

    return !/^\d+$/.test( value );

  }

  static isValidNumber( value: any ) {

    return this.isNumber( value ) && !this.isNaN( value );

  }

  static getParsedValue( value: any ) {

    try {

      if ( !value || value.trim() === '' ) {

        return value;

      }

      const boolValue = value.toLowerCase();

      if ( boolValue === 'true' ) {

        return true;

      }

      if ( boolValue === 'false' ) {

        return false;

      }

      const num = Number( value );

      if ( !Number.isNaN( num ) ) {

        const numberRegEx = new RegExp( /^\d+(\.\d+)?$/ );

        if ( numberRegEx.test( value ) ) {

          return num;

        }

      }

    } catch ( err ) {

      console.log( `getParsedValue:: Error occurred while parsing value: ${value} error: `, err );

    }

    return value;

  }

  static isQA( user_type: UserType ) {
    if ( user_type == 'qa' )
      return true
    else
      return false
  }

  static isManager( user_type: UserType ) {
    if ( user_type == 'manager' )
      return true
    else
      return false
  }

  static isDeveloper( user_type: UserType ) {
    if ( user_type == 'developer' )
      return true
    else
      return false
  }

}

